import { describe, it, expect } from 'vitest';
import { applyEvidence, computeOverallScore, scoreToLabel, applyRetentionEvidence } from '@/lib/mastery';

describe('mastery: applyEvidence', () => {
  it('raises the recognition dimension after a correct identify_role attempt', () => {
    const start = { recognitionScore: 0, formationScore: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, readingApplicationScore: 0, distinctDaysPracticed: 0 };
    const next = applyEvidence(start, { exerciseType: 'identify_role', isCorrect: true, score: 1, hintsUsed: 0, attemptedOnNewCalendarDay: true });
    expect(next.recognitionScore).toBeGreaterThan(0);
    expect(next.formationScore).toBe(0);
    expect(next.distinctDaysPracticed).toBe(1);
  });

  it('penalizes credit for heavy hint usage', () => {
    const start = { recognitionScore: 0, formationScore: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, readingApplicationScore: 0, distinctDaysPracticed: 0 };
    const noHints = applyEvidence(start, { exerciseType: 'full_irab', isCorrect: true, score: 1, hintsUsed: 0, attemptedOnNewCalendarDay: false });
    const withHints = applyEvidence(start, { exerciseType: 'full_irab', isCorrect: true, score: 1, hintsUsed: 3, attemptedOnNewCalendarDay: false });
    expect(withHints.formationScore).toBeLessThan(noHints.formationScore);
  });

  it('does not advance distinctDaysPracticed on a same-day repeat', () => {
    const start = { recognitionScore: 0.5, formationScore: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, readingApplicationScore: 0, distinctDaysPracticed: 2 };
    const next = applyEvidence(start, { exerciseType: 'identify_role', isCorrect: true, score: 1, hintsUsed: 0, attemptedOnNewCalendarDay: false });
    expect(next.distinctDaysPracticed).toBe(2);
  });
});

describe('mastery: scoreToLabel guards against the illusion of same-day mastery', () => {
  const highEvidenceButOneDay = {
    overall: 0.9,
    distinctDaysPracticed: 1,
    explanationScore: 0.9,
    transferScore: 0.9,
    retentionScore: 0.9,
    isOverdueForReview: false,
  };

  it('never labels a concept "strong" from a single day of practice, even with a high score', () => {
    expect(scoreToLabel(highEvidenceButOneDay)).not.toBe('strong');
  });

  it('does label a concept "strong" once multi-day and applied evidence both exist', () => {
    const label = scoreToLabel({ ...highEvidenceButOneDay, distinctDaysPracticed: 3 });
    expect(label).toBe('strong');
  });

  it('demotes an otherwise-strong concept to needs_review when overdue and failed', () => {
    const label = scoreToLabel({ ...highEvidenceButOneDay, distinctDaysPracticed: 5, isOverdueForReview: true });
    expect(label).toBe('needs_review');
  });

  it('labels very low scores as new', () => {
    expect(scoreToLabel({ overall: 0.05, distinctDaysPracticed: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, isOverdueForReview: false })).toBe('new');
  });
});

describe('mastery: computeOverallScore', () => {
  it('weights explanation and transfer more heavily than recognition', () => {
    const recognitionHeavy = computeOverallScore({ recognitionScore: 1, formationScore: 0, explanationScore: 0, transferScore: 0, retentionScore: 0, readingApplicationScore: 0 });
    const explanationHeavy = computeOverallScore({ recognitionScore: 0, formationScore: 0, explanationScore: 1, transferScore: 0, retentionScore: 0, readingApplicationScore: 0 });
    expect(explanationHeavy).toBeGreaterThan(recognitionHeavy);
  });

  it('stays within [0, 1]', () => {
    const score = computeOverallScore({ recognitionScore: 1, formationScore: 1, explanationScore: 1, transferScore: 1, retentionScore: 1, readingApplicationScore: 1 });
    expect(score).toBeLessThanOrEqual(1);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('mastery: applyRetentionEvidence', () => {
  it('increases retention after a successful delayed review', () => {
    expect(applyRetentionEvidence(0.3, true)).toBeGreaterThan(0.3);
  });
  it('decreases retention after a failed delayed review', () => {
    expect(applyRetentionEvidence(0.6, false)).toBeLessThan(0.6);
  });
});
