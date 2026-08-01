export interface ReferenceWorkSeed {
  code: string;
  titleArabic: string;
  titleEnglish: string;
  author: string;
  kind: 'inductive_primer' | 'classical_matn_commentary';
}

export const referenceWorks: ReferenceWorkSeed[] = [
  {
    code: 'nahw_wadih',
    titleArabic: 'النحو الواضح في قواعد اللغة العربية',
    titleEnglish: 'Clear Grammar in the Rules of the Arabic Language',
    author: 'ʿAlī al-Jārim and Muṣṭafā Amīn',
    kind: 'inductive_primer',
  },
  {
    code: 'tuhfah_saniyyah',
    titleArabic: 'التحفة السنية بشرح المقدمة الآجرومية',
    titleEnglish: 'The Splendid Gift: A Commentary on the Ājurrūmiyyah Primer',
    author: 'Muḥyī al-Dīn ʿAbd al-Ḥamīd (commentary on Ibn Ājurrūm\'s matn)',
    kind: 'classical_matn_commentary',
  },
];
