import Anthropic from '@anthropic-ai/sdk';
import { EXERCISE_TYPES } from '@/lib/types';

/**
 * Optional enhancement layer for the Living Teacher: if (and only if) the
 * learner has pasted in their own Anthropic API key, their questions are
 * additionally routed through a real Claude call — strictly constrained to
 * the same grounded facts the rule-based engine already retrieved.
 *
 * This never replaces the grounded engine (src/lib/tutor/engine.ts): that
 * engine still does all retrieval (which concept, which misconception, which
 * token) from this app's verified curriculum data. Claude's only job here is
 * to phrase that already-verified material more naturally, under a system
 * prompt that explicitly forbids adding anything not present in the
 * supplied context — this is what keeps the "not the sole source of
 * grammatical truth" guarantee intact even with a real model in the loop.
 */

export const SUPPORTED_ANTHROPIC_MODELS = ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-5'] as const;
export type SupportedAnthropicModel = (typeof SUPPORTED_ANTHROPIC_MODELS)[number];

export function isSupportedModel(model: string): model is SupportedAnthropicModel {
  return (SUPPORTED_ANTHROPIC_MODELS as readonly string[]).includes(model);
}

export interface ValidateKeyResult {
  valid: boolean;
  error?: string;
}

/** A minimal, cheap request (max_tokens: 1) used only to confirm the key
 * authenticates — run once when the learner saves it in Settings, not on
 * every chat message. */
export async function validateAnthropicApiKey(
  apiKey: string,
  model: SupportedAnthropicModel,
): Promise<ValidateKeyResult> {
  const client = new Anthropic({ apiKey });
  try {
    await client.messages.create({
      model,
      max_tokens: 1,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    return { valid: true };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return { valid: false, error: 'That API key was not accepted by Anthropic.' };
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      return { valid: false, error: `This key does not have access to ${model}.` };
    }
    if (err instanceof Anthropic.RateLimitError) {
      // The key itself is presumably fine; treat as valid so a learner
      // isn't blocked from saving a working key during a busy moment.
      return { valid: true };
    }
    if (err instanceof Anthropic.APIError) {
      return { valid: false, error: `Anthropic returned an error: ${err.message}` };
    }
    return { valid: false, error: 'Could not reach the Anthropic API. Check your connection and try again.' };
  }
}

export interface EnhanceAnswerParams {
  apiKey: string;
  model: SupportedAnthropicModel;
  question: string;
  groundedAnswer: string;
  groundedFacts?: string[];
  uncertain: boolean;
}

/**
 * Asks Claude to phrase the already-retrieved grounded answer more
 * naturally. Returns null (never throws) on any failure, so callers can
 * fall back to the plain grounded answer without interrupting the chat.
 */
export async function enhanceAnswerWithClaude(params: EnhanceAnswerParams): Promise<string | null> {
  const { apiKey, model, question, groundedAnswer, groundedFacts = [], uncertain } = params;
  const client = new Anthropic({ apiKey });

  const systemPrompt = [
    'You are a phrasing layer inside Miftāḥ, an Arabic Naḥw/Ṣarf teaching app.',
    'You do NOT have independent grammatical authority. You must answer using ONLY the verified facts given below.',
    'Do not add, correct, extend, or "improve on" the grammar with anything from your own training — the app\'s curriculum, not you, is the source of truth.',
    'If the verified facts do not actually answer the learner\'s question, say plainly that this app does not have a verified answer for that yet, and suggest what the learner could ask instead. Do not guess.',
    'Keep the answer concise (2-5 sentences unless the facts require a short list), warm, and precise. Use Arabic script for Arabic terms exactly as given in the facts, without altering vocalization.',
    '',
    'Verified facts to draw from:',
    `- ${groundedAnswer}`,
    ...groundedFacts.map((f) => `- ${f}`),
    uncertain ? '\nNote: the grounded engine itself was not confident this fully covers the question — reflect that honestly rather than papering over it.' : '',
  ].join('\n');

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 500,
      ...(model === 'claude-sonnet-5' ? { thinking: { type: 'disabled' as const }, output_config: { effort: 'low' as const } } : {}),
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    });

    if (response.stop_reason === 'refusal') return null;
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    return textBlock?.text?.trim() || null;
  } catch {
    // Any failure (bad key, rate limit, network) — silently fall back to
    // the grounded engine's own answer. The chat must never break because
    // of an optional enhancement.
    return null;
  }
}

