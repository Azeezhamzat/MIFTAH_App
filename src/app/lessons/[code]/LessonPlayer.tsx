'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArabicText from '@/components/ArabicText';
import ExercisePlayer, { type ExerciseForPlayer } from '@/components/ExercisePlayer';
import SentenceBreakdown, { type BreakdownToken } from '@/components/SentenceBreakdown';
import type { OfflineGradingData } from '@/lib/offline/types';

type Stage = 'observe' | 'discover' | 'explain' | 'practice' | 'reflect';
const STAGES: Stage[] = ['observe', 'discover', 'explain', 'practice', 'reflect'];

interface LessonData {
  code: string;
  title: string;
  titleArabic: string;
  summary: string;
  unitTitle: string;
  domainTitle: string;
  microExplanation: string;
  deeperDetail?: string | null;
  discoveryPrompt: string;
  concepts: { code: string; title: string; titleArabic: string }[];
  observeSentences: { id: string; textVocalized: string; translationEnglish: string; notes?: string | null; tokens?: BreakdownToken[] }[];
  exercises: ExerciseForPlayer[];
}

export default function LessonPlayer({
  lesson,
  offlineGradingByExerciseId,
  onOfflineAttempt,
}: {
  lesson: LessonData;
  /** When set, exercises are graded locally instead of via the server — used by the /offline study mode. */
  offlineGradingByExerciseId?: Record<string, OfflineGradingData>;
  onOfflineAttempt?: (exerciseId: string, attempt: { response: string; hintsUsed: number; responseTimeMs: number; confidence?: number }) => void;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [showDeeper, setShowDeeper] = useState(false);
  const [discoveryNote, setDiscoveryNote] = useState('');
  const stage = STAGES[stageIndex];

  function next() {
    setStageIndex((i) => Math.min(STAGES.length - 1, i + 1));
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-jade-700 dark:text-jade-300">{lesson.domainTitle} · {lesson.unitTitle}</p>
        <h1 className="text-2xl font-serif font-semibold mt-1">{lesson.title}</h1>
        <ArabicText text={lesson.titleArabic} className="text-ink-500" />
      </div>

      <div className="flex gap-1.5 mb-8">
        {STAGES.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stageIndex ? 'bg-jade-600' : 'bg-ink-100 dark:bg-ink-800'}`} />
        ))}
      </div>

      {stage === 'observe' && (
        <div className="space-y-5 animate-rise-in">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Observe</h2>
          <p className="text-sm text-ink-500">Look at how meaning and structure shift across these examples. No labels yet — just notice.</p>
          {lesson.observeSentences.map((s) => (
            <div key={s.id} className="card p-5">
              <ArabicText text={s.textVocalized} size="lg" as="div" />
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-2">{s.translationEnglish}</p>
            </div>
          ))}
          <button onClick={next} className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-3 transition-colors">
            Continue to discovery
          </button>
        </div>
      )}

      {stage === 'discover' && (
        <div className="space-y-5 animate-rise-in">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Compare & infer</h2>
          <div className="card p-6">
            <p className="text-base text-ink-800 dark:text-ink-100">{lesson.discoveryPrompt}</p>
          </div>
          <textarea
            value={discoveryNote}
            onChange={(e) => setDiscoveryNote(e.target.value)}
            rows={3}
            placeholder="Jot down what you notice (optional, not graded) — this primes the explanation that follows."
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button onClick={next} className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-3 transition-colors">
            Reveal the explanation
          </button>
        </div>
      )}

      {stage === 'explain' && (
        <div className="space-y-5 animate-rise-in">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Name it</h2>
          <div className="card p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {lesson.concepts.map((c) => (
                <span key={c.code} className="text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 px-3 py-1">
                  {c.title} · <ArabicText text={c.titleArabic} />
                </span>
              ))}
            </div>
            <p className="text-base text-ink-800 dark:text-ink-100 leading-relaxed">{lesson.microExplanation}</p>
            {lesson.deeperDetail && (
              <div className="mt-4">
                {!showDeeper ? (
                  <button onClick={() => setShowDeeper(true)} className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                    Go deeper →
                  </button>
                ) : (
                  <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 border-t border-ink-900/10 dark:border-white/10 pt-3">{lesson.deeperDetail}</p>
                )}
              </div>
            )}
          </div>

          {lesson.observeSentences.some((s) => s.tokens && s.tokens.length > 0) && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3">
                Now see it applied, word by word
              </h3>
              <div className="space-y-3">
                {lesson.observeSentences.map((s) => (
                  <div key={s.id} className="card p-5">
                    <ArabicText text={s.textVocalized} size="lg" as="div" />
                    <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">{s.translationEnglish}</p>
                    {s.tokens && <SentenceBreakdown tokens={s.tokens} />}
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={next} className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-3 transition-colors">
            Practice this
          </button>
        </div>
      )}

      {stage === 'practice' && (
        <div className="space-y-5 animate-rise-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Practice</h2>
            <span className="text-xs text-ink-400">{exerciseIndex + 1} / {lesson.exercises.length}</span>
          </div>
          {lesson.exercises.length === 0 ? (
            <p className="text-sm text-ink-500">No practice items are attached to this lesson yet.</p>
          ) : exerciseIndex < lesson.exercises.length ? (
            <ExercisePlayer
              key={lesson.exercises[exerciseIndex].id}
              exercise={lesson.exercises[exerciseIndex]}
              offlineGrading={offlineGradingByExerciseId?.[lesson.exercises[exerciseIndex].id]}
              onOfflineAttempt={onOfflineAttempt ? (attempt) => onOfflineAttempt(lesson.exercises[exerciseIndex].id, attempt) : undefined}
              onNext={() => {
                if (exerciseIndex + 1 < lesson.exercises.length) setExerciseIndex((i) => i + 1);
                else next();
              }}
            />
          ) : null}
        </div>
      )}

      {stage === 'reflect' && (
        <div className="space-y-5 animate-rise-in text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Reflection</h2>
          <div className="card p-8">
            <p className="text-lg font-serif mb-2">Lesson complete.</p>
            <p className="text-sm text-ink-500">
              {lesson.title} has been added to your mastery model and will resurface in your review queue at the right
              interval — not tomorrow by default, but whenever the spacing algorithm judges it will best protect
              retention.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard" className="rounded-lg border border-ink-900/10 dark:border-white/10 py-3 text-sm font-medium hover:border-jade-400 transition-colors">
              Back to dashboard
            </Link>
            <Link href="/review" className="rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white py-3 text-sm font-medium transition-colors">
              Continue to review
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
