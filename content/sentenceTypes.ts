export interface AlternativeSeed {
  description: string;
  isTraditional?: boolean;
  note?: string;
}

export interface TokenSeed {
  position: number;
  surfaceVocalized: string;
  surfaceUnvocalized: string;
  lemma?: string;
  rootRadicals?: string;
  patternLabel?: string;
  prefix?: string;
  stem?: string;
  suffix?: string;
  partOfSpeech: string;
  person?: string;
  gender?: string;
  number?: string;
  definiteness?: string;
  state?: string;
  grammaticalCase?: string;
  mood?: string;
  role: string;
  marker?: string;
  markerType?: string;
  governedByPosition?: number;
  translation: string;
  contextualMeaning?: string;
  explanation: string;
  traditionalExplanation?: string;
  alternatives?: AlternativeSeed[];
}

export interface DependencySeed {
  headPosition: number;
  dependentPosition: number;
  relation: string;
  explanation: string;
}

export interface SentenceSeed {
  code: string;
  textVocalized: string;
  textUnvocalized: string;
  transliteration?: string;
  translationEnglish: string;
  sourceType?: 'original' | 'quranic' | 'hadith' | 'classical' | 'corpus';
  sourceRef?: string;
  notes?: string;
  difficulty?: number;
  tokens: TokenSeed[];
  dependencies: DependencySeed[];
}
