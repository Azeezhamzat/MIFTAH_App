'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArabicText from '@/components/ArabicText';

const WORKFLOW_STATES = ['draft', 'linguistic_review', 'pedagogical_review', 'yoruba_review', 'technical_validation', 'approved', 'published', 'retired'];

interface Review { id: string; entityType: string; entityId: string; workflowState: string; reviewerNote: string | null; createdAt: string }
interface DraftExercisePreview { id: string; prompt: string; expectedAnswer: string; explanation: string; hints: string[] }
interface DraftLesson {
  id: string; title: string; titleArabic: string; summary: string; microExplanation: string;
  concepts: string[]; exercises: DraftExercisePreview[];
}
interface DraftExercise extends DraftExercisePreview { conceptTitle: string }

export default function StudioBrowser({
  lessons, exercises, sentences, concepts, recentReviews, draftLessons, draftExercises,
}: {
  lessons: { id: string; code: string; title: string; status: string }[];
  exercises: { id: string; type: string; prompt: string }[];
  sentences: { id: string; code: string; text: string; sourceType: string }[];
  concepts: { id: string; code: string; title: string }[];
  recentReviews: Review[];
  draftLessons: DraftLesson[];
  draftExercises: DraftExercise[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'ai' | 'lessons' | 'exercises' | 'sentences' | 'concepts' | 'reviews'>('ai');
  const [flagging, setFlagging] = useState<{ type: string; id: string } | null>(null);
  const [note, setNote] = useState('');
  const [workflowState, setWorkflowState] = useState('linguistic_review');
  const [genConceptCode, setGenConceptCode] = useState(concepts[0]?.code ?? '');
  const [genTopicHint, setGenTopicHint] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);

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

  async function generateLesson() {
    setGenerating(true);
    setGenError(null);
    setGenSuccess(null);
    const res = await fetch('/api/studio/generate-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptCode: genConceptCode, topicHint: genTopicHint || undefined }),
    });
    const data = await res.json();
    setGenerating(false);
    if (!res.ok || !data.ok) {
      setGenError(data.error ?? 'Generation failed.');
      return;
    }
    setGenSuccess(`Draft lesson created (${data.exerciseCount} exercises) — review it below before it goes live.`);
    setGenTopicHint('');
    router.refresh();
  }

  async function reviewDraft(entityType: 'lesson' | 'exercise', id: string, action: 'approve' | 'reject') {
    setReviewing(id);
    await fetch('/api/studio/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, id, action }),
    });
    setReviewing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(['ai', 'lessons', 'exercises', 'sentences', 'concepts', 'reviews'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm rounded-full px-4 py-1.5 border capitalize ${tab === t ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200' : 'border-ink-900/10 dark:border-white/10'}`}>
            {t === 'ai' ? `AI drafts (${draftLessons.length + draftExercises.length})` : t}
          </button>
        ))}
      </div>

      {tab === 'ai' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-medium mb-1">Draft a new lesson with Claude</h3>
            <p className="text-xs text-ink-500 mb-4">
              Claude may only cite already-verified example sentences and never becomes the source of grammatical
              truth — everything it writes lands here as a draft, invisible to the learner until you approve it.
              Requires an Anthropic API key connected in Settings.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <select value={genConceptCode} onChange={(e) => setGenConceptCode(e.target.value)} className="rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm">
                {concepts.map((c) => <option key={c.code} value={c.code}>{c.title}</option>)}
              </select>
              <input
                value={genTopicHint}
                onChange={(e) => setGenTopicHint(e.target.value)}
                placeholder="Optional emphasis, e.g. 'more reading-comprehension style'"
                className="rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <button onClick={generateLesson} disabled={generating || !genConceptCode} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-5 py-2 text-sm">
              {generating ? 'Drafting…' : 'Draft lesson'}
            </button>
            {genError && <p className="text-sm text-red-600 mt-2">{genError}</p>}
            {genSuccess && <p className="text-sm text-jade-700 dark:text-jade-300 mt-2">{genSuccess}</p>}
          </div>

          {draftLessons.length === 0 && draftExercises.length === 0 && (
            <p className="text-sm text-ink-500">No AI drafts waiting for review.</p>
          )}

          {draftLessons.map((l) => (
            <div key={l.id} className="card p-5 border border-gold-400/40">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold-700 dark:text-gold-400">Draft lesson · {l.concepts.join(', ')}</p>
                  <p className="font-medium">{l.title}</p>
                  <ArabicText text={l.titleArabic} className="text-ink-500" />
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => reviewDraft('lesson', l.id, 'reject')} disabled={reviewing === l.id} className="text-xs font-medium text-red-600 disabled:opacity-50">Reject</button>
                  <button onClick={() => reviewDraft('lesson', l.id, 'approve')} disabled={reviewing === l.id} className="text-xs font-medium text-jade-700 dark:text-jade-300 disabled:opacity-50">Approve & publish</button>
                </div>
              </div>
              <p className="text-sm text-ink-600 dark:text-ink-300 mb-3">{l.summary}</p>
              <p className="text-sm text-ink-700 dark:text-ink-200 mb-3">{l.microExplanation}</p>
              <details>
                <summary className="cursor-pointer text-xs text-ink-400">{l.exercises.length} draft exercises</summary>
                <div className="mt-2 space-y-2">
                  {l.exercises.map((e) => (
                    <div key={e.id} className="text-xs bg-parchment-100 dark:bg-ink-800 rounded-lg px-3 py-2">
                      <p className="text-ink-700 dark:text-ink-200">{e.prompt}</p>
                      <p className="text-ink-500 mt-1">Answer: {e.expectedAnswer}</p>
                      <p className="text-ink-500">{e.explanation}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}

          {draftExercises.map((e) => (
            <div key={e.id} className="card p-5 border border-gold-400/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold-700 dark:text-gold-400">Draft exercise · {e.conceptTitle}</p>
                  <p className="text-sm text-ink-800 dark:text-ink-100 mt-1">{e.prompt}</p>
                  <p className="text-xs text-ink-500 mt-1">Answer: {e.expectedAnswer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => reviewDraft('exercise', e.id, 'reject')} disabled={reviewing === e.id} className="text-xs font-medium text-red-600 disabled:opacity-50">Reject</button>
                  <button onClick={() => reviewDraft('exercise', e.id, 'approve')} disabled={reviewing === e.id} className="text-xs font-medium text-jade-700 dark:text-jade-300 disabled:opacity-50">Approve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
