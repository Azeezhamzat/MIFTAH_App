import { describe, it, expect } from 'vitest';
import { normalizeArabic, gradeShortAnswer, gradeFreeText, stripArabicDiacritics } from '@/lib/grading';

describe('grading: stripArabicDiacritics / normalizeArabic', () => {
  it('removes short vowels and tanwin', () => {
    expect(stripArabicDiacritics('كَتَبَ')).toBe('كتب');
    expect(stripArabicDiacritics('مُجْتَهِدٌ')).toBe('مجتهد');
  });

  it('normalizes alef and ta-marbuta variants so accepted variants still match', () => {
    expect(normalizeArabic('إنّ')).toBe(normalizeArabic('ان'));
    expect(normalizeArabic('مدرسة')).toBe(normalizeArabic('مدرسه'));
  });
});

describe('grading: gradeShortAnswer', () => {
  it('accepts an answer that matches after diacritic normalization', () => {
    const result = gradeShortAnswer('الطالب', 'الطَّالِبُ', []);
    expect(result.isCorrect).toBe(true);
  });

  it('accepts any listed accepted variant, not just the primary expected answer', () => {
    const result = gradeShortAnswer('verb', 'فعل (verb)', ['verb', 'فعل']);
    expect(result.isCorrect).toBe(true);
  });

  it('rejects an unrelated answer', () => {
    const result = gradeShortAnswer('حرف', 'فعل (verb)', ['verb', 'فعل']);
    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
  });

  it('is whitespace- and case-insensitive for English answers', () => {
    const result = gradeShortAnswer('  Nominative  ', 'nominative', []);
    expect(result.isCorrect).toBe(true);
  });
});

describe('grading: gradeFreeText', () => {
  it('gives full credit when the response shares all meaningful terms with the expected explanation', () => {
    const result = gradeFreeText(
      'inna governs the noun into the accusative case',
      ['إنّ governs the following noun and forces it into the accusative case'],
    );
    expect(result.score).toBeGreaterThan(0.4);
    expect(result.isCorrect).toBe(true);
  });

  it('gives low credit to a response sharing no meaningful vocabulary', () => {
    const result = gradeFreeText('I like bananas today', ['إنّ governs the following noun into the accusative']);
    expect(result.isCorrect).toBe(false);
  });

  it('reports which expected terms were matched and which were missed', () => {
    const result = gradeFreeText('governs accusative', ['governs the noun into the accusative case']);
    expect(result.matchedTerms).toContain('governs');
    expect(result.matchedTerms).toContain('accusative');
    expect(result.missedTerms.length).toBeGreaterThan(0);
  });
});
