import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function LessonByConceptPage({ params }: { params: { code: string } }) {
  const concept = await prisma.concept.findUnique({ where: { code: params.code } });
  if (!concept) notFound();
  const lessonConcept = await prisma.lessonConcept.findFirst({
    where: { conceptId: concept.id },
    include: { lesson: true },
    orderBy: { lesson: { order: 'asc' } },
  });
  if (!lessonConcept) notFound();
  redirect(`/lessons/${lessonConcept.lesson.code}`);
}
