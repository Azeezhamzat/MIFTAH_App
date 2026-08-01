'use client';

import { useMemo, useState } from 'react';
import ArabicText from '@/components/ArabicText';

interface TokenData {
  id: string;
  position: number;
  surfaceVocalized: string;
  surfaceUnvocalized: string;
  lemma: string | null;
  root: string | null;
  rootMeaning: string | null;
  pattern: string | null;
  prefix: string | null;
  stem: string | null;
  suffix: string | null;
  partOfSpeech: string;
  person: string | null;
  gender: string | null;
  number: string | null;
  definiteness: string | null;
  state: string | null;
  grammaticalCase: string | null;
  mood: string | null;
  role: string;
  marker: string | null;
  markerType: string | null;
  governedByTokenId: string | null;
  translation: string;
  contextualMeaning: string | null;
  explanation: string;
  traditionalExplanation: string | null;
  alternatives: { description: string; isTraditional: boolean; note: string | null }[];
}

interface DependencyData {
  headTokenId: string;
  dependentTokenId: string;
  relation: string;
  explanation: string;
}

interface SentenceData {
  id: string;
  textVocalized: string;
  translationEnglish: string;
  notes: string | null;
  tokens: TokenData[];
  dependencies: DependencyData[];
}

const REASON_STEPS = [
  'What kind of word is this — اسم، فعل، or حرف?',
  'What governs it, if anything?',
  'What syntactic role does it perform in this sentence?',
  'What grammatical state should result from that role (which case or mood)?',
  'What marker expresses that state?',
  'Is that marker visible, secondary, or estimated?',
];

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm text-ink-800 dark:text-ink-100">{value}</p>
    </div>
  );
}

