export interface PatternSeed {
  label: string;
  skeleton: string;
  category:
    | 'verb_form_i' | 'verb_form_ii' | 'verb_form_iii' | 'verb_form_iv' | 'verb_form_v'
    | 'verb_form_vi' | 'verb_form_vii' | 'verb_form_viii' | 'verb_form_x'
    | 'active_participle' | 'passive_participle' | 'verbal_noun'
    | 'noun_of_place' | 'instrument_noun' | 'intensive_form' | 'elative' | 'diminutive' | 'nisba' | 'broken_plural';
  meaningTendency?: string;
}

export const patterns: PatternSeed[] = [
  { label: 'Form I — فَعَلَ', skeleton: 'فَعَلَ', category: 'verb_form_i', meaningTendency: 'The bare, underived action.' },
  { label: 'Form II — فَعَّلَ', skeleton: 'فَعَّلَ', category: 'verb_form_ii', meaningTendency: 'Often causative or intensive: دَرَسَ (studied) → دَرَّسَ (taught, i.e. caused to study).' },
  { label: 'Form III — فَاعَلَ', skeleton: 'فَاعَلَ', category: 'verb_form_iii', meaningTendency: 'Often implies doing the action with/at another party: كَاتَبَ (corresponded with).' },
  { label: 'Form IV — أَفْعَلَ', skeleton: 'أَفْعَلَ', category: 'verb_form_iv', meaningTendency: 'Often causative: خَرَجَ (went out) → أَخْرَجَ (took out, caused to go out).' },
  { label: 'Form V — تَفَعَّلَ', skeleton: 'تَفَعَّلَ', category: 'verb_form_v', meaningTendency: 'Often reflexive of Form II: عَلَّمَ (taught) → تَعَلَّمَ (learned, taught oneself).' },
  { label: 'Form VI — تَفَاعَلَ', skeleton: 'تَفَاعَلَ', category: 'verb_form_vi', meaningTendency: 'Often reciprocal: تَكَاتَبَ (they corresponded with each other).' },
  { label: 'Form VII — انْفَعَلَ', skeleton: 'انْفَعَلَ', category: 'verb_form_vii', meaningTendency: 'Often passive/reflexive in sense: كَسَرَ (broke it) → انْكَسَرَ (it broke / got broken).' },
  { label: 'Form VIII — افْتَعَلَ', skeleton: 'افْتَعَلَ', category: 'verb_form_viii', meaningTendency: 'Often reflexive or shows effort: جَمَعَ (gathered) → اجْتَمَعَ (gathered together, met).' },
  { label: 'Form X — اسْتَفْعَلَ', skeleton: 'اسْتَفْعَلَ', category: 'verb_form_x', meaningTendency: 'Often "to seek/ask for X": عَلِمَ (knew) → اسْتَعْلَمَ (sought to know, inquired).' },
  { label: 'Active participle (Form I) — فَاعِل', skeleton: 'فَاعِل', category: 'active_participle', meaningTendency: 'Names the one who does the action: كَاتِب — a writer / one writing.' },
  { label: 'Passive participle (Form I) — مَفْعُول', skeleton: 'مَفْعُول', category: 'passive_participle', meaningTendency: 'Names the one/thing acted upon: مَكْتُوب — something written.' },
  { label: 'Verbal noun pattern — فِعَالَة', skeleton: 'فِعَالَة', category: 'verbal_noun', meaningTendency: 'One common Form-I مصدر shape naming the action itself: كِتَابَة — writing (the act).' },
  { label: 'Verbal noun pattern — فَعْل', skeleton: 'فَعْل', category: 'verbal_noun', meaningTendency: 'Another common Form-I مصدر shape: فَتْح — opening (the act).' },
  { label: 'Verbal noun pattern — فُعُول', skeleton: 'فُعُول', category: 'verbal_noun', meaningTendency: 'A Form-I مصدر shape common with verbs of motion: خُرُوج — going out (the act).' },
  { label: 'Verbal noun pattern — فَعَل', skeleton: 'فَعَل', category: 'verbal_noun', meaningTendency: 'A Form-I مصدر shape: عَمَل — work/doing (the act).' },
  { label: 'Verbal noun pattern — فِعْل', skeleton: 'فِعْل', category: 'verbal_noun', meaningTendency: 'A Form-I مصدر shape common with verbs of mental state: عِلْم — knowledge (the state of knowing).' },
  { label: 'Noun of place (feminine) — مَفْعَلة', skeleton: 'مَفْعَلة', category: 'noun_of_place', meaningTendency: 'A feminine-marked place-noun shape: مَدْرَسَة — school (a place of study).' },
  { label: 'Noun of place — مَفْعَل', skeleton: 'مَفْعَل', category: 'noun_of_place', meaningTendency: 'Names the place where the action typically happens: مَكْتَب — office/desk (a place of writing).' },
  { label: 'Instrument noun — مِفْعَال', skeleton: 'مِفْعَال', category: 'instrument_noun', meaningTendency: 'Names the tool used to perform the action: مِفْتَاح — key (the instrument of opening).' },
  { label: 'Intensive form — فَعَّال', skeleton: 'فَعَّال', category: 'intensive_form', meaningTendency: 'Marks habitual or professional intensity: كَذَّاب — a habitual liar.' },
  { label: 'Elative — أَفْعَل', skeleton: 'أَفْعَل', category: 'elative', meaningTendency: 'The comparative/superlative shape: أَكْبَر — bigger/biggest.' },
  { label: 'Nisba adjective — فَعَلِيّ', skeleton: 'فَعَلِيّ', category: 'nisba', meaningTendency: 'Turns a noun into a "belonging to / relating to" adjective by adding ـِيّ: مِصْر → مِصْرِيّ (Egyptian).' },
  { label: 'Broken plural pattern — فُعُول', skeleton: 'فُعُول', category: 'broken_plural', meaningTendency: 'One of many irregular plural shapes formed by an internal vowel change rather than a suffix: كِتَاب → كُتُب... this specific pattern: بَيْت → بُيُوت (houses).' },
];
