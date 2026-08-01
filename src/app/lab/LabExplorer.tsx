'use client';

import { useMemo, useState } from 'react';
import ArabicText from '@/components/ArabicText';

interface TokenLite {
  position: number;
  surfaceVocalized: string;
  lemma: string | null;
  role: string;
  grammaticalCase: string | null;
  mood: string | null;
  marker: string | null;
  explanation: string;
}
interface SentenceLite {
  code: string;
  textVocalized: string;
  translationEnglish: string;
  tokens: TokenLite[];
}
interface Family {
  code: string;
  title: string;
  featureAxis: string;
  description: string;
  variants: { sentenceCode: string; label: string }[];
}
interface BrokenExample {
  code: string;
  textVocalized: string;
  attemptedMeaning: string;
  whyItFails: string;
}

function stripTanwin(s: string) {
  return s.replace(/[ًٌٍَُِّْـ]/g, '');
}

function align(base: TokenLite[], variant: TokenLite[]) {
  return base.map((bt) => {
    const match = variant.find((vt) => (vt.lemma && bt.lemma && vt.lemma === bt.lemma) || stripTanwin(vt.surfaceVocalized).includes(stripTanwin(bt.surfaceVocalized).slice(0, 3)));
    return { base: bt, variant: match ?? null };
  });
}

export default function LabExplorer({
  families,
  sentenceByCode,
  brokenExamples,
}: {
  families: Family[];
  sentenceByCode: Record<string, SentenceLite>;
  brokenExamples: BrokenExample[];
}) {
  const [familyCode, setFamilyCode] = useState(families[0].code);
  const [variantIndex, setVariantIndex] = useState(0);
  const [revealedBroken, setRevealedBroken] = useState<Set<string>>(new Set());

  const family = families.find((f) => f.code === familyCode)!;
  const baseSentence = sentenceByCode[family.variants[0].sentenceCode];
  const currentSentence = sentenceByCode[family.variants[variantIndex].sentenceCode];

  const diffs = useMemo(() => {
    if (!baseSentence || !currentSentence || variantIndex === 0) return [];
    const aligned = align(baseSentence.tokens, currentSentence.tokens);
    return aligned
      .filter((a) => a.variant && (a.variant.grammaticalCase !== a.base.grammaticalCase || a.variant.role !== a.base.role || a.variant.marker !== a.base.marker))
      .map((a) => ({
        word: a.variant!.surfaceVocalized,
        before: { role: a.base.role, case: a.base.grammaticalCase, marker: a.base.marker },
        after: { role: a.variant!.role, case: a.variant!.grammaticalCase, marker: a.variant!.marker },
        explanation: a.variant!.explanation,
      }));
  }, [baseSentence, currentSentence, variantIndex]);

  const insertedWords = useMemo(() => {
    if (!baseSentence || !currentSentence) return [];
    return currentSentence.tokens.filter(
      (vt) => !baseSentence.tokens.some((bt) => (bt.lemma && vt.lemma && bt.lemma === vt.lemma) || stripTanwin(bt.surfaceVocalized).slice(0, 3) === stripTanwin(vt.surfaceVocalized).slice(0, 3)),
    );
  }, [baseSentence, currentSentence]);

  function toggleReveal(code: string) {
    setRevealedBroken((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {families.map((f) => (
          <button
            key={f.code}
            onClick={() => { setFamilyCode(f.code); setVariantIndex(0); }}
            className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${
              f.code === familyCode ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200' : 'border-ink-900/10 dark:border-white/10 text-ink-600 dark:text-ink-300'
            }`}
          >
            {f.title}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <p className="text-xs uppercase tracking-widest text-ink-400 mb-1">{family.featureAxis}</p>
        <p className="text-sm text-ink-600 dark:text-ink-300 mb-4">{family.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {family.variants.map((v, i) => (
            <button
              key={v.sentenceCode}
              onClick={() => setVariantIndex(i)}
              className={`text-sm rounded-lg px-3 py-1.5 border transition-colors ${
                i === variantIndex ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200' : 'border-ink-900/10 dark:border-white/10'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {currentSentence ? (
          <div className="animate-rise-in">
            <ArabicText text={currentSentence.textVocalized} size="xl" as="div" className="mb-2" />
            <p className="text-sm text-ink-600 dark:text-ink-300 mb-4">{currentSentence.translationEnglish}</p>

            {variantIndex === 0 ? (
              <p className="text-sm text-ink-400 italic">This is the baseline — pick another tab to see what changes.</p>
            ) : (
              <div className="space-y-3">
                {insertedWords.length > 0 && (
                  <p className="text-sm text-gold-700 dark:text-gold-400">
                    Inserted: {insertedWords.map((w) => w.surfaceVocalized).join(', ')}
                  </p>
                )}
                {diffs.length === 0 && insertedWords.length === 0 && (
                  <p className="text-sm text-ink-400">No case or role changes detected between these two variants.</p>
                )}
                {diffs.map((d) => (
                  <div key={d.word} className="rounded-lg bg-parchment-100 dark:bg-ink-800 px-4 py-3">
                    <p className="text-sm font-medium text-ink-900 dark:text-parchment-50 mb-1">
                      <ArabicText text={d.word} />
                    </p>
                    <p className="text-xs text-ink-500">
                      {d.before.role} ({d.before.case ?? 'no case'}) → <span className="font-medium text-jade-700 dark:text-jade-300">{d.after.role} ({d.after.case ?? 'no case'})</span>
                    </p>
                    <p className="text-xs text-ink-600 dark:text-ink-300 mt-1">{d.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-400">Sentence data unavailable.</p>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Break the sentence</h2>
        <div className="space-y-3">
          {brokenExamples.map((b) => (
            <div key={b.code} className="card p-4">
              <div className="flex items-center justify-between">
                <ArabicText text={b.textVocalized} className="text-red-700 dark:text-red-400 line-through decoration-red-400/50" />
                <button onClick={() => toggleReveal(b.code)} className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  {revealedBroken.has(b.code) ? 'Hide' : 'Why does this fail?'}
                </button>
              </div>
              <p className="text-xs text-ink-500 mt-1">{b.attemptedMeaning}</p>
              {revealedBroken.has(b.code) && (
                <p className="text-sm text-ink-700 dark:text-ink-200 mt-2 border-t border-ink-900/10 dark:border-white/10 pt-2">{b.whyItFails}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
