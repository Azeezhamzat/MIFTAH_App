export const UNIT_ORDER = [
  'unit-word-categories',
  'unit-sentence-shapes',
  'unit-nominal-sentence',
  'unit-verbal-sentence',
  'unit-case-foundations',
  'unit-roots-patterns',
  'unit-verb-conjugation',
  'unit-weak-verbs',
  'unit-advanced-analysis',
];

export const SKILL_AREA_TO_UNIT: Record<string, string> = {
  reading_comfort: 'unit-word-categories',
  word_category: 'unit-word-categories',
  sentence_meaning: 'unit-sentence-shapes',
  nominal_verbal: 'unit-nominal-sentence',
  agreement: 'unit-verbal-sentence',
  case_awareness: 'unit-case-foundations',
  conjugation: 'unit-verb-conjugation',
  root_pattern: 'unit-roots-patterns',
  inference: 'unit-advanced-analysis',
  explanation: 'unit-advanced-analysis',
};

const SKILL_AREA_LABEL: Record<string, string> = {
  reading_comfort: 'Reading comfort with vocalized Arabic',
  word_category: 'Recognizing اسم، فعل، حرف',
  sentence_meaning: 'Basic sentence meaning',
  nominal_verbal: 'Nominal vs. verbal sentence recognition',
  agreement: 'Verb–subject and adjective agreement',
  case_awareness: 'Case (إعراب) awareness',
  conjugation: 'Verb conjugation',
  root_pattern: 'Root-and-pattern inference',
  inference: 'Inference from examples',
  explanation: 'Explaining grammatical reasoning',
};

export interface PlacementResponseGraded {
  skillArea: string;
  isCorrect: boolean;
  difficulty: number;
}

export interface PlacementResult {
  accuracyBySkillArea: Record<string, number>;
  recommendedStartUnitCode: string;
  strengths: string[];
  fragilePrerequisites: string[];
  priorityGaps: string[];
  suggestedFirstWeekUnitCode: string;
  estimatedIntensityHint: string;
  confidenceLevel: number;
}

const THRESHOLD = 0.66;

export function scorePlacement(responses: PlacementResponseGraded[]): PlacementResult {
  const bySkill = new Map<string, { correct: number; total: number }>();
  for (const r of responses) {
    const entry = bySkill.get(r.skillArea) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (r.isCorrect) entry.correct += 1;
    bySkill.set(r.skillArea, entry);
  }

  const accuracyBySkillArea: Record<string, number> = {};
  bySkill.forEach((v, k) => {
    accuracyBySkillArea[k] = v.total === 0 ? 0 : v.correct / v.total;
  });

  const strengths: string[] = [];
  const fragilePrerequisites: string[] = [];
  Object.entries(accuracyBySkillArea).forEach(([skill, acc]) => {
    const label = SKILL_AREA_LABEL[skill] ?? skill;
    if (acc >= 0.8) strengths.push(label);
    else if (acc < THRESHOLD) fragilePrerequisites.push(label);
  });

  // Walk the curriculum in prerequisite order; recommend starting at the
  // first unit whose associated skill area fell below threshold (or was
  // never tested — treated conservatively as untested-but-required).
  let recommendedStartUnitCode = UNIT_ORDER[UNIT_ORDER.length - 1];
  for (const unitCode of UNIT_ORDER) {
    const skillsForUnit = Object.entries(SKILL_AREA_TO_UNIT).filter(([, u]) => u === unitCode).map(([s]) => s);
    const relevantAccuracies = skillsForUnit
      .filter((s) => accuracyBySkillArea[s] !== undefined)
      .map((s) => accuracyBySkillArea[s]);
    if (relevantAccuracies.length === 0) continue;
    const avg = relevantAccuracies.reduce((a, b) => a + b, 0) / relevantAccuracies.length;
    if (avg < THRESHOLD) {
      recommendedStartUnitCode = unitCode;
      break;
    }
  }

  const priorityGaps = fragilePrerequisites.slice(0, 3);
  const totalAnswered = responses.length;
  const overallAccuracy =
    totalAnswered === 0 ? 0 : responses.filter((r) => r.isCorrect).length / totalAnswered;
  const confidenceLevel = Math.min(0.95, 0.5 + totalAnswered * 0.02 + overallAccuracy * 0.2);

  return {
    accuracyBySkillArea,
    recommendedStartUnitCode,
    strengths: strengths.length ? strengths : ['Consistent effort across the assessment'],
    fragilePrerequisites,
    priorityGaps: priorityGaps.length ? priorityGaps : ['No major gaps detected — ready to move at a brisk pace'],
    suggestedFirstWeekUnitCode: recommendedStartUnitCode,
    estimatedIntensityHint: overallAccuracy > 0.75 ? 'intensive' : overallAccuracy > 0.5 ? 'standard' : 'light',
    confidenceLevel,
  };
}
