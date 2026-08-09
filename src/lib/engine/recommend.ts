import { prisma } from '@/lib/db';
import { explainWhyReview } from '@/lib/mastery';
import { isDue } from '@/lib/srs';

const MASTERED_LABELS = new Set(['reliable', 'strong']);

export interface Recommendation {
  kind: 'review' | 'new_concept' | 'reading' | 'open_study';
  title: string;
  description: string;
  href: string;
  estimatedMinutes: number;
}

export async function getDashboardData(userId: string) {
  const [dueReviews, masteries, learnerProfile, recentAttempts, activeMisconceptions] = await Promise.all([
    prisma.reviewSchedule.findMany({ where: { userId }, include: { concept: true } }),
    prisma.conceptMastery.findMany({ where: { userId }, include: { concept: { include: { domain: true } } } }),
    prisma.learnerProfile.findUnique({ where: { userId } }),
    prisma.attempt.findMany({ where: { userId }, orderBy: { attemptedAt: 'desc' }, take: 20 }),
    prisma.misconceptionLog.findMany({ where: { userId, status: 'active' }, include: { misconception: true }, orderBy: { detectedAt: 'desc' }, take: 3 }),
  ]);

  const now = new Date();
  const dueNow = dueReviews.filter((r) => isDue(r.dueAt, now));

  const masteryByConceptId = new Map(masteries.map((m) => [m.conceptId, m]));

  const allConcepts = await prisma.concept.findMany({
    // prerequisitesOf holds this concept's own prerequisites (rows where
    // conceptId = this concept) — the `prerequisites` relation is the reverse
    // (concepts this one is a prerequisite FOR), which would make every
    // concept appear to depend only on itself. See the same note in
    // src/app/curriculum/page.tsx.
    include: { domain: true, prerequisitesOf: { include: { prerequisite: true } } },
    orderBy: [{ domain: { order: 'asc' } }, { order: 'asc' }],
  });

  const nextNewConcept = allConcepts.find((c) => {
    if (masteryByConceptId.has(c.id)) return false;
    return c.prerequisitesOf.every((p) => {
      const m = masteryByConceptId.get(p.prerequisiteId);
      return m && MASTERED_LABELS.has(m.label);
    });
  });

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const newConceptsToday = masteries.filter((m) => m.lastPracticedAt && m.lastPracticedAt >= todayStart && m.distinctDaysPracticed <= 1).length;
  const readyForNewConcept = newConceptsToday < 3;

  const reviewExplanations = dueNow.slice(0, 5).map((r) => {
    const mastery = masteryByConceptId.get(r.conceptId);
    return {
      conceptTitle: r.concept.title,
      explanation: explainWhyReview({
        label: (mastery?.label as never) ?? 'developing',
        dueAt: r.dueAt,
        now,
        intervalDays: r.intervalDays,
        lastResult: r.lastResult,
        retentionScore: mastery?.retentionScore ?? 0,
      }),
    };
  });

  const recommendations: Recommendation[] = [];
  if (dueNow.length > 0) {
    recommendations.push({
      kind: 'review',
      title: `Clear your review queue (${dueNow.length} due)`,
      description: 'A few seconds of retrieval now protects everything you have already learned.',
      href: '/review',
      estimatedMinutes: Math.max(3, Math.min(15, dueNow.length * 2)),
    });
  }
  if (nextNewConcept && readyForNewConcept) {
    recommendations.push({
      kind: 'new_concept',
      title: `Learn: ${nextNewConcept.title}`,
      description: nextNewConcept.whyItMatters,
      href: `/lessons/by-concept/${nextNewConcept.code}`,
      estimatedMinutes: 15,
    });
  } else if (nextNewConcept && !readyForNewConcept) {
    recommendations.push({
      kind: 'open_study',
      title: 'Strengthen what you started today',
      description: 'You have introduced enough new material for today — consolidating it now will protect tomorrow\'s progress better than adding more.',
      href: '/review',
      estimatedMinutes: 10,
    });
  }
  recommendations.push({
    kind: 'reading',
    title: 'Read a passage',
    description: 'Apply what you know to connected Arabic text.',
    href: '/library',
    estimatedMinutes: 10,
  });

  return {
    dueCount: dueNow.length,
    dueReviews: dueNow.slice(0, 8),
    reviewExplanations,
    masteries,
    nextNewConcept,
    readyForNewConcept,
    recommendations,
    learnerProfile,
    recentAttempts,
    activeMisconceptions,
    streak: learnerProfile?.currentStreak ?? 0,
  };
}
