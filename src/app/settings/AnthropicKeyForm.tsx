'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnthropicKeyForm({
  hasKey,
  model,
  validatedAt,
}: {
  hasKey: boolean;
  model: string;
  validatedAt: string | null;
}) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(model);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setStatus('saving');
    setError(null);
    const res = await fetch('/api/settings/anthropic-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model: selectedModel }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus('error');
      setError(data.error ?? 'Could not save the key.');
      return;
    }
    setApiKey('');
    setStatus('idle');
    router.refresh();
  }

  async function remove() {
    setStatus('saving');
    await fetch('/api/settings/anthropic-key', { method: 'DELETE' });
    setStatus('idle');
    router.refresh();
  }

  return (
    <div className="card p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Claude API key (optional)</h2>
        <p className="text-sm text-ink-500 mt-2">
          The app works fully on its own, grounded entirely in verified curriculum data — no key required. If you
          paste your own Anthropic API key, two things unlock: the Living Teacher additionally phrases its answers
          through a real Claude call (strictly constrained to only the facts this app already retrieved), and
          <strong> Content studio → AI drafts</strong> can draft new lessons for you to review and approve. Neither
          ever becomes an independent source of grammatical truth — Claude phrases and drafts; this app&apos;s
          verified data and your explicit approval decide what&apos;s true. Your key never leaves this device except
          in calls you authorize to Anthropic&apos;s API.
        </p>
      </div>

      {hasKey ? (
        <div className="rounded-lg bg-jade-50 dark:bg-jade-900/30 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-jade-800 dark:text-jade-200">Connected — using {model}</p>
            {validatedAt && <p className="text-xs text-ink-500">Verified {new Date(validatedAt).toLocaleDateString()}</p>}
          </div>
          <button onClick={remove} disabled={status === 'saving'} className="text-sm text-red-600 font-medium">
            Remove key
          </button>
        </div>
      ) : (
        <p className="text-sm text-ink-400">Not connected — the grounded rule-based engine is answering on its own.</p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="anthropicModel">Model</label>
        <select
          id="anthropicModel"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
        >
          <option value="claude-haiku-4-5">Claude Haiku 4.5 — fastest, cheapest (recommended for chat)</option>
          <option value="claude-sonnet-5">Claude Sonnet 5 — higher quality, costs more per message</option>
          <option value="claude-opus-5">Claude Opus 5 — most capable, best for drafting new lessons in /studio</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="apiKey">Anthropic API key</label>
        <input
          id="apiKey"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm font-mono"
        />
        <p className="text-xs text-ink-400 mt-1">
          Stored encrypted on this server and never shown again or sent to your browser. Get a key at{' '}
          <span className="font-mono">console.anthropic.com</span>.
        </p>
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button
        onClick={save}
        disabled={status === 'saving' || !apiKey.trim()}
        className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium py-2.5"
      >
        {status === 'saving' ? 'Validating…' : hasKey ? 'Replace key' : 'Save and validate key'}
      </button>
    </div>
  );
}
