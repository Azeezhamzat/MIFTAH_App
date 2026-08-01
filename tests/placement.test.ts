import { describe, it, expect } from 'vitest';
import { scorePlacement, SKILL_AREA_TO_UNIT, UNIT_ORDER } from '@/lib/placement';

describe('placement: scorePlacement', () => {
  it('recommends starting at the earliest unit whose skill area is below threshold', () => {
    const responses = [
      { skillArea: 'word_category', isCorrect: true, difficulty: 1 },
      { skillArea: 'word_category', isCorrect: true, difficulty: 1 },
      { skillArea: 'nominal_verbal', isCorrect: false, difficulty: 2 },
      { skillArea: 'nominal_verbal', isCorrect: false, difficulty: 2 },
    ];
    const result = scorePlacement(responses);
    expect(result.recommendedStartUnitCode).toBe(SKILL_AREA_TO_UNIT.nominal_verbal);
  });

  it('recommends the most advanced unit when every skill area is strong', () => {
    const responses = Object.keys(SKILL_AREA_TO_UNIT).map((skillArea) => ({ skillArea, isCorrect: true, difficulty: 3 }));
    const result = scorePlacement(responses);
    expect(result.recommendedStartUnitCode).toBe(UNIT_ORDER[UNIT_ORDER.length - 1]);
  });

  it('lists high-accuracy skill areas as strengths and low-accuracy ones as fragile prerequisites', () => {
    const responses = [
      { skillArea: 'word_category', isCorrect: true, difficulty: 1 },
      { skillArea: 'word_category', isCorrect: true, difficulty: 1 },
      { skillArea: 'case_awareness', isCorrect: false, difficulty: 3 },
      { skillArea: 'case_awareness', isCorrect: false, difficulty: 3 },
    ];
    const result = scorePlacement(responses);
    expect(result.strengths.some((s) => /word categor|اسم/i.test(s) || s.includes('اسم'))).toBe(true);
    expect(result.fragilePrerequisites.length).toBeGreaterThan(0);
  });

  it('never returns a confidence above 0.95 or below 0', () => {
    const result = scorePlacement([]);
    expect(result.confidenceLevel).toBeLessThanOrEqual(0.95);
    expect(result.confidenceLevel).toBeGreaterThanOrEqual(0);
  });

  it('increases confidence with more answered questions', () => {
    const few = scorePlacement([{ skillArea: 'word_category', isCorrect: true, difficulty: 1 }]);
    const many = scorePlacement(Array.from({ length: 18 }, () => ({ skillArea: 'word_category', isCorrect: true, difficulty: 1 })));
    expect(many.confidenceLevel).toBeGreaterThan(few.confidenceLevel);
  });
});
