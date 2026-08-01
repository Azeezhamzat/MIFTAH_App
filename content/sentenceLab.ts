export interface LabFamily {
  code: string;
  title: string;
  featureAxis: string;
  description: string;
  variants: { sentenceCode: string; label: string }[];
}

export const labFamilies: LabFamily[] = [
  {
    code: 'number-agreement',
    title: 'Singular, dual, plural subject',
    featureAxis: 'Number of the فاعل',
    description: 'The verb كَتَبَ never changes even as the subject grows from one student to two to many.',
    variants: [
      { sentenceCode: 'verb-01-basic-vso', label: 'Singular' },
      { sentenceCode: 'verb-02-dual-subject-singular-verb', label: 'Dual' },
      { sentenceCode: 'verb-03-plural-subject-singular-verb', label: 'Plural' },
    ],
  },
  {
    code: 'fronting',
    title: 'Fronting the subject',
    featureAxis: 'Word order',
    description: 'Moving الطلاب to the front turns this into a nominal sentence and switches on full verb agreement.',
    variants: [
      { sentenceCode: 'verb-03-plural-subject-singular-verb', label: 'Verb-first (default)' },
      { sentenceCode: 'verb-04-fronted-subject-full-agreement', label: 'Subject-fronted' },
    ],
  },
  {
    code: 'voice',
    title: 'Active vs. passive',
    featureAxis: 'Voice',
    description: 'Dropping the agent promotes the object to نائب الفاعل and shifts the verb\'s internal vowels.',
    variants: [
      { sentenceCode: 'verb-01-basic-vso', label: 'Active' },
      { sentenceCode: 'pass-01-anchor', label: 'Passive' },
    ],
  },
  {
    code: 'governing-particle',
    title: 'What enters a nominal sentence',
    featureAxis: 'Governing particle',
    description: 'The same underlying idea — "the student is diligent" — reshaped by four different governors, each targeting a different word.',
    variants: [
      { sentenceCode: 'nom-01-mubtada-khabar-basic', label: 'Bare nominal sentence' },
      { sentenceCode: 'part-01-inna-basic', label: 'With إنّ' },
      { sentenceCode: 'part-03-kana-basic', label: 'With كان' },
      { sentenceCode: 'part-06-maa-zaala', label: 'With ما زال' },
    ],
  },
  {
    code: 'case-role',
    title: 'One word, three roles',
    featureAxis: 'Grammatical role → case',
    description: 'الطالب never changes meaning — only its role, and with it, its case ending.',
    variants: [
      { sentenceCode: 'case-01-nominative-triplet', label: 'Subject (رفع)' },
      { sentenceCode: 'case-02-accusative-triplet', label: 'Object (نصب)' },
      { sentenceCode: 'case-03-genitive-triplet', label: 'After a preposition (جر)' },
    ],
  },
  {
    code: 'hollow-verb-person',
    title: 'A hollow verb before a suffix',
    featureAxis: 'Person (perfect tense)',
    description: 'قَالَ\'s middle radical و contracts into ا in the third person, but resurfaces once a consonant-initial suffix like ـتُ is attached.',
    variants: [
      { sentenceCode: 'morph-05-hollow-perfect-contracted', label: 'Third person' },
      { sentenceCode: 'morph-06-hollow-first-person-resurfaces', label: 'First person' },
    ],
  },
];

export interface BrokenExample {
  code: string;
  textVocalized: string;
  attemptedMeaning: string;
  whyItFails: string;
  relatedFamilyCode?: string;
}

export const brokenExamples: BrokenExample[] = [
  {
    code: 'break-idafa-double-al',
    textVocalized: 'الكِتَابُ الطَّالِبِ',
    attemptedMeaning: 'Attempting: "the student\'s book"',
    whyItFails: 'The مضاف (first noun of an إضافة) can never take ال. Correct: كِتَابُ الطَّالِبِ — only the second noun carries the definiteness.',
  },
  {
    code: 'break-preposition-nominative',
    textVocalized: 'الكِتَابُ عَلَى الطَّاوِلَةُ',
    attemptedMeaning: 'Attempting: "The book is on the table."',
    whyItFails: 'Every preposition forces its noun into the genitive, with no exceptions — الطاولةُ must be الطَّاوِلَةِ.',
  },
  {
    code: 'break-adjective-definiteness-mismatch',
    textVocalized: 'طَالِبٌ المُجْتَهِدُ حَاضِرٌ',
    attemptedMeaning: 'Attempting: "The diligent student is present."',
    whyItFails: 'A نعت must match its noun in definiteness as well as gender, number, and case. المجتهد (definite) cannot describe طالبٌ (indefinite) — both must be الطالب الـمجتهد or طالب مجتهد.',
  },
  {
    code: 'break-verb-agreement-plural-before',
    textVocalized: 'كَتَبُوا الطُّلَّابُ الدَّرْسَ',
    attemptedMeaning: 'Attempting: "The students wrote the lesson."',
    whyItFails: 'A verb preceding its فاعل stays grammatically singular, even for a plural subject. Correct: كَتَبَ الطُّلَّابُ الدَّرْسَ.',
  },
  {
    code: 'break-diptote-tanwin',
    textVocalized: 'سَافَرْتُ إِلَى مِصْرٍ',
    attemptedMeaning: 'Attempting: "I traveled to Egypt."',
    whyItFails: 'مِصْر is a diptote and never takes تنوين. Correct: سَافَرْتُ إِلَى مِصْرَ — فتحة, no تنوين.',
  },
];
