export interface StageSeed {
  code: string;
  title: string;
  description: string;
  order: number;
}

export interface DomainSeed {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
}

export const stages: StageSeed[] = [
  {
    code: 'foundation',
    title: 'Foundation',
    description: 'Recognizing words, phrases, and the two basic sentence shapes of Arabic.',
    order: 1,
  },
  {
    code: 'core',
    title: 'Core system',
    description: 'The government-and-agreement machinery that runs every Arabic sentence: case, roots, patterns, and verb conjugation.',
    order: 2,
  },
  {
    code: 'advanced',
    title: 'Advanced analysis',
    description: 'Ellipsis, competing analyses, connected reading, and classical variation.',
    order: 3,
  },
];

export const domains: DomainSeed[] = [
  {
    code: 'A',
    title: 'Sentence foundations',
    subtitle: 'اسم، فعل، حرف',
    description: 'What counts as a word, a phrase, and a complete Arabic sentence.',
    order: 1,
  },
  {
    code: 'B',
    title: 'Nominal syntax',
    subtitle: 'الجملة الاسمية',
    description: 'مبتدأ and خبر, agreement, إضافة, and the noun-centered sentence.',
    order: 2,
  },
  {
    code: 'C',
    title: 'Verbal syntax',
    subtitle: 'الجملة الفعلية',
    description: 'فعل، فاعل، مفعول به — who does what to whom, and how the passive reshapes it.',
    order: 3,
  },
  {
    code: 'D',
    title: 'Case and government',
    subtitle: 'الإعراب والبناء',
    description: 'Why word-endings change: رفع، نصب، جر، جزم and what controls each one.',
    order: 4,
  },
  {
    code: 'E',
    title: 'Verb morphology',
    subtitle: 'تصريف الأفعال',
    description: 'Root and pattern, the ten verb forms, and how meaning shifts across them.',
    order: 5,
  },
  {
    code: 'F',
    title: 'Irregular morphology',
    subtitle: 'الإعلال والإبدال',
    description: 'Hamzated, doubled, hollow, and defective verbs — and the sound changes that shape them.',
    order: 6,
  },
  {
    code: 'G',
    title: 'Noun morphology',
    subtitle: 'صرف الأسماء',
    description: 'Plurals, gender formation, participles, and pattern-to-meaning tendencies in nouns.',
    order: 7,
  },
  {
    code: 'H',
    title: 'Advanced analysis',
    subtitle: 'التحليل المتقدم',
    description: 'العامل, ellipsis, competing valid analyses, and reading connected and classical text.',
    order: 8,
  },
];
