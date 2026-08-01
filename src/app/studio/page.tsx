import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import StudioBrowser from './StudioBrowser';

export default async function StudioPage() {
  const user = await requireOnboardedUser();

  const [lessons, exercises, sentences, concepts, reviews] = await Promise.all([
    prisma.lesson.findMany({ select: { id: true, code: true, title: true, status: true }, orderBy: { order: 'asc' } }),
    prisma.exercise.findMany({ select: { id: true, type: true, prompt: true }, take: 50 }),
    prisma.arabicSentence.findMany({ select: { id: true, code: true, textVocalized: true, sourceType: true } }),
    prisma.concept.findMany({ select: { id: true, code: true, title: true } }),
    prisma.contentReview.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
  ]);

  return (
    <NavShell userName={user.name}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Content-authoring & linguistic review studio</h1>
        <p className="text-sm text-ink-500 mb-8">
          Browse seeded content and flag items for the review workflow (draft → linguistic review → pedagogical
          review → Yorùbá-language review → technical validation → approved → published → retired). Full authoring
          (adding new lessons/exercises in-app) is on the roadmap — see README.
        </p>
        <StudioBrowser
          lessons={lessons}
          exercises={exercises}
          sentences={sentences.map((s) => ({ id: s.id, code: s.code ?? '', text: s.textVocalized, sourceType: s.sourceType }))}
          concepts={concepts}
          recentReviews={reviews.map((r) => ({
            id: r.id, entityType: r.entityType, entityId: r.entityId, workflowState: r.workflowState,
            reviewerNote: r.reviewerNote, createdAt: r.createdAt.toISOString(),
          }))}
        />
      </div>
    </NavShell>
  );
}
