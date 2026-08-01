'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArabicText from '@/components/ArabicText';
import MasteryIndicator from '@/components/MasteryIndicator';
import type { MasteryLabel } from '@/lib/types';

interface Item { id: string; arabic: string; meaning: string; root: string | null; note: string | null; masteryLevel: string }
interface Lexeme { id: string; vocalized: string; meaningEnglish: string; rootRadicals: string | null }
interface RootItem { radicals: string; meaningCore: string }

export default function NotebookView({ items, lexemes, roots }: { items: Item[]; lexemes: Lexeme[]; roots: RootItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'notebook' | 'roots'>('notebook');

  const filteredLexemes = search.length > 0 ? lexemes.filter((l) => l.vocalized.includes(search) || l.meaningEnglish.toLowerCase().includes(search.toLowerCase())).slice(0, 8) : [];

  async function addLexeme(lexemeId: string) {
    await fetch('/api/notebook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lexemeId }) });
    setSearch('');
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/notebook/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['notebook', 'roots'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm rounded-full px-4 py-1.5 border ${tab === t ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200' : 'border-ink-900/10 dark:border-white/10'}`}
          >
            {t === 'notebook' ? 'My notebook' : 'Root browser'}
          </button>
        ))}
      </div>

      {tab === 'notebook' && (
        <div className="space-y-6">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the lexicon to add a word…"
              className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
            />
            {filteredLexemes.length > 0 && (
              <div className="absolute z-10 mt-1 w-full card p-2 space-y-1 max-h-64 overflow-y-auto">
                {filteredLexemes.map((l) => (
                  <button key={l.id} onClick={() => addLexeme(l.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-parchment-100 dark:hover:bg-ink-800 flex items-center justify-between">
                    <ArabicText text={l.vocalized} />
                    <span className="text-xs text-ink-500">{l.meaningEnglish}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-ink-500">Your notebook is empty — search above to add your first word.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <ArabicText text={item.arabic} size="lg" />
                    <button onClick={() => remove(item.id)} className="text-xs text-ink-400 hover:text-red-500">Remove</button>
                  </div>
                  <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">{item.meaning}</p>
                  {item.root && <p className="text-xs text-ink-400 mt-1">Root: {item.root}</p>}
                  <div className="mt-2">
                    <MasteryIndicator label={item.masteryLevel as MasteryLabel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'roots' && (
        <div className="grid sm:grid-cols-3 gap-3">
          {roots.map((r) => (
            <div key={r.radicals} className="card p-4">
              <ArabicText text={r.radicals} size="lg" />
              <p className="text-sm text-ink-500 mt-1">{r.meaningCore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
