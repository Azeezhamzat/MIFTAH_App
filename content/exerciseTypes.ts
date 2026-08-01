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
  hints: string[];
  explanation: string;
  misconceptionTags?: string[];
  estimatedSeconds?: number;
  reviewPriority?: number;
}
