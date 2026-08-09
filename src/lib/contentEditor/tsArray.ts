// Reads and rewrites a `export const <name>: T[] = [ {...}, {...} ];` array
// literal inside a content/*.ts seed file, so the in-app content-authoring
// editor can persist changes to the git-tracked source of truth instead of
// only the database (which gets fully wiped on every `npm run db:seed`).
//
// This intentionally does not depend on the TypeScript compiler or a full
// AST library — the file shape is simple and constrained enough that a
// small string/bracket-aware scanner is enough, and it keeps this feature
// dependency-free like the rest of the app. It only ever needs to answer
// two questions: "where does this top-level object literal start and end,"
// and "how do I turn a plain JS object back into source text in the same
// style." It does not attempt to parse arbitrary TypeScript.

export class TsArrayError extends Error {}

function skipStringLiteral(text: string, start: number): number {
  const quote = text[start];
  let i = start + 1;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === quote) return i + 1;
    i += 1;
  }
  throw new TsArrayError('Unterminated string literal while scanning content file.');
}

function findMatchingBracket(text: string, openIndex: number): number {
  const open = text[openIndex];
  const close = open === '{' ? '}' : open === '[' ? ']' : null;
  if (!close) throw new TsArrayError(`Unsupported bracket character: ${open}`);
  let depth = 0;
  let i = openIndex;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "'" || ch === '"' || ch === '`') {
      i = skipStringLiteral(text, i);
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  throw new TsArrayError('Unbalanced brackets while scanning content file.');
}

export function locateExportArray(fileText: string, exportName: string): { openBracketIndex: number; closeBracketIndex: number } {
  const re = new RegExp(`export const ${exportName}\\s*:[^=]*=\\s*\\[`);
  const m = re.exec(fileText);
  if (!m) throw new TsArrayError(`Could not find "export const ${exportName}: ...[] = [" in content file.`);
  const openBracketIndex = m.index + m[0].length - 1;
  const closeBracketIndex = findMatchingBracket(fileText, openBracketIndex);
  return { openBracketIndex, closeBracketIndex };
}

export interface EntryRange { start: number; end: number }

export function splitTopLevelObjects(fileText: string, openBracketIndex: number, closeBracketIndex: number): EntryRange[] {
  const entries: EntryRange[] = [];
  let i = openBracketIndex + 1;
  while (i < closeBracketIndex) {
    const ch = fileText[i];
    if (ch === '{') {
      const end = findMatchingBracket(fileText, i);
      entries.push({ start: i, end: end + 1 });
      i = end + 1;
    } else if (ch === "'" || ch === '"' || ch === '`') {
      i = skipStringLiteral(fileText, i);
    } else {
      i += 1;
    }
  }
  return entries;
}

function unescapeSingleQuoted(raw: string): string {
  return raw.replace(/\\(.)/g, (_, c) => (c === 'n' ? '\n' : c));
}

export function findEntryByCode(fileText: string, entries: EntryRange[], code: string): EntryRange | null {
  for (const entry of entries) {
    const entryText = fileText.slice(entry.start, entry.end);
    const match = /code:\s*'((?:\\.|[^'\\])*)'/.exec(entryText);
    if (match && unescapeSingleQuoted(match[1]) === code) return entry;
  }
  return null;
}

function tsString(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
  return `'${escaped}'`;
}

function serializeValue(value: unknown, indent: string): string {
  if (typeof value === 'string') return tsString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every((v) => typeof v === 'string')) {
      return `[${(value as string[]).map(tsString).join(', ')}]`;
    }
    const itemIndent = `${indent}  `;
    const items = (value as Record<string, unknown>[]).map((v) => `${itemIndent}${serializeInlineObject(v)}`);
    return `[\n${items.join(',\n')},\n${indent}]`;
  }
  if (value && typeof value === 'object') {
    return serializeInlineObject(value as Record<string, unknown>);
  }
  throw new TsArrayError(`Cannot serialize value of type ${typeof value} into TypeScript source.`);
}

function serializeInlineObject(obj: Record<string, unknown>): string {
  const parts = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}: ${serializeValue(v, '')}`);
  return `{ ${parts.join(', ')} }`;
}

// Fields whose value should be included in the emitted object even when
// omitted/empty. Everything else in `fieldOrder` is treated as optional and
// dropped from the output when it's undefined, null, or an empty string.
export function serializeObjectLiteral(
  obj: Record<string, unknown>,
  fieldOrder: string[],
  alwaysInclude: string[] = [],
): string {
  const baseIndent = '  ';
  const fieldIndent = `${baseIndent}  `;
  const lines = ['{'];
  for (const key of fieldOrder) {
    if (!(key in obj)) continue;
    const value = obj[key];
    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    if (isEmpty && !alwaysInclude.includes(key)) continue;
    lines.push(`${fieldIndent}${key}: ${serializeValue(value ?? (Array.isArray(value) ? [] : ''), fieldIndent)},`);
  }
  lines.push(`${baseIndent}}`);
  return lines.join('\n');
}

// For array shapes with no stable identifier field to match on (e.g.
// ExerciseSeed, which has no `code`) — always appends, never replaces.
export function appendArrayEntry(fileText: string, exportName: string, serializedEntry: string): string {
  const { openBracketIndex, closeBracketIndex } = locateExportArray(fileText, exportName);
  const entries = splitTopLevelObjects(fileText, openBracketIndex, closeBracketIndex);
  const insertion = entries.length === 0 ? `\n  ${serializedEntry},\n` : `  ${serializedEntry},\n`;
  return fileText.slice(0, closeBracketIndex) + insertion + fileText.slice(closeBracketIndex);
}

export interface UpsertResult { updatedText: string; created: boolean }

// Replaces the entry whose `code` field matches, or appends a new one just
// before the array's closing bracket if no match is found.
export function upsertArrayEntry(
  fileText: string,
  exportName: string,
  code: string,
  serializedEntry: string,
): UpsertResult {
  const { openBracketIndex, closeBracketIndex } = locateExportArray(fileText, exportName);
  const entries = splitTopLevelObjects(fileText, openBracketIndex, closeBracketIndex);
  const existing = findEntryByCode(fileText, entries, code);

  if (existing) {
    const updatedText = fileText.slice(0, existing.start) + serializedEntry + fileText.slice(existing.end);
    return { updatedText, created: false };
  }

  const insertion = entries.length === 0 ? `\n  ${serializedEntry},\n` : `  ${serializedEntry},\n`;
  const updatedText = fileText.slice(0, closeBracketIndex) + insertion + fileText.slice(closeBracketIndex);
  return { updatedText, created: true };
}
