'use client';

import { listQueuedAttempts, removeQueuedAttempt, enqueueAttempt } from './db';

export interface SyncSummary {
  attempted: number;
  succeeded: number;
  failed: number;
}

// A module-level lock guards against two triggers firing in the same page
// instance in close succession (e.g. the 'online' event and a mount effect
// both reacting to the same reconnect). It cannot help across separate page
// instances (a navigation mid-sync starts a fresh JS realm), which is why
// each attempt is also dequeued *before* it is POSTed rather than after:
// once removed, a concurrent sync running in a different page instance can
// no longer see it, so the same attempt cannot be sent twice. If the POST
// fails, the attempt is re-queued so it isn't silently lost.
let syncInFlight = false;

export async function syncPendingAttempts(): Promise<SyncSummary> {
  if (syncInFlight) return { attempted: 0, succeeded: 0, failed: 0 };
  syncInFlight = true;
  try {
    const queued = await listQueuedAttempts();
    let succeeded = 0;
    let failed = 0;

    for (const attempt of queued) {
      await removeQueuedAttempt(attempt.localId);
      try {
        const res = await fetch(`/api/exercises/${attempt.exerciseId}/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response: attempt.response,
            hintsUsed: attempt.hintsUsed,
            responseTimeMs: attempt.responseTimeMs,
            confidence: attempt.confidence,
          }),
        });
        if (!res.ok) throw new Error(`Sync failed with status ${res.status}`);
        succeeded += 1;
      } catch {
        await enqueueAttempt(attempt);
        failed += 1;
        // Stop at the first failure — likely still offline — rather than
        // burning through the rest of the queue against a dead connection.
        break;
      }
    }

    return { attempted: queued.length, succeeded, failed };
  } finally {
    syncInFlight = false;
  }
}
