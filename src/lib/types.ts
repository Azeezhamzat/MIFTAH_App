// Shared enum-like unions. SQLite has no native enum type, so the Prisma schema
// stores these as plain strings; this file is the single source of truth for
// the allowed values so the rest of the app never hard-codes a magic string.

export const MASTERY_LABELS = [
  'new',
  'emerging',
  'developing',
  'reliable',
  'strong',
  'needs_review',
] as const;
export type MasteryLabel = (typeof MASTERY_LABELS)[number];

export const MASTERY_DIMENSIONS = [
  'recognitionScore',
  'formationScore',
  'explanationScore',
  'transferScore',
  'retentionScore',
  'readingApplicationScore',
] as const;
export type MasteryDimension = (typeof MASTERY_DIMENSIONS)[number];

export const EXERCISE_TYPES = [
  'identify_role',
  'identify_governor',
  'select_ending',
  'add_vowels',
  'remove_vowels',
  'reorder',
  'connect_dependency',
  'complete_conjugation',
  'construct_from_root',
  'transform_word',
  'transform_sentence',
  'repair_error',
  'complete_paradigm',
  'translate_to_structure',
  'compare_analyses',
  'explain_rule',
  'partial_irab',
  'full_irab',
  'analyze_passage',
  'free_production',
  'teach_back',
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const SESSION_LENGTHS = [3, 7, 15, 25, 45, 0] as const; // 0 = open study
export type SessionLength = (typeof SESSION_LENGTHS)[number];

export const LEARNING_MODES = ['guided', 'accelerated', 'reference', 'lab'] as const;
export type LearningMode = (typeof LEARNING_MODES)[number];

export const REVIEW_RESULTS = ['again', 'hard', 'good', 'easy'] as const;
export type ReviewResult = (typeof REVIEW_RESULTS)[number];

export const GRAMMATICAL_CASES = ['nominative', 'accusative', 'genitive'] as const;
export type GrammaticalCase = (typeof GRAMMATICAL_CASES)[number];

export const MOODS = ['indicative', 'subjunctive', 'jussive'] as const;
export type Mood = (typeof MOODS)[number];

export const MARKER_TYPES = ['visible', 'secondary', 'estimated', 'positional'] as const;
export type MarkerType = (typeof MARKER_TYPES)[number];

export const GENDERS = ['masculine', 'feminine'] as const;
export type Gender = (typeof GENDERS)[number];

export const NUMBERS = ['singular', 'dual', 'plural'] as const;
export type GNumber = (typeof NUMBERS)[number];

export const PERSONS = ['first', 'second', 'third'] as const;
export type Person = (typeof PERSONS)[number];

export interface MasteryScoreSet {
  recognitionScore: number;
  formationScore: number;
  explanationScore: number;
  transferScore: number;
  retentionScore: number;
  readingApplicationScore: number;
}
