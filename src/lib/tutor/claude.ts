import Anthropic from '@anthropic-ai/sdk';

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

export const SUPPORTED_ANTHROPIC_MODELS = ['claude-haiku-4-5', 'claude-sonnet-5'] as const;
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
