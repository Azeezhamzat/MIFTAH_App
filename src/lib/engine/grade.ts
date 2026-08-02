import { prisma } from '@/lib/db';
import { gradeShortAnswer, gradeFreeText } from '@/lib/grading';
import { applyEvidence, applyRetentionEvidence, computeOverallScore, scoreToLabel } from '@/lib/mastery';
import { scheduleNextReview, crossesRetentionThreshold } from '@/lib/srs';
import type { ExerciseType, ReviewResult } from '@/lib/types';

export interface GradeInput {
  userId: string;
  exerciseId: string;
  response: string;
  hintsUsed: number;
  responseTimeMs: number;
  confidence?: number;
  sessionId?: string;
}

export interface GradeFeedback {
  isCorrect: boolean;
  score: number;
  expectedAnswer: string;
  explanation: string;
  invalidPlausible: { answer: string; why: string }[];
  matchedTerms?: string[];
  missedTerms?: string[];
  masteryLabel: string;
  misconceptionDetected: { code: string; title: string } | null;
}

function scoreToReviewResult(score: number, hintsUsed: number): ReviewResult {
  if (score < 0.4) return 'again';
  if (score < 0.7) return 'hard';
  if (score >= 0.95 && hintsUsed === 0) return 'easy';
  return 'good';
}

export async function gradeAndRecordAttempt(input: GradeInput): Promise<GradeFeedback> {
  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: input.exerciseId } });
  if (exercise.status !== 'published') {
    // Defense in depth: even if a draft exercise's id ever reached the client,
    // it must never be graded or feed the mastery/SRS pipeline before review.
    throw new Error('This exercise is not yet published.');
  }
  const expectedAnswer = JSON.parse(exercise.expectedAnswer) as string;
  const acceptedVariants = JSON.parse(exercise.acceptedVariants) as string[];
  const invalidPlausible = JSON.parse(exercise.invalidPlausible) as { answer: string; why: string }[];
  const misconceptionTags = JSON.parse(exercise.misconceptionTags) as string[];

  const shortGrade = gradeShortAnswer(input.response, expectedAnswer, acceptedVariants);
  let isCorrect = shortGrade.isCorrect;
  let score = shortGrade.score;
  let matchedTerms: string[] | undefined;
  let missedTerms: string[] | undefined;

  if (!isCorrect) {
    const freeGrade = gradeFreeText(input.response, [expectedAnswer, ...acceptedVariants]);
    isCorrect = freeGrade.isCorrect;
    score = Math.max(score, freeGrade.score);
    matchedTerms = freeGrade.matchedTerms;
    missedTerms = freeGrade.missedTerms;
  }

  await prisma.attempt.create({
    data: {
      userId: input.userId,
      exerciseId: input.exerciseId,
      sessionId: input.sessionId,
      response: JSON.stringify(input.response),
      isCorrect,
      score,
      confidence: input.confidence,
      responseTimeMs: input.responseTimeMs,
      hintsUsed: input.hintsUsed,
      misconceptionCode: !isCorrect && misconceptionTags[0] ? misconceptionTags[0] : undefined,
    },
  });

  // --- Mastery update ---
  const existingMastery = await prisma.conceptMastery.findUnique({
    where: { userId_conceptId: { userId: input.userId, conceptId: exercise.conceptId } },
  });
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const attemptedOnNewCalendarDay = !existingMastery?.lastPracticedAt || existingMastery.lastPracticedAt < todayStart;

  const baseScores = existingMastery ?? {
    recognitionScore: 0, formationScore: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, readingApplicationScore: 0, distinctDaysPracticed: 0,
  };

  const wasRetentionCheck = crossesRetentionThreshold(existingMastery?.lastPracticedAt ?? null, now);
  const updated = applyEvidence(baseScores, {
    exerciseType: exercise.type as ExerciseType,
    isCorrect,
    score,
    hintsUsed: input.hintsUsed,
    attemptedOnNewCalendarDay,
  });
  const retentionScore = wasRetentionCheck ? applyRetentionEvidence(baseScores.retentionScore, isCorrect) : updated.retentionScore;
  const overall = computeOverallScore({ ...updated, retentionScore });

  const reviewSchedule = await prisma.reviewSchedule.findUnique({
    where: { userId_conceptId: { userId: input.userId, conceptId: exercise.conceptId } },
  });
  const isOverdue = !!reviewSchedule && reviewSchedule.dueAt < now;
  const label = scoreToLabel({
    overall,
    distinctDaysPracticed: updated.distinctDaysPracticed,
    explanationScore: updated.explanationScore,
    transferScore: updated.transferScore,
    retentionScore,
    isOverdueForReview: isOverdue && !isCorrect,
  });

  await prisma.conceptMastery.upsert({
    where: { userId_conceptId: { userId: input.userId, conceptId: exercise.conceptId } },
    create: {
      userId: input.userId,
      conceptId: exercise.conceptId,
      ...updated,
      retentionScore,
      overallScore: overall,
      label,
      lastPracticedAt: now,
    },
    update: {
      ...updated,
      retentionScore,
      overallScore: overall,
      label,
      lastPracticedAt: now,
    },
  });

  // --- Spaced review scheduling ---
  const result = scoreToReviewResult(score, input.hintsUsed);
  const srs = scheduleNextReview(
    reviewSchedule
      ? { intervalDays: reviewSchedule.intervalDays, easeFactor: reviewSchedule.easeFactor, repetitions: reviewSchedule.repetitions }
      : { intervalDays: 1, easeFactor: 2.3, repetitions: 0 },
    result,
    now,
  );
  await prisma.reviewSchedule.upsert({
    where: { userId_conceptId: { userId: input.userId, conceptId: exercise.conceptId } },
    create: {
      userId: input.userId,
      conceptId: exercise.conceptId,
      dueAt: srs.dueAt,
      intervalDays: srs.intervalDays,
      easeFactor: srs.easeFactor,
      repetitions: srs.repetitions,
      lastResult: result,
    },
    update: {
      dueAt: srs.dueAt,
      intervalDays: srs.intervalDays,
      easeFactor: srs.easeFactor,
      repetitions: srs.repetitions,
      lastResult: result,
    },
  });

  // --- Misconception detection ---
  let misconceptionDetected: { code: string; title: string } | null = null;
  if (!isCorrect && misconceptionTags[0]) {
    const misconception = await prisma.misconception.findUnique({ where: { code: misconceptionTags[0] } });
    if (misconception) {
      const existingLog = await prisma.misconceptionLog.findFirst({
        where: { userId: input.userId, misconceptionId: misconception.id, status: 'active' },
      });
      if (!existingLog) {
        await prisma.misconceptionLog.create({
          data: { userId: input.userId, misconceptionId: misconception.id, status: 'active' },
        });
      }
      misconceptionDetected = { code: misconception.code, title: misconception.title };
    }
  }

  return {
    isCorrect,
    score,
    expectedAnswer,
    explanation: exercise.explanation,
    invalidPlausible,
    matchedTerms,
    missedTerms,
    masteryLabel: label,
    misconceptionDetected,
  };
}