/**
 * AI-assisted lesson drafting. This is a fundamentally different trust
 * boundary from enhanceAnswerWithClaude above: there, Claude only rephrases
 * facts the rule engine already verified. Here, Claude is asked to *write*
 * new pedagogical content and exercises — including grammatical claims
 * (expectedAnswer, explanation) — which it has no independent authority to
 * assert as correct.
 *
 * Two structural safeguards keep this consistent with the app's "no
 * unconstrained model as sole source of grammatical truth" rule:
 *   1. Claude may only cite example sentences from a closed list of
 *      already-verified sentence codes passed in — any code it invents is
 *      dropped server-side (validateDraft), never trusted.
 *   2. Every draft this produces is written to the database with
 *      status: 'draft' (see the /api/studio/generate-lesson route) and is
 *      invisible to the learner until a human explicitly approves it in
 *      /studio — Claude drafts, a person still decides what's true enough
 *      to teach.
 */

export interface AllowedSentence {
  code: string;
  textVocalized: string;
  translationEnglish: string;
}

export interface DraftLessonParams {
  apiKey: string;
  model: SupportedAnthropicModel;
  concept: { code: string; title: string; titleArabic: string; definition: string; whyItMatters: string };
  allowedSentences: AllowedSentence[];
  topicHint?: string;
}

export interface DraftedExercise {
  type: string;
  objective: string;
  prompt: string;
  promptArabic: string;
  difficulty: number;
  expectedAnswer: string;
  acceptedVariants: string[];
  explanation: string;
  hints: string[];
}

export interface DraftedLesson {
  title: string;
  titleArabic: string;
  summary: string;
  microExplanation: string;
  deeperDetail: string;
  discoveryPrompt: string;
  observeSentenceCodes: string[];
  exercises: DraftedExercise[];
}

export interface DraftLessonResult {
  lesson?: DraftedLesson;
  error?: string;
}

const DRAFT_LESSON_TOOL: Anthropic.Tool = {
  name: 'draft_lesson',
  description: 'Submit a complete draft lesson for human review.',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'English lesson title.' },
      titleArabic: { type: 'string', description: 'Arabic lesson title, fully vocalized.' },
      summary: { type: 'string', description: 'One-sentence summary of what the lesson teaches.' },
      microExplanation: { type: 'string', description: 'The core explanation shown at the "Name it" stage — 2-4 sentences.' },
      deeperDetail: { type: 'string', description: 'An optional-to-read deeper elaboration, 2-4 more sentences.' },
      discoveryPrompt: { type: 'string', description: 'A guided question inviting the learner to notice the pattern before it is named.' },
      observeSentenceCodes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Two or three sentence codes, chosen ONLY from the provided allowed list, that best illustrate this lesson.',
      },
      exercises: {
        type: 'array',
        minItems: 3,
        maxItems: 6,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', description: `One of: ${EXERCISE_TYPES.join(', ')}` },
            objective: { type: 'string' },
            prompt: { type: 'string', description: 'The exercise question, in English.' },
            promptArabic: { type: 'string', description: 'Arabic text the exercise is about, if any; empty string if none.' },
            difficulty: { type: 'integer', minimum: 1, maximum: 5 },
            expectedAnswer: { type: 'string' },
            acceptedVariants: { type: 'array', items: { type: 'string' } },
            explanation: { type: 'string', description: 'Why that is the correct answer.' },
            hints: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
          },
          required: ['type', 'objective', 'prompt', 'promptArabic', 'difficulty', 'expectedAnswer', 'acceptedVariants', 'explanation', 'hints'],
        },
      },
    },
    required: ['title', 'titleArabic', 'summary', 'microExplanation', 'deeperDetail', 'discoveryPrompt', 'observeSentenceCodes', 'exercises'],
  },
};

