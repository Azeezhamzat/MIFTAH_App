const ARABIC_DIACRITICS = /[ً-ْٰٓ-ٟۖ-ۭ]/g;

export function stripArabicDiacritics(text: string): string {
  return text.replace(ARABIC_DIACRITICS, '');
}

export function normalizeArabic(text: string): string {
  return stripArabicDiacritics(text)
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeGeneral(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Grades a short, closed-form answer (multiple choice, single word, short
 * phrase). Tries an Arabic-aware normalized match first, falls back to a
 * general lowercase/whitespace-insensitive match — accepting any of the
 * exercise's listed accepted variants.
 */
export function gradeShortAnswer(
  response: string,
  expectedAnswer: string,
  acceptedVariants: string[] = [],
): { isCorrect: boolean; score: number } {
  const candidates = [expectedAnswer, ...acceptedVariants];
  const normalizedResponseAr = normalizeArabic(response);
  const normalizedResponseGeneral = normalizeGeneral(response);

  const isCorrect = candidates.some((c) => {
    return normalizeArabic(c) === normalizedResponseAr || normalizeGeneral(c) === normalizedResponseGeneral;
  });

  return { isCorrect, score: isCorrect ? 1 : 0 };
}

/**
 * Lenient scoring for free-text explanations: this is not meant to replace
 * expert grading, only to give useful partial-credit feedback. It measures
 * how many of the expected answer's meaningful words appear in the
 * learner's response, after normalization and stopword removal.
 */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'because', 'of', 'to', 'and', 'or', 'it', 'its',
  'this', 'that', 'in', 'on', 'as', 'be', 'by', 'for', 'with', 'not', 'no', 'so', 'than', 'here',
]);

function meaningfulWords(text: string): string[] {
  return normalizeGeneral(text)
    .replace(/[.,!?()"']/g, '')
    .split(' ')
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function gradeFreeText(
  response: string,
  expectedKeyPoints: string[],
): { isCorrect: boolean; score: number; matchedTerms: string[]; missedTerms: string[] } {
  const responseWords = new Set(meaningfulWords(response));
  const expectedWords = Array.from(new Set(expectedKeyPoints.flatMap((e) => meaningfulWords(e))));

  const matchedTerms = expectedWords.filter((w) => responseWords.has(w));
  const missedTerms = expectedWords.filter((w) => !responseWords.has(w));
  const ratio = expectedWords.length === 0 ? 1 : matchedTerms.length / expectedWords.length;

  return {
    isCorrect: ratio >= 0.4,
    score: Math.max(0, Math.min(1, ratio)),
    matchedTerms,
    missedTerms,
  };
}
