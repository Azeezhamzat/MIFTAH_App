export interface InvalidPlausible {
  answer: string;
  why: string;
}

export interface ExerciseSeed {
  lessonCode?: string;
  conceptCode: string;
  sentenceCode?: string;
  type: string;
  objective: string;
  prompt: string;
  promptArabic?: string;
  difficulty: number;
  expectedAnswer: unknown;
  acceptedVariants?: string[];
  invalidPlausible?: InvalidPlausible[];
  /** Explicit closed-answer options for select_ending exercises whose answer isn't a sentence token (see src/lib/exerciseChoices.ts). */
  choices?: string[];
  hints: string[];
  explanation: string;
  misconceptionTags?: string[];
  estimatedSeconds?: number;
  reviewPriority?: number;
}
