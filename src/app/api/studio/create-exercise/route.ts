import fs from 'fs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { serializeObjectLiteral, appendArrayEntry } from '@/lib/contentEditor/tsArray';
import { STUDIO_EXERCISES_FILE } from '@/lib/contentEditor/paths';
import { EXERCISE_TYPES } from '@/lib/contentEditor/exerciseTypeOptions';

const FIELD_ORDER = [
  'lessonCode', 'conceptCode', 'sentenceCode', 'type', 'objective', 'prompt', 'promptArabic',
  'difficulty', 'expectedAnswer', 'acceptedVariants', 'hints', 'explanation',
];

// Create-only: appends to content/exercises/studio.ts. Editing an existing
// hand-authored exercise in place isn't supported yet, since the ~140
// existing exercises are spread across content/exercises/*.ts by theme with
// no stable id field to locate them by (see docs/ROADMAP.md).
export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();

  const lessonCode = body.lessonCode ? String(body.lessonCode).trim() : undefined;
  const conceptCode = String(body.conceptCode ?? '').trim();
  const sentenceCode = body.sentenceCode ? String(body.sentenceCode).trim() : undefined;
  const type = String(body.type ?? '').trim();
  const objective = String(body.objective ?? '').trim();
  const prompt = String(body.prompt ?? '').trim();
  const promptArabic = body.promptArabic ? String(body.promptArabic).trim() : undefined;
  const difficulty = Number(body.difficulty);
  const expectedAnswer = String(body.expectedAnswer ?? '').trim();
  const acceptedVariants = Array.isArray(body.acceptedVariants) ? body.acceptedVariants.map((v: unknown) => String(v).trim()).filter(Boolean) : [];
  const explanation = String(body.explanation ?? '').trim();
  const hints = Array.isArray(body.hints) ? body.hints.map((h: unknown) => String(h).trim()).filter(Boolean) : [];

  if (!(EXERCISE_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ ok: false, error: `"${type}" is not a recognized exercise type.` }, { status: 400 });
  }
  if (!conceptCode) {
    return NextResponse.json({ ok: false, error: 'A concept is required.' }, { status: 400 });
  }
  if (!objective || !prompt || !expectedAnswer || !explanation) {
    return NextResponse.json({ ok: false, error: 'Objective, prompt, expected answer, and explanation are all required.' }, { status: 400 });
  }
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    return NextResponse.json({ ok: false, error: 'Difficulty must be a whole number from 1 to 5.' }, { status: 400 });
  }
  if (hints.length === 0) {
    return NextResponse.json({ ok: false, error: 'At least one hint is required.' }, { status: 400 });
  }

  const concept = await prisma.concept.findUnique({ where: { code: conceptCode } });
  if (!concept) {
    return NextResponse.json({ ok: false, error: `No concept with code "${conceptCode}".` }, { status: 400 });
  }
  let lessonId: string | undefined;
  if (lessonCode) {
    const lesson = await prisma.lesson.findUnique({ where: { code: lessonCode } });
    if (!lesson) return NextResponse.json({ ok: false, error: `No lesson with code "${lessonCode}".` }, { status: 400 });
    lessonId = lesson.id;
  }
  let sentenceId: string | undefined;
  if (sentenceCode) {
    const sentence = await prisma.arabicSentence.findUnique({ where: { code: sentenceCode } });
    if (!sentence) return NextResponse.json({ ok: false, error: `No sentence with code "${sentenceCode}".` }, { status: 400 });
    sentenceId = sentence.id;
  }

  // This form only supports a plain-string expectedAnswer; exercise types
  // whose answer is an array/object (e.g. some reorder or multi-blank
  // variants) aren't authorable here yet — see docs/ROADMAP.md.
  const entryObj = { lessonCode, conceptCode, sentenceCode, type, objective, prompt, promptArabic, difficulty, expectedAnswer, acceptedVariants, hints, explanation };
  const serialized = serializeObjectLiteral(entryObj, FIELD_ORDER, ['hints']);

  try {
    const fileText = fs.readFileSync(STUDIO_EXERCISES_FILE, 'utf-8');
    const updatedText = appendArrayEntry(fileText, 'studioExercises', serialized);
    fs.writeFileSync(STUDIO_EXERCISES_FILE, updatedText, 'utf-8');
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Could not update content/exercises/studio.ts: ${(err as Error).message}` }, { status: 500 });
  }

  let dbSynced = true;
  try {
    const maxOrder = await prisma.exercise.aggregate({ _max: { order: true } });
    const row = await prisma.exercise.create({
      data: {
        lessonId,
        conceptId: concept.id,
        sentenceId,
        type,
        objective,
        prompt,
        promptArabic,
        difficulty,
        expectedAnswer: JSON.stringify(expectedAnswer),
        acceptedVariants: JSON.stringify(acceptedVariants),
        explanation,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });
    for (let i = 0; i < hints.length; i += 1) {
      await prisma.hint.create({ data: { exerciseId: row.id, level: i + 1, text: hints[i] } });
    }
  } catch {
    dbSynced = false;
  }

  return NextResponse.json({
    ok: true,
    dbSynced,
    message: dbSynced
      ? `Saved to content/exercises/studio.ts and applied live. A future \`npm run db:seed\` will keep it.`
      : `Saved to content/exercises/studio.ts, but the live database could not be updated automatically — run \`npm run db:seed\` to apply it (this will reset all learner progress).`,
  });
}
