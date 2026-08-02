import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import type { OfflineBundle, OfflineExercise, OfflineGradingData, OfflineLesson } from '@/lib/offline/types';

// Everything a learner needs to study and practice with no network at all:
// every lesson (in the same shape the lesson page assembles) plus the
// complete exercise bank — not just lesson-attached exercises, so offline
// review-style practice covers the same pool as the online spaced-review
// queue. Grading data (answer key) travels in a separate map so the UI can
// keep the "don't show the answer in the exercise object" convention the
// online path uses, even though — unlike the online path — it must ship the
// answer key to the client at all, which is an inherent trade-off of grading
// without a server round-trip. This is acceptable for a personal, single-user
// deployment; it would not be for a multi-tenant one.
export async function GET() {
  const user = await requireUser();

  const [lessons, exercises] = await Promise.all([
    prisma.lesson.findMany({
      include: {
        unit: { include: { domain: true } },
        concepts: { include: { concept: true } },
        exercises: { select: { id: true } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.exercise.findMany({
      include: { hints: { orderBy: { level: 'asc' } }, concept: true, lesson: { select: { code: true } } },
      orderBy: { order: 'asc' },
    }),
  ]);

  const sentenceCodes = Array.from(
    new Set(lessons.flatMap((l) => JSON.parse(l.observePrompt ?? '[]') as string[])),
  );
  const sentences = await prisma.arabicSentence.findMany({ where: { code: { in: sentenceCodes } } });
  const sentenceByCode = new Map(sentences.map((s) => [s.code, s]));

  const offlineLessons: OfflineLesson[] = lessons.map((l) => {
    const observeCodes = JSON.parse(l.observePrompt ?? '[]') as string[];
    const discovery = JSON.parse(l.discoveryJson ?? '{}') as { prompt: string };
    return {
      code: l.code,
      title: l.title,
      titleArabic: l.titleArabic,
      summary: l.summary,
      unitTitle: l.unit.title,
      domainTitle: l.unit.domain.title,
      microExplanation: l.microExplanation,
      deeperDetail: l.deeperDetail,
      discoveryPrompt: discovery.prompt ?? '',
      concepts: l.concepts.map((lc) => ({ code: lc.concept.code, title: lc.concept.title, titleArabic: lc.concept.titleArabic })),
      observeSentences: observeCodes
        .map((c) => sentenceByCode.get(c))
        .filter((s): s is NonNullable<typeof s> => !!s)
        .map((s) => ({ id: s.id, textVocalized: s.textVocalized, translationEnglish: s.translationEnglish, notes: s.notes })),
      exerciseIds: l.exercises.map((e) => e.id),
    };
  });

  const offlineExercises: OfflineExercise[] = [];
  const grading: Record<string, OfflineGradingData> = {};
  for (const e of exercises) {
    offlineExercises.push({
      id: e.id,
      type: e.type,
      objective: e.objective,
      prompt: e.prompt,
      promptArabic: e.promptArabic,
      difficulty: e.difficulty,
      hints: e.hints.map((h) => ({ level: h.level, text: h.text })),
      conceptCode: e.concept.code,
      conceptTitle: e.concept.title,
      lessonCode: e.lesson?.code ?? null,
    });
    grading[e.id] = {
      expectedAnswer: JSON.parse(e.expectedAnswer) as string,
      acceptedVariants: JSON.parse(e.acceptedVariants) as string[],
      invalidPlausible: JSON.parse(e.invalidPlausible) as { answer: string; why: string }[],
      explanation: e.explanation,
    };
  }

  const bundle: OfflineBundle = {
    generatedAt: new Date().toISOString(),
    learnerName: user.name ?? 'Learner',
    lessons: offlineLessons,
    exercises: offlineExercises,
    grading,
  };

  return NextResponse.json(bundle);
}
