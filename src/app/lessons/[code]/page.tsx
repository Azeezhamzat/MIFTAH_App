import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import LessonPlayer from './LessonPlayer';

export default async function LessonPage({ params }: { params: { code: string } }) {
  const user = await requireOnboardedUser();

  const lesson = await prisma.lesson.findUnique({
    where: { code: params.code },
    include: {
      unit: { include: { domain: true } },
      concepts: { include: { concept: true } },
      exercises: { include: { hints: { orderBy: { level: 'asc' } } }, orderBy: { order: 'asc' } },
    },
  });
  if (!lesson) notFound();

  const observeCodes = JSON.parse(lesson.observePrompt ?? '[]') as string[];
  const observeSentences = await prisma.arabicSentence.findMany({ where: { code: { in: observeCodes } } });
  const orderedObserve = observeCodes.map((c) => observeSentences.find((s) => s.code === c)).filter(Boolean);
  const discovery = JSON.parse(lesson.discoveryJson ?? '{}') as { prompt: string };

  return (
    <NavShell userName={user.name}>
      <LessonPlayer
        lesson={{
          code: lesson.code,
          title: lesson.title,
          titleArabic: lesson.titleArabic,
          summary: lesson.summary,
          unitTitle: lesson.unit.title,
          domainTitle: lesson.unit.domain.title,
          microExplanation: lesson.microExplanation,
          deeperDetail: lesson.deeperDetail,
          discoveryPrompt: discovery.prompt ?? '',
          concepts: lesson.concepts.map((lc) => ({ code: lc.concept.code, title: lc.concept.title, titleArabic: lc.concept.titleArabic })),
          observeSentences: orderedObserve.map((s) => ({
            id: s!.id, textVocalized: s!.textVocalized, translationEnglish: s!.translationEnglish, notes: s!.notes,
          })),
          exercises: lesson.exercises.map((e) => ({
            id: e.id, type: e.type, objective: e.objective, prompt: e.prompt, promptArabic: e.promptArabic,
            difficulty: e.difficulty, hints: e.hints.map((h) => ({ level: h.level, text: h.text })),
          })),
        }}
      />
    </NavShell>
  );
}
