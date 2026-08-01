import type { ExerciseSeed } from '../exerciseTypes';

export const advancedExercises: ExerciseSeed[] = [
  {
    lessonCode: 'l-ellipsis', conceptCode: 'c-ellipsis-and-estimation', type: 'explain_rule',
    objective: 'Recover an omitted element and name its estimated role.',
    prompt: 'A sign reads simply "مَمْنُوعٌ" ("forbidden"). What word is omitted, and what role does the estimated element play?', difficulty: 4,
    expectedAnswer: 'The مبتدأ (e.g. "هذا" or "الدخول") is omitted; ممنوعٌ is the خبر of an understood subject recoverable from context.',
    hints: ['Ask "forbidden — what, specifically?" The answer is understood, not stated.'],
    explanation: 'Recognizing recoverable omission prevents a learner from treating a compressed sentence as broken or incomplete.', estimatedSeconds: 40,
  },
  {
    lessonCode: 'l-ellipsis', conceptCode: 'c-ellipsis-and-estimation', type: 'compare_analyses',
    objective: 'Distinguish estimation (مقدّر) from an ordinary missing word error.',
    prompt: 'Is "الطالب مجتهدٌ" missing anything the way "ممنوعٌ" is? Why or why not?', difficulty: 3,
    expectedAnswer: 'No — "الطالب مجتهدٌ" is already a complete mubtada+khabar sentence with nothing recoverable-but-unstated; "ممنوعٌ" is missing an explicit مبتدأ that context must supply.',
    hints: ['Check whether each sentence already has both a مبتدأ and a خبر physically present.'],
    explanation: 'Ellipsis applies only when a role is genuinely unstated but structurally required and contextually recoverable — not to every short sentence.', estimatedSeconds: 35,
  },
  {
    lessonCode: 'l-mahall', conceptCode: 'c-mahall-al-jumla', sentenceCode: 'part-04-kana-imperfect', type: 'explain_rule',
    objective: 'Explain محل الجملة for an embedded clause.',
    prompt: 'In كَانَ الطَّالِبُ يَكْتُبُ الدَّرْسَ, the clause يَكْتُبُ الدَّرْسَ has no case ending of its own. In what sense can it still be called "accusative"?', difficulty: 5,
    expectedAnswer: 'It has no literal case ending, but it occupies the syntactic slot a single accusative word could have filled as خبر كان — so it is said to be "في محل نصب" (in the position of accusative).',
    hints: ['Recall that only single words carry case endings — what do grammarians say about a whole clause filling a case-bearing role?'],
    explanation: 'محل الجملة is what makes full إعراب of sentences with embedded clauses possible, rather than treating such clauses as unanalyzable.', estimatedSeconds: 50,
  },
  {
    lessonCode: 'l-mahall', conceptCode: 'c-mahall-al-jumla', sentenceCode: 'verb-04-fronted-subject-full-agreement', type: 'full_irab',
    objective: 'Perform full إعراب including a clause\'s محل.',
    prompt: 'Perform full إعراب of الطُّلَّابُ كَتَبُوا الدَّرْسَ, including the embedded clause\'s محل.', difficulty: 5,
    expectedAnswer: 'الطلابُ: مبتدأ مرفوع. كتبوا الدرسَ: جملة فعلية في محل رفع خبر. كتبوا: فعل ماض، والواو ضمير متصل مبني في محل رفع فاعل. الدرسَ: مفعول به منصوب.',
    hints: ['Work outward: name the embedded clause\'s overall محل first, then perform ordinary إعراب inside it.'],
    explanation: 'This exercise synthesizes agreement, case, and محل الجملة in one full analysis — a realistic target for advanced independent reading.', estimatedSeconds: 90,
  },
  {
    lessonCode: 'l-mahall', conceptCode: 'c-mahall-al-jumla', type: 'teach_back',
    objective: 'Explain why clauses need محل at all.',
    prompt: 'Explain to a learner who has only studied single-word إعراب why we even need the idea of "محل الجملة."', difficulty: 4,
    expectedAnswer: 'Because real sentences contain embedded clauses (as predicates, as descriptions, as objects) that must still occupy a grammatical slot, even though only single words can carry a physical case ending — محل lets us analyze those clauses coherently.',
    hints: ['Think about what would be left unanalyzed without this concept.'],
    explanation: 'A strong answer connects محل directly to the practical needs of reading connected prose.', estimatedSeconds: 45,
  },
  {
    lessonCode: 'l-ellipsis', conceptCode: 'c-ellipsis-and-estimation', type: 'analyze_passage',
    objective: 'Find and explain an ellipsis in a short passage.',
    prompt: 'In casual spoken usage, "أهلاً وسهلاً" ("welcome") stands for a longer classical phrase wishing the guest an easy, family-like arrival. What is estimated here that is never spoken?',
    difficulty: 4, expectedAnswer: 'A verb of wishing/greeting (e.g. "حَلَلْتَ أهلاً ونزلت سهلاً" — "you have arrived among family, upon easy ground") is compressed to just the two nouns, with the governing verb entirely omitted and estimated.',
    hints: ['Formulaic expressions are some of the most heavily elided structures in the language.'],
    explanation: 'Recognizing ellipsis in fixed expressions is good preparation for reading authentic, less controlled Arabic.', estimatedSeconds: 45,
  },
];
