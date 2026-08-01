'use client';

import { useMemo, useState } from 'react';
import ArabicText from '@/components/ArabicText';

interface RootData { radicals: string; meaningCore: string }
interface PatternData { label: string; skeleton: string; category: string; meaningTendency: string | null }
interface LexemeData {
  vocalized: string; unvocalized: string; meaningEnglish: string; partOfSpeech: string; notes: string | null;
  rootRadicals: string | null; patternLabel: string | null;
}

function mechanicalComposite(radicals: string, skeleton: string): string {
  const [r1, r2, r3] = radicals.split(' ');
  return skeleton.replace(/ف/g, r1 ?? 'ف').replace(/ع/g, r2 ?? 'ع').replace(/ل/g, r3 ?? 'ل');
}

const DEFAULT_ACTIVE_PARTICIPLE_LABEL = 'Active participle (Form I) — فَاعِل';

export default function ForgeExplorer({ roots, patterns, lexemes }: { roots: RootData[]; patterns: PatternData[]; lexemes: LexemeData[] }) {
  const defaultVerified = lexemes.find((l) => l.patternLabel === DEFAULT_ACTIVE_PARTICIPLE_LABEL && l.rootRadicals === 'ك ت ب');
  const [rootRadicals, setRootRadicals] = useState(defaultVerified?.rootRadicals ?? roots[0]?.radicals ?? '');
  const [patternLabel, setPatternLabel] = useState(
    defaultVerified?.patternLabel ?? patterns.find((p) => p.category === 'active_participle')?.label ?? patterns[0]?.label ?? '',
  );
  const [composed, setComposed] = useState(false);

  const root = roots.find((r) => r.radicals === rootRadicals);
  const pattern = patterns.find((p) => p.label === patternLabel);

  const verifiedLexeme = lexemes.find((l) => l.rootRadicals === rootRadicals && l.patternLabel === patternLabel);
  const mechanical = root && pattern ? mechanicalComposite(root.radicals, pattern.skeleton) : '';

  const rootFamily = useMemo(() => lexemes.filter((l) => l.rootRadicals === rootRadicals), [lexemes, rootRadicals]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-ink-400 mb-2">1. Select a root — الجذر</label>
          <select
            value={rootRadicals}
            onChange={(e) => { setRootRadicals(e.target.value); setComposed(false); }}
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            {roots.map((r) => (
              <option key={r.radicals} value={r.radicals}>{r.radicals} — {r.meaningCore}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-ink-400 mb-2">2. Select a pattern — الوزن</label>
          <select
            value={patternLabel}
            onChange={(e) => { setPatternLabel(e.target.value); setComposed(false); }}
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            {patterns.map((p) => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setComposed(true)}
        className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-2.5 transition-colors"
      >
        Insert root into pattern
      </button>

      {composed && (
        <div className="card p-8 text-center animate-rise-in">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">النحو (syntax) is not involved here — this is pure الصرف (morphology)</p>
          <div className={`inline-block ${composed ? 'animate-letter-shift' : ''}`}>
            <ArabicText text={verifiedLexeme?.vocalized ?? mechanical} size="xl" as="div" />
          </div>
          {pattern?.meaningTendency && <p className="text-sm text-ink-500 mt-3">{pattern.meaningTendency}</p>}

          {verifiedLexeme ? (
            <div className="mt-5 pt-5 border-t border-ink-900/10 dark:border-white/10">
              <p className="text-lg font-medium text-jade-700 dark:text-jade-300">{verifiedLexeme.meaningEnglish}</p>
              <p className="text-xs text-ink-400 mt-1">{verifiedLexeme.partOfSpeech}{verifiedLexeme.notes ? ` — ${verifiedLexeme.notes}` : ''}</p>
            </div>
          ) : (
            <div className="mt-5 pt-5 border-t border-ink-900/10 dark:border-white/10">
              <p className="text-sm text-gold-700 dark:text-gold-400">
                This exact combination is not yet in the verified lexicon. Shown above is a mechanical letter-substitution —
                useful for sound roots, but weak roots (hamzated, doubled, hollow, defective) often do <em>not</em> combine this
                simply. Treat it as a hypothesis, not a confirmed word.
              </p>
            </div>
          )}
        </div>
      )}

      {rootFamily.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">
            The verified family of {rootRadicals}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {rootFamily.map((l) => (
              <button
                key={l.vocalized + l.patternLabel}
                onClick={() => l.patternLabel && setPatternLabel(l.patternLabel)}
                className="card p-4 text-left hover:border-jade-400 transition-colors"
              >
                <ArabicText text={l.vocalized} size="lg" />
                <p className="text-sm text-ink-600 dark:text-ink-300">{l.meaningEnglish}</p>
                <p className="text-xs text-ink-400 mt-1">{l.patternLabel ?? 'Irregular / non-derived'}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
