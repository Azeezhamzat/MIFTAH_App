export interface ConceptSeed {
  code: string;
  domainCode: string;
  title: string;
  titleArabic: string;
  definition: string;
  whyItMatters: string;
  difficulty: number;
  order: number;
  prerequisites: string[];
  nahwWadih?: string;
  tuhfahSaniyyah?: string;
}

export const concepts: ConceptSeed[] = [
  {
    code: 'c-word-classes',
    domainCode: 'A',
    title: 'The three word classes',
    titleArabic: 'اسم، فعل، حرف',
    definition:
      'Every Arabic word is a noun (اسم — names a person, thing, or idea), a verb (فعل — expresses an action tied to time), or a particle (حرف — has no independent meaning until attached to something else, e.g. في، من، لا).',
    whyItMatters:
      'Every later rule in Naḥw and Ṣarf is stated in terms of these three classes. You cannot ask "does this noun take a case ending?" until you can reliably spot that it is a noun.',
    difficulty: 1,
    order: 1,
    prerequisites: [],
    nahwWadih: 'الجزء الأول، الباب الأول: الكلمة وأقسامها',
    tuhfahSaniyyah: 'مقدمة: الكلام وما يتألف منه',
  },
  {
    code: 'c-complete-utterance',
    domainCode: 'A',
    title: 'The complete, meaningful sentence',
    titleArabic: 'الجملة المفيدة',
    definition:
      'A complete Arabic utterance (الكلام) gives the listener a self-sufficient meaning — it does not leave them waiting for more. "الطالبُ" alone is a word; "الطالبُ مجتهدٌ" (The student is diligent) is complete.',
    whyItMatters:
      'Distinguishing a complete sentence from a bare phrase is the first gate: exercises, إعراب, and case rules all apply to sentences, not to isolated words floating without a role.',
    difficulty: 1,
    order: 2,
    prerequisites: ['c-word-classes'],
    nahwWadih: 'الباب الثاني: الكلام وأنواعه',
  },
  {
    code: 'c-nominal-vs-verbal',
    domainCode: 'A',
    title: 'Nominal vs. verbal sentences',
    titleArabic: 'الجملة الاسمية والجملة الفعلية',
    definition:
      'Arabic has exactly two sentence shapes, told apart by the first word: a sentence opening with a noun is nominal (الجملة الاسمية); one opening with a verb is verbal (الجملة الفعلية). This is a structural test, not a meaning test — both shapes can describe an action.',
    whyItMatters:
      'This single distinction decides which whole rulebook applies next: مبتدأ/خبر agreement for nominal sentences, or فعل/فاعل agreement (including the surprising singular-verb-before-plural-subject rule) for verbal ones.',
    difficulty: 1,
    order: 3,
    prerequisites: ['c-complete-utterance'],
    nahwWadih: 'الباب الثالث: أنواع الجملة',
  },
  {
    code: 'c-demonstratives',
    domainCode: 'A',
    title: 'Demonstratives',
    titleArabic: 'أسماء الإشارة',
    definition:
      'هذا (this, m.), هذه (this, f.), هذان/هاتان (these two), هؤلاء (these, plural), ذلك/تلك (that/that, f.) point at something instead of naming it, and they agree with the thing pointed at in gender and number.',
    whyItMatters:
      'Demonstratives are usually a learner\'s first working nominal sentence ("هذا كتابٌ") and the first place gender agreement becomes unavoidable.',
    difficulty: 1,
    order: 4,
    prerequisites: ['c-word-classes'],
  },
  {
    code: 'c-personal-pronouns',
    domainCode: 'A',
    title: 'Detached personal pronouns',
    titleArabic: 'الضمائر المنفصلة',
    definition:
      'هو، هي، أنتَ، أنتِ، أنا، نحن، هم، هنّ and their duals stand in for a noun already known from context. Arabic marks person, gender, and number on the pronoun itself — English "you" collapses distinctions Arabic keeps separate.',
    whyItMatters:
      'Pronouns reappear everywhere: as مبتدأ, as attached subject markers fused onto verbs, and as possessive suffixes on nouns. Confusing attached and detached pronouns is one of the most common early errors.',
    difficulty: 1,
    order: 5,
    prerequisites: ['c-word-classes'],
  },
  {
    code: 'c-questions',
    domainCode: 'A',
    title: 'Forming questions',
    titleArabic: 'أدوات الاستفهام',
    definition:
      'هل and أَ turn a statement into a yes/no question without reordering it. Question words — مَن (who), ما/ماذا (what), أين (where), متى (when), كيف (how), كم (how many) — occupy the front of the sentence and take on their own grammatical role inside it.',
    whyItMatters:
      'Question words are often themselves the مبتدأ or the مفعول به of the sentence, so reading a question correctly means first solving its underlying sentence type.',
    difficulty: 1,
    order: 6,
    prerequisites: ['c-nominal-vs-verbal'],
  },
  {
    code: 'c-negation-basic',
    domainCode: 'A',
    title: 'Basic negation',
    titleArabic: 'أدوات النفي',
    definition:
      'لا negates a present-tense idea or a whole category (لا طالبَ حاضرٌ), ما negates a simple statement of fact (ما هذا كتابًا), and ليس — itself conjugated like a verb — negates a nominal sentence by putting its predicate into the accusative.',
    whyItMatters:
      'ليس is the learner\'s first encounter with a word that changes a noun\'s case for a reason that has nothing to do with verbs or prepositions — an early, gentle introduction to grammatical government.',
    difficulty: 2,
    order: 7,
    prerequisites: ['c-nominal-vs-verbal'],
  },
  {
    code: 'c-prepositional-phrase',
    domainCode: 'A',
    title: 'The prepositional phrase',
    titleArabic: 'الجار والمجرور',
    definition:
      'A preposition (حرف جر: في، من، إلى، على، عن، بِـ، لِـ...) always attaches to a noun, and that noun is always genitive. The pair is called جار ومجرور and functions as a single unit inside the larger sentence.',
    whyItMatters:
      'This is the cleanest possible introduction to grammatical government (العامل): the preposition is a "governor" and the genitive ending is its visible effect. Every later government rule is a variation on this pattern.',
    difficulty: 2,
    order: 8,
    prerequisites: ['c-word-classes'],
  },
  {
    code: 'c-mubtada-khabar',
    domainCode: 'B',
    title: 'مبتدأ and خبر',
    titleArabic: 'المبتدأ والخبر',
    definition:
      'In a nominal sentence, the مبتدأ is the noun the sentence is about (typically definite, typically first), and the خبر is what is said about it. Both are nominative by default: الطالبُ (mubtada, nominative) مجتهدٌ (khabar, nominative).',
    whyItMatters:
      'This pair is the skeleton of the entire nominal sentence and the anchor against which every later complication — إنّ, كان, fronting, ellipsis — is defined as a change to one of these two roles.',
    difficulty: 2,
    order: 9,
    prerequisites: ['c-nominal-vs-verbal'],
    nahwWadih: 'الباب الرابع: المبتدأ والخبر',
    tuhfahSaniyyah: 'باب المبتدأ والخبر',
  },
  {
    code: 'c-khabar-types',
    domainCode: 'B',
    title: 'Types of predicate',
    titleArabic: 'أنواع الخبر',
    definition:
      'A خبر can be a single word (مفرد: الجوُّ جميلٌ), a prepositional phrase (شبه جملة: الكتابُ على الطاولةِ), or a full embedded sentence (جملة: الطالبُ يكتبُ الدرسَ) — and in the last case, that embedded sentence needs its own internal إعراب while still serving one grammatical job for the mubtada.',
    whyItMatters:
      'Recognizing an embedded verbal sentence as "the khabar" — rather than mistaking the whole thing for a separate sentence — is essential for reading anything beyond single-clause Arabic.',
    difficulty: 3,
    order: 10,
    prerequisites: ['c-mubtada-khabar'],
  },
  {
    code: 'c-definiteness',
    domainCode: 'B',
    title: 'Definiteness',
    titleArabic: 'التعريف والتنكير',
    definition:
      'A noun becomes definite by taking ال, by being a proper name (عَلَم), by being a pronoun, by being pointed at (اسم إشارة), by being related to something already definite (see إضافة), or by being a relative noun (اسم موصول). Anything else is indefinite (نكرة), typically marked by tanwīn.',
    whyItMatters:
      'Definiteness decides mubtada-eligibility, adjective agreement, and — critically — which noun in an إضافة controls the meaning of "the," which has no direct English equivalent.',
    difficulty: 2,
    order: 11,
    prerequisites: ['c-word-classes'],
    nahwWadih: 'باب المعرفة والنكرة',
  },
  {
    code: 'c-gender-number-of-nouns',
    domainCode: 'B',
    title: 'Gender and number of nouns',
    titleArabic: 'التذكير والتأنيث، الإفراد والتثنية والجمع',
    definition:
      'Arabic nouns are masculine or feminine (often, not always, marked by ة), and singular, dual, or plural. Arabic dual and plural are not just "more than one" in the English sense — they carry their own dedicated endings and agreement consequences.',
    whyItMatters:
      'Every agreement rule downstream — adjectives, verbs, demonstratives — is stated as "agrees in gender and number," so this concept has to be automatic before those rules mean anything.',
    difficulty: 2,
    order: 12,
    prerequisites: ['c-word-classes'],
  },
  {
    code: 'c-adjective-agreement',
    domainCode: 'B',
    title: 'Adjective agreement',
    titleArabic: 'النعت (الصفة)',
    definition:
      'An adjective (نعت) agrees with the noun it describes in four features: gender, number, definiteness, and case. الطالبُ المجتهدُ (definite + definite, nominative + nominative) versus طالبٌ مجتهدٌ (indefinite + indefinite).',
    whyItMatters:
      'This is the first rule requiring four simultaneous agreement checks, and it is the single most common source of small, self-correctable errors once a learner knows what to check.',
    difficulty: 2,
    order: 13,
    prerequisites: ['c-definiteness', 'c-gender-number-of-nouns'],
  },
  {
    code: 'c-idafa',
    domainCode: 'B',
    title: 'The possessive construction (إضافة)',
    titleArabic: 'الإضافة',
    definition:
      'Two nouns in a row form an إضافة: the first (المضاف) loses تنوين and never takes ال, while the second (المضاف إليه) is genitive and carries the sentence\'s definiteness for the whole pair — كتابُ الطالبِ (the student\'s book) is definite because الطالبِ is definite, with no separate word for "the" on كتاب.',
    whyItMatters:
      'Idafa is how Arabic expresses possession, material, and many compound nouns — and its definiteness rule is one of the sharpest structural differences from English that a learner must internalize, not translate around.',
    difficulty: 3,
    order: 14,
    prerequisites: ['c-definiteness'],
    nahwWadih: 'باب الإضافة',
  },
  {
    code: 'c-dual-and-sound-plurals',
    domainCode: 'B',
    title: 'Duals and sound plurals',
    titleArabic: 'المثنى وجمعا المذكر والمؤنث السالمان',
    definition:
      'The dual adds ـَانِ (nom.) / ـَيْنِ (acc./gen.) to a singular. The sound masculine plural adds ـُونَ (nom.) / ـِينَ (acc./gen.). The sound feminine plural adds ـَاتٌ and behaves regularly across all three cases.',
    whyItMatters:
      'These are the first nouns whose case is shown by swapping a whole suffix rather than a single short vowel — the clearest visible evidence that إعراب is a real, audible system.',
    difficulty: 3,
    order: 15,
    prerequisites: ['c-gender-number-of-nouns'],
  },
  {
    code: 'c-inna-wa-akhawatuha',
    domainCode: 'B',
    title: 'إنّ and its sisters',
    titleArabic: 'إنّ وأخواتها',
    definition:
      'إنّ، أنّ، كأنّ، لكنّ، ليت، لعلّ enter a nominal sentence and flip its default case pattern: the noun that follows (formerly the mubtada) becomes accusative (اسم إنّ), while the predicate stays nominative (خبر إنّ).',
    whyItMatters:
      'This is the first "governing particle" a learner meets that reaches into a nominal sentence and changes an ending that had nothing to do with verbs or prepositions — a pure demonstration of grammatical government.',
    difficulty: 3,
    order: 16,
    prerequisites: ['c-mubtada-khabar'],
    tuhfahSaniyyah: 'باب إنّ وأخواتها',
  },
  {
    code: 'c-kana-wa-akhawatuha',
    domainCode: 'B',
    title: 'كان and its sisters',
    titleArabic: 'كان وأخواتها',
    definition:
      'كان، أصبح، ظلّ، أمسى، بات، صار، ما زال، ليس enter a nominal sentence and do the opposite of إنّ: the subject (اسم كان) stays nominative, while the predicate (خبر كان) becomes accusative — كان الطالبُ مجتهدًا.',
    whyItMatters:
      'كان is how Arabic expresses past-tense "to be" and ongoing/change-of-state meanings a bare nominal sentence cannot express — and contrasting it with إنّ cements the idea that different governors move the case marker to different places.',
    difficulty: 3,
    order: 17,
    prerequisites: ['c-mubtada-khabar'],
    tuhfahSaniyyah: 'باب كان وأخواتها',
  },
  {
    code: 'c-fi-l-fa-il',
    domainCode: 'C',
    title: 'The verb and its subject',
    titleArabic: 'الفعل والفاعل',
    definition:
      'In a verbal sentence, the فاعل is whoever or whatever performs the action, and it is always nominative, regardless of where it sits or what role it seems to play in the English translation. It follows the verb by default: كتبَ الطالبُ (wrote the-student).',
    whyItMatters:
      'The single most common beginner misconception is assuming "the first noun is the subject" — in Arabic the verb usually comes first, and فاعل is a grammatical role decided by structure and ending, not position.',
    difficulty: 2,
    order: 18,
    prerequisites: ['c-nominal-vs-verbal', 'c-gender-number-of-nouns'],
    nahwWadih: 'الباب الخامس: الفعل والفاعل',
  },
  {
    code: 'c-verb-subject-agreement',
    domainCode: 'C',
    title: 'Verb–subject agreement',
    titleArabic: 'مطابقة الفعل للفاعل',
    definition:
      'A verb always agrees with an explicit فاعل in gender, but — when the فاعل follows the verb, as is default — the verb stays grammatically singular even if the فاعل is dual or plural: كتبَ الطلابُ (wrote[sing.] the-students), not "كتبوا الطلاب."',
    whyItMatters:
      'This single rule blocks the most persistent English-based transfer error: assuming the verb must "agree in number" the way an English verb loosely does. It also sets up the sharp contrast with fronted subjects, where full agreement returns.',
    difficulty: 3,
    order: 19,
    prerequisites: ['c-fi-l-fa-il'],
  },
  {
    code: 'c-maful-bihi',
    domainCode: 'C',
    title: 'The direct object',
    titleArabic: 'المفعول به',
    definition:
      'A transitive verb\'s direct object (مفعول به) is accusative: كتبَ الطالبُ الدرسَ (the student wrote the lesson — الدرسَ accusative). Some verbs are intransitive and take no مفعول به at all; some take two.',
    whyItMatters:
      'مفعول به is the second of the two "default" cases (after فاعل\'s nominative) a learner must assign automatically, and mixing the two up is the single most common إعراب error at this stage.',
    difficulty: 2,
    order: 20,
    prerequisites: ['c-fi-l-fa-il'],
  },
  {
    code: 'c-passive-voice',
    domainCode: 'C',
    title: 'The passive voice',
    titleArabic: 'المبني للمجهول ونائب الفاعل',
    definition:
      'When the agent is unknown, unimportant, or deliberately hidden, the verb\'s internal vowels shift (كَتَبَ → كُتِبَ) and the former مفعول به is promoted to نائب الفاعل — "the substitute for the subject" — which is nominative, exactly like a real فاعل.',
    whyItMatters:
      'The passive shows that case assignment tracks grammatical role, not real-world meaning: نائب الفاعل is nominative because it behaves like a subject syntactically, even though semantically it is the one acted upon.',
    difficulty: 3,
    order: 21,
    prerequisites: ['c-maful-bihi'],
  },
  {
    code: 'c-irab-concept',
    domainCode: 'D',
    title: 'What إعراب actually is',
    titleArabic: 'مفهوم الإعراب والبناء',
    definition:
      'إعراب is the system by which a word\'s ending changes to show its grammatical role — the same word can be nominative, accusative, or genitive depending on its job in the sentence. Some words never change (مبني) regardless of role; most nouns and present-tense verbs do change (معرب).',
    whyItMatters:
      'This reframes "grammar" from a list of endings to memorize into a single coherent idea: the ending is evidence of a role, not the other way around. Every rule from here on is really a rule about roles, with the ending as its visible symptom.',
    difficulty: 2,
    order: 22,
    prerequisites: ['c-mubtada-khabar', 'c-fi-l-fa-il'],
    nahwWadih: 'الباب السادس: الإعراب والبناء',
    tuhfahSaniyyah: 'باب الإعراب',
  },
  {
    code: 'c-three-cases',
    domainCode: 'D',
    title: 'The three cases and their default homes',
    titleArabic: 'رفع، نصب، جر',
    definition:
      'رفع (nominative) is the default state and the home of مبتدأ, خبر, and فاعل. نصب (accusative) is the state a governor imposes, most often on مفعول به. جر (genitive) only ever happens after a preposition or as the second term of an إضافة.',
    whyItMatters:
      'Once a learner can name which of these three "homes" a word\'s role belongs to, assigning the correct ending becomes a lookup rather than a guess.',
    difficulty: 2,
    order: 23,
    prerequisites: ['c-irab-concept'],
  },
  {
    code: 'c-marker-types',
    domainCode: 'D',
    title: 'Visible, secondary, and estimated markers',
    titleArabic: 'العلامات الأصلية والفرعية والمقدرة',
    definition:
      'Most singular nouns show case with a short vowel (ضمة/فتحة/كسرة) — a visible marker. Duals and sound plurals show case with a different suffix altogether — a secondary marker. Some nouns (ending in ى or a possessive ي) cannot physically carry the vowel, so the case is estimated (مقدّرة): present in the grammar, absent from the sound.',
    whyItMatters:
      'Without this distinction, learners either demand to hear an ending that Arabic never pronounces, or assume a word has "no case" just because nothing is audible — both block reading fluency later.',
    difficulty: 3,
    order: 24,
    prerequisites: ['c-three-cases'],
  },
  {
    code: 'c-diptotes',
    domainCode: 'D',
    title: 'Diptotes',
    titleArabic: 'الممنوع من الصرف',
    definition:
      'A closed set of nouns — many proper names, most patterns of the form أَفْعَل and فَعْلَاء, and broken plurals of certain shapes — take only two case vowels instead of three: فتحة for both accusative and genitive, and no تنوين at all.',
    whyItMatters:
      'Without knowing this category exists, a genitive-looking فتحة on a diptote reads as an error instead of a rule, undermining a learner\'s confidence in their own case-reading right when it should be solidifying.',
    difficulty: 4,
    order: 25,
    prerequisites: ['c-three-cases'],
  },
  {
    code: 'c-root-and-pattern',
    domainCode: 'E',
    title: 'Root and pattern',
    titleArabic: 'الجذر والوزن',
    definition:
      'Almost every Arabic word is built from a root of (usually) three consonants carrying a core meaning, poured into a pattern that adds grammatical shape and often a specific derivational meaning: ك ت ب ("writing") + فَاعِل (agent pattern) = كَاتِب ("writer").',
    whyItMatters:
      'This is the master key to Arabic vocabulary: once a learner can extract a root and recognize a pattern, an unfamiliar word becomes decodable instead of requiring a dictionary lookup every time.',
    difficulty: 2,
    order: 26,
    prerequisites: ['c-word-classes'],
  },
  {
    code: 'c-form-i-verb',
    domainCode: 'E',
    title: 'Form I and its derived nouns',
    titleArabic: 'الوزن الأول ومشتقاته',
    definition:
      'Form I (فَعَلَ / يَفْعُلُ or يَفْعِلُ or يَفْعَلُ) is the bare, underived verb form a root starts from. From it come the active participle (فَاعِل), passive participle (مَفْعُول), and one of several possible verbal-noun patterns (مصدر), each with a predictable shape but a meaning that must be learned per verb.',
    whyItMatters:
      'Form I is the base every other derived form (II–X) is compared against, so its participle and verbal-noun patterns must be automatic before the derived forms\' variations make sense.',
    difficulty: 2,
    order: 27,
    prerequisites: ['c-root-and-pattern'],
  },
  {
    code: 'c-derived-forms',
    domainCode: 'E',
    title: 'Derived verb forms II–X',
    titleArabic: 'الأوزان من الثاني إلى العاشر',
    definition:
      'Adding consonant doubling, a prefixed أ, an infixed ت or ن, or other augmentations to Form I produces Forms II–X, each with recurring meaning tendencies: II often makes a verb causative (دَرَّسَ, "to teach" from دَرَسَ, "to study"), III often implies interaction with another party, X often means "to seek/ask for."',
    whyItMatters:
      'These tendencies are not exceptionless rules, but they let a learner make an educated guess at an unfamiliar derived verb\'s meaning from its shape alone — the payoff of the root-and-pattern system.',
    difficulty: 4,
    order: 28,
    prerequisites: ['c-form-i-verb'],
  },
  {
    code: 'c-active-passive-participle',
    domainCode: 'E',
    title: 'Active and passive participles',
    titleArabic: 'اسم الفاعل واسم المفعول',
    definition:
      'اسم الفاعل (فَاعِل for Form I) names the doer of an action — كَاتِب, "one who writes / a writer." اسم المفعول (مَفْعُول for Form I) names the one acted upon — مَكْتُوب, "something written." Both behave as ordinary adjectives or nouns once formed, taking their own case and agreement.',
    whyItMatters:
      'Confusing اسم الفاعل with فاعل (the syntactic subject role) is one of the most common and persistent morphology/syntax mix-ups: one is a shape a word can have, the other is a job a word can do — a Form-I active participle can itself serve as the فاعل of a sentence.',
    difficulty: 3,
    order: 29,
    prerequisites: ['c-root-and-pattern'],
  },
  {
    code: 'c-verbal-noun',
    domainCode: 'E',
    title: 'The verbal noun (مصدر)',
    titleArabic: 'المصدر',
    definition:
      'The مصدر names the action itself, abstracted from any doer or time: كِتَابَة, "writing" (the act), from ك ت ب. Every verb has at least one مصدر, and derived forms\' مصادر follow largely predictable patterns even though Form I\'s does not.',
    whyItMatters:
      'المصدر underlies the cognate accusative (المفعول المطلق) and countless everyday abstract nouns, and dictionaries often list it alongside the verb as the form to search for related words.',
    difficulty: 3,
    order: 30,
    prerequisites: ['c-root-and-pattern'],
  },
  {
    code: 'c-perfect-tense',
    domainCode: 'E',
    title: 'The perfect (الماضي)',
    titleArabic: 'الفعل الماضي',
    definition:
      'The perfect verb marks a completed action by attaching suffixes that encode person, gender, and number directly onto the stem: كَتَبَ (he wrote), كَتَبَتْ (she wrote), كَتَبْتُ (I wrote), كَتَبُوا (they, m., wrote).',
    whyItMatters:
      'Because the perfect fuses subject information into the verb itself, a fully conjugated Arabic verb can be a complete sentence with no separate subject word at all — a structural fact English has no equivalent for.',
    difficulty: 2,
    order: 31,
    prerequisites: ['c-fi-l-fa-il', 'c-root-and-pattern'],
  },
  {
    code: 'c-imperfect-tense',
    domainCode: 'E',
    title: 'The imperfect (المضارع)',
    titleArabic: 'الفعل المضارع',
    definition:
      'The imperfect marks an ongoing, habitual, or future action with a prefix encoding person (and often gender) — يَكْتُبُ (he writes/will write), تَكْتُبُ (she writes / you, m., write) — and, unlike the perfect, it is مُعرَب: its ending changes with mood.',
    whyItMatters:
      'The imperfect is the first verb form that participates in إعراب the way nouns do, which is the doorway into mood (indicative/subjunctive/jussive) in Domain D and F.',
    difficulty: 3,
    order: 32,
    prerequisites: ['c-perfect-tense'],
  },
  {
    code: 'c-imperative',
    domainCode: 'E',
    title: 'The imperative (الأمر)',
    titleArabic: 'فعل الأمر',
    definition:
      'The imperative is built from the jussive form of the imperfect by stripping its subject prefix, sometimes adding a helping همزة at the front: اكْتُبْ (write!, to a man), اكْتُبِي (write!, to a woman).',
    whyItMatters:
      'Deriving the imperative from the jussive — rather than treating it as a fourth independent form to memorize — previews how the mood system in Domain D actually functions.',
    difficulty: 3,
    order: 33,
    prerequisites: ['c-imperfect-tense'],
  },
  {
    code: 'c-mood-jussive-subjunctive',
    domainCode: 'E',
    title: 'Mood: indicative, subjunctive, jussive',
    titleArabic: 'الرفع والنصب والجزم في المضارع',
    definition:
      'The imperfect verb\'s final vowel (or final letter, for weak/plural forms) changes with mood: رفع (indicative, the default), نصب (subjunctive, triggered by particles like أن، لن، كي), and جزم (jussive, triggered by لم، لا الناهية، or conditional particles).',
    whyItMatters:
      'This is verbal إعراب in its clearest form, and it directly parallels nominal case: a governing particle changes an ending, exactly as إنّ or a preposition does for nouns.',
    difficulty: 4,
    order: 34,
    prerequisites: ['c-imperfect-tense', 'c-irab-concept'],
  },
  {
    code: 'c-hamzated-verbs',
    domainCode: 'F',
    title: 'Hamzated verbs',
    titleArabic: 'الفعل المهموز',
    definition:
      'A verb with a همزة as one of its root letters (أَكَلَ، سَأَلَ، قَرَأَ) follows regular conjugation patterns but requires careful seat-selection for the همزة (ء/أ/إ/ؤ) as vowels around it change.',
    whyItMatters:
      'Hamzated verbs are common (أكل, سأل, قرأ, بدأ) and are the gentlest introduction to Domain F\'s irregular morphology, since the root consonants never actually disappear — only the همزة\'s written seat shifts.',
    difficulty: 3,
    order: 35,
    prerequisites: ['c-form-i-verb'],
  },
  {
    code: 'c-doubled-verbs',
    domainCode: 'F',
    title: 'Doubled verbs',
    titleArabic: 'الفعل المضعّف',
    definition:
      'When a verb\'s second and third root letters are identical (م د د، ح ب ب), they merge (إدغام) into one doubled consonant in most forms — مَدَّ, حَبَّ — but separate again in forms where a vowel would otherwise fall between them, such as with the تُ suffix: مَدَدْتُ.',
    whyItMatters:
      'Recognizing when the merge splits back apart is the key to correctly producing the first-and-second-person perfect forms, which are exactly the forms a beginner uses most ("I love," "I extended").',
    difficulty: 3,
    order: 36,
    prerequisites: ['c-form-i-verb'],
  },
  {
    code: 'c-hollow-verbs',
    domainCode: 'F',
    title: 'Hollow verbs',
    titleArabic: 'الفعل الأجوف',
    definition:
      'A verb with و or ي as its middle root letter (ق و ل، ب ي ع) contracts that letter into a long vowel in most forms — قَالَ، بَاعَ — but the original weak letter resurfaces as a short vowel when a consonant-initial suffix follows: قُلْتُ، بِعْتُ.',
    whyItMatters:
      'Hollow verbs look at first like an unrelated irregular verb (قال vs. قلت), but the pattern is fully predictable once the underlying root and the "resurfacing" rule are known.',
    difficulty: 4,
    order: 37,
    prerequisites: ['c-form-i-verb'],
  },
  {
    code: 'c-defective-verbs',
    domainCode: 'F',
    title: 'Defective verbs',
    titleArabic: 'الفعل الناقص',
    definition:
      'A verb with و or ي as its final root letter (د ع و، ن س ي) shows that weak letter as a long vowel at the end in most forms — دَعَا، نَسِيَ — but drops or shifts it in others, and its imperfect jussive/imperative endings are shortened rather than vowel-marked.',
    whyItMatters:
      'Defective verbs interact directly with mood marking: because the final letter is already weak, jussive and subjunctive show up as the letter itself dropping, not as a separate vowel change — a distinct visible-marker pattern worth its own attention.',
    difficulty: 4,
    order: 38,
    prerequisites: ['c-form-i-verb'],
  },
  {
    code: 'c-ellipsis-and-estimation',
    domainCode: 'H',
    title: 'Ellipsis and estimation',
    titleArabic: 'الحذف والتقدير',
    definition:
      'Arabic regularly omits a word whose identity is fully recoverable from context or convention — a خبر, a مبتدأ, even a whole conditional clause — while the grammatical role that word would have played is still "estimated" (مُقدَّر) to exist for the purposes of analysis.',
    whyItMatters:
      'Without this concept, an omitted element looks like a broken sentence rather than a normal, rule-governed compression — and connected reading is full of exactly this kind of compression.',
    difficulty: 5,
    order: 39,
    prerequisites: ['c-irab-concept', 'c-marker-types'],
  },
  {
    code: 'c-mahall-al-jumla',
    domainCode: 'H',
    title: 'The syntactic position of a clause',
    titleArabic: 'محل الجملة من الإعراب',
    definition:
      'An embedded clause has no case ending of its own, yet it still occupies a syntactic slot — subject, predicate, object, or descriptive — and grammarians say it "has a position" (لها محل) equivalent to whatever single word could have filled that slot.',
    whyItMatters:
      'This is what makes it possible to perform full إعراب on sentences containing embedded clauses (relative clauses, embedded predicates) rather than treating them as unanalyzable extras.',
    difficulty: 5,
    order: 40,
    prerequisites: ['c-irab-concept'],
  },
];
