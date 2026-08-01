'use client';

import { useState } from 'react';
import ExercisePlayer, { type ExerciseForPlayer } from '@/components/ExercisePlayer';

interface ClinicItem {
  logId: string;
  status: string;
  detectedAt: string;
  misconception: {
    code: string; title: string; description: string; evidencePattern: string;
    correctModel: string; contrastExample: string; repairGuidance: string;
  };
  repairExercise: ExerciseForPlayer | null;
}

export default function ClinicView({ items }: { items: ClinicItem[] }) {
  const [practicing, setPracticing] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const active = items.filter((i) => i.status === 'active' && !resolved.has(i.logId));
  const past = items.filter((i) => i.status !== 'active' || resolved.has(i.logId));

  async function markRepaired(logId: string) {
    await fetch(`/api/misconceptions/${logId}/resolve`, { method: 'POST' });
    setResolved((prev) => new Set(prev).add(logId));
    setPracticing(null);
  }

  if (items.length === 0) {
    return <div className="card p-8 text-center text-sm text-ink-500">No misconceptions detected yet — keep practicing and this will fill in with real, personalized data.</div>;
  }

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Active ({active.length})</h2>
          <div className="space-y-4">
            {active.map((item) => (
              <div key={item.logId} className="card p-6">
                <p className="font-medium text-ink-900 dark:text-parchment-50">{item.misconception.title}</p>
                <p className="text-sm text-ink-500 mt-1">{item.misconception.description}</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink-400">Your evidence</p>
                    <p className="text-ink-700 dark:text-ink-200">{item.misconception.evidencePattern}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink-400">The correct model</p>
                    <p className="text-ink-700 dark:text-ink-200">{item.misconception.correctModel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink-400">Minimal contrast</p>
                    <p className="text-ink-700 dark:text-ink-200">{item.misconception.contrastExample}</p>
                  </div>
                </div>

                {practicing === item.logId ? (
                  item.repairExercise ? (
                    <div className="mt-4">
                      <ExercisePlayer exercise={item.repairExercise} onNext={() => markRepaired(item.logId)} />
                    </div>
                  ) : (
                    <p className="text-sm text-ink-400 mt-4">No dedicated repair exercise is tagged for this yet — review the contrast above, then mark it addressed.</p>
                  )
                ) : (
                  <button
                    onClick={() => setPracticing(item.logId)}
                    className="mt-4 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2"
                  >
                    Repair this now
                  </button>
                )}
                {practicing === item.logId && !item.repairExercise && (
                  <button onClick={() => markRepaired(item.logId)} className="mt-3 ml-3 text-sm text-jade-700 dark:text-jade-300 font-medium">
                    Mark as addressed
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Previously repaired</h2>
          <div className="space-y-2">
            {past.map((item) => (
              <div key={item.logId} className="card px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-ink-600 dark:text-ink-300">{item.misconception.title}</span>
                <span className="text-xs text-jade-700 dark:text-jade-300">Repaired — will be retested later</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
