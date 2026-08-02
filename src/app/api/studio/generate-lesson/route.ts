import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { decryptSecret } from '@/lib/crypto';
import { draftLessonWithClaude, isSupportedModel, type AllowedSentence } from '@/lib/tutor/claude';

// Drafts a new lesson using the learner's own Claude key and writes it to
// the database with status: 'draft' — invisible to the learner (see the
// `status: 'published'` filters throughout the app) until a human approves
// it via POST /api/studio/drafts. See draftLessonWithClaude for the safety
// model: Claude may only cite already-verified example sentences, and
// nothing it writes is trusted as grammatical fact without that approval.
export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const conceptCode = String(body.conceptCode ?? '');
  const topicHint = body.topicHint ? String(body.topicHint) : undefined;

  const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId: user.id } });
  if (!learnerProfile?.anthropicApiKeyEncrypted || !isSupportedModel(learnerProfile.anthropicModel)) {
    return NextResponse.json(
      { ok: false, error: 'Connect an Anthropic API key in Settings first — lesson drafting needs a real Claude call.' },
      { status: 400 },
    );
  }

  const concept = await prisma.concept.findUnique({ where: { code: conceptCode } });
  if (!concept) return NextResponse.json({ ok: false, error: 'Unknown concept.' }, { status: 400 });

  // Gather a pool of already-verified sentences to ground the draft in,
  // preferring ones already associated with this concept.
  const [linkedByLesson, linkedByExercise, allSentences] = await Promise.all([
    prisma.lessonConcept.findMany({ where: { conceptId: concept.id }, include: { lesson: true } }),
    prisma.exercise.findMany({ where: { conceptId: concept.id, sentenceId: { not: null } }, include: { sentence: true } }),
    prisma.arabicSentence.findMany({ orderBy: { difficulty: 'asc' }, take: 60 }),
  ]);
  const priorityCodes = new Set<string>();
  for (const lc of linkedByLesson) {
    for (const c of JSON.parse(lc.lesson.observePrompt ?? '[]') as string[]) priorityCodes.add(c);
  }
  for (const e of linkedByExercise) {
    if (e.sentence?.code) priorityCodes.add(e.sentence.code);
  }
  const ranked = [...allSentences].sort((a, b) => Number(priorityCodes.has(b.code ?? '')) - Number(priorityCodes.has(a.code ?? '')));
  const allowedSentences: AllowedSentence[] = ranked
    .filter((s) => !!s.code)
    .slice(0, 20)
    .map((s) => ({ code: s.code!, textVocalized: s.textVocalized, translationEnglish: s.translationEnglish }));

  if (allowedSentences.length === 0) {
    return NextResponse.json({ ok: false, error: 'No verified sentences exist yet to ground a draft in.' }, { status: 400 });
  }

  const apiKey = decryptSecret(learnerProfile.anthropicApiKeyEncrypted);
  const result = await draftLessonWithClaude({
    apiKey,
    model: learnerProfile.anthropicModel,
    concept: { code: concept.code, title: concept.title, titleArabic: concept.titleArabic, definition: concept.definition, whyItMatters: concept.whyItMatters },
    allowedSentences,
    topicHint,
  });

  if (!result.lesson) {
    return NextResponse.json({ ok: false, error: result.error ?? 'Draft generation failed.' }, { status: 422 });
  }
  const draft = result.lesson;

  // Place the new lesson in whichever unit already teaches this concept;
  // otherwise fall back to the first unit in the concept's domain.
  const existingLesson = linkedByLesson[0]?.lesson;
  const unit = existingLesson
    ? await prisma.unit.findUnique({ where: { id: existingLesson.unitId } })
    : await prisma.unit.findFirst({ where: { domainId: concept.domainId }, orderBy: { order: 'asc' } });
  if (!unit) return NextResponse.json({ ok: false, error: 'Could not find a unit to place this lesson in.' }, { status: 500 });

  const maxOrder = await prisma.lesson.aggregate({ where: { unitId: unit.id }, _max: { order: true } });
  const lessonCode = `ai-${concept.code}-${Date.now().toString(36)}`;

  const lesson = await prisma.lesson.create({
    data: {
      unitId: unit.id,
      code: lessonCode,
      title: draft.title,
      titleArabic: draft.titleArabic,
      summary: draft.summary,
      order: (maxOrder._max.order ?? 0) + 1,
      estimatedMinutes: 15,
      status: 'draft',
      observePrompt: JSON.stringify(draft.observeSentenceCodes),
      discoveryJson: JSON.stringify({ prompt: draft.discoveryPrompt }),
      microExplanation: draft.microExplanation,
      deeperDetail: draft.deeperDetail,
      concepts: { create: { conceptId: concept.id, role: existingLesson ? 'reinforces' : 'introduces' } },
    },
  });

  let order = 0;
  for (const e of draft.exercises) {
    order += 1;
    const exerciseSentence = ranked.find((s) => s.code && draft.observeSentenceCodes.includes(s.code));
    const row = await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        conceptId: concept.id,
        sentenceId: exerciseSentence?.id,
        type: e.type,
        status: 'draft',
        objective: e.objective,
        prompt: e.prompt,
        promptArabic: e.promptArabic || null,
        difficulty: e.difficulty,
        expectedAnswer: JSON.stringify(e.expectedAnswer),
        acceptedVariants: JSON.stringify(e.acceptedVariants),
        explanation: e.explanation,
        order,
      },
    });
    for (let i = 0; i < e.hints.length; i += 1) {
      await prisma.hint.create({ data: { exerciseId: row.id, level: i + 1, text: e.hints[i] } });
    }
  }

  return NextResponse.json({ ok: true, lessonId: lesson.id, lessonCode: lesson.code, exerciseCount: draft.exercises.length });
}
