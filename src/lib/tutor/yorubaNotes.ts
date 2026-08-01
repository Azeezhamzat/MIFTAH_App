/**
 * Verified, reviewed Yoruba-aware contrast notes. Deliberately small and
 * explicit: the Living Teacher must never invent a Yoruba linguistic claim,
 * so it only ever surfaces a note from this vetted list, keyed to the
 * concept it is relevant for, and says so plainly when nothing verified
 * exists for a given question.
 */
export const YORUBA_NOTES: Record<string, string> = {
  'c-irab-concept':
    'Yorùbá does not mark grammatical role with case endings the way Arabic does — word order and tone carry work that Arabic hands to إعراب. That is exactly why the ending-as-evidence-of-role idea can feel unfamiliar at first: there is no direct Yorùbá analogue to translate it through.',
  'c-three-cases':
    'Yorùbá has no case-ending system to map رفع/نصب/جر onto — this is a genuinely new structural dimension for a Yorùbá-speaking learner, not a re-labeling of something Yorùbá already marks.',
  'c-adjective-agreement':
    'Yorùbá does not require a descriptive word to agree with its noun in gender, number, definiteness, and case simultaneously. Expect the four-feature check in this lesson to feel like new mental bookkeeping rather than a habit you can transfer.',
  'c-gender-number-of-nouns':
    'Yorùbá nouns do not carry grammatical gender, and its verbs do not agree with a subject\'s gender at all — so Arabic\'s gender-agreement reflexes will need deliberate practice rather than intuition transfer from Yorùbá.',
  'c-perfect-tense':
    'Yorùbá verbs do not inflect for person, gender, and number the way Arabic verbs do; Yorùbá instead relies on separate pronouns and particles. Expect the idea of a verb "containing" its subject to take conscious practice.',
  'c-dual-and-sound-plurals':
    'Yorùbá has no dual number category at all — only singular and plural — so الـمثنى is a genuinely new grammatical concept, not a variant of a Yorùbá pattern.',
  'c-root-and-pattern':
    'Arabic\'s root-and-pattern system has no equivalent in Yorùbá word formation, which is not templatic in this way — avoid trying to map Yorùbá morphology onto root-and-pattern reasoning; treat it as a new system on its own terms.',
};

export function getYorubaNote(conceptCode?: string): string | null {
  if (!conceptCode) return null;
  return YORUBA_NOTES[conceptCode] ?? null;
}