function validateDraft(raw: unknown, allowedCodes: Set<string>): DraftLessonResult {
  if (typeof raw !== 'object' || raw === null) return { error: 'Claude returned no usable draft.' };
  const d = raw as Record<string, unknown>;

  const strings: (keyof DraftedLesson)[] = ['title', 'titleArabic', 'summary', 'microExplanation', 'deeperDetail', 'discoveryPrompt'];
  for (const key of strings) {
    if (typeof d[key] !== 'string' || (d[key] as string).trim().length === 0) {
      return { error: `Draft is missing a usable "${key}".` };
    }
  }

  const codes = Array.isArray(d.observeSentenceCodes) ? (d.observeSentenceCodes as unknown[]).filter((c): c is string => typeof c === 'string') : [];
  const validCodes = codes.filter((c) => allowedCodes.has(c));
  if (validCodes.length === 0) {
    return { error: 'Draft did not cite any sentence from the allowed, already-verified list — rejecting rather than trusting an invented example.' };
  }

  if (!Array.isArray(d.exercises) || d.exercises.length < 1) {
    return { error: 'Draft contained no exercises.' };
  }
  const exerciseTypeSet = new Set<string>(EXERCISE_TYPES);
  const exercises: DraftedExercise[] = [];
  for (const raw of d.exercises as unknown[]) {
    if (typeof raw !== 'object' || raw === null) continue;
    const e = raw as Record<string, unknown>;
    if (typeof e.type !== 'string' || !exerciseTypeSet.has(e.type)) continue;
    if (typeof e.objective !== 'string' || !e.objective.trim()) continue;
    if (typeof e.prompt !== 'string' || !e.prompt.trim()) continue;
    if (typeof e.expectedAnswer !== 'string' || !e.expectedAnswer.trim()) continue;
    if (typeof e.explanation !== 'string' || !e.explanation.trim()) continue;
    const hints = Array.isArray(e.hints) ? (e.hints as unknown[]).filter((h): h is string => typeof h === 'string' && h.trim().length > 0) : [];
    if (hints.length === 0) continue;
    const difficulty = typeof e.difficulty === 'number' && e.difficulty >= 1 && e.difficulty <= 5 ? Math.round(e.difficulty) : 2;
    const acceptedVariants = Array.isArray(e.acceptedVariants) ? (e.acceptedVariants as unknown[]).filter((v): v is string => typeof v === 'string') : [];
    exercises.push({
      type: e.type,
      objective: e.objective,
      prompt: e.prompt,
      promptArabic: typeof e.promptArabic === 'string' ? e.promptArabic : '',
      difficulty,
      expectedAnswer: e.expectedAnswer,
      acceptedVariants,
      explanation: e.explanation,
      hints,
    });
  }
  if (exercises.length === 0) {
    return { error: 'None of the drafted exercises passed validation (missing fields or an unrecognized exercise type).' };
  }

  return {
    lesson: {
      title: d.title as string,
      titleArabic: d.titleArabic as string,
      summary: d.summary as string,
      microExplanation: d.microExplanation as string,
      deeperDetail: d.deeperDetail as string,
      discoveryPrompt: d.discoveryPrompt as string,
      observeSentenceCodes: validCodes,
      exercises,
    },
  };
}

export async function draftLessonWithClaude(params: DraftLessonParams): Promise<DraftLessonResult> {
  const { apiKey, model, concept, allowedSentences, topicHint } = params;
  const client = new Anthropic({ apiKey });
  const allowedCodes = new Set(allowedSentences.map((s) => s.code));

  const systemPrompt = [
    'You are drafting a NEW lesson for Miftāḥ, an Arabic Naḥw/Ṣarf teaching app, for a human reviewer to check before it is ever shown to a learner.',
    'You do not have independent grammatical authority. This app never treats an unreviewed model output as verified grammatical truth — your draft is a starting point a human editor will correct or reject, not a finished, trusted lesson.',
    'For "observeSentenceCodes", you MUST choose only from the allowed sentence list below — every one of those sentences has already been linguistically verified. Do NOT invent new Arabic example sentences or cite a code not in this list.',
    'Write in the same register as the rest of the app: precise, warm, assuming an adult learner literate in English with no prior Arabic grammar terminology, following the Observe -> Compare/Infer -> Name -> Practice cycle.',
    '',
    `Target concept: ${concept.title} (${concept.titleArabic}) — ${concept.definition} Why it matters: ${concept.whyItMatters}`,
    topicHint ? `The reviewer asked you to emphasize: ${topicHint}` : '',
    '',
    'Allowed sentences (code — vocalized text — English translation):',
    ...allowedSentences.map((s) => `- ${s.code} — ${s.textVocalized} — ${s.translationEnglish}`),
  ].filter(Boolean).join('\n');

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Draft a lesson for the concept "${concept.title}" and submit it via the draft_lesson tool.` }],
      tools: [DRAFT_LESSON_TOOL],
      tool_choice: { type: 'tool', name: 'draft_lesson' },
    });

    if (response.stop_reason === 'refusal') return { error: 'Claude declined to draft this lesson.' };
    const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'draft_lesson');
    if (!toolUse) return { error: 'Claude did not return a structured draft.' };

    return validateDraft(toolUse.input, allowedCodes);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { error: 'Your Anthropic API key was not accepted.' };
    if (err instanceof Anthropic.RateLimitError) return { error: 'Anthropic rate-limited this request — try again shortly.' };
    if (err instanceof Anthropic.APIError) return { error: `Anthropic returned an error: ${err.message}` };
    return { error: 'Could not reach the Anthropic API. Check your connection and try again.' };
  }
}
