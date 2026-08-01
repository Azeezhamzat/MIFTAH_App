'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArabicText from '@/components/ArabicText';

const WORKFLOW_STATES = ['draft', 'linguistic_review', 'pedagogical_review', 'yoruba_review', 'technical_validation', 'approved', 'published', 'retired'];

interface Review { id: string; entityType: string; entityId: string; workflowState: string; reviewerNote: string | null; createdAt: string }

export default function StudioBrowser({
  lessons, exercises, sentences, concepts, recentReviews,
}: {
  lessons: { id: string; code: string; title: string; status: string }[];
  exercises: { id: string; type: string; prompt: string }[];
  sentences: { id: string; code: string; text: string; sourceType: string }[];
  concepts: { id: string; code: string; title: string }[];
  recentReviews: Review[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'lessons' | 'exercises' | 'sentences' | 'concepts' | 'reviews'>('lessons');
  const [flagging, setFlagging] = useState<{ type: string; id: string } | null>(null);
  const [note, setNote] = useState('');
  const [workflowState, setWorkflowState] = useState('linguistic_review');

  async function flag() {
    if (!flagging) return;
    await fetch('/api/content-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: flagging.type, entityId: flagging.id, workflowState, reviewerNote: note }),
    });
    setFlagging(null);
    setNote('');
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(['lessons', 'exercises', 'sentences', 'concepts', 'reviews'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm rounded-full px-4 py-1.5 border capitalize ${tab === t ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200' : 'border-ink-900/10 dark:border-white/10'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'lessons' && (
        <div className="space-y-2">
          {lessons.map((l) => (
            <div key={l.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{l.title}</p>
                <p className="text-xs text-ink-400">{l.code} · {l.status}</p>
              </div>
              <button onClick={() => setFlagging({ type: 'lesson', id: l.id })} className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Flag for review</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'exercises' && (
        <div className="space-y-2">
          {exercises.map((e) => (
            <div key={e.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{e.prompt.slice(0, 80)}</p>
                <p className="text-xs text-ink-400">{e.type}</p>
              </div>
              <button onClick={() => setFlagging({ type: 'exercise', id: e.id })} className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Flag for review</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'sentences' && (
        <div className="space-y-2">
          {sentences.map((s) => (
            <div key={s.id} className="card p-4 flex items-center justify-between">
              <div>
                <ArabicText text={s.text} />
                <p className="text-xs text-ink-400 mt-1">{s.code} · {s.sourceType}</p>
              </div>
              <button onClick={() => setFlagging({ type: 'sentence', id: s.id })} className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Flag for review</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'concepts' && (
        <div className="space-y-2">
          {concepts.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <p className="text-sm font-medium">{c.title}</p>
              <button onClick={() => setFlagging({ type: 'concept', id: c.id })} className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Flag for review</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'reviews' && (
        <div className="space-y-2">
          {recentReviews.length === 0 && <p className="text-sm text-ink-500">No review flags yet.</p>}
          {recentReviews.map((r) => (
            <div key={r.id} className="card p-4">
              <p className="text-sm font-medium capitalize">{r.entityType} — {r.workflowState.replace(/_/g, ' ')}</p>
              {r.reviewerNote && <p className="text-xs text-ink-500 mt-1">{r.reviewerNote}</p>}
            </div>
          ))}
        </div>
      )}

      {flagging && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full bg-parchment-50 dark:bg-ink-900">
            <h3 className="font-medium mb-3">Flag {flagging.type} for review</h3>
            <select value={workflowState} onChange={(e) => setWorkflowState(e.target.value)} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm mb-3">
              {WORKFLOW_STATES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reviewer note (optional)" rows={3} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm mb-3" />
            <div className="flex gap-2">
              <button onClick={() => setFlagging(null)} className="flex-1 rounded-lg border border-ink-900/10 dark:border-white/10 py-2 text-sm">Cancel</button>
              <button onClick={flag} className="flex-1 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white py-2 text-sm font-medium">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
