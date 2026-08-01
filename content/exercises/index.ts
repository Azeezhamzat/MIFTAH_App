import { foundationsExercises } from './foundations';
import { nominalExercises } from './nominal';
import { verbalExercises } from './verbal';
import { caseExercises } from './case';
import { morphologyExercises } from './morphology';
import { conjugationExercises } from './conjugation';
import { weakVerbExercises } from './weak';
import { advancedExercises } from './advanced';
import type { ExerciseSeed } from '../exerciseTypes';

export const allHandAuthoredExercises: ExerciseSeed[] = [
  ...foundationsExercises,
  ...nominalExercises,
  ...verbalExercises,
  ...caseExercises,
  ...morphologyExercises,
  ...conjugationExercises,
  ...weakVerbExercises,
  ...advancedExercises,
];
