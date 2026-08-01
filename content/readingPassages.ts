export interface ReadingPassageSeed {
  title: string;
  level: number;
  textVocalized: string;
  translationEnglish: string;
  vocabPreview: { arabic: string; meaning: string }[];
  comprehensionQuestions: { question: string; answer: string }[];
  sentenceCodes: string[];
  recurringStructures: string[];
}

export const readingPassages: ReadingPassageSeed[] = [
  {
    title: 'A day at school',
    level: 2,
    textVocalized:
      'الطَّالِبُ مُجْتَهِدٌ. ذَهَبَتِ الطَّالِبَةُ إِلَى الْمَدْرَسَةِ. فَتَحَ الْمُعَلِّمُ الْبَابَ. كَتَبَ الطَّالِبُ الدَّرْسَ. الْكِتَابُ عَلَى الطَّاوِلَةِ.',
    translationEnglish:
      'The student is diligent. The (female) student went to school. The teacher opened the door. The student wrote the lesson. The book is on the table.',
    vocabPreview: [
      { arabic: 'طَالِب / طَالِبَة', meaning: 'student (m./f.)' },
      { arabic: 'مُجْتَهِد', meaning: 'diligent' },
      { arabic: 'مَدْرَسَة', meaning: 'school' },
      { arabic: 'مُعَلِّم', meaning: 'teacher' },
      { arabic: 'بَاب', meaning: 'door' },
      { arabic: 'دَرْس', meaning: 'lesson' },
      { arabic: 'كِتَاب', meaning: 'book' },
      { arabic: 'طَاوِلَة', meaning: 'table' },
    ],
    comprehensionQuestions: [
      { question: 'Who went to school?', answer: 'الطالبة — the female student.' },
      { question: 'What did the teacher do?', answer: 'فتح الباب — he opened the door.' },
      { question: 'Where is the book?', answer: 'على الطاولة — on the table.' },
    ],
    sentenceCodes: ['nom-01-mubtada-khabar-basic', 'verb-05-feminine-intransitive', 'verb-08-transitive-teacher-door', 'verb-01-basic-vso', 'nom-04-khabar-shibh-jumla'],
    recurringStructures: ['Nominal sentence (mubtada/khabar)', 'Verbal sentence (VSO)', 'Prepositional-phrase khabar'],
  },
  {
    title: 'Diligence, past and present',
    level: 4,
    textVocalized:
      'كَتَبَ الطَّالِبُ الدَّرْسَ بِخَطٍّ جَمِيلٍ. إِنَّ الطَّالِبَ مُجْتَهِدٌ. وَكَانَ مُجْتَهِدًا فِي الْعَامِ الْمَاضِي أَيْضًا. لِذَلِكَ كُتِبَ اسْمُهُ عَلَى لَوْحَةِ الشَّرَفِ.',
    translationEnglish:
      "The student wrote the lesson in beautiful handwriting. Indeed, the student is diligent. And he was diligent last year too. Because of that, his name was written on the honor board.",
    vocabPreview: [
      { arabic: 'بِخَطٍّ جَمِيلٍ', meaning: 'in beautiful handwriting' },
      { arabic: 'إِنَّ', meaning: 'indeed (governs the following noun into the accusative)' },
      { arabic: 'كَانَ', meaning: 'was (governs the following predicate into the accusative)' },
      { arabic: 'الْعَام الْمَاضِي', meaning: 'last year' },
      { arabic: 'لِذَلِكَ', meaning: 'because of that; therefore' },
      { arabic: 'اسْم', meaning: 'name' },
      { arabic: 'لَوْحَة الشَّرَف', meaning: 'the honor board' },
    ],
    comprehensionQuestions: [
      { question: 'What two governing particles appear in this passage, and what does each do to the noun or predicate that follows it?', answer: 'إنّ pushes the following noun into the accusative (اسم إنّ); كان pushes the following predicate into the accusative (خبر كان) while its subject stays nominative.' },
      { question: 'Why was the passive كُتِبَ used in the final sentence rather than an active verb?', answer: 'The agent (whoever wrote the name on the board) is not the point of the sentence — the passive lets the writer omit the agent and focus on الاسم.' },
    ],
    sentenceCodes: ['verb-01-basic-vso', 'part-01-inna-basic', 'part-03-kana-basic', 'pass-01-anchor'],
    recurringStructures: ['إنّ وأخواتها', 'كان وأخواتها', 'Passive voice with omitted agent'],
  },
  {
    title: 'The new book',
    level: 6,
    textVocalized:
      'باب البيت مفتوح. دخل المعلم البيت ووجد كتاب الطالب على الطاولة. قال المعلم: "هذا كتاب جديد." اجتمع الطلاب في الفصل بعد قليل ليتعلموا النحو من هذا الكتاب.',
    translationEnglish:
      'The door of the house is open. The teacher entered the house and found the student\'s book on the table. The teacher said: "This is a new book." The students gathered in the classroom shortly after to learn grammar from this book.',
    vocabPreview: [
      { arabic: 'دَخَلَ', meaning: 'he entered' },
      { arabic: 'وَجَدَ', meaning: 'he found' },
      { arabic: 'قَالَ', meaning: 'he said' },
      { arabic: 'اجْتَمَعَ', meaning: 'they gathered' },
      { arabic: 'بَعْدَ قَلِيل', meaning: 'shortly after' },
      { arabic: 'لِيَتَعَلَّمُوا', meaning: 'so that they might learn' },
    ],
    comprehensionQuestions: [
      { question: 'What two idafa (إضافة) constructions appear in the first two sentences? What does each show about definiteness?', answer: 'باب البيت ("the door of the house") and كتاب الطالب ("the student\'s book") — both are definite because their second term (البيت, الطالب) is definite, without either مضاف taking ال.' },
      { question: 'Which verb in this passage is hollow, and which root letter does it hide?', answer: 'قَالَ is hollow, from the root ق و ل, with the middle radical و contracted into the long ا.' },
      { question: 'Which verb form is اجْتَمَعَ, and what does that form usually add to a root\'s bare meaning?', answer: 'Form VIII (افْتَعَلَ), which here adds a reciprocal/reflexive sense to جمع ("gathered [something]") → "gathered together."' },
    ],
    sentenceCodes: ['nom-07-idafa-passive-participle-khabar', 'morph-10-assimilated', 'morph-05-hollow-perfect-contracted', 'morph-03-form8-reciprocal-effort'],
    recurringStructures: ['Idafa chains', 'Hollow verbs', 'Form VIII', 'Connected narrative with minimal vocalization'],
  },
];
