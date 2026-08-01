import { nominalSentences } from './nominal';
import { verbalSentences } from './verbal';
import { passiveSentences } from './passive';
import { caseSentences } from './case';
import { particleSentences } from './particles';
import { morphologySentences } from './morphology';
import type { SentenceSeed } from '../sentenceTypes';

export const allSentences: SentenceSeed[] = [
  ...nominalSentences,
  ...verbalSentences,
  ...passiveSentences,
  ...caseSentences,
  ...particleSentences,
  ...morphologySentences,
];

export {
  nominalSentences,
  verbalSentences,
  passiveSentences,
  caseSentences,
  particleSentences,
  morphologySentences,
};
