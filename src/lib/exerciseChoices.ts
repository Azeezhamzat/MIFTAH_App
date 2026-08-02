// Turns a subset of exercises from free-text into click-to-answer, without
// any new content-authoring burden for most of them: identify_role and
// identify_governor exercises usually ask "which word in this sentence is
// X" — the sentence's own tokens ARE a natural, always-correct set of
// options, so we derive choices from them instead of typing the answer.
// select_ending exercises use explicitly authored `choices` instead, since
// their two options aren't sentence tokens.
const CHOICE_ELIGIBLE_TYPES = new Set(['select_ending', 'identify_role', 'identify_governor']);

export function isChoiceEligible(type: string): boolean {
  return CHOICE_ELIGIBLE_TYPES.has(type);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function computeChoices(
  exercise: { type: string; expectedAnswer: string; choices: string[] },
  sentenceTokenSurfaceForms: string[] = [],
): string[] {
  if (!isChoiceEligible(exercise.type)) return [];

  if (exercise.choices.length > 0) {
    const options = exercise.choices.includes(exercise.expectedAnswer)
      ? exercise.choices
      : [...exercise.choices, exercise.expectedAnswer];
    return shuffle(options);
  }

  if (sentenceTokenSurfaceForms.length > 0) {
    const unique = Array.from(new Set(sentenceTokenSurfaceForms));
    // Only offer this as multiple-choice if the correct answer is actually
    // one of the clickable options — otherwise silently fall back to free
    // text rather than presenting a set with no right answer in it.
    if (!unique.includes(exercise.expectedAnswer)) return [];
    return shuffle(unique);
  }

  return [];
}
