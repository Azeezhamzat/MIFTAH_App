import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import StudioBrowser from './StudioBrowser';
import AuthorStudio from './AuthorStudio';

export default async function StudioPage() {
  const user = await requireOnboardedUser();

  const [
    lessons, exercises, sentences, concepts, reviews, draftLessons, draftExercises,
    domains, units, conceptsFull, lessonsFull,
  ] = await Promise.all([
    prisma.lesson.findMany({ where: { status: 'published' }, select: { id: true, code: true, title: true, status: true }, orderBy: { order: 'asc' } }),
    prisma.exercise.findMany({ where: { status: 'published' }, select: { id: true, type: true, prompt: true }, take: 50 }),
    prisma.arabicSentence.findMany({ select: { id: true, code: true, textVocalized: true, sourceType: true } }),
    prisma.concept.findMany({ select: { id: true, code: true, title: true } }),
    prisma.contentReview.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.lesson.findMany({
      where: { status: { not: 'published' } },
      include: { exercises: { include: { hints: { orderBy: { level: 'asc' } } } }, concepts: { include: { concept: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.exercise.findMany({
      where: { status: { not: 'published' }, lessonId: null },
      include: { hints: { orderBy: { level: 'asc' } }, concept: true },
      orderBy: { order: 'desc' },
    }),
    prisma.domain.findMany({ orderBy: { order: 'asc' }, select: { code: true, title: true } }),
    prisma.unit.findMany({ orderBy: { order: 'asc' }, select: { code: true, title: true } }),
    prisma.concept.findMany({
      include: { domain: true, prerequisitesOf: { include: { prerequisite: true } } },
      orderBy: { order: 'asc' },
    }),
    prisma.lesson.findMany({
      include: { unit: true, concepts: { include: { concept: true } } },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <NavShell userName={user.name}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Content-authoring & linguistic review studio</h1>
        <p className="text-sm text-ink-500 mb-8">
          Browse published content, flag items for the review workflow, and review AI-drafted lessons before they
          ever reach the learner-facing app. A drafted lesson only becomes visible in the normal lesson flow once
          you explicitly approve it here.
        </p>

        <AuthorStudio
          domains={domains}
          units={units}
          concepts={conceptsFull.map((c) => ({
            code: c.code,
            domainCode: c.domain.code,
            title: c.title,
            titleArabic: c.titleArabic,
            definition: c.definition,
            whyItMatters: c.whyItMatters,
            difficulty: c.difficulty,
            order: c.order,
            prerequisites: c.prerequisitesOf.map((p) => p.prerequisite.code),
          }))}
          lessons={lessonsFull.map((l) => {
            let discoveryPrompt = '';
            try { discoveryPrompt = (JSON.parse(l.discoveryJson ?? '{}') as { prompt?: string }).prompt ?? ''; } catch { /* leave blank */ }
            let observeSentenceCodes: string[] = [];
            try { observeSentenceCodes = JSON.parse(l.observePrompt ?? '[]') as string[]; } catch { /* leave empty */ }
            return {
              code: l.code,
              unitCode: l.unit.code,
              title: l.title,
              titleArabic: l.titleArabic,
              summary: l.summary,
              order: l.order,
              estimatedMinutes: l.estimatedMinutes,
              concepts: l.concepts.map((c) => ({ conceptCode: c.concept.code, role: c.role })),
              observeSentenceCodes,
              discoveryPrompt,
              microExplanation: l.microExplanation,
              deeperDetail: l.deeperDetail ?? '',
            };
          })}
          allConceptOptions={concepts.map((c) => ({ code: c.code, title: c.title }))}
          allLessonOptions={lessons.map((l) => ({ code: l.code, title: l.title }))}
          allSentenceOptions={sentences.map((s) => ({ code: s.code ?? '', text: s.textVocalized }))}
        />

        <StudioBrowser
          lessons={lessons}
          exercises={exercises}
          sentences={sentences.map((s) => ({ id: s.id, code: s.code ?? '', text: s.textVocalized, sourceType: s.sourceType }))}
          concepts={concepts}
          recentReviews={reviews.map((r) => ({
            id: r.id, entityType: r.entityType, entityId: r.entityId, workflowState: r.workflowState,
            reviewerNote: r.reviewerNote, createdAt: r.createdAt.toISOString(),
          }))}
          draftLessons={draftLessons.map((l) => ({
            id: l.id, title: l.title, titleArabic: l.titleArabic, summary: l.summary, microExplanation: l.microExplanation,
            concepts: l.concepts.map((c) => c.concept.title),
            exercises: l.exercises.map((e) => ({ id: e.id, prompt: e.prompt, expectedAnswer: JSON.parse(e.expectedAnswer) as string, explanation: e.explanation, hints: e.hints.map((h) => h.text) })),
          }))}
          draftExercises={draftExercises.map((e) => ({
            id: e.id, prompt: e.prompt, expectedAnswer: JSON.parse(e.expectedAnswer) as string, explanation: e.explanation,
            conceptTitle: e.concept.title, hints: e.hints.map((h) => h.text),
          }))}
        />
      </div>
    </NavShell>
  );
}
