'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArabicText from '@/components/ArabicText';

interface Question {
  code: string;
  skillArea: string;
  prompt: string;
  promptArabic?: string;
  type: 'multiple_choice' | 'short_answer' | 'sorting' | 'free_text';
  options: string[];
  difficulty: number;
}

interface PlacementResult {
  accuracyBySkillArea: Record<string, number>;
  recommendedStartUnitCode: string;
  strengths: string[];
  fragilePrerequisites: string[];
  priorityGaps: string[];
  estimatedIntensityHint: string;
  confidenceLevel: number;
}

export default function PlacementRunner() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textValue, setTextValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  useEffect(() => {
    fetch('/api/placement/questions')
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  if (!questions) {
    return <div className="text-center text-ink-400 py-16">Loading assessment…</div>;
  }
  const qs = questions;

  const current = qs[index];

  async function submitAll(finalAnswers: Record<string, string>) {
    setSubmitting(true);
    const responses = Object.entries(finalAnswers).map(([code, answer]) => ({ code, answer }));
    const res = await fetch('/api/placement/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses }),
    });
    const data = await res.json();
    setResult(data.result);
    setSubmitting(false);
  }

  function recordAndAdvance(answer: string) {
    const next = { ...answers, [current.code]: answer };
    setAnswers(next);
    setTextValue('');
    if (index + 1 < qs.length) {
      setIndex(index + 1);
    } else {
      submitAll(next);
    }
  }

  if (result) {
    return (
      <div className="card p-8 space-y-6 animate-rise-in">
        <div>
          <p className="text-xs uppercase tracking-widest text-jade-700 dark:text-jade-300 mb-1">Assessment complete</p>
          <h2 className="text-xl font-serif font-semibold">Here is where you stand</h2>
          <p className="text-sm text-ink-500 mt-1">Confidence in this placement: {Math.round(result.confidenceLevel * 100)}%</p>
        </div>
        <div>
          <p className="font-medium text-sm mb-1">Demonstrated strengths</p>
          <ul className="text-sm text-ink-600 dark:text-ink-300 list-disc list-inside space-y-0.5">
            {result.strengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-1">Fragile prerequisites</p>
          <ul className="text-sm text-ink-600 dark:text-ink-300 list-disc list-inside space-y-0.5">
            {result.fragilePrerequisites.length ? result.fragilePrerequisites.map((s) => <li key={s}>{s}</li>) : <li>None detected — your foundations look solid.</li>}
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-1">Three priority gaps to close first</p>
          <ul className="text-sm text-ink-600 dark:text-ink-300 list-disc list-inside space-y-0.5">
            {result.priorityGaps.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <p className="text-sm text-ink-500">
          Suggested study intensity: <span className="font-medium text-ink-800 dark:text-ink-100">{result.estimatedIntensityHint}</span>. You can challenge this placement at any time from Settings.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-3 transition-colors"
        >
          Go to my dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-ink-400">Question {index + 1} of {qs.length}</span>
        <div className="h-1.5 w-32 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
          <div className="h-full bg-jade-600 transition-all" style={{ width: `${((index) / qs.length) * 100}%` }} />
        </div>
      </div>

      {current.promptArabic && (
        <ArabicText text={current.promptArabic} size="lg" as="div" className="mb-4 text-ink-900 dark:text-parchment-50" />
      )}
      <p className="text-base text-ink-800 dark:text-ink-100 mb-6">{current.prompt}</p>

      {current.type === 'multiple_choice' ? (
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => recordAndAdvance(opt)}
              disabled={submitting}
              className="w-full text-left rounded-lg border border-ink-900/10 dark:border-white/10 px-4 py-3 text-sm hover:border-jade-500 hover:bg-jade-50 dark:hover:bg-jade-900/20 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={current.type === 'free_text' ? 3 : 1}
            placeholder="Type your answer — or leave blank and continue if you're unsure."
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={() => recordAndAdvance(textValue)}
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
          >
            {submitting ? 'Scoring…' : index + 1 < qs.length ? 'Continue' : 'Finish assessment'}
          </button>
        </div>
      )}
    </div>
  );
}
