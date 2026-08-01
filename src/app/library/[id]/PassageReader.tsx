'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArabicText from '@/components/ArabicText';

interface Passage {
  title: string;
  level: number;
  textVocalized: string;
  vocabPreview: { arabic: string; meaning: string }[];
  comprehensionQuestions: { question: string; answer: string }[];
  recurringStructures: string[];
  sentences: { id: string; textVocalized: string; translationEnglish: string }[];
}

export default function PassageReader({ passage }: { passage: Passage }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold mb-1">{passage.title}</h1>
        <p className="text-xs text-ink-400">Reading level {passage.level} of 9</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Vocabulary preview</h2>
        <div className="flex flex-wrap gap-2">
          {passage.vocabPreview.map((v) => (
            <span key={v.arabic} className="text-sm rounded-full bg-parchment-100 dark:bg-ink-800 px-3 py-1.5">
              <ArabicText text={v.arabic} /> <span className="text-ink-500">— {v.meaning}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="card p-8">
        <ArabicText text={passage.textVocalized} size="lg" as="div" className="leading-loose" />
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Comprehension</h2>
        <div className="space-y-3">
          {passage.comprehensionQuestions.map((q, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{q.question}</p>
                <button
                  onClick={() => setRevealed((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                  className="text-xs text-indigo-700 dark:text-indigo-300 font-medium shrink-0 ml-3"
                >
                  {revealed.has(i) ? 'Hide' : 'Reveal'}
                </button>
              </div>
              {revealed.has(i) && <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 border-t border-ink-900/10 dark:border-white/10 pt-2">{q.answer}</p>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Recurring structures in this passage</h2>
        <div className="flex flex-wrap gap-2">
          {passage.recurringStructures.map((s) => (
            <span key={s} className="text-xs rounded-full bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200 px-3 py-1">{s}</span>
          ))}
        </div>
      </div>

      {passage.sentences.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Syntax map — inspect sentences from this passage</h2>
          <div className="space-y-2">
            {passage.sentences.map((s) => (
              <Link key={s.id} href={`/xray/${s.id}`} className="card p-4 flex items-center justify-between hover:border-jade-400 transition-colors">
                <ArabicText text={s.textVocalized} />
                <span className="text-xs text-indigo-700 dark:text-indigo-300">Open in X-Ray →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
