'use client';

import { useState } from 'react';
import ArabicText from '@/components/ArabicText';

export interface BreakdownToken {
  position: number;
  surfaceVocalized: string;
  role: string;
  grammaticalCase: string | null;
  mood: string | null;
  marker: string | null;
  translation: string;
  explanation: string;
}

// A compact, word-by-word grammatical breakdown for a single sentence,
// surfaced directly in the lesson flow. The full interactive version of
// this analysis lives in the Iʿrāb X-Ray tool; this is the same underlying
// per-token data (case, role, marker, explanation — already authored and
// linguistically reviewed for every sentence), presented as a simple
// expandable list so a lesson's "why" isn't limited to a short paragraph.
export default function SentenceBreakdown({ tokens }: { tokens: BreakdownToken[] }) {
  const [open, setOpen] = useState(false);

  if (tokens.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-indigo-700 dark:text-indigo-300"
      >
        {open ? 'Hide the word-by-word breakdown' : 'See the word-by-word breakdown →'}
      </button>
      {open && (
        <div className="mt-3 space-y-2 animate-rise-in">
          {tokens.map((t) => (
            <div key={t.position} className="rounded-lg bg-parchment-100 dark:bg-ink-800 px-3 py-2.5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                <ArabicText text={t.surfaceVocalized} size="base" className="font-medium" />
                <span className="text-xs text-ink-500">&ldquo;{t.translation}&rdquo;</span>
                <span className="text-xs uppercase tracking-wide text-jade-700 dark:text-jade-300">{t.role}</span>
                {(t.grammaticalCase || t.mood) && (
                  <span className="text-xs text-ink-400">
                    {t.grammaticalCase ?? t.mood}
                    {t.marker ? ` · ${t.marker}` : ''}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-700 dark:text-ink-200">{t.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
