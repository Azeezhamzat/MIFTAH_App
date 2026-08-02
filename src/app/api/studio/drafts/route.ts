import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

// Approving a draft is the one moment a human explicitly signs off on
// content Claude wrote, flipping it from status: 'draft' to 'published' so
// it becomes visible to the learner for the first time. Rejecting deletes
// it outright rather than leaving stale unreviewed rows around.
export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();
  const entityType = String(body.entityType ?? '');
  const id = String(body.id ?? '');
  const action = String(body.action ?? '');

  if (!['lesson', 'exercise'].includes(entityType) || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  if (entityType === 'lesson') {
    const lesson = await prisma.lesson.findUnique({ where: { id }, include: { exercises: true } });
    if (!lesson) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
    if (action === 'approve') {
      await prisma.$transaction([
        prisma.lesson.update({ where: { id }, data: { status: 'published' } }),
        prisma.exercise.updateMany({ where: { lessonId: id }, data: { status: 'published' } }),
      ]);
    } else {
      await prisma.lessonConcept.deleteMany({ where: { lessonId: id } });
      await prisma.hint.deleteMany({ where: { exerciseId: { in: lesson.exercises.map((e) => e.id) } } });
      await prisma.exercise.deleteMany({ where: { lessonId: id } });
      await prisma.lesson.delete({ where: { id } });
    }
  } else {
    const exercise = await prisma.exercise.findUnique({ where: { id } });
    if (!exercise) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
    if (action === 'approve') {
      await prisma.exercise.update({ where: { id }, data: { status: 'published' } });
    } else {
      await prisma.hint.deleteMany({ where: { exerciseId: id } });
      await prisma.exercise.delete({ where: { id } });
    }
  }

  return NextResponse.json({ ok: true });
}
