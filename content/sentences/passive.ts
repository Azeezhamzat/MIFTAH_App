import type { SentenceSeed } from '../sentenceTypes';

export const passiveSentences: SentenceSeed[] = [
  {
    code: 'pass-01-anchor',
    textVocalized: 'كُتِبَ الدَّرْسُ',
    textUnvocalized: 'كتب الدرس',
    transliteration: 'kutiba d-darsu',
    translationEnglish: 'The lesson was written.',
    difficulty: 2,
    notes: 'The fourth sentence in this course\'s founding contrast set (see kataba ṭ-ṭālibu d-darsa). Compare the internal vowels: كَتَبَ → كُتِبَ.',
    tokens: [
      {
        position: 1, surfaceVocalized: 'كُتِبَ', surfaceUnvocalized: 'كتب', lemma: 'كتب', rootRadicals: 'ك ت ب', partOfSpeech: 'verb',
        person: 'third', gender: 'masculine', number: 'singular', role: 'the verb (passive)',
        translation: 'was written', explanation: 'The internal vowel pattern shifts to ḍammah–kasrah–fatḥah to mark the passive; no agent is mentioned or implied to exist by name.',
      },
      {
        position: 2, surfaceVocalized: 'الدَّرْسُ', surfaceUnvocalized: 'الدرس', lemma: 'درس', rootRadicals: 'د ر س', prefix: 'ال',
        partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'definite', grammaticalCase: 'nominative',
        role: 'nāʾib al-fāʿil (substitute for the subject)', marker: 'ḍammah (ـُ)', markerType: 'visible', translation: 'the lesson',
        explanation: 'الدرس was the مفعول به in the active sentence; here it is promoted to nominative because it now behaves syntactically as the subject, even though it is still semantically the thing acted upon.',
        traditionalExplanation: 'نائب فاعل مرفوع وعلامة رفعه الضمة.',
      },
    ],
    dependencies: [
      { headPosition: 1, dependentPosition: 2, relation: 'verb_subject', explanation: 'الدرس is the نائب فاعل of the passive verb كُتِبَ — grammatically parallel to a فاعل.' },
    ],
  },
  {
    code: 'pass-02-door-opened',
    textVocalized: 'فُتِحَ الْبَابُ',
    textUnvocalized: 'فتح الباب',
    transliteration: 'futiḥa l-bābu',
    translationEnglish: 'The door was opened.',
    difficulty: 2,
    tokens: [
      { position: 1, surfaceVocalized: 'فُتِحَ', surfaceUnvocalized: 'فتح', lemma: 'فتح', rootRadicals: 'ف ت ح', partOfSpeech: 'verb', person: 'third', gender: 'masculine', number: 'singular', role: 'the verb (passive)', translation: 'was opened', explanation: 'Passive vowel pattern on a Form I verb.' },
      { position: 2, surfaceVocalized: 'الْبَابُ', surfaceUnvocalized: 'الباب', lemma: 'باب', prefix: 'ال', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'definite', grammaticalCase: 'nominative', role: 'nāʾib al-fāʿil', marker: 'ḍammah (ـُ)', markerType: 'visible', translation: 'the door', explanation: 'Promoted from object to grammatical subject-position.' },
    ],
    dependencies: [{ headPosition: 1, dependentPosition: 2, relation: 'verb_subject', explanation: 'الباب is the نائب فاعل.' }],
  },
  {
    code: 'pass-03-two-object-verb-passive',
    textVocalized: 'أُعْطِيَ الطَّالِبُ كِتَابًا',
    textUnvocalized: 'أعطي الطالب كتابا',
    transliteration: 'uʿṭiya ṭ-ṭālibu kitāban',
    translationEnglish: 'The student was given a book.',
    difficulty: 3,
    notes: 'With a ditransitive verb, only the first object is promoted to نائب الفاعل; the second stays accusative.',
    tokens: [
      { position: 1, surfaceVocalized: 'أُعْطِيَ', surfaceUnvocalized: 'أعطي', lemma: 'أعطى', partOfSpeech: 'verb', person: 'third', gender: 'masculine', number: 'singular', role: 'the verb (passive)', translation: 'was given', explanation: 'Passive of the two-object verb أعطى.' },
      { position: 2, surfaceVocalized: 'الطَّالِبُ', surfaceUnvocalized: 'الطالب', lemma: 'طالب', rootRadicals: 'ط ل ب', prefix: 'ال', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'definite', grammaticalCase: 'nominative', role: 'nāʾib al-fāʿil', marker: 'ḍammah (ـُ)', markerType: 'visible', translation: 'the student', explanation: 'The first (recipient) object is promoted, matching the English passive "the student was given."' },
      { position: 3, surfaceVocalized: 'كِتَابًا', surfaceUnvocalized: 'كتابا', lemma: 'كتاب', rootRadicals: 'ك ت ب', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'indefinite', grammaticalCase: 'accusative', role: 'remaining mafʿūl bihi', marker: 'fatḥah + tanwīn (ـً)', markerType: 'visible', translation: 'a book', explanation: 'The second object keeps its accusative case even in the passive sentence.' },
    ],
    dependencies: [
      { headPosition: 1, dependentPosition: 2, relation: 'verb_subject', explanation: 'الطالب is promoted to نائب الفاعل.' },
      { headPosition: 1, dependentPosition: 3, relation: 'verb_object', explanation: 'كتابًا remains an ordinary accusative object.' },
    ],
  },
  {
    code: 'pass-04-heard-strange-sound',
    textVocalized: 'سُمِعَ صَوْتٌ غَرِيبٌ',
    textUnvocalized: 'سمع صوت غريب',
    transliteration: 'sumiʿa ṣawtun gharībun',
    translationEnglish: 'A strange sound was heard.',
    difficulty: 3,
    notes: 'Direct passive counterpart of verb-09; compare the case of صوت (accusative there, nominative here) and of غريب, which must still agree with it.',
    tokens: [
      { position: 1, surfaceVocalized: 'سُمِعَ', surfaceUnvocalized: 'سمع', lemma: 'سمع', rootRadicals: 'س م ع', partOfSpeech: 'verb', person: 'third', gender: 'masculine', number: 'singular', role: 'the verb (passive)', translation: 'was heard', explanation: 'Passive of سمع.' },
      { position: 2, surfaceVocalized: 'صَوْتٌ', surfaceUnvocalized: 'صوت', lemma: 'صوت', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'indefinite', grammaticalCase: 'nominative', role: 'nāʾib al-fāʿil', marker: 'ḍammah + tanwīn (ـٌ)', markerType: 'visible', translation: 'a sound', explanation: 'Promoted from accusative object to nominative نائب الفاعل.' },
      { position: 3, surfaceVocalized: 'غَرِيبٌ', surfaceUnvocalized: 'غريب', lemma: 'غريب', partOfSpeech: 'adjective', gender: 'masculine', number: 'singular', definiteness: 'indefinite', grammaticalCase: 'nominative', role: 'naʿt of صوتٌ', marker: 'ḍammah + tanwīn (ـٌ)', markerType: 'visible', translation: 'strange', explanation: 'Must follow صوت\'s case change: nominative here, whereas it was accusative in the active version.' },
    ],
    dependencies: [
      { headPosition: 1, dependentPosition: 2, relation: 'verb_subject', explanation: 'صوت is the نائب الفاعل.' },
      { headPosition: 2, dependentPosition: 3, relation: 'noun_adjective', explanation: 'غريب agrees with صوت, including its new nominative case.' },
    ],
  },
  {
    code: 'pass-05-book-found',
    textVocalized: 'وُجِدَ الْكِتَابُ فِي الْمَكْتَبِ',
    textUnvocalized: 'وجد الكتاب في المكتب',
    transliteration: 'wujida l-kitābu fī l-maktabi',
    translationEnglish: 'The book was found in the office.',
    difficulty: 3,
    notes: 'وجد is assimilated (weak first radical و); its passive still forms regularly on the surface, unlike its imperfect.',
    tokens: [
      { position: 1, surfaceVocalized: 'وُجِدَ', surfaceUnvocalized: 'وجد', lemma: 'وجد', rootRadicals: 'و ج د', partOfSpeech: 'verb', person: 'third', gender: 'masculine', number: 'singular', role: 'the verb (passive)', translation: 'was found', explanation: 'Passive of the assimilated verb وجد — the weak و is unaffected here since this is the perfect passive, not the imperfect.' },
      { position: 2, surfaceVocalized: 'الْكِتَابُ', surfaceUnvocalized: 'الكتاب', lemma: 'كتاب', rootRadicals: 'ك ت ب', prefix: 'ال', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'definite', grammaticalCase: 'nominative', role: 'nāʾib al-fāʿil', marker: 'ḍammah (ـُ)', markerType: 'visible', translation: 'the book', explanation: 'Promoted object.' },
      { position: 3, surfaceVocalized: 'فِي', surfaceUnvocalized: 'في', lemma: 'في', partOfSpeech: 'particle', role: 'preposition', translation: 'in', explanation: 'Governs المكتب into the genitive.' },
      { position: 4, surfaceVocalized: 'الْمَكْتَبِ', surfaceUnvocalized: 'المكتب', lemma: 'مكتب', rootRadicals: 'ك ت ب', patternLabel: 'Noun of place — مَفْعَل', prefix: 'ال', partOfSpeech: 'noun', gender: 'masculine', number: 'singular', definiteness: 'definite', grammaticalCase: 'genitive', role: 'majrūr', marker: 'kasrah (ـِ)', markerType: 'visible', translation: 'the office', explanation: 'Genitive by government of في.' },
    ],
    dependencies: [
      { headPosition: 1, dependentPosition: 2, relation: 'verb_subject', explanation: 'الكتاب is the نائب الفاعل.' },
      { headPosition: 3, dependentPosition: 4, relation: 'preposition_object', explanation: 'في governs المكتب.' },
    ],
  },
];
