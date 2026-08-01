import { describe, it, expect } from 'vitest';
import { scheduleNextReview, isDue, crossesRetentionThreshold } from '@/lib/srs';

describe('srs: scheduleNextReview', () => {
  const base = { intervalDays: 1, easeFactor: 2.3, repetitions: 0 };
  const now = new Date('2026-08-01T00:00:00Z');

  it('resets to a same-day learning step on "again"', () => {
    const result = scheduleNextReview(base, 'again', now);
    expect(result.intervalDays).toBeLessThan(1);
    expect(result.repetitions).toBe(0);
  });

  it('does not let a same-day "good" repetition jump to a multi-day interval', () => {
    const sameDayState = { intervalDays: 1 / 24, easeFactor: 2.3, repetitions: 0 };
    const result = scheduleNextReview(sameDayState, 'good', now);
    // same-day learning step -> exactly 1 day, not an inflated multi-day jump
    expect(result.intervalDays).toBe(1);
  });

  it('grows the interval on repeated "good" results using the ease factor', () => {
    const first = scheduleNextReview(base, 'good', now);
    const second = scheduleNextReview(first, 'good', now);
    expect(second.intervalDays).toBeGreaterThan(first.intervalDays);
  });

  it('shortens the ease factor and interval on "hard"', () => {
    const result = scheduleNextReview({ intervalDays: 10, easeFactor: 2.3, repetitions: 3 }, 'hard', now);
    expect(result.easeFactor).toBeLessThan(2.3);
    expect(result.intervalDays).toBeLessThan(10 * 2.3);
  });

  it('caps the interval at 180 days', () => {
    const result = scheduleNextReview({ intervalDays: 170, easeFactor: 3, repetitions: 20 }, 'easy', now);
    expect(result.intervalDays).toBeLessThanOrEqual(180);
  });

  it('computes dueAt as now plus intervalDays', () => {
    const result = scheduleNextReview({ intervalDays: 3, easeFactor: 2.3, repetitions: 2 }, 'good', now);
    const expectedMs = now.getTime() + result.intervalDays * 86_400_000;
    expect(result.dueAt.getTime()).toBe(expectedMs);
  });
});

describe('srs: isDue', () => {
  it('is true when dueAt is in the past', () => {
    expect(isDue(new Date('2026-01-01'), new Date('2026-02-01'))).toBe(true);
  });
  it('is false when dueAt is in the future', () => {
    expect(isDue(new Date('2026-03-01'), new Date('2026-02-01'))).toBe(false);
  });
});

describe('srs: crossesRetentionThreshold', () => {
  it('is false with no prior practice', () => {
    expect(crossesRetentionThreshold(null)).toBe(false);
  });
  it('is false for a same-day repeat under 18 hours later', () => {
    const last = new Date('2026-02-01T09:00:00Z');
    const now = new Date('2026-02-01T12:00:00Z');
    expect(crossesRetentionThreshold(last, now)).toBe(false);
  });
  it('is true once at least 18 hours have passed', () => {
    const last = new Date('2026-02-01T09:00:00Z');
    const now = new Date('2026-02-02T09:00:01Z');
    expect(crossesRetentionThreshold(last, now)).toBe(true);
  });
});
