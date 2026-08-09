import { describe, it, expect } from 'vitest';
import {
  locateExportArray,
  splitTopLevelObjects,
  findEntryByCode,
  serializeObjectLiteral,
  upsertArrayEntry,
  appendArrayEntry,
  TsArrayError,
} from '@/lib/contentEditor/tsArray';

const SAMPLE = `export interface ThingSeed {
  code: string;
  title: string;
  note?: string;
}

export const things: ThingSeed[] = [
  {
    code: 'a-one',
    title: "It's a title with an apostrophe",
  },
  {
    code: 'a-two',
    title: 'Nested { brace } and [ bracket ] inside a string, and a \\' escaped quote',
    note: 'kept',
  },
];
`;

describe('contentEditor/tsArray: locateExportArray + splitTopLevelObjects', () => {
  it('finds the array bounds and every top-level entry, ignoring braces/brackets inside string literals', () => {
    const { openBracketIndex, closeBracketIndex } = locateExportArray(SAMPLE, 'things');
    const entries = splitTopLevelObjects(SAMPLE, openBracketIndex, closeBracketIndex);
    expect(entries).toHaveLength(2);
    expect(SAMPLE.slice(entries[0].start, entries[0].end)).toContain("code: 'a-one'");
    expect(SAMPLE.slice(entries[1].start, entries[1].end)).toContain("code: 'a-two'");
  });

  it('throws a TsArrayError for a missing export', () => {
    expect(() => locateExportArray(SAMPLE, 'nonexistent')).toThrow(TsArrayError);
  });
});

describe('contentEditor/tsArray: findEntryByCode', () => {
  it('matches by the code field even when other entries contain brace-like characters in strings', () => {
    const { openBracketIndex, closeBracketIndex } = locateExportArray(SAMPLE, 'things');
    const entries = splitTopLevelObjects(SAMPLE, openBracketIndex, closeBracketIndex);
    const found = findEntryByCode(SAMPLE, entries, 'a-two');
    expect(found).not.toBeNull();
    expect(SAMPLE.slice(found!.start, found!.end)).toContain('kept');
  });

  it('returns null for a code that is not present', () => {
    const { openBracketIndex, closeBracketIndex } = locateExportArray(SAMPLE, 'things');
    const entries = splitTopLevelObjects(SAMPLE, openBracketIndex, closeBracketIndex);
    expect(findEntryByCode(SAMPLE, entries, 'a-missing')).toBeNull();
  });
});

describe('contentEditor/tsArray: serializeObjectLiteral', () => {
  it('quotes strings, escapes embedded quotes/newlines, and drops empty optional fields', () => {
    const text = serializeObjectLiteral(
      { code: 'a-three', title: "Has an 'apostrophe' and\na newline", note: '' },
      ['code', 'title', 'note'],
    );
    expect(text).toContain("code: 'a-three',");
    expect(text).toContain("Has an \\'apostrophe\\' and\\na newline");
    expect(text).not.toContain('note:');
  });

  it('always includes fields listed in alwaysInclude even when empty', () => {
    const text = serializeObjectLiteral({ code: 'a-four', tags: [] }, ['code', 'tags'], ['tags']);
    expect(text).toContain('tags: [],');
  });

  it('serializes an array of nested objects across multiple lines', () => {
    const text = serializeObjectLiteral(
      { code: 'a-five', links: [{ id: 'x', role: 'introduces' }, { id: 'y', role: 'reviews' }] },
      ['code', 'links'],
    );
    expect(text).toContain("{ id: 'x', role: 'introduces' }");
    expect(text).toContain("{ id: 'y', role: 'reviews' }");
  });
});

describe('contentEditor/tsArray: upsertArrayEntry', () => {
  it('replaces an existing entry in place without disturbing the rest of the file', () => {
    const newEntry = serializeObjectLiteral({ code: 'a-one', title: 'Updated title' }, ['code', 'title']);
    const { updatedText, created } = upsertArrayEntry(SAMPLE, 'things', 'a-one', newEntry);
    expect(created).toBe(false);
    expect(updatedText).toContain('Updated title');
    expect(updatedText).toContain("code: 'a-two'"); // untouched sibling entry survives
    expect(updatedText).not.toContain("It's a title with an apostrophe");
  });

  it('appends a new entry before the closing bracket when the code does not exist yet', () => {
    const newEntry = serializeObjectLiteral({ code: 'a-brand-new', title: 'Brand new thing' }, ['code', 'title']);
    const { updatedText, created } = upsertArrayEntry(SAMPLE, 'things', 'a-brand-new', newEntry);
    expect(created).toBe(true);
    expect(updatedText).toContain('Brand new thing');
    // still a syntactically plausible array: appended entry lands before the closing "];"
    const appendedIndex = updatedText.indexOf('a-brand-new');
    const closingIndex = updatedText.lastIndexOf('];');
    expect(appendedIndex).toBeGreaterThan(0);
    expect(appendedIndex).toBeLessThan(closingIndex);
  });

  it('round-trips through Function to confirm the produced text is valid JS object syntax', () => {
    const newEntry = serializeObjectLiteral(
      { code: 'a-six', title: "Quote ' and backslash \\ together", note: 'multi\nline' },
      ['code', 'title', 'note'],
    );
    const { updatedText } = upsertArrayEntry(SAMPLE, 'things', 'a-six', newEntry);
    const { openBracketIndex, closeBracketIndex } = locateExportArray(updatedText, 'things');
    const arrayLiteralSource = updatedText.slice(openBracketIndex, closeBracketIndex + 1);
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return ${arrayLiteralSource};`)() as { code: string; title: string; note?: string }[];
    const found = parsed.find((e) => e.code === 'a-six');
    expect(found).toBeDefined();
    expect(found!.title).toBe("Quote ' and backslash \\ together");
    expect(found!.note).toBe('multi\nline');
  });
});

describe('contentEditor/tsArray: appendArrayEntry (for shapes with no stable id field)', () => {
  it('always appends, even for a fresh empty array', () => {
    const empty = `export const items: { title: string }[] = [];\n`;
    const entry = serializeObjectLiteral({ title: 'First one' }, ['title']);
    const updated = appendArrayEntry(empty, 'items', entry);
    const { openBracketIndex, closeBracketIndex } = locateExportArray(updated, 'items');
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return ${updated.slice(openBracketIndex, closeBracketIndex + 1)};`)() as { title: string }[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('First one');
  });

  it('appends after existing entries without touching them', () => {
    const entry = serializeObjectLiteral({ code: 'a-new', title: 'New one' }, ['code', 'title']);
    const updated = appendArrayEntry(SAMPLE, 'things', entry);
    expect(updated).toContain("code: 'a-one'");
    expect(updated).toContain("code: 'a-two'");
    expect(updated).toContain("code: 'a-new'");
  });
});
