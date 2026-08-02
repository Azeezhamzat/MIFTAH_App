import { requireOnboardedUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import NavShell from '@/components/NavShell';
import ReviewRunner from './ReviewRunner';
import { explainWhyReview } from '@/lib/mastery';
import { isDue } from '@/lib/srs';

export default async function ReviewPage() {
  const user = await requireOnboardedUser();
  const now = new Date();

  const schedules = await prisma.reviewSchedule.findMany({
    where: { userId: user.id },
    include: { concept: true },
    orderBy: { dueAt: 'asc' },
  });
  const due = schedules.filter((s) => isDue(s.dueAt, now));

  const masteries = await prisma.conceptMastery.findMany({
    where: { userId: user.id, conceptId: { in: due.map((d) => d.conceptId) } },
  });
  const masteryByConcept = new Map(masteries.map((m) => [m.conceptId, m]));

  const items = [];
  for (const s of due) {
    const exercise = await prisma.exercise.findFirst({
      where: { conceptId: s.conceptId, status: 'published' },
      include: { hints: { orderBy: { level: 'asc' } } },
      orderBy: { reviewPriority: 'desc' },
    });
    if (!exercise) continue;
    const mastery = masteryByConcept.get(s.conceptId);
    items.push({
      conceptTitle: s.concept.title,
      reason: explainWhyReview({
        label: (mastery?.label as never) ?? 'developing',
        dueAt: s.dueAt,
        now,
        intervalDays: s.intervalDays,
        lastResult: s.lastResult,
        retentionScore: mastery?.retentionScore ?? 0,
      }),
      exercise: {
        id: exercise.id,
        type: exercise.type,
        objective: exercise.objective,
        prompt: exercise.prompt,
        promptArabic: exercise.promptArabic,
        difficulty: exercise.difficulty,
        hints: exercise.hints.map((h) => ({ level: h.level, text: h.text })),
      },
    });
  }

  return (
    <NavShell userName={user.name}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Review queue</h1>
        <p className="text-sm text-ink-500 mb-8">
          {items.length === 0
            ? 'Nothing is due right now.'
            : `${items.length} concept${items.length === 1 ? '' : 's'} due for retrieval practice.`}
        </p>
        <ReviewRunner items={items} />
      </div>
    </NavShell>
  );
}
