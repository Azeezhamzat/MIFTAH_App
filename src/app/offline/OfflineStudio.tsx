'use client';

import { useEffect, useState, useCallback } from 'react';
import ArabicText from '@/components/ArabicText';
import ExercisePlayer, { type ExerciseForPlayer } from '@/components/ExercisePlayer';
import LessonPlayer from '@/app/lessons/[code]/LessonPlayer';
import type { OfflineBundle, QueuedAttempt } from '@/lib/offline/types';
import { saveBundle, loadBundle, clearBundle, enqueueAttempt, listQueuedAttempts } from '@/lib/offline/db';
import { syncPendingAttempts } from '@/lib/offline/sync';

type View = { kind: 'home' } | { kind: 'lesson'; code: string } | { kind: 'exercise'; id: string };

export default function OfflineStudio() {
  const [bundle, setBundle] = useState<OfflineBundle | null>(null);
  const [loadingBundle, setLoadingBundle] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueuedAttempt[]>([]);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [view, setView] = useState<View>({ kind: 'home' });

  const refreshQueue = useCallback(async () => {
    setQueue(await listQueuedAttempts());
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    (async () => {
      setBundle(await loadBundle());
      await refreshQueue();
      setLoadingBundle(false);
    })();
  }, [refreshQueue]);

  const runSync = useCallback(async () => {
    if (!navigator.onLine) {
      setSyncStatus('Still offline — nothing was synced.');
      return;
    }
    setSyncing(true);
    const summary = await syncPendingAttempts();
    await refreshQueue();
    setSyncing(false);
    if (summary.attempted === 0) setSyncStatus('Nothing to sync.');
    else setSyncStatus(`Synced ${summary.succeeded} of ${summary.attempted} queued attempt${summary.attempted === 1 ? '' : 's'}.`);
  }, [refreshQueue]);

  useEffect(() => {
    if (isOnline) runSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  async function download() {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch('/api/offline/bundle');
      if (!res.ok) throw new Error('Could not reach the server.');
      const data = (await res.json()) as OfflineBundle;
      await saveBundle(data);
      setBundle(data);
    } catch {
      setDownloadError('Download failed — you need to be online at least once to download the curriculum for offline use.');
    } finally {
      setDownloading(false);
    }
  }

  async function removeDownload() {
    await clearBundle();
    setBundle(null);
    setView({ kind: 'home' });
  }

  async function queueAttempt(exerciseId: string, attempt: { response: string; hintsUsed: number; responseTimeMs: number; confidence?: number }) {
    await enqueueAttempt({ localId: `${exerciseId}-${Date.now()}-${Math.random().toString(36).slice(2)}`, exerciseId, ...attempt, queuedAt: new Date().toISOString() });
    await refreshQueue();
  }

  if (loadingBundle) {
    return <p className="text-sm text-ink-400">Loading…</p>;
  }

  const statusBar = (
    <div className="card p-4 flex items-center justify-between mb-6 text-sm">
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-jade-500' : 'bg-gold-500'}`} />
        <span className="text-ink-600 dark:text-ink-300">{isOnline ? 'Online' : 'Offline'}</span>
        {queue.length > 0 && (
          <span className="text-ink-400">· {queue.length} attempt{queue.length === 1 ? '' : 's'} waiting to sync</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {syncStatus && <span className="text-xs text-ink-400">{syncStatus}</span>}
        <button
          onClick={runSync}
          disabled={syncing || !isOnline}
          className="text-xs font-medium text-indigo-700 dark:text-indigo-300 disabled:opacity-50"
        >
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
      </div>
    </div>
  );

  if (!bundle) {
    return (
      <div>
        {statusBar}
        <div className="card p-8 text-center">
          <h2 className="text-lg font-serif font-semibold mb-2">Download the curriculum for offline use</h2>
          <p className="text-sm text-ink-500 mb-5 max-w-md mx-auto">
            This saves every lesson and every exercise to this device, so you can keep studying with no connection at
            all. Answers travel with the download so grading can happen locally — your mastery and review schedule
            update once you are back online and this page syncs.
          </p>
          <button
            onClick={download}
            disabled={downloading}
            className="rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-6 py-3"
          >
            {downloading ? 'Downloading…' : 'Download for offline use'}
          </button>
          {downloadError && <p className="text-sm text-red-600 mt-3">{downloadError}</p>}
        </div>
      </div>
    );
  }

  if (view.kind === 'lesson') {
    const lesson = bundle.lessons.find((l) => l.code === view.code);
    if (!lesson) return null;
    const exercises: ExerciseForPlayer[] = lesson.exerciseIds
      .map((id) => bundle.exercises.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .map((e) => ({ id: e.id, type: e.type, objective: e.objective, prompt: e.prompt, promptArabic: e.promptArabic, difficulty: e.difficulty, hints: e.hints, choices: e.choices }));
    const gradingByExerciseId = Object.fromEntries(lesson.exerciseIds.map((id) => [id, bundle.grading[id]]).filter(([, g]) => g));

    return (
      <div>
        {statusBar}
        <button onClick={() => setView({ kind: 'home' })} className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-4">
          ← Back to offline library
        </button>
        <LessonPlayer
          lesson={{
            code: lesson.code, title: lesson.title, titleArabic: lesson.titleArabic, summary: lesson.summary,
            unitTitle: lesson.unitTitle, domainTitle: lesson.domainTitle, microExplanation: lesson.microExplanation,
            deeperDetail: lesson.deeperDetail, discoveryPrompt: lesson.discoveryPrompt, concepts: lesson.concepts,
            observeSentences: lesson.observeSentences, exercises,
          }}
          offlineGradingByExerciseId={gradingByExerciseId}
          onOfflineAttempt={queueAttempt}
        />
      </div>
    );
  }

  if (view.kind === 'exercise') {
    const exercise = bundle.exercises.find((e) => e.id === view.id);
    const grading = bundle.grading[view.id];
    if (!exercise || !grading) return null;
    return (
      <div className="max-w-2xl mx-auto px-6 py-4">
        {statusBar}
        <button onClick={() => setView({ kind: 'home' })} className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-4">
          ← Back to offline library
        </button>
        <ExercisePlayer
          exercise={exercise}
          offlineGrading={grading}
          onOfflineAttempt={(attempt) => queueAttempt(exercise.id, attempt)}
          onNext={() => setView({ kind: 'home' })}
        />
      </div>
    );
  }

  const exercisesByConcept = new Map<string, { title: string; exercises: typeof bundle.exercises }>();
  for (const e of bundle.exercises) {
    if (!exercisesByConcept.has(e.conceptCode)) exercisesByConcept.set(e.conceptCode, { title: e.conceptTitle, exercises: [] });
    exercisesByConcept.get(e.conceptCode)!.exercises.push(e);
  }

  return (
    <div>
      {statusBar}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-400">
          Downloaded {new Date(bundle.generatedAt).toLocaleString()} · {bundle.lessons.length} lessons ·{' '}
          {bundle.exercises.length} exercises
        </p>
        <div className="flex gap-3">
          <button onClick={download} disabled={downloading} className="text-xs font-medium text-indigo-700 dark:text-indigo-300 disabled:opacity-50">
            {downloading ? 'Refreshing…' : 'Refresh download'}
          </button>
          <button onClick={removeDownload} className="text-xs font-medium text-red-600">Remove downloaded data</button>
        </div>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Lessons</h2>
      <div className="grid gap-2 mb-8">
        {bundle.lessons.map((l) => (
          <button
            key={l.code}
            onClick={() => setView({ kind: 'lesson', code: l.code })}
            className="card p-4 text-left hover:border-jade-400 border border-transparent transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-jade-700 dark:text-jade-300">{l.domainTitle} · {l.unitTitle}</p>
            <p className="font-medium">{l.title}</p>
            <ArabicText text={l.titleArabic} className="text-sm text-ink-500" />
          </button>
        ))}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Practice any exercise</h2>
      <div className="space-y-4">
        {Array.from(exercisesByConcept.entries()).map(([code, group]) => (
          <details key={code} className="card p-4">
            <summary className="cursor-pointer font-medium">{group.title} ({group.exercises.length})</summary>
            <div className="mt-3 grid gap-1.5">
              {group.exercises.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setView({ kind: 'exercise', id: e.id })}
                  className="text-left text-sm text-ink-600 dark:text-ink-300 hover:text-jade-700 dark:hover:text-jade-300 truncate"
                >
                  {e.prompt}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
