import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import LessonPlayer from './LessonPlayer';
import { computeChoices } from '@/lib/exerciseChoices';

export default async function LessonPage({ params }: { params: { code: string } }) {
  const user = await requireOnboardedUser();

  const lesson = await prisma.lesson.findUnique({
    where: { code: params.code },
    include: {
      unit: { include: { domain: true } },
      concepts: { include: { concept: true } },
      exercises: {
        where: { status: 'published' },
        include: { hints: { orderBy: { level: 'asc' } }, sentence: { include: { tokens: true } } },
        orderBy: { order: 'asc' },
      },
    },
  });
  // Draft lessons (e.g. AI-generated, pending review in /studio) are never
  // shown to the learner — only fully approved, published content is.
  if (!lesson || lesson.status !== 'published') notFound();

  const conceptIds = lesson.concepts.map((lc) => lc.conceptId);
  const relatedMisconceptions = await prisma.misconception.findMany({
    where: { concepts: { some: { conceptId: { in: conceptIds } } } },
  });

  const observeCodes = JSON.parse(lesson.observePrompt ?? '[]') as string[];
  const observeSentences = await prisma.arabicSentence.findMany({
    where: { code: { in: observeCodes } },
    include: { tokens: { orderBy: { position: 'asc' } } },
  });
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
          commonMistakes: relatedMisconceptions.map((m) => ({
            title: m.title,
            description: m.description,
            correctModel: m.correctModel,
            contrastExample: m.contrastExample,
          })),
          discoveryPrompt: discovery.prompt ?? '',
          concepts: lesson.concepts.map((lc) => ({ code: lc.concept.code, title: lc.concept.title, titleArabic: lc.concept.titleArabic })),
          observeSentences: orderedObserve.map((s) => ({
            id: s!.id, textVocalized: s!.textVocalized, translationEnglish: s!.translationEnglish, notes: s!.notes,
            tokens: s!.tokens.map((t) => ({
              position: t.position, surfaceVocalized: t.surfaceVocalized, role: t.role,
              grammaticalCase: t.grammaticalCase, mood: t.mood, marker: t.marker,
              translation: t.translation, explanation: t.explanation,
            })),
          })),
          exercises: lesson.exercises.map((e) => ({
            id: e.id, type: e.type, objective: e.objective, prompt: e.prompt, promptArabic: e.promptArabic,
            difficulty: e.difficulty, hints: e.hints.map((h) => ({ level: h.level, text: h.text })),
            choices: computeChoices(
              { type: e.type, expectedAnswer: JSON.parse(e.expectedAnswer) as string, choices: JSON.parse(e.choices) as string[] },
              e.sentence?.tokens.map((t) => t.surfaceVocalized) ?? [],
            ),
          })),
        }}
      />
    </NavShell>
  );
}
