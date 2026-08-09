import fs from 'fs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { serializeObjectLiteral, upsertArrayEntry } from '@/lib/contentEditor/tsArray';
import { LESSONS_FILE, CODE_PATTERN } from '@/lib/contentEditor/paths';

const FIELD_ORDER = [
  'code', 'unitCode', 'title', 'titleArabic', 'summary', 'order', 'estimatedMinutes',
  'concepts', 'observeSentenceCodes', 'discoveryPrompt', 'microExplanation', 'deeperDetail',
];
const ROLES = new Set(['introduces', 'reinforces', 'reviews']);

// Mirrors src/app/api/studio/save-concept/route.ts: writes to content/lessons.ts
// (the durable, git-tracked source) and best-effort mirrors the change into
// the live database so it shows up immediately, without forcing a full
// `db:seed` that would wipe every learner's progress.
export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();

  const code = String(body.code ?? '').trim();
  const unitCode = String(body.unitCode ?? '').trim();
  const title = String(body.title ?? '').trim();
  const titleArabic = String(body.titleArabic ?? '').trim();
  const summary = String(body.summary ?? '').trim();
  const order = Number(body.order);
  const estimatedMinutes = Number(body.estimatedMinutes);
  const discoveryPrompt = String(body.discoveryPrompt ?? '').trim();
  const microExplanation = String(body.microExplanation ?? '').trim();
  const deeperDetail = body.deeperDetail ? String(body.deeperDetail).trim() : undefined;
  const observeSentenceCodes = Array.isArray(body.observeSentenceCodes)
    ? body.observeSentenceCodes.map((s: unknown) => String(s).trim()).filter(Boolean)
    : [];
  const concepts: { conceptCode: string; role: string }[] = Array.isArray(body.concepts)
    ? body.concepts
        .map((c: unknown) => ({ conceptCode: String((c as { conceptCode?: unknown }).conceptCode ?? '').trim(), role: String((c as { role?: unknown }).role ?? 'introduces').trim() }))
        .filter((c: { conceptCode: string }) => c.conceptCode)
    : [];

  if (!CODE_PATTERN.test(code)) {
    return NextResponse.json({ ok: false, error: 'Code must be lowercase, starting with a letter (e.g. l-my-lesson).' }, { status: 400 });
  }
  if (!title || !titleArabic || !summary || !discoveryPrompt || !microExplanation) {
    return NextResponse.json({ ok: false, error: 'Title, Arabic title, summary, discovery prompt, and micro-explanation are all required.' }, { status: 400 });
  }
  if (!Number.isInteger(order) || order < 1) {
    return NextResponse.json({ ok: false, error: 'Order must be a positive whole number.' }, { status: 400 });
  }
  if (!Number.isInteger(estimatedMinutes) || estimatedMinutes < 1) {
    return NextResponse.json({ ok: false, error: 'Estimated minutes must be a positive whole number.' }, { status: 400 });
  }
  if (concepts.length === 0) {
    return NextResponse.json({ ok: false, error: 'A lesson must link at least one concept.' }, { status: 400 });
  }
  for (const c of concepts) {
    if (!ROLES.has(c.role)) {
      return NextResponse.json({ ok: false, error: `"${c.role}" is not a valid concept role (introduces, reinforces, reviews).` }, { status: 400 });
    }
  }

  const unit = await prisma.unit.findUnique({ where: { code: unitCode } });
  if (!unit) {
    return NextResponse.json({ ok: false, error: `No unit with code "${unitCode}".` }, { status: 400 });
  }
  const conceptRows = await prisma.concept.findMany({ where: { code: { in: concepts.map((c) => c.conceptCode) } } });
  const missingConcepts = concepts.filter((c) => !conceptRows.some((r) => r.code === c.conceptCode));
  if (missingConcepts.length > 0) {
    return NextResponse.json({ ok: false, error: `Unknown concept code(s): ${missingConcepts.map((c) => c.conceptCode).join(', ')}.` }, { status: 400 });
  }
  if (observeSentenceCodes.length > 0) {
    const sentenceRows = await prisma.arabicSentence.findMany({ where: { code: { in: observeSentenceCodes } }, select: { code: true } });
    const missingSentences = observeSentenceCodes.filter((s: string) => !sentenceRows.some((r) => r.code === s));
    if (missingSentences.length > 0) {
      return NextResponse.json({ ok: false, error: `Unknown observe-stage sentence code(s): ${missingSentences.join(', ')}.` }, { status: 400 });
    }
  }

  const entryObj = { code, unitCode, title, titleArabic, summary, order, estimatedMinutes, concepts, observeSentenceCodes, discoveryPrompt, microExplanation, deeperDetail };
  const serialized = serializeObjectLiteral(entryObj, FIELD_ORDER, ['concepts', 'observeSentenceCodes']);

  let created = false;
  try {
    const fileText = fs.readFileSync(LESSONS_FILE, 'utf-8');
    const result = upsertArrayEntry(fileText, 'lessons', code, serialized);
    fs.writeFileSync(LESSONS_FILE, result.updatedText, 'utf-8');
    created = result.created;
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Could not update content/lessons.ts: ${(err as Error).message}` }, { status: 500 });
  }

  let dbSynced = true;
  try {
    const observePrompt = JSON.stringify(observeSentenceCodes);
    const discoveryJson = JSON.stringify({ prompt: discoveryPrompt });
    const lesson = await prisma.lesson.upsert({
      where: { code },
      create: { code, unitId: unit.id, title, titleArabic, summary, order, estimatedMinutes, observePrompt, discoveryJson, microExplanation, deeperDetail },
      update: { unitId: unit.id, title, titleArabic, summary, order, estimatedMinutes, observePrompt, discoveryJson, microExplanation, deeperDetail },
    });
    await prisma.lessonConcept.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.lessonConcept.createMany({
      data: concepts.map((c) => ({ lessonId: lesson.id, conceptId: conceptRows.find((r) => r.code === c.conceptCode)!.id, role: c.role })),
    });
  } catch {
    dbSynced = false;
  }

  return NextResponse.json({
    ok: true,
    created,
    dbSynced,
    message: dbSynced
      ? `Saved to content/lessons.ts and applied live. A future \`npm run db:seed\` will keep it.`
      : `Saved to content/lessons.ts, but the live database could not be updated automatically — run \`npm run db:seed\` to apply it (this will reset all learner progress).`,
  });
}
