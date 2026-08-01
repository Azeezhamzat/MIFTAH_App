export interface RootSeed {
  radicals: string; // space-separated letters, e.g. "ك ت ب"
  meaningCore: string;
  irregularity?: 'sound' | 'hamzated' | 'doubled' | 'assimilated' | 'hollow' | 'defective';
}

export const roots: RootSeed[] = [
  { radicals: 'ك ت ب', meaningCore: 'writing', irregularity: 'sound' },
  { radicals: 'ف ت ح', meaningCore: 'opening', irregularity: 'sound' },
  { radicals: 'د ر س', meaningCore: 'studying', irregularity: 'sound' },
  { radicals: 'ل ع ب', meaningCore: 'playing', irregularity: 'sound' },
  { radicals: 'خ ر ج', meaningCore: 'going out', irregularity: 'sound' },
  { radicals: 'د خ ل', meaningCore: 'entering', irregularity: 'sound' },
  { radicals: 'ج ل س', meaningCore: 'sitting', irregularity: 'sound' },
  { radicals: 'ف ه م', meaningCore: 'understanding', irregularity: 'sound' },
  { radicals: 'ع ل م', meaningCore: 'knowing', irregularity: 'sound' },
  { radicals: 'ع م ل', meaningCore: 'doing / working', irregularity: 'sound' },
  { radicals: 'س م ع', meaningCore: 'hearing', irregularity: 'sound' },
  { radicals: 'ن ظ ر', meaningCore: 'looking', irregularity: 'sound' },
  { radicals: 'س ك ن', meaningCore: 'dwelling / stillness', irregularity: 'sound' },
  { radicals: 'ق ط ع', meaningCore: 'cutting', irregularity: 'sound' },
  { radicals: 'ر ك ب', meaningCore: 'riding / mounting', irregularity: 'sound' },
  { radicals: 'ك س ر', meaningCore: 'breaking', irregularity: 'sound' },
  { radicals: 'ن ز ل', meaningCore: 'descending / alighting', irregularity: 'sound' },
  { radicals: 'ح ف ظ', meaningCore: 'preserving / memorizing', irregularity: 'sound' },
  { radicals: 'ذ ه ب', meaningCore: 'going', irregularity: 'sound' },
  { radicals: 'ش ر ب', meaningCore: 'drinking', irregularity: 'sound' },
  { radicals: 'أ ك ل', meaningCore: 'eating', irregularity: 'hamzated' },
  { radicals: 'س أ ل', meaningCore: 'asking', irregularity: 'hamzated' },
  { radicals: 'ق ر أ', meaningCore: 'reading / reciting', irregularity: 'hamzated' },
  { radicals: 'م د د', meaningCore: 'extending', irregularity: 'doubled' },
  { radicals: 'ح ب ب', meaningCore: 'loving', irregularity: 'doubled' },
  { radicals: 'و ج د', meaningCore: 'finding', irregularity: 'assimilated' },
  { radicals: 'و ص ل', meaningCore: 'arriving', irregularity: 'assimilated' },
  { radicals: 'ق و ل', meaningCore: 'saying', irregularity: 'hollow' },
  { radicals: 'ب ي ع', meaningCore: 'selling', irregularity: 'hollow' },
  { radicals: 'ن س ي', meaningCore: 'forgetting', irregularity: 'defective' },
  { radicals: 'د ع و', meaningCore: 'calling / inviting', irregularity: 'defective' },
  { radicals: 'ج م ع', meaningCore: 'gathering', irregularity: 'sound' },
  { radicals: 'ط ل ب', meaningCore: 'seeking / requesting', irregularity: 'sound' },
  { radicals: 'ح ض ر', meaningCore: 'being present / attending', irregularity: 'sound' },
];
