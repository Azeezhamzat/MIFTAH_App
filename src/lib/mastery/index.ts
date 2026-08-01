import type { ExerciseType } from '@/lib/types';
import type { MasteryDimension, MasteryLabel, MasteryScoreSet } from '@/lib/types';

/**
 * Maps each exercise type to the mastery dimension(s) it provides evidence for.
 * A single exercise can feed more than one dimension (e.g. full_irab exercises
 * demonstrate both formation and explanation).
 */
export const EXERCISE_DIMENSION_MAP: Record<ExerciseType, MasteryDimension[]> = {
  identify_role: ['recognitionScore'],
  identify_governor: ['recognitionScore'],
  select_ending: ['recognitionScore', 'formationScore'],
  add_vowels: ['formationScore'],
  remove_vowels: ['formationScore'],
  reorder: ['formationScore'],
  connect_dependency: ['recognitionScore'],
  complete_conjugation: ['formationScore'],
  construct_from_root: ['formationScore'],
  transform_word: ['formationScore'],
  transform_sentence: ['formationScore', 'transferScore'],
  repair_error: ['explanationScore'],
  complete_paradigm: ['formationScore'],
  translate_to_structure: ['formationScore', 'transferScore'],
  compare_analyses: ['explanationScore'],
  explain_rule: ['explanationScore'],
  partial_irab: ['recognitionScore', 'formationScore'],
  full_irab: ['formationScore', 'explanationScore'],
  analyze_passage: ['transferScore', 'readingApplicationScore'],
  free_production: ['transferScore'],
  teach_back: ['explanationScore'],
};

/** Weight given to each dimension when combining into a single overall score.
 * Explanation and transfer are weighted highest: the spec is explicit that
 * exposure and recognition alone must not read as mastery. */
const DIMENSION_WEIGHTS: MasteryScoreSet = {
  recognitionScore: 0.12,
  formationScore: 0.2,
  explanationScore: 0.24,
  transferScore: 0.24,
  retentionScore: 0.14,
  readingApplicationScore: 0.06,
};

const EMA_ALPHA = 0.35; // how much a single new data point moves a dimension score

export function updateDimensionScore(previous: number, observed: number): number {
  const clampedObserved = Math.max(0, Math.min(1, observed));
  return previous + EMA_ALPHA * (clampedObserved - previous);
}

export function computeOverallScore(scores: MasteryScoreSet): number {
  const total = (Object.keys(DIMENSION_WEIGHTS) as MasteryDimension[]).reduce(
    (sum, dim) => sum + scores[dim] * DIMENSION_WEIGHTS[dim],
    0,
  );
  return Math.max(0, Math.min(1, total));
}

interface LabelInput {
  overall: number;
  distinctDaysPracticed: number;
  explanationScore: number;
  transferScore: number;
  retentionScore: number;
  isOverdueForReview: boolean;
}

/**
 * Converts numeric evidence into a humane label. Deliberately guards against
 * the "illusion of mastery": a concept cannot reach `strong` from a single
 * day's repetition, and overdue reviews demote a concept back to needs_review
 * even if the raw overall score is still high.
 */
export function scoreToLabel(input: LabelInput): MasteryLabel {
  const { overall, distinctDaysPracticed, explanationScore, transferScore, retentionScore, isOverdueForReview } = input;

  if (isOverdueForReview && overall > 0.35) return 'needs_review';
  if (overall < 0.2) return 'new';
  if (overall < 0.45) return 'emerging';
  if (overall < 0.65) return 'developing';

  const hasMultiDayEvidence = distinctDaysPracticed >= 2;
  const hasAppliedEvidence = explanationScore >= 0.6 && transferScore >= 0.55;

  if (overall >= 0.82 && hasMultiDayEvidence && hasAppliedEvidence && retentionScore >= 0.6) {
    return 'strong';
  }
  return 'reliable';
}

export interface MasteryEvidence {
  exerciseType: ExerciseType;
  isCorrect: boolean;
  score: number; // 0..1 partial credit
  hintsUsed: number;
  attemptedOnNewCalendarDay: boolean;
}

export function applyEvidence(
  current: MasteryScoreSet & { distinctDaysPracticed: number },
  evidence: MasteryEvidence,
): MasteryScoreSet & { distinctDaysPracticed: number } {
  const dims = EXERCISE_DIMENSION_MAP[evidence.exerciseType] ?? [];
  // Hints reduce the credited evidence: using the answer ladder to the end
  // should not count the same as producing the answer independently.
  const hintPenalty = Math.max(0, 1 - evidence.hintsUsed * 0.18);
  const observed = Math.max(0, Math.min(1, evidence.score * hintPenalty));

  const next = { ...current };
  for (const dim of dims) {
    next[dim] = updateDimensionScore(current[dim], observed);
  }
  if (evidence.attemptedOnNewCalendarDay) {
    next.distinctDaysPracticed = current.distinctDaysPracticed + 1;
  }
  return next;
}

/** Retention score is updated separately, driven by spaced-review outcomes
 * rather than ordinary practice, since retention specifically measures
 * performance *after a delay* rather than same-day repetition. */
export function applyRetentionEvidence(previousRetention: number, reviewWasSuccessful: boolean): number {
  return updateDimensionScore(previousRetention, reviewWasSuccessful ? 1 : 0.15);
}

export function explainWhyReview(params: {
  label: MasteryLabel;
  dueAt: Date;
  now: Date;
  intervalDays: number;
  lastResult: string | null;
  retentionScore: number;
}): string {
  const { label, dueAt, now, intervalDays, lastResult, retentionScore } = params;
  const overdueDays = Math.max(0, Math.round((now.getTime() - dueAt.getTime()) / 86_400_000));
  const parts: string[] = [];

  if (overdueDays > 0) {
    parts.push(
      `This was due ${overdueDays} day${overdueDays === 1 ? '' : 's'} ago, on a ${intervalDays.toFixed(1)}-day spacing interval calculated from your past recall.`,
    );
  } else {
    parts.push(`It is scheduled today as part of a ${intervalDays.toFixed(1)}-day spacing interval.`);
  }

  if (lastResult === 'again' || lastResult === 'hard') {
    parts.push(`Your last attempt was rated "${lastResult}", so the interval was shortened rather than extended.`);
  } else if (lastResult === 'good' || lastResult === 'easy') {
    parts.push(`Your last attempt went well, so this review checks whether that recall survives a longer gap.`);
  }

  if (label === 'needs_review') {
    parts.push('It is currently flagged "needs review" because a scheduled check-in was missed or answered incorrectly.');
  } else if (retentionScore < 0.5) {
    parts.push('Retention evidence for this concept is still thin — recall after a delay hasn\'t been demonstrated yet.');
  }

  return parts.join(' ');
}
