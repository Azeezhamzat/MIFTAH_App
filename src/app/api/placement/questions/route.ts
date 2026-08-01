import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function GET() {
  await requireUser();
  const questions = await prisma.placementQuestion.findMany({ orderBy: { difficulty: 'asc' } });
  const sanitized = questions.map((q) => ({
    code: q.code,
    skillArea: q.skillArea,
    prompt: q.prompt,
    promptArabic: q.promptArabic,
    type: q.type,
    options: JSON.parse(q.options) as string[],
    difficulty: q.difficulty,
  }));
  return NextResponse.json({ questions: sanitized });
}
