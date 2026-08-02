// Shared shapes for the downloadable offline curriculum bundle and the
// locally-queued attempts that get replayed against the server once back
// online. Keeping these in one file means the bundle route, the IndexedDB
// layer, and the offline UI all agree on the same contract.

export interface OfflineGradingData {
  expectedAnswer: string;
  acceptedVariants: string[];
  invalidPlausible: { answer: string; why: string }[];
  explanation: string;
}

export interface OfflineExercise {
  id: string;
  type: string;
  objective: string;
  prompt: string;
  promptArabic?: string | null;
  difficulty: number;
  hints: { level: number; text: string }[];
  conceptCode: string;
  conceptTitle: string;
  lessonCode?: string | null;
  choices?: string[];
}

export interface OfflineLesson {
  code: string;
  title: string;
  titleArabic: string;
  summary: string;
  unitTitle: string;
  domainTitle: string;
  microExplanation: string;
  deeperDetail?: string | null;
  discoveryPrompt: string;
  concepts: { code: string; title: string; titleArabic: string }[];
  observeSentences: {
    id: string; textVocalized: string; translationEnglish: string; notes?: string | null;
    tokens: { position: number; surfaceVocalized: string; role: string; grammaticalCase: string | null; mood: string | null; marker: string | null; translation: string; explanation: string }[];
  }[];
  exerciseIds: string[];
}

export interface OfflineBundle {
  generatedAt: string;
  learnerName: string;
  lessons: OfflineLesson[];
  exercises: OfflineExercise[];
  grading: Record<string, OfflineGradingData>;
}

export interface QueuedAttempt {
  localId: string;
  exerciseId: string;
  response: string;
  hintsUsed: number;
  responseTimeMs: number;
  confidence?: number;
  queuedAt: string;
}
