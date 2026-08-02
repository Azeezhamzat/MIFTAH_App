import { describe, it, expect } from 'vitest';
import { domains, stages } from '../content/domains';
import { units } from '../content/units';
import { concepts } from '../content/concepts';
import { roots } from '../content/roots';
import { patterns } from '../content/patterns';
import { lexemes } from '../content/lexemes';
import { allSentences } from '../content/sentences/index';
import { lessons } from '../content/lessons';
import { misconceptions } from '../content/misconceptions';
import { allHandAuthoredExercises } from '../content/exercises/index';

const domainCodes = new Set(domains.map((d) => d.code));
const stageCodes = new Set(stages.map((s) => s.code));
const unitCodes = new Set(units.map((u) => u.code));
const conceptCodes = new Set(concepts.map((c) => c.code));
const rootRadicalSet = new Set(roots.map((r) => r.radicals));
const patternLabelSet = new Set(patterns.map((p) => p.label));
const sentenceCodeSet = new Set(allSentences.map((s) => s.code));
const lessonCodeSet = new Set(lessons.map((l) => l.code));

describe('content integrity: curriculum graph', () => {
  it('every unit references a real domain and stage', () => {
    for (const u of units) {
      expect(domainCodes.has(u.domainCode), `unit ${u.code} -> domain ${u.domainCode}`).toBe(true);
      expect(stageCodes.has(u.stageCode), `unit ${u.code} -> stage ${u.stageCode}`).toBe(true);
    }
  });

  it('every concept prerequisite points to a real concept, with no self-reference', () => {
    for (const c of concepts) {
      for (const prereq of c.prerequisites) {
        expect(conceptCodes.has(prereq), `${c.code} -> prerequisite ${prereq}`).toBe(true);
        expect(prereq).not.toBe(c.code);
      }
    }
  });

  it('has no circular prerequisite chains', () => {
    const byCode = new Map(concepts.map((c) => [c.code, c]));
    for (const start of concepts) {
      const visited = new Set<string>();
      const stack = [...start.prerequisites];
      while (stack.length) {
        const code = stack.pop()!;
        expect(code, `cycle detected involving ${start.code}`).not.toBe(start.code);
        if (visited.has(code)) continue;
        visited.add(code);
        const next = byCode.get(code);
        if (next) stack.push(...next.prerequisites);
      }
    }
  });

  it('every lesson references a real unit and real concepts', () => {
    for (const l of lessons) {
      expect(unitCodes.has(l.unitCode), `lesson ${l.code} -> unit ${l.unitCode}`).toBe(true);
      for (const lc of l.concepts) {
        expect(conceptCodes.has(lc.conceptCode), `lesson ${l.code} -> concept ${lc.conceptCode}`).toBe(true);
      }
      expect(l.concepts.length, `lesson ${l.code} has at least one concept`).toBeGreaterThan(0);
    }
  });

  it('every lesson observe-stage sentence code exists in the sentence bank', () => {
    for (const l of lessons) {
      for (const sc of l.observeSentenceCodes) {
        expect(sentenceCodeSet.has(sc), `lesson ${l.code} -> observe sentence ${sc}`).toBe(true);
      }
    }
  });

  it('every misconception links only to real concepts', () => {
    for (const m of misconceptions) {
      for (const cc of m.conceptCodes) {
        expect(conceptCodes.has(cc), `misconception ${m.code} -> concept ${cc}`).toBe(true);
      }
    }
  });
});

describe('content integrity: exercises', () => {
  it('every hand-authored exercise references a real concept', () => {
    for (const e of allHandAuthoredExercises) {
      expect(conceptCodes.has(e.conceptCode), `exercise "${e.prompt.slice(0, 30)}" -> concept ${e.conceptCode}`).toBe(true);
    }
  });

  it('every hand-authored exercise\'s lesson (if set) really exists', () => {
    for (const e of allHandAuthoredExercises) {
      if (e.lessonCode) expect(lessonCodeSet.has(e.lessonCode), `exercise -> lesson ${e.lessonCode}`).toBe(true);
    }
  });

  it('every hand-authored exercise\'s sentence (if set) really exists', () => {
    for (const e of allHandAuthoredExercises) {
      if (e.sentenceCode) expect(sentenceCodeSet.has(e.sentenceCode), `exercise -> sentence ${e.sentenceCode}`).toBe(true);
    }
  });

  it('every exercise has at least one hint and a non-empty explanation', () => {
    for (const e of allHandAuthoredExercises) {
      expect(e.hints.length, `exercise "${e.prompt.slice(0, 30)}" has hints`).toBeGreaterThan(0);
      expect(e.explanation.length).toBeGreaterThan(0);
    }
  });

  it('every hand-authored choices list actually contains the correct answer', () => {
    for (const e of allHandAuthoredExercises) {
      if (e.choices && e.choices.length > 0) {
        expect(e.choices, `exercise "${e.prompt.slice(0, 30)}" choices include expectedAnswer`).toContain(e.expectedAnswer);
      }
    }
  });
});

describe('content integrity: morphology', () => {
  it('every lexeme\'s root (if set) exists in the root list', () => {
    for (const l of lexemes) {
      if (l.rootRadicals) expect(rootRadicalSet.has(l.rootRadicals), `lexeme ${l.vocalized} -> root ${l.rootRadicals}`).toBe(true);
    }
  });

  it('every lexeme\'s pattern (if set) exists in the pattern list', () => {
    for (const l of lexemes) {
      if (l.patternLabel) expect(patternLabelSet.has(l.patternLabel), `lexeme ${l.vocalized} -> pattern ${l.patternLabel}`).toBe(true);
    }
  });

  it('has at least one lexeme demonstrating each weak-root irregularity category referenced in the roots list', () => {
    const irregularities = new Set(roots.map((r) => r.irregularity).filter(Boolean));
    expect(irregularities).toEqual(new Set(['sound', 'hamzated', 'doubled', 'assimilated', 'hollow', 'defective']));
  });
});

describe('content integrity: sentences and tokens', () => {
  it('every token position within a sentence is unique and sequential from 1', () => {
    for (const s of allSentences) {
      const positions = s.tokens.map((t) => t.position).sort((a, b) => a - b);
      expect(positions, `sentence ${s.code} token positions`).toEqual(Array.from({ length: positions.length }, (_, i) => i + 1));
    }
  });

  it('every governedByPosition points at a real token position in the same sentence', () => {
    for (const s of allSentences) {
      for (const t of s.tokens) {
        if (t.governedByPosition) {
          expect(s.tokens.some((x) => x.position === t.governedByPosition), `sentence ${s.code} token ${t.position} governedBy ${t.governedByPosition}`).toBe(true);
        }
      }
    }
  });

  it('every dependency references real token positions in the same sentence', () => {
    for (const s of allSentences) {
      const positions = new Set(s.tokens.map((t) => t.position));
      for (const dep of s.dependencies) {
        expect(positions.has(dep.headPosition), `sentence ${s.code} dependency head ${dep.headPosition}`).toBe(true);
        expect(positions.has(dep.dependentPosition), `sentence ${s.code} dependency dependent ${dep.dependentPosition}`).toBe(true);
      }
    }
  });

  it('every sentence code is unique', () => {
    expect(sentenceCodeSet.size).toBe(allSentences.length);
  });

  it('meets the minimum seeded content bar for the five core units', () => {
    expect(concepts.length).toBeGreaterThanOrEqual(30);
    expect(lessons.length).toBeGreaterThanOrEqual(30);
    expect(allSentences.length).toBeGreaterThanOrEqual(40);
    expect(roots.length).toBeGreaterThanOrEqual(25);
  });
});