export default function XRayViewer({ sentence }: { sentence: SentenceData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reasonMode, setReasonMode] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const selected = sentence.tokens.find((t) => t.id === selectedId) ?? null;

  const relatedIds = useMemo(() => {
    if (!selected) return new Set<string>();
    const ids = new Set<string>();
    if (selected.governedByTokenId) ids.add(selected.governedByTokenId);
    sentence.dependencies.forEach((d) => {
      if (d.headTokenId === selected.id) ids.add(d.dependentTokenId);
      if (d.dependentTokenId === selected.id) ids.add(d.headTokenId);
    });
    return ids;
  }, [selected, sentence.dependencies]);

  const dependenciesForSelected = selected
    ? sentence.dependencies.filter((d) => d.headTokenId === selected.id || d.dependentTokenId === selected.id)
    : [];

  function selectToken(id: string) {
    setSelectedId(id);
    setRevealedSteps(0);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-serif font-semibold">Iʿrāb X-Ray</h1>
        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input type="checkbox" checked={reasonMode} onChange={(e) => setReasonMode(e.target.checked)} className="rounded" />
          Reason-from-scratch mode
        </label>
      </div>
      <p className="text-sm text-ink-500 mb-6">{sentence.translationEnglish}</p>

      <div dir="rtl" className="card p-6 flex flex-wrap gap-3 justify-start mb-6" lang="ar">
        {sentence.tokens.map((t) => {
          const isSelected = t.id === selectedId;
          const isRelated = relatedIds.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => selectToken(t.id)}
              className={`arabic arabic-lg rounded-lg px-3 py-1.5 border transition-colors ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100'
                  : isRelated
                    ? 'border-gold-500 bg-gold-400/10'
                    : 'border-transparent hover:border-ink-300 dark:hover:border-ink-600'
              }`}
            >
              {t.surfaceVocalized}
            </button>
          );
        })}
      </div>

      {sentence.notes && <p className="text-xs text-ink-400 mb-6 italic">{sentence.notes}</p>}

      {!selected && (
        <div className="card p-8 text-center text-sm text-ink-500">Select a word above to inspect it.</div>
      )}

      {selected && !reasonMode && (
        <div className="card p-6 space-y-5 animate-rise-in">
          <div className="flex items-center justify-between">
            <ArabicText text={selected.surfaceVocalized} size="xl" />
            <span className="text-sm text-ink-500">{selected.translation}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Unvocalized" value={selected.surfaceUnvocalized} />
            <Field label="Lemma" value={selected.lemma} />
            <Field label="Root" value={selected.root ? `${selected.root} (${selected.rootMeaning})` : null} />
            <Field label="Pattern" value={selected.pattern} />
            <Field label="Prefix" value={selected.prefix} />
            <Field label="Stem" value={selected.stem} />
            <Field label="Suffix" value={selected.suffix} />
            <Field label="Part of speech" value={selected.partOfSpeech} />
            <Field label="Person" value={selected.person} />
            <Field label="Gender" value={selected.gender} />
            <Field label="Number" value={selected.number} />
            <Field label="Definiteness" value={selected.definiteness} />
            <Field label="State" value={selected.state} />
            <Field label="Case / mood" value={selected.grammaticalCase ?? selected.mood} />
            <Field label="Marker" value={selected.marker} />
            <Field label="Marker type" value={selected.markerType} />
            <Field label="Contextual meaning" value={selected.contextualMeaning} />
          </div>

          <div className="border-t border-ink-900/10 dark:border-white/10 pt-4">
            <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Syntactic role</p>
            <p className="text-sm font-medium text-ink-900 dark:text-parchment-50">{selected.role}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Plain-English explanation</p>
            <p className="text-sm text-ink-700 dark:text-ink-200">{selected.explanation}</p>
          </div>

          {selected.traditionalExplanation && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Traditional إعراب</p>
              <ArabicText text={selected.traditionalExplanation} className="text-ink-700 dark:text-ink-200" />
            </div>
          )}

          {selected.alternatives.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Alternative analyses</p>
              {selected.alternatives.map((a, i) => (
                <p key={i} className="text-sm text-ink-600 dark:text-ink-300">
                  {a.description} {a.isTraditional && <span className="text-xs text-gold-600">(traditional)</span>}
                </p>
              ))}
            </div>
          )}

          {dependenciesForSelected.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Dependencies</p>
              <ul className="space-y-1">
                {dependenciesForSelected.map((d, i) => {
                  const other = sentence.tokens.find((t) => t.id === (d.headTokenId === selected.id ? d.dependentTokenId : d.headTokenId));
                  const isHead = d.headTokenId === selected.id;
                  const direction = d.relation === 'mubtada_khabar'
                    ? (isHead ? 'is predicated by' : 'is predicated of')
                    : (isHead ? 'governs' : 'is governed by');
                  return (
                    <li key={i} className="text-sm text-ink-600 dark:text-ink-300">
                      <span className="font-medium">{selected.surfaceVocalized}</span> {direction}{' '}
                      <span className="font-medium">{other?.surfaceVocalized}</span> ({d.relation.replace(/_/g, ' ')}) — {d.explanation}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {selected && reasonMode && (
        <div className="card p-6 space-y-4 animate-rise-in">
          <ArabicText text={selected.surfaceVocalized} size="xl" />
          <ol className="space-y-3">
            {REASON_STEPS.slice(0, revealedSteps + 1).map((step, i) => (
              <li key={i} className="text-sm">
                <p className="font-medium text-ink-800 dark:text-ink-100">{i + 1}. {step}</p>
                {i < revealedSteps && (
                  <p className="text-ink-500 mt-1 pl-4 border-l-2 border-jade-400">
                    {
                      [
                        selected.partOfSpeech,
                        selected.governedByTokenId
                          ? sentence.tokens.find((t) => t.id === selected.governedByTokenId)?.surfaceVocalized ?? 'a governing element'
                          : 'Nothing — this is a default (unmarked) case.',
                        selected.role,
                        selected.grammaticalCase ?? selected.mood ?? 'built (مبني) — no case/mood applies',
                        selected.marker ?? 'none (built word)',
                        selected.markerType ?? 'n/a',
                      ][i]
                    }
                  </p>
                )}
              </li>
            ))}
          </ol>
          {revealedSteps < REASON_STEPS.length - 1 ? (
            <button
              onClick={() => setRevealedSteps((r) => r + 1)}
              className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-2.5"
            >
              Reveal next step
            </button>
          ) : (
            <button onClick={() => setReasonMode(false)} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 py-2.5 text-sm font-medium">
              See the full analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
}
