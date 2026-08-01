export interface LexemeSeed {
  rootRadicals?: string;
  patternLabel?: string;
  vocalized: string;
  unvocalized: string;
  partOfSpeech: string;
  meaningEnglish: string;
  notes?: string;
}

export const lexemes: LexemeSeed[] = [
  // ك ت ب — writing
  { rootRadicals: 'ك ت ب', patternLabel: 'Form I — فَعَلَ', vocalized: 'كَتَبَ', unvocalized: 'كتب', partOfSpeech: 'verb', meaningEnglish: 'he wrote' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'كَاتِب', unvocalized: 'كاتب', partOfSpeech: 'noun', meaningEnglish: 'writer; one writing' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَكْتُوب', unvocalized: 'مكتوب', partOfSpeech: 'adjective', meaningEnglish: 'written' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Verbal noun pattern — فِعَالَة', vocalized: 'كِتَابَة', unvocalized: 'كتابة', partOfSpeech: 'noun', meaningEnglish: 'writing (the act)' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَكْتَب', unvocalized: 'مكتب', partOfSpeech: 'noun', meaningEnglish: 'office; desk' },
  { rootRadicals: 'ك ت ب', vocalized: 'كِتَاب', unvocalized: 'كتاب', partOfSpeech: 'noun', meaningEnglish: 'book', notes: 'Historically related to the root but not a regular derived pattern — worth flagging so learners do not over-generalize the forge rules to it.' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Form III — فَاعَلَ', vocalized: 'كَاتَبَ', unvocalized: 'كاتب', partOfSpeech: 'verb', meaningEnglish: 'he corresponded with (someone)', notes: 'Form III often implies doing the action toward/with another party.' },
  { rootRadicals: 'ك ت ب', patternLabel: 'Form VI — تَفَاعَلَ', vocalized: 'تَكَاتَبَ', unvocalized: 'تكاتب', partOfSpeech: 'verb', meaningEnglish: 'they corresponded with each other', notes: 'Form VI often adds reciprocity to Form III\'s meaning.' },

  // ف ت ح — opening
  { rootRadicals: 'ف ت ح', patternLabel: 'Form I — فَعَلَ', vocalized: 'فَتَحَ', unvocalized: 'فتح', partOfSpeech: 'verb', meaningEnglish: 'he opened' },
  { rootRadicals: 'ف ت ح', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'فَاتِح', unvocalized: 'فاتح', partOfSpeech: 'noun', meaningEnglish: 'opener; conqueror' },
  { rootRadicals: 'ف ت ح', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَفْتُوح', unvocalized: 'مفتوح', partOfSpeech: 'adjective', meaningEnglish: 'open; opened' },
  { rootRadicals: 'ف ت ح', patternLabel: 'Verbal noun pattern — فَعْل', vocalized: 'فَتْح', unvocalized: 'فتح', partOfSpeech: 'noun', meaningEnglish: 'opening; conquest (the act)' },
  { rootRadicals: 'ف ت ح', patternLabel: 'Instrument noun — مِفْعَال', vocalized: 'مِفْتَاح', unvocalized: 'مفتاح', partOfSpeech: 'noun', meaningEnglish: 'key (the instrument of opening)' },

  // د ر س — studying
  { rootRadicals: 'د ر س', patternLabel: 'Form I — فَعَلَ', vocalized: 'دَرَسَ', unvocalized: 'درس', partOfSpeech: 'verb', meaningEnglish: 'he studied' },
  { rootRadicals: 'د ر س', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَدْرُوس', unvocalized: 'مدروس', partOfSpeech: 'adjective', meaningEnglish: 'studied' },
  { rootRadicals: 'د ر س', patternLabel: 'Verbal noun pattern — فِعَالَة', vocalized: 'دِرَاسَة', unvocalized: 'دراسة', partOfSpeech: 'noun', meaningEnglish: 'studying; study' },
  { rootRadicals: 'د ر س', patternLabel: 'Noun of place (feminine) — مَفْعَلة', vocalized: 'مَدْرَسَة', unvocalized: 'مدرسة', partOfSpeech: 'noun', meaningEnglish: 'school (a place of study)' },
  { rootRadicals: 'د ر س', vocalized: 'الدَّرْس', unvocalized: 'الدرس', partOfSpeech: 'noun', meaningEnglish: 'the lesson', notes: 'Used constantly in this course\'s example sentences (كَتَبَ الطَّالِبُ الدَّرْسَ).' },
  { rootRadicals: 'د ر س', patternLabel: 'Form II — فَعَّلَ', vocalized: 'دَرَّسَ', unvocalized: 'درس', partOfSpeech: 'verb', meaningEnglish: 'he taught', notes: 'Classic Form II causative: "caused to study" → "taught."' },

  // ل ع ب — playing
  { rootRadicals: 'ل ع ب', patternLabel: 'Form I — فَعَلَ', vocalized: 'لَعِبَ', unvocalized: 'لعب', partOfSpeech: 'verb', meaningEnglish: 'he played' },
  { rootRadicals: 'ل ع ب', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'لَاعِب', unvocalized: 'لاعب', partOfSpeech: 'noun', meaningEnglish: 'player' },
  { rootRadicals: 'ل ع ب', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَلْعَب', unvocalized: 'ملعب', partOfSpeech: 'noun', meaningEnglish: 'playground; stadium' },

  // خ ر ج — going out
  { rootRadicals: 'خ ر ج', patternLabel: 'Form I — فَعَلَ', vocalized: 'خَرَجَ', unvocalized: 'خرج', partOfSpeech: 'verb', meaningEnglish: 'he went out' },
  { rootRadicals: 'خ ر ج', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'خَارِج', unvocalized: 'خارج', partOfSpeech: 'noun', meaningEnglish: 'one going out; outside' },
  { rootRadicals: 'خ ر ج', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَخْرَج', unvocalized: 'مخرج', partOfSpeech: 'noun', meaningEnglish: 'exit' },
  { rootRadicals: 'خ ر ج', patternLabel: 'Verbal noun pattern — فُعُول', vocalized: 'خُرُوج', unvocalized: 'خروج', partOfSpeech: 'noun', meaningEnglish: 'going out (the act)' },
  { rootRadicals: 'خ ر ج', patternLabel: 'Form IV — أَفْعَلَ', vocalized: 'أَخْرَجَ', unvocalized: 'أخرج', partOfSpeech: 'verb', meaningEnglish: 'he took out; caused to go out', notes: 'Classic Form IV causative built on a Form I verb of motion.' },

  // د خ ل — entering
  { rootRadicals: 'د خ ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'دَخَلَ', unvocalized: 'دخل', partOfSpeech: 'verb', meaningEnglish: 'he entered' },
  { rootRadicals: 'د خ ل', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'دَاخِل', unvocalized: 'داخل', partOfSpeech: 'noun', meaningEnglish: 'one entering; inside' },
  { rootRadicals: 'د خ ل', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَدْخَل', unvocalized: 'مدخل', partOfSpeech: 'noun', meaningEnglish: 'entrance' },
  { rootRadicals: 'د خ ل', patternLabel: 'Verbal noun pattern — فُعُول', vocalized: 'دُخُول', unvocalized: 'دخول', partOfSpeech: 'noun', meaningEnglish: 'entering (the act)' },

  // ج ل س — sitting
  { rootRadicals: 'ج ل س', patternLabel: 'Form I — فَعَلَ', vocalized: 'جَلَسَ', unvocalized: 'جلس', partOfSpeech: 'verb', meaningEnglish: 'he sat' },
  { rootRadicals: 'ج ل س', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'جَالِس', unvocalized: 'جالس', partOfSpeech: 'noun', meaningEnglish: 'one sitting' },
  { rootRadicals: 'ج ل س', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَجْلِس', unvocalized: 'مجلس', partOfSpeech: 'noun', meaningEnglish: 'sitting-room; council' },
  { rootRadicals: 'ج ل س', patternLabel: 'Verbal noun pattern — فُعُول', vocalized: 'جُلُوس', unvocalized: 'جلوس', partOfSpeech: 'noun', meaningEnglish: 'sitting (the act)' },

  // ف ه م — understanding
  { rootRadicals: 'ف ه م', patternLabel: 'Form I — فَعَلَ', vocalized: 'فَهِمَ', unvocalized: 'فهم', partOfSpeech: 'verb', meaningEnglish: 'he understood' },
  { rootRadicals: 'ف ه م', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'فَاهِم', unvocalized: 'فاهم', partOfSpeech: 'noun', meaningEnglish: 'one who understands' },
  { rootRadicals: 'ف ه م', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَفْهُوم', unvocalized: 'مفهوم', partOfSpeech: 'noun', meaningEnglish: 'understood; a concept' },
  { rootRadicals: 'ف ه م', patternLabel: 'Verbal noun pattern — فَعْل', vocalized: 'فَهْم', unvocalized: 'فهم', partOfSpeech: 'noun', meaningEnglish: 'understanding (the act)' },

  // ع ل م — knowing
  { rootRadicals: 'ع ل م', patternLabel: 'Form I — فَعَلَ', vocalized: 'عَلِمَ', unvocalized: 'علم', partOfSpeech: 'verb', meaningEnglish: 'he knew' },
  { rootRadicals: 'ع ل م', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'عَالِم', unvocalized: 'عالم', partOfSpeech: 'noun', meaningEnglish: 'knower; scholar' },
  { rootRadicals: 'ع ل م', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَعْلُوم', unvocalized: 'معلوم', partOfSpeech: 'adjective', meaningEnglish: 'known' },
  { rootRadicals: 'ع ل م', patternLabel: 'Verbal noun pattern — فِعْل', vocalized: 'عِلْم', unvocalized: 'علم', partOfSpeech: 'noun', meaningEnglish: 'knowledge' },
  { rootRadicals: 'ع ل م', patternLabel: 'Form II — فَعَّلَ', vocalized: 'عَلَّمَ', unvocalized: 'علم', partOfSpeech: 'verb', meaningEnglish: 'he taught' },
  { rootRadicals: 'ع ل م', patternLabel: 'Form V — تَفَعَّلَ', vocalized: 'تَعَلَّمَ', unvocalized: 'تعلم', partOfSpeech: 'verb', meaningEnglish: 'he learned', notes: 'Form V here is reflexive of Form II: "taught himself" → "learned."' },
  { rootRadicals: 'ع ل م', patternLabel: 'Form X — اسْتَفْعَلَ', vocalized: 'اسْتَعْلَمَ', unvocalized: 'استعلم', partOfSpeech: 'verb', meaningEnglish: 'he inquired (sought to know)' },

  // ع م ل — doing / working
  { rootRadicals: 'ع م ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'عَمِلَ', unvocalized: 'عمل', partOfSpeech: 'verb', meaningEnglish: 'he worked; he did' },
  { rootRadicals: 'ع م ل', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'عَامِل', unvocalized: 'عامل', partOfSpeech: 'noun', meaningEnglish: 'worker; agent', notes: 'Also the grammatical term العامل — the governing element that causes a case ending.' },
  { rootRadicals: 'ع م ل', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَعْمُول', unvocalized: 'معمول', partOfSpeech: 'adjective', meaningEnglish: 'done; made', notes: 'Also the grammatical term المعمول — the element governed by an عامل.' },
  { rootRadicals: 'ع م ل', patternLabel: 'Verbal noun pattern — فَعَل', vocalized: 'عَمَل', unvocalized: 'عمل', partOfSpeech: 'noun', meaningEnglish: 'work; action' },
  { rootRadicals: 'ع م ل', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَعْمَل', unvocalized: 'معمل', partOfSpeech: 'noun', meaningEnglish: 'workshop; laboratory' },

  // س م ع — hearing
  { rootRadicals: 'س م ع', patternLabel: 'Form I — فَعَلَ', vocalized: 'سَمِعَ', unvocalized: 'سمع', partOfSpeech: 'verb', meaningEnglish: 'he heard' },
  { rootRadicals: 'س م ع', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'سَامِع', unvocalized: 'سامع', partOfSpeech: 'noun', meaningEnglish: 'hearer; listener' },
  { rootRadicals: 'س م ع', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَسْمُوع', unvocalized: 'مسموع', partOfSpeech: 'adjective', meaningEnglish: 'heard; audible' },
  { rootRadicals: 'س م ع', patternLabel: 'Verbal noun pattern — فَعْل', vocalized: 'سَمْع', unvocalized: 'سمع', partOfSpeech: 'noun', meaningEnglish: 'hearing (the sense)' },

  // ن ظ ر — looking
  { rootRadicals: 'ن ظ ر', patternLabel: 'Form I — فَعَلَ', vocalized: 'نَظَرَ', unvocalized: 'نظر', partOfSpeech: 'verb', meaningEnglish: 'he looked' },
  { rootRadicals: 'ن ظ ر', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'نَاظِر', unvocalized: 'ناظر', partOfSpeech: 'noun', meaningEnglish: 'onlooker; overseer' },
  { rootRadicals: 'ن ظ ر', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَنْظُور', unvocalized: 'منظور', partOfSpeech: 'adjective', meaningEnglish: 'looked at; considered' },
  { rootRadicals: 'ن ظ ر', patternLabel: 'Verbal noun pattern — فَعَل', vocalized: 'نَظَر', unvocalized: 'نظر', partOfSpeech: 'noun', meaningEnglish: 'looking; a view/opinion' },
  { rootRadicals: 'ن ظ ر', patternLabel: 'Noun of place — مَفْعَل', vocalized: 'مَنْظَر', unvocalized: 'منظر', partOfSpeech: 'noun', meaningEnglish: 'view; scene' },

  // ك س ر — breaking
  { rootRadicals: 'ك س ر', patternLabel: 'Form I — فَعَلَ', vocalized: 'كَسَرَ', unvocalized: 'كسر', partOfSpeech: 'verb', meaningEnglish: 'he broke (something)' },
  { rootRadicals: 'ك س ر', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَكْسُور', unvocalized: 'مكسور', partOfSpeech: 'adjective', meaningEnglish: 'broken' },
  { rootRadicals: 'ك س ر', patternLabel: 'Verbal noun pattern — فَعْل', vocalized: 'كَسْر', unvocalized: 'كسر', partOfSpeech: 'noun', meaningEnglish: 'breaking; a fraction' },
  { rootRadicals: 'ك س ر', patternLabel: 'Form VII — انْفَعَلَ', vocalized: 'انْكَسَرَ', unvocalized: 'انكسر', partOfSpeech: 'verb', meaningEnglish: 'it broke; got broken', notes: 'Classic Form VII: gives the plain Form I verb a passive/reflexive sense.' },

  // ج م ع — gathering
  { rootRadicals: 'ج م ع', patternLabel: 'Form I — فَعَلَ', vocalized: 'جَمَعَ', unvocalized: 'جمع', partOfSpeech: 'verb', meaningEnglish: 'he gathered (something)' },
  { rootRadicals: 'ج م ع', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَجْمُوع', unvocalized: 'مجموع', partOfSpeech: 'noun', meaningEnglish: 'total; sum' },
  { rootRadicals: 'ج م ع', patternLabel: 'Form VIII — افْتَعَلَ', vocalized: 'اجْتَمَعَ', unvocalized: 'اجتمع', partOfSpeech: 'verb', meaningEnglish: 'he/they gathered together; met', notes: 'Form VIII often adds a reflexive or effortful sense to Form I.' },

  // ط ل ب — seeking / requesting
  { rootRadicals: 'ط ل ب', patternLabel: 'Form I — فَعَلَ', vocalized: 'طَلَبَ', unvocalized: 'طلب', partOfSpeech: 'verb', meaningEnglish: 'he requested; he sought' },
  { rootRadicals: 'ط ل ب', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'طَالِب', unvocalized: 'طالب', partOfSpeech: 'noun', meaningEnglish: 'student; seeker', notes: 'The everyday word for "student" is literally "one who seeks [knowledge]" — an active participle used as an ordinary noun.' },
  { rootRadicals: 'ط ل ب', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَطْلُوب', unvocalized: 'مطلوب', partOfSpeech: 'adjective', meaningEnglish: 'required; requested' },
  { rootRadicals: 'ط ل ب', patternLabel: 'Verbal noun pattern — فَعَل', vocalized: 'طَلَب', unvocalized: 'طلب', partOfSpeech: 'noun', meaningEnglish: 'a request; demand' },

  // ح ض ر — being present
  { rootRadicals: 'ح ض ر', patternLabel: 'Form I — فَعَلَ', vocalized: 'حَضَرَ', unvocalized: 'حضر', partOfSpeech: 'verb', meaningEnglish: 'he was present; he attended' },
  { rootRadicals: 'ح ض ر', patternLabel: 'Active participle (Form I) — فَاعِل', vocalized: 'حَاضِر', unvocalized: 'حاضر', partOfSpeech: 'adjective', meaningEnglish: 'present; attending' },

  // hamzated
  { rootRadicals: 'أ ك ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'أَكَلَ', unvocalized: 'أكل', partOfSpeech: 'verb', meaningEnglish: 'he ate', notes: 'Hamzated (first radical): the همزة is the first root letter.' },
  { rootRadicals: 'أ ك ل', patternLabel: 'Passive participle (Form I) — مَفْعُول', vocalized: 'مَأْكُول', unvocalized: 'مأكول', partOfSpeech: 'adjective', meaningEnglish: 'eaten; edible' },
  { rootRadicals: 'س أ ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'سَأَلَ', unvocalized: 'سأل', partOfSpeech: 'verb', meaningEnglish: 'he asked', notes: 'Hamzated (middle radical).' },
  { rootRadicals: 'ق ر أ', patternLabel: 'Form I — فَعَلَ', vocalized: 'قَرَأَ', unvocalized: 'قرأ', partOfSpeech: 'verb', meaningEnglish: 'he read; he recited', notes: 'Hamzated (final radical).' },

  // doubled
  { rootRadicals: 'م د د', patternLabel: 'Form I — فَعَلَ', vocalized: 'مَدَّ', unvocalized: 'مد', partOfSpeech: 'verb', meaningEnglish: 'he extended', notes: 'Doubled root: 2nd and 3rd radicals (د، د) merge by إدغام.' },
  { rootRadicals: 'ح ب ب', patternLabel: 'Form I — فَعَلَ', vocalized: 'حَبَّ', unvocalized: 'حب', partOfSpeech: 'verb', meaningEnglish: 'he loved', notes: 'Doubled root: 2nd and 3rd radicals (ب، ب) merge by إدغام.' },

  // assimilated (first radical و)
  { rootRadicals: 'و ج د', patternLabel: 'Form I — فَعَلَ', vocalized: 'وَجَدَ', unvocalized: 'وجد', partOfSpeech: 'verb', meaningEnglish: 'he found', notes: 'Assimilated: the weak first radical و drops in the imperfect (يَجِدُ, not يَوْجِدُ).' },
  { rootRadicals: 'و ص ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'وَصَلَ', unvocalized: 'وصل', partOfSpeech: 'verb', meaningEnglish: 'he arrived', notes: 'Assimilated: weak first radical و.' },

  // hollow
  { rootRadicals: 'ق و ل', patternLabel: 'Form I — فَعَلَ', vocalized: 'قَالَ', unvocalized: 'قال', partOfSpeech: 'verb', meaningEnglish: 'he said', notes: 'Hollow: middle radical و contracts to a long vowel, but resurfaces as قُلْتُ before a consonant-initial suffix.' },
  { rootRadicals: 'ب ي ع', patternLabel: 'Form I — فَعَلَ', vocalized: 'بَاعَ', unvocalized: 'باع', partOfSpeech: 'verb', meaningEnglish: 'he sold', notes: 'Hollow: middle radical ي, resurfaces as بِعْتُ.' },

  // defective
  { rootRadicals: 'ن س ي', patternLabel: 'Form I — فَعَلَ', vocalized: 'نَسِيَ', unvocalized: 'نسي', partOfSpeech: 'verb', meaningEnglish: 'he forgot', notes: 'Defective: final radical ي.' },
  { rootRadicals: 'د ع و', patternLabel: 'Form I — فَعَلَ', vocalized: 'دَعَا', unvocalized: 'دعا', partOfSpeech: 'verb', meaningEnglish: 'he called; he invited', notes: 'Defective: final radical و surfaces as a long ā.' },
];
