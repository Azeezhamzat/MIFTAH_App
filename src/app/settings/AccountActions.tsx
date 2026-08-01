'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function AccountActions() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch('/api/account', { method: 'DELETE' });
    await signOut({ callbackUrl: '/' });
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Your data</h2>
      <a
        href="/api/account/export"
        className="block w-full text-center rounded-lg border border-ink-900/10 dark:border-white/10 py-2.5 text-sm font-medium hover:border-jade-400 transition-colors"
      >
        Export my data (JSON)
      </a>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="w-full rounded-lg border border-red-300 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Delete my account
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-red-600">This permanently deletes your account and all learning data. This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(false)} className="flex-1 rounded-lg border border-ink-900/10 dark:border-white/10 py-2 text-sm">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white py-2 text-sm font-medium disabled:opacity-60">
              {deleting ? 'Deleting…' : 'Confirm deletion'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
