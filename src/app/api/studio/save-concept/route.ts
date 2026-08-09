import fs from 'fs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { serializeObjectLiteral, upsertArrayEntry } from '@/lib/contentEditor/tsArray';
import { CONCEPTS_FILE, CODE_PATTERN } from '@/lib/contentEditor/paths';

const FIELD_ORDER = [
  'code', 'domainCode', 'title', 'titleArabic', 'definition', 'whyItMatters',
  'difficulty', 'order', 'prerequisites', 'nahwWadih', 'tuhfahSaniyyah',
];

// Persists a hand-authored concept to content/concepts.ts (the git-tracked
// source of truth, restored by every `db:seed`), then best-effort mirrors it
// into the live database so the change is visible immediately without
// forcing a full reseed — which would also wipe every learner's progress.
export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();

  const code = String(body.code ?? '').trim();
  const domainCode = String(body.domainCode ?? '').trim();
  const title = String(body.title ?? '').trim();
  const titleArabic = String(body.titleArabic ?? '').trim();
  const definition = String(body.definition ?? '').trim();
  const whyItMatters = String(body.whyItMatters ?? '').trim();
  const difficulty = Number(body.difficulty);
  const order = Number(body.order);
  const prerequisites = Array.isArray(body.prerequisites) ? body.prerequisites.map((p: unknown) => String(p).trim()).filter(Boolean) : [];
  const nahwWadih = body.nahwWadih ? String(body.nahwWadih).trim() : undefined;
  const tuhfahSaniyyah = body.tuhfahSaniyyah ? String(body.tuhfahSaniyyah).trim() : undefined;

  if (!CODE_PATTERN.test(code)) {
    return NextResponse.json({ ok: false, error: 'Code must be lowercase, starting with a letter (e.g. c-my-concept).' }, { status: 400 });
  }
  if (!title || !titleArabic || !definition || !whyItMatters) {
    return NextResponse.json({ ok: false, error: 'Title, Arabic title, definition, and why-it-matters are all required.' }, { status: 400 });
  }
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    return NextResponse.json({ ok: false, error: 'Difficulty must be a whole number from 1 to 5.' }, { status: 400 });
  }
  if (!Number.isInteger(order) || order < 1) {
    return NextResponse.json({ ok: false, error: 'Order must be a positive whole number.' }, { status: 400 });
  }
  if (prerequisites.includes(code)) {
    return NextResponse.json({ ok: false, error: 'A concept cannot list itself as its own prerequisite.' }, { status: 400 });
  }

  const domain = await prisma.domain.findUnique({ where: { code: domainCode } });
  if (!domain) {
    return NextResponse.json({ ok: false, error: `No domain with code "${domainCode}".` }, { status: 400 });
  }
  if (prerequisites.length > 0) {
    const found = await prisma.concept.findMany({ where: { code: { in: prerequisites } }, select: { code: true } });
    const missing = prerequisites.filter((p: string) => !found.some((f) => f.code === p));
    if (missing.length > 0) {
      return NextResponse.json({ ok: false, error: `Unknown prerequisite concept code(s): ${missing.join(', ')}.` }, { status: 400 });
    }
  }

  const entryObj = { code, domainCode, title, titleArabic, definition, whyItMatters, difficulty, order, prerequisites, nahwWadih, tuhfahSaniyyah };
  const serialized = serializeObjectLiteral(entryObj, FIELD_ORDER, ['prerequisites']);

  let created = false;
  try {
    const fileText = fs.readFileSync(CONCEPTS_FILE, 'utf-8');
    const result = upsertArrayEntry(fileText, 'concepts', code, serialized);
    fs.writeFileSync(CONCEPTS_FILE, result.updatedText, 'utf-8');
    created = result.created;
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Could not update content/concepts.ts: ${(err as Error).message}` }, { status: 500 });
  }

  let dbSynced = true;
  try {
    const concept = await prisma.concept.upsert({
      where: { code },
      create: { code, domainId: domain.id, title, titleArabic, definition, whyItMatters, difficulty, order },
      update: { domainId: domain.id, title, titleArabic, definition, whyItMatters, difficulty, order },
    });
    await prisma.conceptPrerequisite.deleteMany({ where: { conceptId: concept.id } });
    if (prerequisites.length > 0) {
      const prereqConcepts = await prisma.concept.findMany({ where: { code: { in: prerequisites } }, select: { id: true } });
      await prisma.conceptPrerequisite.createMany({
        data: prereqConcepts.map((p) => ({ conceptId: concept.id, prerequisiteId: p.id })),
      });
    }
  } catch {
    dbSynced = false;
  }

  return NextResponse.json({
    ok: true,
    created,
    dbSynced,
    message: dbSynced
      ? `Saved to content/concepts.ts and applied live. A future \`npm run db:seed\` will keep it.`
      : `Saved to content/concepts.ts, but the live database could not be updated automatically — run \`npm run db:seed\` to apply it (this will reset all learner progress).`,
  });
}
