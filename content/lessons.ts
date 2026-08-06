export interface LessonConceptLink {
  conceptCode: string;
  role: 'introduces' | 'reinforces' | 'reviews';
}

export interface LessonSeed {
  code: string;
  unitCode: string;
  title: string;
  titleArabic: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
  concepts: LessonConceptLink[];
  observeSentenceCodes: string[];
  discoveryPrompt: string;
  microExplanation: string;
  deeperDetail?: string;
}

export const lessons: LessonSeed[] = [
  {
    code: 'l-word-classes',
    unitCode: 'unit-word-categories',
    title: 'Spotting a noun, a verb, and a particle',
    titleArabic: 'اسم، فعل، حرف',
    summary: 'The three-way sort every later rule depends on.',
    order: 1,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-word-classes', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'verb-01-basic-vso', 'nom-04-khabar-shibh-jumla', 'verb-15-word-classes-mixed'],
    discoveryPrompt:
      'Look at الطَّالِبُ, مُجْتَهِدٌ, كَتَبَ, and عَلَى across these three sentences. Two of these words could be pointed at and asked "what is it?" One describes an action locked to a time. One means nothing at all until it attaches to something else. Sort all four into three piles before reading on.',
    microExplanation:
      'Arabic sorts every word into اسم (noun — names a thing, person, quality, or idea and can take case endings and, in many instances, tanwīn), فعل (verb — ties an action or state to a tense), or حرف (particle — has no standalone meaning: عَلَى means nothing alone, only "on [something]"). This is a structural test, not a meaning test: مُجْتَهِدٌ ("diligent") is grammatically a noun in Arabic, not an adjective in a separate class.',
    deeperDetail:
      'Traditional grammars add finer tests: a noun can take تنوين or ال or be preceded by a preposition; a verb conjugates for tense and person; a particle does neither. You will use these tests constantly once ambiguous words appear.',
  },
  {
    code: 'l-complete-sentence',
    unitCode: 'unit-word-categories',
    title: "What makes a sentence complete",
    titleArabic: 'الجملة المفيدة وأنواعها',
    summary: 'Distinguishing a full sentence from a bare phrase, and telling nominal from verbal sentences.',
    order: 2,
    estimatedMinutes: 15,
    concepts: [
      { conceptCode: 'c-complete-utterance', role: 'introduces' },
      { conceptCode: 'c-nominal-vs-verbal', role: 'introduces' },
    ],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'verb-01-basic-vso', 'nom-13-nominal-with-verbal-khabar'],
    discoveryPrompt:
      'الطَّالِبُ مُجْتَهِدٌ and كَتَبَ الطَّالِبُ الدَّرْسَ both leave you satisfied — nothing more is needed. What is the very first word of each? Is it the same kind of word in both?',
    microExplanation:
      'A complete utterance (الكلام) gives a self-sufficient meaning. Arabic has exactly two shapes for one: if the first word is a noun, it is a nominal sentence (الجملة الاسمية); if the first word is a verb, it is a verbal sentence (الجملة الفعلية) — regardless of what the sentence is actually about.',
    deeperDetail:
      'This is a purely structural label. "الطالب مجتهد" and "كتب الطالب الدرس" are both about a student doing something, but only the second is "verbal" — because that term describes the sentence\'s opening word, not its meaning.',
  },
  {
    code: 'l-demonstratives',
    unitCode: 'unit-sentence-shapes',
    title: 'Pointing and naming: demonstratives',
    titleArabic: 'أسماء الإشارة',
    summary: 'هذا، هذه، هؤلاء — pointing words that already agree in gender and number.',
    order: 1,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-demonstratives', role: 'introduces' }],
    observeSentenceCodes: ['nom-02-demonstrative-indefinite-khabar', 'nom-03-demonstrative-feminine-adjective', 'nom-18-demonstrative-plural', 'nom-22-demonstrative-dual'],
    discoveryPrompt: 'هَذَا كِتَابٌ vs. هَذِهِ الْمَدْرَسَةُ جَمِيلَةٌ — what changes about the pointing word, and why, given كِتَاب is masculine and مَدْرَسَة is feminine?',
    microExplanation:
      'هذا (m.), هذه (f.), هذان/هاتان (dual), and هؤلاء (plural) point at something instead of naming it, and must agree with what they point at in gender and number. They are built words (مبني): they never change ending for case, even though a case role is still assigned to them.',
    deeperDetail:
      'ذلك and تلك work identically but point at something farther away (that vs. this). When a demonstrative is followed directly by a definite noun, that noun is in apposition (بدل), restating exactly what is being pointed at — هذا الطالبُ ("this student"). When it is followed by an indefinite noun instead, that noun is the خبر itself — هذا كتابٌ ("this is a book"). The only difference between the two readings is the definiteness of the second word; the demonstrative\'s own shape never changes.',
  },
  {
    code: 'l-pronouns',
    unitCode: 'unit-sentence-shapes',
    title: "Who's talking: personal pronouns",
    titleArabic: 'الضمائر المنفصلة',
    summary: 'Detached pronouns and why Arabic keeps more distinctions than English.',
    order: 2,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-personal-pronouns', role: 'introduces' }],
    observeSentenceCodes: ['nom-09-pronoun-mubtada-plural-khabar', 'verb-14-attached-object-pronoun'],
    discoveryPrompt: 'رَأَيْتُ ends in ـتُ, and كَتَبُوا ends in ـوا. Neither sentence has a separate word for "I" or "they." Where did those meanings go?',
    microExplanation:
      'Arabic distinguishes gender in "you" and "they" where English does not, and marks person, gender, and number on attached pronoun suffixes fused directly onto verbs — ـتُ ("I"), ـوا ("they, m."). Detached pronouns (أنا، هو، هي، أنتَ، أنتِ، نحن، هم، هنّ) are used mainly when no verb is present to carry that information, or for emphasis.',
    deeperDetail:
      'The full set also includes dual forms (أنتما "you two," هما "they two," used for exactly two of any gender) and keeps the masculine/feminine split even in the plural: أنتم/أنتنّ ("you," m./f. plural), هم/هنّ ("they," m./f. plural) — six more distinctions than English\'s single "you" and "they." The same attached suffixes that mark a verb\'s فاعل (ـتُ، ـوا، ـتِ...) can also attach to nouns and prepositions to mark possession or the object of a preposition (كِتَابِي "my book," بِهِ "with him") — one small set of attached pronouns doing three different jobs depending on what it attaches to.',
  },
  {
    code: 'l-questions-negation',
    unitCode: 'unit-sentence-shapes',
    title: 'Asking and denying',
    titleArabic: 'الاستفهام والنفي',
    summary: 'هل, question words, and the three negators لا، ما، ليس.',
    order: 3,
    estimatedMinutes: 20,
    concepts: [
      { conceptCode: 'c-questions', role: 'introduces' },
      { conceptCode: 'c-negation-basic', role: 'introduces' },
    ],
    observeSentenceCodes: ['nom-10-interrogative-khabar-muqaddam', 'part-05-laysa-negation'],
    discoveryPrompt: 'لَيْسَ الطَّالِبُ غَائِبًا — غَائِبًا is accusative, yet nothing "did" anything to it. What kind of word could reach in and change a noun\'s case without being a preposition or a verb of action?',
    microExplanation:
      'هل and أَ ask yes/no questions without reordering the sentence; مَن، ما/ماذا، أين، متى، كيف، كم ask for specific information and take on a grammatical role inside the sentence they open. Of the three negators, لا and ما negate plainly, while ليس is grammatically a verb that pushes a nominal sentence\'s predicate into the accusative — your first hint that "government" is coming.',
    deeperDetail:
      'An interrogative word is never just a label glued onto a sentence — it occupies a real grammatical role. أين المعلم؟ has أين functioning as a fronted خبر (the mubtada المعلم is simply delayed), exactly the same structure as الكتابُ على الطاولةِ with the prepositional-phrase khabar moved first and reduced to one interrogative word. لا and ما differ subtly too: لا is the general, timeless negator (لا أفهمُ, "I don\'t understand," true regardless of time), while ما more often negates a specific past action (ما فهمتُ, "I didn\'t understand [that time]"). ليس, despite looking and governing like a verb, has no imperfect or imperative form at all — it exists only to negate a nominal sentence in the present.',
  },
  {
    code: 'l-prepositional-phrase',
    unitCode: 'unit-sentence-shapes',
    title: 'The prepositional phrase',
    titleArabic: 'الجار والمجرور',
    summary: 'Your first, cleanest example of grammatical government.',
    order: 4,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-prepositional-phrase', role: 'introduces' }],
    observeSentenceCodes: ['nom-04-khabar-shibh-jumla', 'nom-08-plural-mubtada-shibh-jumla', 'pass-05-book-found'],
    discoveryPrompt: 'عَلَى الطَّاوِلَةِ and فِي الْفَصْلِ: both nouns end in kasrah. Both follow a particle. Coincidence?',
    microExplanation:
      'A preposition (حرف جر) always forces the following noun into the genitive — this is grammatical government (العامل) in its simplest, most reliable form. The whole pair (جار ومجرور) then behaves as a single unit that can serve as a khabar, an adjective-equivalent, or other roles.',
    deeperDetail:
      'This is the one governing relationship in Arabic with no exceptions at all: every single preposition, with no exceptions, forces a genitive — unlike إنّ or كان, which govern only specific roles inside a nominal sentence. When the object of a preposition is an attached pronoun rather than a full noun (بِهِ, "with him/it"), the pronoun still counts as genitive even though, being مبني, it shows no case vowel of its own — the genitive is simply estimated (مقدّر) rather than heard. Common prepositions worth fixing in memory early: مِن (from), إلى (to), عَن (about/away from), عَلى (on), فِي (in), بِ (with/by), كَ (like), لِ (for/belonging to).',
  },
  {
    code: 'l-mubtada-khabar',
    unitCode: 'unit-nominal-sentence',
    title: "مبتدأ and خبر: the sentence's skeleton",
    titleArabic: 'المبتدأ والخبر',
    summary: 'The two roles every nominal sentence is built from.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-mubtada-khabar', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'nom-02-demonstrative-indefinite-khabar', 'nom-14-mubtada-khabar-feminine'],
    discoveryPrompt: 'In الطَّالِبُ مُجْتَهِدٌ, which word is the sentence "about," and which word tells you something new about it? Check both words\' final vowel — what do you notice?',
    microExplanation:
      'The مبتدأ is the noun the sentence is about — typically definite, typically first. The خبر is what is said about it. Both are nominative by default. Every later complication in the nominal sentence (إنّ, كان, fronting, omission) is defined relative to this pair.',
    deeperDetail:
      'The default order is mubtada then khabar, and the default requirement is mubtada-definite, khabar-indefinite — a sentence backwards from that pattern (indefinite mubtada, definite khabar) is unusual enough that grammarians treat it as a signal the two words have actually swapped positions, with the "real" khabar fronted for emphasis and the "real" mubtada delayed (مبتدأ مؤخر). Every governing particle you\'ll meet next — إنّ, كان, and their sisters — is defined entirely in terms of what it does to this pair: which one it touches, and which case it pushes that one into. Get this pair solid, and every later rule is just "which of these two does X change."',
  },
  {
    code: 'l-khabar-types',
    unitCode: 'unit-nominal-sentence',
    title: 'Three shapes of خبر',
    titleArabic: 'أنواع الخبر',
    summary: 'Single word, prepositional phrase, or a whole embedded sentence.',
    order: 2,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-khabar-types', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'nom-04-khabar-shibh-jumla', 'part-04-kana-imperfect', 'nom-15-khabar-zarf', 'nom-20-khabar-types-verbal-sentence'],
    discoveryPrompt: 'Compare the خبر in all three example sentences: مُجْتَهِدٌ, عَلَى الطَّاوِلَةِ, and يَكْتُبُ الدَّرْسَ. Which one is a single word? Which is a phrase? Which is a whole miniature sentence?',
    microExplanation:
      'A خبر can be a single word (مفرد), a prepositional phrase (شبه جملة), or a full embedded sentence (جملة) with its own internal فاعل/مفعول أو مبتدأ/خبر — while still, as a whole, doing one job: being predicated of the mubtada.',
    deeperDetail:
      'A single mubtada can even take more than one khabar at once — الجَوُّ حَارٌّ رَطْبٌ ("the weather is hot [and] humid") predicates two separate words of الجو with no conjunction needed. When the khabar is a شبه جملة (prepositional phrase or adverb), classical grammar treats it as depending on an unstated, understood verb of being or existing (متعلَّق محذوف تقديره كائن أو موجود) — الكتاب على الطاولة is really "the book [exists/is located] on the table," even though no Arabic word ever says "exists." That hidden link is why a prepositional-phrase khabar can be predicated of a mubtada at all, despite containing no verb.',
  },
  {
    code: 'l-definiteness',
    unitCode: 'unit-nominal-sentence',
    title: "Definiteness: what makes a noun 'the'",
    titleArabic: 'التعريف والتنكير',
    summary: 'Six ways Arabic makes a noun definite — and why it matters for إضافة.',
    order: 3,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-definiteness', role: 'introduces' }],
    observeSentenceCodes: ['nom-06-idafa-basic', 'case-08-diptote-genitive', 'nom-16-definiteness-via-idafa', 'nom-21-definiteness-fronted-khabar'],
    discoveryPrompt: 'كِتَابُ الطَّالِبِ is "the student\'s book" — definite — but neither word carries ال. Where did "the" come from?',
    microExplanation:
      'A noun becomes definite with ال, as a proper name, as a pronoun, as a demonstrative\'s referent, as a relative noun, or — critically — by being the first term of an إضافة whose second term is already definite. Anything else is indefinite (نكرة).',
    deeperDetail:
      'That is the complete, closed list of six routes to definiteness in Arabic — there is no seventh: (1) ال, (2) a proper name (اسم علم), (3) a pronoun (attached or detached — always maximally definite), (4) a demonstrative (اسم إشارة), (5) a relative noun (الاسم الموصول, الذي/التي...), and (6) idafa to something already definite. Indefiniteness (نكرة) is simply the default state a noun falls into when none of these six apply — it is not marked by anything of its own, only recognized by the absence of all six definiteness routes. This list matters beyond terminology: definiteness decides whether a following adjective can be its نعت (definiteness must match) or must instead be its خبر (definiteness need not match), and it decides which noun in an إضافة supplies the whole phrase\'s definiteness.',
  },
  {
    code: 'l-adjective-agreement',
    unitCode: 'unit-nominal-sentence',
    title: 'Adjective agreement in four features',
    titleArabic: 'النعت',
    summary: 'Gender, number, definiteness, and case — all four, every time.',
    order: 4,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-adjective-agreement', role: 'introduces' }],
    observeSentenceCodes: ['nom-05-adjective-agreement-definite', 'nom-01-mubtada-khabar-basic', 'pass-04-heard-strange-sound', 'nom-17-attributive-adjective'],
    discoveryPrompt: 'الطَّالِبُ الْمُجْتَهِدُ حَاضِرٌ has three nominative words in a row, but only two of them form a matched pair. Which two, and on how many features do they match?',
    microExplanation:
      'A نعت agrees with its noun in gender, number, definiteness, and case — all four simultaneously. Contrast this with a خبر (as in nom-01), which only shares case with its mubtada, not definiteness: مُجْتَهِدٌ can be indefinite while الطالب is definite, because خبر and نعت are different jobs with different agreement rules.',
    deeperDetail:
      'A noun can carry more than one نعت in a row, each fully agreeing on its own — الطالبُ المجتهدُ النشيطُ ("the diligent, energetic student"), both adjectives matching الطالب independently. One real exception to memorize early: a broken plural referring to non-human things or animals (جمع تكسير لغير العاقل) takes a feminine-singular نعت, not a plural one — الكتب الجديدة ("the new books"), جديدة singular-feminine even though كتب is plural, because non-human plurals are grammatically treated as a feminine-singular collective. Human plurals do not follow this exception: المعلمون النشيطون keeps the plural adjective, since المعلمون refers to people.',
  },
  {
    code: 'l-idafa',
    unitCode: 'unit-nominal-sentence',
    title: 'Possession without a possessive word',
    titleArabic: 'الإضافة',
    summary: 'How two nouns in a row express "of" — with no word meaning "of."',
    order: 5,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-idafa', role: 'introduces' }],
    observeSentenceCodes: ['nom-06-idafa-basic', 'nom-07-idafa-passive-participle-khabar', 'nom-12-idafa-chain', 'nom-23-idafa-pronoun'],
    discoveryPrompt: 'كِتَابُ الطَّالِبِ has no تنوين on كتاب and no ال on either word, yet the whole phrase is definite. Try adding ال to كتاب — native intuition (and the rule) says you cannot. Why not?',
    microExplanation:
      'Two nouns in a row form an إضافة: the first (المضاف) never takes ال or تنوين, and the second (المضاف إليه) is always genitive and supplies the whole phrase\'s definiteness. This has no direct English equivalent — English\'s "the student\'s book" marks definiteness once, on "the," while Arabic marks it structurally, through position.',
    deeperDetail:
      'An idafa can chain further than two terms — بَابُ بَيْتِ الطَّالِبِ ("the door of the student\'s house") has بيت playing two roles at once: مضاف إليه of باب (which makes بيت genitive) and simultaneously مضاف to الطالب (which is why بيت itself takes no ال or تنوين, even though it is genitive). Only the very last term of a chain may carry ال, and only the very first term\'s own case (here باب\'s nominative, as مبتدأ) comes from something outside the idafa. A dual or sound-plural مضاف also drops its final ن before the مضاف إليه — مُعَلِّمَا الفصلِ ("the two teachers of the class"), not مُعَلِّمَانِ الفصلِ — one more sign that idafa fuses two nouns into a single grammatical unit rather than just placing them side by side.',
  },
  {
    code: 'l-dual-sound-plurals',
    unitCode: 'unit-nominal-sentence',
    title: 'Duals and sound plurals',
    titleArabic: 'المثنى وجمعا المذكر والمؤنث السالمان',
    summary: 'When case is shown by swapping a whole suffix, not a vowel.',
    order: 6,
    estimatedMinutes: 20,
    concepts: [
      { conceptCode: 'c-gender-number-of-nouns', role: 'introduces' },
      { conceptCode: 'c-dual-and-sound-plurals', role: 'introduces' },
    ],
    observeSentenceCodes: ['case-04-dual-predicate', 'case-05-dual-accusative', 'case-06-sound-plural-predicate', 'case-07-sound-plural-accusative', 'nom-11-dual-teachers-busy', 'case-10-sound-feminine-plural-accusative'],
    discoveryPrompt: 'الطَّالِبَانِ (nominative) vs. الطَّالِبَيْنِ (accusative) — and الْمُعَلِّمُونَ vs. الْمُعَلِّمِينَ. What part of the word is changing? Is it the same kind of change you\'ve seen on singular nouns?',
    microExplanation:
      'The dual marks case with ـَانِ (nominative) vs. ـَيْنِ (accusative/genitive combined); the sound masculine plural marks it with ـُونَ vs. ـِينَ. These are secondary markers — a different mechanism from a singular noun\'s short-vowel change, but still fully regular and predictable.',
    deeperDetail:
      'The sound feminine plural (جمع المؤنث السالم, usually formed with ـَات) uses a third mechanism again: it keeps the very same suffix in all three cases and instead swaps only the short vowel underneath it — ḍammah for nominative (المعلماتُ), kasrah for both accusative and genitive (المعلماتِ), never fatḥah. That is genuinely different from the dual and sound masculine plural, which each swap the whole suffix. A broken plural (جمع تكسير, like طلاب from طالب) is different again — it takes ordinary singular-style short-vowel case endings, because grammatically it behaves as if it were simply a singular noun with its own separate dictionary entry, not a plural of anything.',
  },
  {
    code: 'l-inna',
    unitCode: 'unit-nominal-sentence',
    title: 'إنّ enters the sentence',
    titleArabic: 'إنّ وأخواتها',
    summary: 'A particle that reaches in and flips the mubtada to accusative.',
    order: 7,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-inna-wa-akhawatuha', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'part-01-inna-basic', 'part-02-lakinna-contrast', 'part-08-laalla-hope'],
    discoveryPrompt: 'الطَّالِبُ مُجْتَهِدٌ vs. إِنَّ الطَّالِبَ مُجْتَهِدٌ — track the ending on الطالب across both sentences. What changed, and what did not?',
    microExplanation:
      'إنّ، أنّ، كأنّ، لكنّ، ليت، لعلّ push the following noun (now called اسم إنّ) into the accusative, while the predicate (خبر إنّ) stays nominative. This is grammatical government reaching into a sentence type — the nominal sentence — that otherwise has no verb to do the governing.',
    deeperDetail:
      'Each sister adds its own shade of meaning on top of identical case government: إنّ and أنّ both mean roughly "indeed/that," but إنّ opens an independent sentence (إِنَّ الطَّالِبَ مُجْتَهِدٌ, "Indeed, the student is diligent") while أنّ appears inside a subordinate clause, most often after a verb of knowing or saying (عَلِمْتُ أَنَّ الطَّالِبَ مُجْتَهِدٌ, "I knew that the student is diligent") — the two are not interchangeable despite the shared meaning and identical grammar. لكنّ adds contrast ("but"), ليت adds a wish ("if only"), لعلّ adds hope or expectation ("perhaps"), and كأنّ adds comparison ("as if") — six different flavors of the same single grammatical operation.',
  },
  {
    code: 'l-kana',
    unitCode: 'unit-nominal-sentence',
    title: 'كان and the nominal sentence in the past',
    titleArabic: 'كان وأخواتها',
    summary: "The mirror image of إنّ: the predicate moves, not the subject.",
    order: 8,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-kana-wa-akhawatuha', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'part-03-kana-basic', 'part-05-laysa-negation', 'part-06-maa-zaala', 'part-07-asbaha-weather-cold', 'part-09-kana-feminine-agreement'],
    discoveryPrompt: 'الطَّالِبُ مُجْتَهِدٌ vs. كَانَ الطَّالِبُ مُجْتَهِدًا — this time track مُجْتَهِدٌ/مُجْتَهِدًا. Compare with what إنّ did in the previous lesson: same target, or different?',
    microExplanation:
      'كان، أصبح، ظلّ، أمسى، بات، صار، ما زال، ليس keep the subject (اسم كان) nominative but push the predicate (خبر كان) into the accusative — the reverse of إنّ\'s target. Contrasting the two side by side is the fastest way to stop confusing which governor touches which word.',
    deeperDetail:
      'كان itself leads a double life: as one of these "deficient verbs" (أفعال ناقصة) it only establishes a state and reaches forward to reshape a nominal sentence, exactly as described above — but كان can also be a complete, ordinary verb (كان تامّة) simply meaning "existed" or "happened," taking a فاعل like any other verb and no خبر at all (كَانَ يَوْمٌ جَمِيلٌ, "There was a beautiful day" — يوم is فاعل, not اسم كان, and there is no separate predicate). Telling the two apart is purely a matter of whether the sentence still makes sense with nothing after the apparent subject: if it does, كان is تامّة; if the sentence needs a predicate to feel complete, it is ناقصة and behaves as described in the main explanation above.',
  },
  {
    code: 'l-verb-subject',
    unitCode: 'unit-verbal-sentence',
    title: 'The verb and its subject',
    titleArabic: 'الفعل والفاعل',
    summary: 'Why the first noun is not automatically the subject.',
    order: 1,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-fi-l-fa-il', role: 'introduces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'verb-07-intransitive-no-object', 'verb-16-simple-vs-laugh'],
    discoveryPrompt: 'كَتَبَ الطَّالِبُ الدَّرْسَ — in English word order this reads "wrote the-student the-lesson." Which word is doing the writing? How do you know, if not from position?',
    microExplanation:
      'In a verbal sentence, the فاعل is whoever performs the action, and it is always nominative — regardless of position, and regardless of what an English translation\'s word order might suggest. Arabic sentences default to verb-first order, so the very first noun after the verb is usually, but not definitionally, the فاعل.',
    deeperDetail:
      'Word order can shift for emphasis — رَأَى الطَّالِبَ الْمُعَلِّمُ still means "the teacher saw the student" even with the object fronted before the subject, because الْمُعَلِّمُ carries the nominative ḍammah no matter where it sits. Never trust position; always check the vowel. A فاعل does not even have to be a separate visible word: a verb like اِكْتُبْ ("write!") has a فاعل built into it — a hidden "you" (ضمير مستتر وجوباً, "obligatorily hidden pronoun") — because Arabic conjugation already fully identifies the doer without needing a separate noun or pronoun to say it again.',
  },
  {
    code: 'l-verb-agreement',
    unitCode: 'unit-verbal-sentence',
    title: "Why the verb doesn't always \"agree\"",
    titleArabic: 'مطابقة الفعل للفاعل',
    summary: 'Singular verb, plural subject — until the subject moves to the front.',
    order: 2,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-verb-subject-agreement', role: 'introduces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'verb-02-dual-subject-singular-verb', 'verb-03-plural-subject-singular-verb', 'verb-04-fronted-subject-full-agreement', 'verb-17-sound-fem-plural-agreement'],
    discoveryPrompt: 'كَتَبَ stays exactly the same in all three of the first sentences, even though the فاعل changes from singular to dual to plural. Then in the fourth sentence, the verb suddenly becomes كَتَبُوا. What changed about the sentence itself, not just the noun?',
    microExplanation:
      'A verb before its فاعل stays grammatically singular no matter the فاعل\'s real number (though it still agrees in gender). Once the subject is fronted, the sentence becomes structurally nominal with an embedded verbal khabar, and that embedded verb carries its own attached pronoun, which does fully agree.',
    deeperDetail:
      'Notice which agreement feature survives fronting and which does not: number agreement is suspended before the subject but restored after it, while gender agreement is never suspended at all — ذَهَبَتِ الطَّالِبَةُ ("the [female] student went") already shows the feminine تِ even in default verb-first order, because gender, unlike number, is treated as always knowable and always marked. This asymmetry is one of the most heavily tested points in this unit precisely because it looks inconsistent until you see that number and gender are simply governed by two separate rules, not one combined "agreement" rule.',
  },
  {
    code: 'l-maful-bihi',
    unitCode: 'unit-verbal-sentence',
    title: 'The direct object',
    titleArabic: 'المفعول به',
    summary: 'Accusative by role, not by meaning.',
    order: 3,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-maful-bihi', role: 'introduces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'verb-07-intransitive-no-object', 'verb-10-ditransitive', 'verb-18-maful-apple'],
    discoveryPrompt: 'جَلَسَ الْوَلَدُ has no object at all, while أَعْطَى الْمُعَلِّمُ الطَّالِبَ كِتَابًا has two. What decides whether a verb needs، allows, or forbids a مفعول به?',
    microExplanation:
      'A transitive verb\'s مفعول به is accusative — the thing acted upon. Some verbs are intransitive (لازم) and take none; a few take two, both marked identically as accusative even when one maps to an English indirect object.',
    deeperDetail:
      'مفعول به is only one member of a whole family of accusative roles traditionally grouped together as "the five مفعولات": المفعول المطلق (a cognate noun repeating the verb\'s own root to intensify or specify it, previewed in سَأَلَ ... سُؤَالًا, "asked ... a question"), المفعول لأجله (naming the reason for the action), المفعول فيه (an adverb of time or place, e.g. غدًا "tomorrow"), and المفعول معه (naming who or what accompanied the action). All five are accusative, but each for a completely different reason — مفعول به is simply the most common of the five, and the one every other member gets contrasted against once you meet them.',
  },
  {
    code: 'l-passive',
    unitCode: 'unit-verbal-sentence',
    title: 'The passive voice',
    titleArabic: 'المبني للمجهول ونائب الفاعل',
    summary: 'The object gets promoted, and the verb changes its internal vowels.',
    order: 4,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-passive-voice', role: 'introduces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'pass-01-anchor', 'pass-02-door-opened', 'pass-03-two-object-verb-passive'],
    discoveryPrompt: 'كَتَبَ الطَّالِبُ الدَّرْسَ becomes كُتِبَ الدَّرْسُ. الدَّرْسَ was accusative; الدَّرْسُ is nominative. Did its meaning in the sentence change, or just its grammatical role?',
    microExplanation:
      'When the agent is unknown, unimportant, or hidden on purpose, the verb\'s internal vowels shift and the former مفعول به is promoted to نائب الفاعل — nominative, exactly like a real فاعل — even though it is still semantically the one acted upon. Case tracks syntactic role, not real-world meaning.',
    deeperDetail:
      'With a ditransitive verb — one that already takes two objects, like أعطى ("gave") — only the first object is promoted to نائب الفاعل; the second stays exactly as accusative as it was in the active sentence: أُعْطِيَ الطَّالِبُ كِتَابًا ("The student was given a book") promotes الطالب but leaves كتابًا untouched. Not every verb can passivize at all: a purely intransitive verb like جَلَسَ ("sat") has no مفعول به to promote in the first place, and the "deficient verbs" (كان and its sisters) never take a passive form, since they don\'t describe an action being done to anything.',
  },
  {
    code: 'l-irab-concept',
    unitCode: 'unit-case-foundations',
    title: 'What إعراب actually is',
    titleArabic: 'مفهوم الإعراب',
    summary: 'Reframing "grammar" as evidence of role, not a list to memorize.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-irab-concept', role: 'introduces' }],
    observeSentenceCodes: ['case-01-nominative-triplet', 'case-02-accusative-triplet', 'case-03-genitive-triplet', 'case-11-irab-concept-mixed'],
    discoveryPrompt: 'الطَّالِبُ، الطَّالِبَ، الطَّالِبِ — same word, three different endings, across three sentences. What changed between the sentences that could explain each ending?',
    microExplanation:
      'إعراب is the system by which a word\'s ending changes to reveal its grammatical role — the ending is evidence of the role, not the rule itself. Most nouns and present-tense verbs change this way (معرب); a smaller set of words never change regardless of role (مبني).',
    deeperDetail:
      'The most reliable order of operations, and the one this app\'s Iʿrāb X-Ray tool walks through on every single word, is: first ask what kind of word this is (اسم، فعل، or حرف); then ask what, if anything, governs it; then ask what syntactic role it performs because of that; only then does the expected case or mood follow, and only after that do you predict which marker should show it and whether that marker is visible, secondary, or estimated. Learners who memorize endings in isolation ("خبر is always ḍammah") get stuck the moment a خبر is a shibh jumla or an embedded clause with no ending of its own — reasoning role-first never gets stuck that way, because it never depended on a fixed list of endings in the first place.',
  },
  {
    code: 'l-three-cases',
    unitCode: 'unit-case-foundations',
    title: 'The three homes: رفع، نصب، جر',
    titleArabic: 'رفع، نصب، جر',
    summary: 'Turning "which ending?" into "which home does this role belong to?"',
    order: 2,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-three-cases', role: 'reinforces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'nom-04-khabar-shibh-jumla', 'case-12-three-cases-coffee'],
    discoveryPrompt: 'List every role you have learned so far — مبتدأ، خبر، فاعل، مفعول به، مجرور بحرف جر. Which case does each one live in by default?',
    microExplanation:
      'رفع is the default state, home to مبتدأ، خبر، and فاعل. نصب is the state a governor imposes, most often on مفعول به. جر only ever happens after a preposition or as a مضاف إليه. Once you can name a word\'s role, its case is a lookup, not a guess.',
    deeperDetail:
      'These three cover every noun, but the imperfect verb has its own parallel, fourth state that belongs only to verbs and never to nouns: الجزم (the jussive), triggered by particles like لم and لا الناهية, alongside رفع (indicative) and نصب (subjunctive) which the imperfect also shares in its own verb-specific sense. So the complete map is: three case "homes" for nouns (رفع، نصب، جر), and three mood "homes" for the imperfect verb (رفع، نصب، جزم) — نصب and رفع are names that get reused across both systems, but جر belongs only to nouns and جزم belongs only to verbs.',
  },
  {
    code: 'l-marker-types',
    unitCode: 'unit-case-foundations',
    title: 'Visible, secondary, and estimated markers',
    titleArabic: 'العلامات الأصلية والفرعية والمقدرة',
    summary: 'Why some case endings can be heard, and some cannot.',
    order: 3,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-marker-types', role: 'introduces' }],
    observeSentenceCodes: ['case-01-nominative-triplet', 'case-04-dual-predicate', 'case-08-diptote-genitive', 'case-13-estimated-marker-fatan', 'case-15-sound-masc-plural-marker'],
    discoveryPrompt: 'الطَّالِبُ shows case with a short vowel. الطَّالِبَانِ shows it with a whole suffix. مِصْرَ shows genitive with the "wrong" vowel and no تنوين at all. Are all three of these "exceptions," or is something more organized going on?',
    microExplanation:
      'A visible marker is an ordinary short vowel. A secondary marker is a dedicated suffix, as with duals and sound plurals. An estimated marker means the case is grammatically present but cannot be physically pronounced — most often because the noun\'s final letter cannot carry a short vowel at all.',
    deeperDetail:
      'There is a fourth category worth naming even though it is really a special case of "estimated": a positional marker, used for whole clauses and attached pronouns that have a real syntactic role but no vowel-bearing final letter of their own to carry it — the embedded clause serving as خبر كان, or the attached ـهُ serving as مفعول به, are each said to occupy a position (لهما محل) rather than to show a marker at all. مِصْرَ from the diptote example is a useful edge case for telling visible from estimated apart: it is visible (you can hear the فتحة), just not the vowel you\'d expect — a reminder that "visible vs. estimated" is about whether anything is pronounced, not about whether it\'s the vowel a beginner would guess.',
  },
  {
    code: 'l-diptotes',
    unitCode: 'unit-case-foundations',
    title: 'The diptote exception class',
    titleArabic: 'الممنوع من الصرف',
    summary: 'A closed set of nouns that only ever show two case vowels.',
    order: 4,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-diptotes', role: 'introduces' }],
    observeSentenceCodes: ['case-08-diptote-genitive', 'case-09-diptote-broken-plural-genitive', 'case-14-diptote-proper-noun'],
    discoveryPrompt: 'سَافَرْتُ إِلَى مِصْرَ — إلى should govern a genitive, which should show as kasrah. It doesn\'t. Is this a mistake, or a rule you haven\'t met yet?',
    microExplanation:
      'Diptotes — many proper names, the أَفْعَل/فَعْلَاء pattern family, and certain broken plurals — take فتحة for both accusative and genitive, and never take تنوين. This is a fixed, learnable list of shapes, not a random irregularity.',
    deeperDetail:
      'The closed list of triggers, precisely: proper names that are feminine (مَكَّةُ), foreign in origin (إِبْرَاهِيمُ), compound (بَعْلَبَكُّ), or match certain verb-like patterns; adjectives on the pattern أَفْعَل with feminine فَعْلَاء (أَحْمَر/حَمْرَاء, "red"); and broken plurals whose pattern has three or more syllables with a long vowel right before the final consonant (مَسَاجِد، مَفَاتِيح). One rule reverses all of this at once: a diptote that becomes definite — by taking ال, or by becoming a مضاف إليه in an idafa — regains full ordinary declension with تنوين and كسرة exactly like any other noun, because diptote status is specifically a property of an indefinite, non-idafa noun.',
  },
  {
    code: 'l-root-pattern',
    unitCode: 'unit-roots-patterns',
    title: 'Root and pattern: the master key',
    titleArabic: 'الجذر والوزن',
    summary: 'Every Arabic word as a root poured into a mold.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-root-and-pattern', role: 'introduces' }],
    observeSentenceCodes: ['morph-01-form2-causative', 'nom-06-idafa-basic', 'morph-13-root-pattern-triple', 'morph-19-root-pattern-daras'],
    discoveryPrompt: 'كَاتِب، مَكْتُوب، كِتَابَة، مَكْتَب all share ك ت ب but sound and mean different things. What is staying constant, and what is changing?',
    microExplanation:
      'Almost every Arabic word is built from a root of (usually) three consonants carrying a core meaning, poured into a pattern that adds grammatical shape and a fairly predictable derivational meaning. Learning to extract the root and recognize the pattern turns an unfamiliar word into something decodable.',
    deeperDetail:
      'Not every root is "sound" (three ordinary consonants behaving predictably) — a root containing و، ي، or a همزة as one of its three letters is called weak, and its patterns undergo regular, learnable contractions that Domain E covers in full (a hollow root like ق و ل contracts its middle letter into a long vowel: قَالَ, not the fully "regular" shape you\'d otherwise expect). A smaller number of words are جامد ("frozen") rather than مشتق ("derived") — mostly names of concrete objects like حِصَان ("horse") — and simply do not analyze into a productive root-and-pattern relationship the way a verb-derived noun does. Recognizing when a word is jāmid and not worth pattern-analyzing is itself a useful skill.',
  },
  {
    code: 'l-form-i',
    unitCode: 'unit-roots-patterns',
    title: 'Form I and its family',
    titleArabic: 'الوزن الأول ومشتقاته',
    summary: 'فَعَلَ, its active participle, its passive participle, and its verbal noun.',
    order: 2,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-form-i-verb', role: 'introduces' }],
    observeSentenceCodes: ['nom-01-mubtada-khabar-basic', 'nom-07-idafa-passive-participle-khabar', 'morph-10-assimilated'],
    discoveryPrompt: 'كَتَبَ، كَاتِب، مَكْتُوب، كِتَابَة — one verb and three related nouns. What job does each one do in a sentence?',
    microExplanation:
      'Form I is the bare, underived verb a root starts from. From it come the active participle (فَاعِل — the doer), the passive participle (مَفْعُول — the one acted upon), and a مصدر whose exact shape must be learned per verb (unlike the derived forms, whose مصادر are far more predictable).',
    deeperDetail:
      'Form I itself is not one single pattern but three vowel subtypes on its middle radical — فَعَلَ، فَعِلَ، فَعُلَ — and which one a given verb uses is not always predictable from the root alone, though it does predict the imperfect\'s own middle vowel (a فَعَلَ verb typically has a يَفْعُلُ or يَفْعِلُ imperfect; a فَعِلَ verb typically has a يَفْعَلُ imperfect). This is exactly why Form I\'s مصدر has to be memorized per verb rather than derived from a formula: the same root shape can pair with several different مصدر patterns (فَعْل، فِعَالَة، فُعُول...) with no fully reliable rule predicting which one a given verb takes, unlike Forms II–X, whose مصادر are governed by strong, nearly exceptionless formulas.',
  },
  {
    code: 'l-derived-forms',
    unitCode: 'unit-roots-patterns',
    title: 'Derived forms and their meaning tendencies',
    titleArabic: 'الأوزان من الثاني إلى العاشر',
    summary: 'Causative, reciprocal, reflexive, and "seeking" — read off the shape.',
    order: 3,
    estimatedMinutes: 25,
    concepts: [{ conceptCode: 'c-derived-forms', role: 'introduces' }],
    observeSentenceCodes: ['morph-01-form2-causative', 'morph-02-form5-reflexive', 'morph-03-form8-reciprocal-effort', 'morph-04-form7-vs-form1-transitivity', 'morph-14-form4-causative', 'morph-20-form10-istaqbala'],
    discoveryPrompt: 'دَرَسَ ("studied") → دَرَّسَ ("taught"). عَلَّمَ ("taught") → تَعَلَّمَ ("learned"). كَسَرَ ("broke it") → انْكَسَرَ ("it broke"). What is the pattern behind each shift in meaning?',
    microExplanation:
      'Augmenting Form I with doubling, a prefixed أ، an infixed ت or ن, or other changes produces Forms II–X, each with recurring (not exceptionless) meaning tendencies: II often causative, III often "toward another party," V often reflexive-of-II, VII often passive/reflexive, VIII often reflexive-or-effortful, X often "to seek."',
    deeperDetail:
      'The full nine-pattern reference, worth having in view all at once: II فَعَّلَ (doubled middle radical — causative), III فَاعَلَ (long ا after first radical — toward another party), IV أَفْعَلَ (prefixed أ — also often causative), V تَفَعَّلَ (تII — reflexive of II), VI تَفَاعَلَ (تIII — mutual/pretending), VII اِنْفَعَلَ (ن prefix — passive/reflexive, never takes a direct object of its own), VIII اِفْتَعَلَ (infixed ت — reflexive or effortful), IX اِفْعَلَّ (doubled final radical, rare — colors and physical defects only), X اِسْتَفْعَلَ (سـت prefix — "to seek/consider X"). These are tendencies a learner uses to guess an unfamiliar verb\'s likely meaning from its shape, not iron laws — plenty of individual verbs drift from their form\'s "typical" sense, which is exactly why a dictionary is still needed alongside the pattern.',
  },
  {
    code: 'l-participles',
    unitCode: 'unit-roots-patterns',
    title: 'Active and passive participles',
    titleArabic: 'اسم الفاعل واسم المفعول',
    summary: 'كَاتِب names the doer; مَكْتُوب names the one acted upon.',
    order: 4,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-active-passive-participle', role: 'introduces' }],
    observeSentenceCodes: ['verb-01-basic-vso', 'nom-07-idafa-passive-participle-khabar', 'morph-12-passive-participle-letter'],
    discoveryPrompt: 'الطَّالِبُ ("the student," from a Form-I active participle of ط ل ب) is فاعل in كتب الطالب الدرس. Is "طالب" (the shape of the word) the same thing as "فاعل" (the job it does in this sentence)?',
    microExplanation:
      'اسم الفاعل (فَاعِل for Form I) names the doer of an action; اسم المفعول (مَفْعُول for Form I) names the one acted upon. Both behave as ordinary nouns or adjectives afterward — a shape a word has is not the same thing as فاعل, the syntactic subject job a word can perform in a sentence.',
    deeperDetail:
      'Only Form I has these two irregular-looking فَاعِل/مَفْعُول shapes; every derived form builds its participles on one predictable template instead — prefix a مُ, keep the form\'s own vowel pattern, and change only the vowel right before the last radical to tell active from passive: Form II active مُعَلِّم ("teacher," literally "one who causes learning") vs. passive مُعَلَّم ("[that which is] taught"); Form IV active مُرْسِل vs. passive مُرْسَل; and so on for every derived form. Once a learner has Form I\'s two irregular shapes memorized, every other form\'s participles follow from one single formula, which is part of why derived-form morphology often feels easier than Form I\'s despite looking more complex on the surface.',
  },
  {
    code: 'l-masdar',
    unitCode: 'unit-roots-patterns',
    title: 'The verbal noun',
    titleArabic: 'المصدر',
    summary: 'Naming the action itself, with no doer and no time attached.',
    order: 5,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-verbal-noun', role: 'introduces' }],
    observeSentenceCodes: ['morph-09-hamzated-cognate-object', 'morph-11-verbal-noun-reading'],
    discoveryPrompt: 'كِتَابَة means "writing" with no one doing it and no time attached — compare to كَتَبَ ("he wrote," locked to third-person-past). What did the pattern shift accomplish?',
    microExplanation:
      'المصدر abstracts the action from any doer or time — كِتَابَة, "writing" (the act itself). Every verb has at least one مصدر; derived forms\' مصادر are largely predictable even though Form I\'s is not.',
    deeperDetail:
      'A مصدر is not just a dictionary curiosity — it is the noun behind two of the five accusative مفعولات from the direct-object lesson: as المفعول المطلق, a verb\'s own مصدر re-appears right after it to intensify or specify the action (سَأَلَ سُؤَالًا, "asked [an act of] asking"); and as المفعول لأجله, a مصدر explains why the action happened. Because a مصدر carries no person, gender, tense, or mood of its own, it can also stand in for an entire subordinate verbal clause in formal registers — "أُحِبُّ الْقِرَاءَةَ" ("I love reading") uses the noun القراءة exactly where English would need a full clause or gerund, with none of a conjugated verb\'s grammatical baggage attached.',
  },
  {
    code: 'l-perfect',
    unitCode: 'unit-verb-conjugation',
    title: 'The perfect tense',
    titleArabic: 'الفعل الماضي',
    summary: 'How a whole sentence can fit inside one conjugated verb.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-perfect-tense', role: 'introduces' }],
    observeSentenceCodes: ['case-02-accusative-triplet', 'verb-04-fronted-subject-full-agreement', 'verb-05-feminine-intransitive', 'verb-19-perfect-family-travel', 'verb-22-perfect-first-person'],
    discoveryPrompt: 'رَأَيْتُ، كَتَبُوا، ذَهَبَتِ — three different suffixes on three different verbs. What information does each suffix carry?',
    microExplanation:
      'The perfect marks a completed action by attaching suffixes that encode person, gender, and number directly onto the stem. Because subject information is fused into the verb, a single fully conjugated verb can be a complete sentence with no separate subject word.',
    deeperDetail:
      'The core suffix set, worth having as a compact reference: ـتُ (I), ـتَ (you, m.), ـتِ (you, f.), ـتُمَا (you two), ـتُم (you, m. pl.), ـتُنَّ (you, f. pl.), ـنَا (we), ـا (they two, m.), ـتَا (they two, f.), ـوا (they, m. pl.), ـنَ (they, f. pl.) — and third-person masculine singular takes no suffix at all (كَتَبَ is already complete). Every one of these fuses directly onto the stem, which is exactly why رَأَيْتُ, a single word, is a complete sentence meaning "I saw" with no separate word for "I" anywhere in it.',
  },
  {
    code: 'l-imperfect',
    unitCode: 'unit-verb-conjugation',
    title: 'The imperfect tense',
    titleArabic: 'الفعل المضارع',
    summary: 'Prefixed for person, and — unlike the perfect — inflected for mood.',
    order: 2,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-imperfect-tense', role: 'introduces' }],
    observeSentenceCodes: ['verb-06-imperfect-indefinite-object', 'part-04-kana-imperfect', 'verb-20-imperfect-plural-library'],
    discoveryPrompt: 'يَكْتُبُ starts with ي, not a suffix. Compare to كَتَبَ. Where did the person-marking move?',
    microExplanation:
      'The imperfect marks an ongoing, habitual, or future action with a prefix encoding person (and often gender): يَكْتُبُ (he writes), تَكْتُبُ (she writes / you, m., write). Unlike the perfect, its ending changes with mood — the doorway into Domain D and F\'s mood system.',
    deeperDetail:
      'The four prefixes carry the heaviest load: أَ (I), نَ (we), تَ (you, or she/it), يَ (he/it, or they in some plural forms) — and plural/dual subjects add a suffix on top of the prefix to disambiguate (تَكْتُبُونَ "you, m. pl., write" vs. تَكْتُبُ "you, m. sg. / she writes"). Because tَ covers both "you" and "she," and يَ alone doesn\'t distinguish singular from some plural forms, the imperfect actually carries less person/gender information per word than the perfect does, and relies more on its suffix (or on context) to fully disambiguate who is doing the action.',
  },
  {
    code: 'l-imperative',
    unitCode: 'unit-verb-conjugation',
    title: 'The imperative',
    titleArabic: 'فعل الأمر',
    summary: 'Built from the jussive, not memorized as a fourth form.',
    order: 3,
    estimatedMinutes: 15,
    concepts: [{ conceptCode: 'c-imperative', role: 'introduces' }],
    observeSentenceCodes: ['verb-06-imperfect-indefinite-object', 'verb-11-imperative'],
    discoveryPrompt: 'يَكْتُبُ means "he writes." Strip the ي and add a helping أ at the front: what command does اُكْتُبْ give, and to whom?',
    microExplanation:
      'The imperative is derived from the jussive form of the imperfect by stripping the subject prefix, sometimes adding a helping همزة: اكْتُبْ (write!, to a man), اكْتُبِي (write!, to a woman) — a derived form, not an independent fourth tense to memorize from scratch.',
    deeperDetail:
      'Whether a helping همزة is needed, and what vowel it carries, depends entirely on the Form I verb\'s own imperfect middle vowel: if the imperfect is يَفْعُلُ or يَفْعِلُ, stripping the ي prefix would leave a word starting with two silent consonants in a row, which Arabic phonology doesn\'t allow — so a helping اُ or اِ is added (اُكْتُبْ, اِذْهَبْ). Derived-form imperatives (Forms II–X) never need this helping vowel at all, because their imperfect stems already begin with a vowel-bearing consonant once the person-prefix is removed — عَلِّمْ ("teach!"), not a form requiring any hamza — one more place where Form I is the irregular one and the derived forms are the more mechanically predictable ones.',
  },
  {
    code: 'l-mood',
    unitCode: 'unit-verb-conjugation',
    title: 'Mood: indicative, subjunctive, jussive',
    titleArabic: 'الرفع والنصب والجزم في المضارع',
    summary: "The imperfect verb's own version of case.",
    order: 4,
    estimatedMinutes: 25,
    concepts: [{ conceptCode: 'c-mood-jussive-subjunctive', role: 'introduces' }],
    observeSentenceCodes: ['verb-06-imperfect-indefinite-object', 'verb-12-negation-jussive-lam', 'verb-13-subjunctive-an', 'part-10-lan-subjunctive'],
    discoveryPrompt: 'يَكْتُبُ ends in ḍammah by default. If a particle like لن or لم precedes it, tradition says that final vowel must change. Which system have you already learned that behaves exactly this way?',
    microExplanation:
      'The imperfect verb\'s final vowel (or final letter, for weak/plural forms) changes with mood: رفع (indicative, default), نصب (subjunctive, triggered by particles like أن، لن، كي), جزم (jussive, triggered by لم، لا الناهية، or conditional particles) — verbal إعراب, running on the same logic as nominal case.',
    deeperDetail:
      'A concrete trigger list, worth memorizing as a set: نصب is forced by أنْ ("to/that," introducing a subordinate clause — يُرِيدُ أَنْ يَكْتُبَ, "he wants to write"), لن ("will never," negating the future), كي ("in order to"), and حتى ("until/so that") in some uses. جزم is forced by لم ("did not," negating the past through the imperfect), لا الناهية ("don\'t!," negative command), and the conditional particles إنْ/مَن/مَا ("if/whoever/whatever"), which put both the condition and its result into the jussive. The surface change for جزم is a bare sukūn on the final consonant (سكون), while نصب shows a فتحة — mirroring, almost vowel-for-vowel, the same رفع/نصب/جر contrast nouns show, just running on a completely separate track that only ever applies to the imperfect.',
  },
  {
    code: 'l-hamzated',
    unitCode: 'unit-weak-verbs',
    title: 'Hamzated verbs',
    titleArabic: 'الفعل المهموز',
    summary: 'When one root letter is a همزة.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-hamzated-verbs', role: 'introduces' }],
    observeSentenceCodes: ['morph-09-hamzated-cognate-object', 'morph-15-hamzated-qaraa', 'morph-21-hamzated-initial-akhadha'],
    discoveryPrompt: 'سَأَلَ has a همزة as its middle letter, seated on ا. Does the root itself ever actually disappear in any conjugated form?',
    microExplanation:
      'A verb with همزة as one of its root letters (أَكَلَ، سَأَلَ، قَرَأَ) conjugates on entirely regular lines — only the همزة\'s written seat (ء/أ/إ/ؤ) shifts as the surrounding vowels change. The root consonants themselves never vanish.',
    deeperDetail:
      'Which position the همزة occupies in the root changes what, if anything, looks unusual: a همزة as the first radical (فاء الفعل, like أَخَذَ "took") can disappear or merge in certain derived forms — Form VIII of أخذ is اتَّخَذَ, not اِأْتَخَذَ, because a weak-behaving initial همزة assimilates into the following ت. A همزة as the middle radical (عين الفعل, like سَأَلَ) is the most "regular" of the three, simply changing its written seat with the vowels around it exactly as the main explanation describes. A همزة as the final radical (لام الفعل, like قَرَأَ) shifts seat at the very end of the word as suffixes are added — قَرَأْتُ keeps a bare ء because a sukūn follows, while قَرَؤُوا would carry a different seat. None of these are separate irregular verbs to memorize — they are one root-letter-position rule applied three times.',
  },
  {
    code: 'l-doubled',
    unitCode: 'unit-weak-verbs',
    title: 'Doubled verbs',
    titleArabic: 'الفعل المضعّف',
    summary: 'Merged consonants that split apart again before certain suffixes.',
    order: 2,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-doubled-verbs', role: 'introduces' }],
    observeSentenceCodes: ['case-03-genitive-triplet', 'morph-16-doubled-ahabbat', 'morph-22-doubled-madda-sentence'],
    discoveryPrompt: 'مَرَرْتُ keeps both رs separate, spelled out. Would you expect حَبَّ ("he loved") to do the same before ـتُ?',
    microExplanation:
      'When a verb\'s second and third root letters are identical (م د د، ح ب ب), they merge (إدغام) in most forms — مَدَّ، حَبَّ — but split back apart wherever a vowel would otherwise fall between them, as with the تُ suffix: مَدَدْتُ، حَبَبْتُ.',
    deeperDetail:
      'The rule for when merging happens is entirely mechanical, not memorized case by case: the two identical letters merge only when nothing separates them, and split apart the instant a vowel would otherwise need to sit directly between them — which is precisely what a consonant-initial suffix like ـتُ forces. In the jussive and imperative, classical grammar actually allows both the merged and split spellings for Form I doubled verbs (اُمْدُدْ or the more common اُمُدَّ, "extend!") because the sukūn the jussive would otherwise put on the final radical creates exactly the same "nothing separates them" condition that triggers merging elsewhere — one more sign that the merge/split behavior is fully rule-governed rather than an arbitrary spelling quirk.',
  },
  {
    code: 'l-hollow',
    unitCode: 'unit-weak-verbs',
    title: 'Hollow verbs',
    titleArabic: 'الفعل الأجوف',
    summary: 'A middle root letter that contracts — and resurfaces.',
    order: 3,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-hollow-verbs', role: 'introduces' }],
    observeSentenceCodes: ['morph-05-hollow-perfect-contracted', 'morph-06-hollow-first-person-resurfaces', 'morph-17-hollow-zaara', 'morph-23-hollow-baa'],
    discoveryPrompt: 'قَالَ vs. قُلْتُ — these look like two unrelated verbs at first glance. What is the same in both, and what predicts the difference?',
    microExplanation:
      'A verb with و or ي as its middle root letter (ق و ل، ب ي ع) contracts that letter into a long vowel in most forms — قَالَ، بَاعَ — but the weak letter resurfaces as a short vowel once a consonant-initial suffix follows: قُلْتُ، بِعْتُ. One rule explains both surface shapes.',
    deeperDetail:
      'The same contraction story continues into the imperfect and beyond the perfect tense: يَقُولُ ("he says"), not the fully "regular" shape the root would otherwise predict, contracts exactly the way قَالَ does. In the jussive, the contracted long vowel shortens away almost entirely — لَمْ يَقُلْ ("he did not say"), the long و of يَقُولُ reduced to nothing once جزم\'s sukūn lands where the vowel used to be. Once a learner sees that the perfect\'s قَالَ/قُلْتُ pair and the imperfect\'s يَقُولُ/لَمْ يَقُلْ pair are the exact same phenomenon — a weak middle letter contracting when nothing follows it and shortening or resurfacing when something does — hollow verbs stop looking like a list of irregular forms to memorize.',
  },
  {
    code: 'l-defective',
    unitCode: 'unit-weak-verbs',
    title: 'Defective verbs',
    titleArabic: 'الفعل الناقص',
    summary: 'A final weak letter, and how mood shows up as it disappears.',
    order: 4,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-defective-verbs', role: 'introduces' }],
    observeSentenceCodes: ['morph-07-defective-ya', 'morph-08-defective-waw', 'morph-18-defective-daaa', 'morph-24-defective-rama'],
    discoveryPrompt: 'نَسِيَ ends in ي؛ دَعَا ends in a long ا that is really a hidden و. Both are "defective" for different underlying reasons — can you tell which final radical each one hides?',
    microExplanation:
      'A verb with و or ي as its final root letter shows that weak letter as a long vowel in most forms — دَعَا، نَسِيَ — but drops or shortens it in others. Because the final letter is already weak, jussive and subjunctive show up here as the letter dropping outright, rather than as a separate vowel change.',
    deeperDetail:
      'Which final radical is hiding — و or ي — decides the exact shape in the jussive, so the two defective subtypes are worth telling apart by name: ناقص يائي ("ي-defective," like نَسِيَ, "forgot") loses its final ي entirely in the jussive — لَمْ يَنْسَ ("he did not forget"), ending in a bare fatḥah where the ي used to be. ناقص واوي ("و-defective," like دَعَا, "called") drops its final و the same way — لَمْ يَدْعُ ("he did not call"), ending in a bare ḍammah. Both patterns look, at first glance, like the letter simply "disappeared for no reason" in the jussive — but in both cases it is the exact same jussive sukūn that deletes weak final vowels elsewhere in the language, applied consistently to whichever weak letter that particular root happens to end in.',
  },
  {
    code: 'l-ellipsis',
    unitCode: 'unit-advanced-analysis',
    title: 'What gets omitted, and why',
    titleArabic: 'الحذف والتقدير',
    summary: 'Recoverable omission as a normal, rule-governed compression.',
    order: 1,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-ellipsis-and-estimation', role: 'introduces' }],
    observeSentenceCodes: ['nom-02-demonstrative-indefinite-khabar', 'part-11-vocative-ellipsis'],
    discoveryPrompt: 'A sign reading simply "ممنوعٌ" ("forbidden") is a complete, understood sentence in context, even with no visible مبتدأ. What is the missing word doing?',
    microExplanation:
      'Arabic regularly omits a word whose identity is fully recoverable from context or convention, while the role that word would have played is still "estimated" (مُقدَّر) for the purposes of analysis. Without this concept, an omission looks like a broken sentence instead of a normal compression.',
    deeperDetail:
      'A few recurring patterns are worth recognizing on sight: signs and warnings routinely omit the مبتدأ and state only the خبر (مَمْنُوعٌ, "forbidden," standing for an understood "هذا ممنوعٌ"); a coordinated second clause often omits a verb it shares with the first rather than repeating it (زيدٌ يكتب وعمرو [يقرأ], with a second verb understood from context); and formulaic greetings compress an entire classical verb phrase into just the surviving nouns (أهلاً وسهلاً originally implied a full verb of welcome, now reduced to two nouns alone). In every case, the test for whether something has genuinely been omitted — rather than the sentence simply being short — is whether a specific, recoverable word could be pointed to as the missing piece. If nothing specific is missing, there is nothing to estimate.',
  },
  {
    code: 'l-mahall',
    unitCode: 'unit-advanced-analysis',
    title: 'When a whole clause has a syntactic position',
    titleArabic: 'محل الجملة من الإعراب',
    summary: 'Clauses do not carry case endings — but they still occupy a slot.',
    order: 2,
    estimatedMinutes: 20,
    concepts: [{ conceptCode: 'c-mahall-al-jumla', role: 'introduces' }],
    observeSentenceCodes: ['part-04-kana-imperfect', 'verb-04-fronted-subject-full-agreement', 'nom-19-mahall-relative-clause-mubtada', 'verb-21-mahall-clause-object'],
    discoveryPrompt: 'يَكْتُبُ الدَّرْسَ, as the خبر of كَانَ, has no case ending of its own — a whole clause can\'t take a single vowel. So in what sense is it still "accusative"?',
    microExplanation:
      'An embedded clause has no case ending, yet it still occupies a syntactic slot equivalent to whatever single word could have filled it — grammarians say it "has a position" (لها محل). This is what makes full إعراب of sentences with embedded clauses possible.',
    deeperDetail:
      'Not every clause has a محل — only clauses filling a role a single word could otherwise fill do. A clause serving as خبر، حال (a state-describing clause), نعت (an adjectival clause), or مضاف إليه all have a محل, because a single noun or adjective could have occupied that same slot instead. A clause that simply opens a new sentence (الجملة الابتدائية أو الاستئنافية), a صلة الموصول clause following a relative pronoun like الذي, or the response clause after an oath (جواب القسم) have no محل at all — they are not standing in for any word a different sentence structure could have used there, so there is nothing for them to be "in the position of." Telling these two kinds of clause apart is the last piece needed to perform complete إعراب on real, connected Arabic prose rather than just single sentences.',
  },
];
