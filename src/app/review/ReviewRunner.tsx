'use client';

import { useState } from 'react';
import Link from 'next/link';
import ExercisePlayer, { type ExerciseForPlayer } from '@/components/ExercisePlayer';

interface ReviewItem {
  conceptTitle: string;
  reason: string;
  exercise: ExerciseForPlayer;
}

export default function ReviewRunner({ items }: { items: ReviewItem[] }) {
  const [index, setIndex] = useState(0);
  const [showReason, setShowReason] = useState(false);

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-500 text-sm mb-4">You're caught up. Come back when the next review is due — or study something new.</p>
        <Link href="/dashboard" className="inline-block rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium px-6 py-2.5">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (index >= items.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-serif mb-2">Review queue cleared.</p>
        <p className="text-sm text-ink-500 mb-4">Every concept you touched just now has been rescheduled based on how it went.</p>
        <Link href="/dashboard" className="inline-block rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium px-6 py-2.5">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const item = items[index];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{item.conceptTitle}</p>
        <button onClick={() => setShowReason((v) => !v)} className="text-xs text-indigo-700 dark:text-indigo-300">
          Why am I reviewing this?
        </button>
      </div>
      {showReason && (
        <p className="text-xs text-ink-500 bg-parchment-100 dark:bg-ink-800 rounded-lg px-3 py-2 mb-4">{item.reason}</p>
      )}
      <ExercisePlayer key={item.exercise.id} exercise={item.exercise} onNext={() => setIndex((i) => i + 1)} />
    </div>
  );
}
