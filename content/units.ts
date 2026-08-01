export interface UnitSeed {
  code: string;
  domainCode: string;
  stageCode: string;
  title: string;
  titleArabic: string;
  description: string;
  order: number;
}

export const units: UnitSeed[] = [
  {
    code: 'unit-word-categories',
    domainCode: 'A',
    stageCode: 'foundation',
    title: 'Words, phrases, and sentences',
    titleArabic: 'الكلمة والجملة',
    description: 'The three word categories and what makes an Arabic utterance complete.',
    order: 1,
  },
  {
    code: 'unit-sentence-shapes',
    domainCode: 'A',
    stageCode: 'foundation',
    title: 'Recognizing the two sentence shapes',
    titleArabic: 'نوعا الجملة',
    description: 'Telling a nominal sentence from a verbal one on sight, plus demonstratives, questions, and negation.',
    order: 2,
  },
  {
    code: 'unit-nominal-sentence',
    domainCode: 'B',
    stageCode: 'core',
    title: 'The nominal sentence, completely',
    titleArabic: 'الجملة الاسمية',
    description: 'مبتدأ and خبر, agreement, إضافة, and definiteness — the full architecture of noun-first sentences.',
    order: 3,
  },
  {
    code: 'unit-verbal-sentence',
    domainCode: 'C',
    stageCode: 'core',
    title: 'The verbal sentence, completely',
    titleArabic: 'الجملة الفعلية',
    description: 'فعل، فاعل، مفعول به, verb–subject agreement, transitivity, and the passive voice.',
    order: 4,
  },
  {
    code: 'unit-case-foundations',
    domainCode: 'D',
    stageCode: 'core',
    title: 'Case, completely: the foundations',
    titleArabic: 'أساسيات الإعراب',
    description: 'What إعراب actually is, the four case/mood states, and how to tell a visible marker from an estimated one.',
    order: 5,
  },
  {
    code: 'unit-roots-patterns',
    domainCode: 'E',
    stageCode: 'core',
    title: 'Roots and patterns, completely',
    titleArabic: 'الجذر والوزن',
    description: 'How every Arabic word is a root poured into a pattern — and how to read that structure on sight.',
    order: 6,
  },
  {
    code: 'unit-verb-conjugation',
    domainCode: 'E',
    stageCode: 'core',
    title: 'Basic verb conjugation, completely',
    titleArabic: 'تصريف الفعل',
    description: 'Perfect, imperfect, and imperative across person, gender, and number for sound Form I verbs.',
    order: 7,
  },
  {
    code: 'unit-weak-verbs',
    domainCode: 'F',
    stageCode: 'advanced',
    title: 'When roots are not so sound',
    titleArabic: 'الأفعال المعتلة والمهموزة',
    description: 'Hamzated, doubled, hollow, and defective verbs, and the sound changes (إعلال) that reshape them.',
    order: 8,
  },
  {
    code: 'unit-advanced-analysis',
    domainCode: 'H',
    stageCode: 'advanced',
    title: 'Reading like a grammarian',
    titleArabic: 'التحليل المتقدم',
    description: 'Ellipsis, competing valid analyses, and syntax in connected prose — unlocked once the core system is reliable.',
    order: 9,
  },
];
