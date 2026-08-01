import type { ReviewResult } from '@/lib/types';

export interface SrsState {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

export interface SrsUpdate extends SrsState {
  dueAt: Date;
}

/**
 * SM-2-derived scheduler, adapted with a same-day guard: same-day repeats
 * never extend the interval past a "learning step" length. Durable spacing
 * only accrues once a review survives a genuine calendar-day gap, which is
 * the mechanism that stops massed same-day repetition from being confused
 * with long-term retention (see spec §6 and §10).
 */
export function scheduleNextReview(
  state: SrsState,
  result: ReviewResult,
  now: Date = new Date(),
): SrsUpdate {
  let { intervalDays, easeFactor, repetitions } = state;

  if (result === 'again') {
    repetitions = 0;
    intervalDays = 1 / 24; // 1 hour learning step — try again very soon today
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    const wasSameDayLearningStep = intervalDays < 1;
    repetitions += 1;

    if (result === 'hard') {
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      intervalDays = wasSameDayLearningStep ? 1 : Math.max(1, intervalDays * 1.2);
    } else if (result === 'good') {
      intervalDays = wasSameDayLearningStep
        ? 1
        : repetitions <= 1
          ? 3
          : intervalDays * easeFactor;
    } else {
      // easy
      easeFactor = Math.min(3.2, easeFactor + 0.1);
      intervalDays = wasSameDayLearningStep ? 2 : Math.max(4, intervalDays * easeFactor * 1.3);
    }
  }

  intervalDays = Math.min(intervalDays, 180);
  const dueAt = new Date(now.getTime() + intervalDays * 86_400_000);
  return { intervalDays, easeFactor, repetitions, dueAt };
}

export function isDue(dueAt: Date, now: Date = new Date()): boolean {
  return dueAt.getTime() <= now.getTime();
}

/** True once a review has been answered successfully after a real (>=18h)
 * gap since it was last seen — the threshold used to credit retentionScore
 * rather than ordinary same-day practice. */
export function crossesRetentionThreshold(lastPracticedAt: Date | null, now: Date = new Date()): boolean {
  if (!lastPracticedAt) return false;
  return now.getTime() - lastPracticedAt.getTime() >= 18 * 60 * 60 * 1000;
}
