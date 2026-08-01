import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { gradeShortAnswer, gradeFreeText } from '@/lib/grading';
import { scorePlacement, type PlacementResponseGraded } from '@/lib/placement';

interface SubmittedResponse {
  code: string;
  answer: string;
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = (await req.json()) as { responses: SubmittedResponse[] };

  const questions = await prisma.placementQuestion.findMany();
  const byCode = new Map(questions.map((q) => [q.code, q]));

  const graded: PlacementResponseGraded[] = [];
  for (const r of body.responses) {
    const q = byCode.get(r.code);
    if (!q) continue;
    const correctAnswer = JSON.parse(q.correctAnswer) as string | string[];
    let isCorrect = false;
    if (q.type === 'multiple_choice') {
      isCorrect = r.answer.trim() === (correctAnswer as string);
    } else if (q.type === 'short_answer') {
      const variants = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
      isCorrect = gradeShortAnswer(r.answer, variants[0], variants.slice(1)).isCorrect;
    } else {
      const points = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
      isCorrect = gradeFreeText(r.answer, points).isCorrect;
    }
    graded.push({ skillArea: q.skillArea, isCorrect, difficulty: q.difficulty });
  }

  const result = scorePlacement(graded);

  const recommendedUnit = await prisma.unit.findUnique({ where: { code: result.recommendedStartUnitCode } });

  await prisma.placementAttempt.create({
    data: {
      userId: user.id,
      completedAt: new Date(),
      responses: JSON.stringify(body.responses),
      recommendedStartUnitId: recommendedUnit?.id,
      strengths: JSON.stringify(result.strengths),
      fragilePrerequisites: JSON.stringify(result.fragilePrerequisites),
      priorityGaps: JSON.stringify(result.priorityGaps),
      suggestedFirstWeek: JSON.stringify([result.suggestedFirstWeekUnitCode]),
      estimatedIntensity: result.estimatedIntensityHint,
      confidenceLevel: result.confidenceLevel,
    },
  });

  await prisma.learnerProfile.update({
    where: { userId: user.id },
    data: {
      placementCompletedAt: new Date(),
      placementConfidence: result.confidenceLevel,
      recommendedStartNodeId: recommendedUnit?.id,
      studyIntensity: result.estimatedIntensityHint,
    },
  });

  return NextResponse.json({ result });
}
