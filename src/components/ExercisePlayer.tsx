'use client';

import { useState } from 'react';
import ArabicText from '@/components/ArabicText';
import { gradeShortAnswer, gradeFreeText } from '@/lib/grading';
import type { OfflineGradingData } from '@/lib/offline/types';

export interface ExerciseForPlayer {
  id: string;
  type: string;
  objective: string;
  prompt: string;
  promptArabic?: string | null;
  difficulty: number;
  hints: { level: number; text: string }[];
}

interface Feedback {
  isCorrect: boolean;
  score: number;
  expectedAnswer: string;
  explanation: string;
  invalidPlausible: { answer: string; why: string }[];
  masteryLabel: string;
  misconceptionDetected: { code: string; title: string } | null;
}

export default function ExercisePlayer({
  exercise,
  onNext,
  offlineGrading,
  onOfflineAttempt,
}: {
  exercise: ExerciseForPlayer;
  onNext: () => void;
  /** When set, the exercise is graded locally instead of via the server — used by the /offline study mode. */
  offlineGrading?: OfflineGradingData;
  /** Called with the raw attempt so the caller can queue it for sync once back online. */
  onOfflineAttempt?: (attempt: { response: string; hintsUsed: number; responseTimeMs: number; confidence?: number }) => void;
}) {
  const [response, setResponse] = useState('');
  const [hintsShown, setHintsShown] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  async function submit() {
    setSubmitting(true);
    const hintsUsed = hintsShown;
    const responseTimeMs = Date.now() - startedAt;

    if (offlineGrading) {
      const shortGrade = gradeShortAnswer(response, offlineGrading.expectedAnswer, offlineGrading.acceptedVariants);
      let isCorrect = shortGrade.isCorrect;
      let score = shortGrade.score;
      if (!isCorrect) {
        const freeGrade = gradeFreeText(response, [offlineGrading.expectedAnswer, ...offlineGrading.acceptedVariants]);
        isCorrect = freeGrade.isCorrect;
        score = Math.max(score, freeGrade.score);
      }
      onOfflineAttempt?.({ response, hintsUsed, responseTimeMs, confidence: confidence ?? undefined });
      setFeedback({
        isCorrect,
        score,
        expectedAnswer: offlineGrading.expectedAnswer,
        explanation: offlineGrading.explanation,
        invalidPlausible: offlineGrading.invalidPlausible,
        masteryLabel: 'pending sync',
        misconceptionDetected: null,
      });
      setSubmitting(false);
      return;
    }

    const res = await fetch(`/api/exercises/${exercise.id}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response, hintsUsed, responseTimeMs, confidence }),
    });
    const data = await res.json();
    setFeedback(data);
    setSubmitting(false);
  }

  function reset() {
    setResponse('');
    setHintsShown(0);
    setFeedback(null);
    setConfidence(null);
    onNext();
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-jade-700 dark:text-jade-300">{exercise.type.replace(/_/g, ' ')}</span>
        <span className="text-xs text-ink-400">Difficulty {exercise.difficulty}/5</span>
      </div>
      <p className="text-xs text-ink-400 mb-2">{exercise.objective}</p>
      {exercise.promptArabic && <ArabicText text={exercise.promptArabic} size="lg" as="div" className="mb-3" />}
      <p className="text-base text-ink-900 dark:text-parchment-50 mb-4">{exercise.prompt}</p>

      {!feedback && (
        <>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={3}
            placeholder="Type your answer…"
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
          />

          {exercise.hints.length > 0 && (
            <div className="mb-4 space-y-2">
              {hintsShown < exercise.hints.length && (
                <button
                  onClick={() => setHintsShown((h) => h + 1)}
                  className="text-xs text-indigo-700 dark:text-indigo-300 font-medium"
                >
                  Show hint {hintsShown + 1} of {exercise.hints.length}
                </button>
              )}
              {exercise.hints.slice(0, hintsShown).map((h) => (
                <p key={h.level} className="text-xs bg-parchment-100 dark:bg-ink-800 rounded-lg px-3 py-2 text-ink-600 dark:text-ink-300">
                  💡 {h.text}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={submit}
            disabled={submitting || !response.trim()}
            className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium py-2.5 transition-colors"
          >
            {submitting ? 'Checking…' : 'Submit answer'}
          </button>
        </>
      )}

      {feedback && (
        <div className="space-y-4 animate-rise-in">
          <div className={`rounded-lg px-4 py-3 ${feedback.isCorrect ? 'bg-jade-50 dark:bg-jade-900/30' : 'bg-gold-400/10'}`}>
            <p className={`font-medium text-sm ${feedback.isCorrect ? 'text-jade-800 dark:text-jade-200' : 'text-gold-700 dark:text-gold-400'}`}>
              {feedback.isCorrect ? 'Correct.' : `Partially there (${Math.round(feedback.score * 100)}% match).`}
            </p>
            <p className="text-sm text-ink-700 dark:text-ink-200 mt-1">You answered: <span className="italic">{response || '(blank)'}</span></p>
            {offlineGrading && (
              <p className="text-xs text-ink-500 mt-1">Graded offline — your mastery and review schedule will update once this device is back online and synced.</p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Correct answer</p>
            <p className="text-sm text-ink-800 dark:text-ink-100">{feedback.expectedAnswer}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Why</p>
            <p className="text-sm text-ink-700 dark:text-ink-200">{feedback.explanation}</p>
          </div>

          {feedback.invalidPlausible.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">A tempting but incorrect alternative</p>
              {feedback.invalidPlausible.map((ip) => (
                <p key={ip.answer} className="text-sm text-ink-600 dark:text-ink-300">
                  <span className="font-medium">{ip.answer}</span> — {ip.why}
                </p>
              ))}
            </div>
          )}

          {feedback.misconceptionDetected && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3">
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                Logged to your Misconception Clinic: {feedback.misconceptionDetected.title}
              </p>
            </div>
          )}

          {confidence === null ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">How confident were you?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfidence(c)}
                    className="flex-1 rounded-lg border border-ink-900/10 dark:border-white/10 py-2 text-sm hover:border-jade-400"
                  >
                    {['Guessed', 'Unsure', 'Fairly sure', 'Certain'][c - 1]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={reset}
              className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-2.5 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
