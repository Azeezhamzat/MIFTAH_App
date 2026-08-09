'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConceptEntry {
  code: string; domainCode: string; title: string; titleArabic: string; definition: string; whyItMatters: string;
  difficulty: number; order: number; prerequisites: string[];
}
interface LessonEntry {
  code: string; unitCode: string; title: string; titleArabic: string; summary: string; order: number;
  estimatedMinutes: number; concepts: { conceptCode: string; role: string }[]; observeSentenceCodes: string[];
  discoveryPrompt: string; microExplanation: string; deeperDetail: string;
}
interface Option { code: string; title: string }

const inputClass = 'w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm';
const EXERCISE_TYPES = [
  'identify_role', 'select_ending', 'add_vowels', 'reorder', 'connect_dependency',
  'complete_conjugation', 'construct_from_root', 'transform_word', 'transform_sentence',
  'repair_error', 'complete_paradigm', 'translate_to_structure', 'compare_analyses',
  'explain_rule', 'partial_irab', 'full_irab', 'analyze_passage', 'free_production', 'teach_back',
];

const emptyConcept: ConceptEntry = {
  code: '', domainCode: '', title: '', titleArabic: '', definition: '', whyItMatters: '',
  difficulty: 1, order: 1, prerequisites: [],
};
const emptyLesson: LessonEntry = {
  code: '', unitCode: '', title: '', titleArabic: '', summary: '', order: 1, estimatedMinutes: 15,
  concepts: [], observeSentenceCodes: [], discoveryPrompt: '', microExplanation: '', deeperDetail: '',
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

export default function AuthorStudio({
  domains, units, concepts, lessons, allConceptOptions, allLessonOptions, allSentenceOptions,
}: {
  domains: Option[]; units: Option[]; concepts: ConceptEntry[]; lessons: LessonEntry[];
  allConceptOptions: Option[]; allLessonOptions: Option[]; allSentenceOptions: { code: string; text: string }[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'concept' | 'lesson' | 'exercise'>('concept');
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // --- Concept form state ---
  const [conceptForm, setConceptForm] = useState<ConceptEntry>(emptyConcept);
  const [conceptPrereqText, setConceptPrereqText] = useState('');
  const [editingConceptCode, setEditingConceptCode] = useState('');

  function loadConcept(code: string) {
    setEditingConceptCode(code);
    if (!code) {
      setConceptForm(emptyConcept);
      setConceptPrereqText('');
      return;
    }
    const c = concepts.find((x) => x.code === code);
    if (!c) return;
    setConceptForm(c);
    setConceptPrereqText(c.prerequisites.join('\n'));
  }

  async function submitConcept() {
    setSaving(true);
    setStatus(null);
    const payload = { ...conceptForm, prerequisites: linesToArray(conceptPrereqText) };
    const res = await fetch('/api/studio/save-concept', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    setStatus({ kind: data.ok ? 'ok' : 'error', text: data.ok ? data.message : data.error });
    if (data.ok) router.refresh();
  }

  // --- Lesson form state ---
  const [lessonForm, setLessonForm] = useState<LessonEntry>(emptyLesson);
  const [lessonConceptsText, setLessonConceptsText] = useState('');
  const [lessonObserveText, setLessonObserveText] = useState('');
  const [editingLessonCode, setEditingLessonCode] = useState('');

  function loadLesson(code: string) {
    setEditingLessonCode(code);
    if (!code) {
      setLessonForm(emptyLesson);
      setLessonConceptsText('');
      setLessonObserveText('');
      return;
    }
    const l = lessons.find((x) => x.code === code);
    if (!l) return;
    setLessonForm(l);
    setLessonConceptsText(l.concepts.map((c) => `${c.conceptCode}:${c.role}`).join('\n'));
    setLessonObserveText(l.observeSentenceCodes.join('\n'));
  }

  async function submitLesson() {
    setSaving(true);
    setStatus(null);
    const parsedConcepts = linesToArray(lessonConceptsText).map((line) => {
      const [conceptCode, role] = line.split(':').map((s) => s.trim());
      return { conceptCode, role: role || 'introduces' };
    });
    const payload = { ...lessonForm, concepts: parsedConcepts, observeSentenceCodes: linesToArray(lessonObserveText) };
    const res = await fetch('/api/studio/save-lesson', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    setStatus({ kind: data.ok ? 'ok' : 'error', text: data.ok ? data.message : data.error });
    if (data.ok) router.refresh();
  }

  // --- Exercise form state (create-only) ---
  const [exerciseForm, setExerciseForm] = useState({
    lessonCode: '', conceptCode: '', sentenceCode: '', type: EXERCISE_TYPES[0], objective: '', prompt: '',
    promptArabic: '', difficulty: 1, expectedAnswer: '', explanation: '',
  });
  const [acceptedVariantsText, setAcceptedVariantsText] = useState('');
  const [hintsText, setHintsText] = useState('');

  async function submitExercise() {
    setSaving(true);
    setStatus(null);
    const payload = {
      ...exerciseForm,
      lessonCode: exerciseForm.lessonCode || undefined,
      sentenceCode: exerciseForm.sentenceCode || undefined,
      acceptedVariants: linesToArray(acceptedVariantsText),
      hints: linesToArray(hintsText),
    };
    const res = await fetch('/api/studio/create-exercise', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    setStatus({ kind: data.ok ? 'ok' : 'error', text: data.ok ? data.message : data.error });
    if (data.ok) {
      setExerciseForm({ lessonCode: '', conceptCode: '', sentenceCode: '', type: EXERCISE_TYPES[0], objective: '', prompt: '', promptArabic: '', difficulty: 1, expectedAnswer: '', explanation: '' });
      setAcceptedVariantsText('');
      setHintsText('');
      router.refresh();
    }
  }

  return (
    <div className="card p-5 mb-8">
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-center justify-between text-left">
        <div>
          <h2 className="font-medium">Author content</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Hand-write a concept, lesson, or exercise. Saves are written straight to the <code>content/*.ts</code>{' '}
            source files — the same ones <code>npm run db:seed</code> reads from — and best-effort mirrored into the
            live database so you see the result immediately.
          </p>
        </div>
        <span className="text-ink-400 text-sm shrink-0 ml-4">{expanded ? 'Hide' : 'Open'}</span>
      </button>

      {expanded && (
        <div className="mt-5">
          <div className="flex flex-wrap gap-2 mb-5">
            {(['concept', 'lesson', 'exercise'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setStatus(null); }}
                className={`text-sm rounded-full px-4 py-1.5 border capitalize ${tab === t ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/30 text-jade-800 dark:text-jade-200' : 'border-ink-900/10 dark:border-white/10'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'concept' && (
            <div className="space-y-3">
              <select value={editingConceptCode} onChange={(e) => loadConcept(e.target.value)} className={inputClass}>
                <option value="">+ New concept</option>
                {concepts.map((c) => <option key={c.code} value={c.code}>{c.title} ({c.code})</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="code (e.g. c-my-concept)" value={conceptForm.code} disabled={!!editingConceptCode} onChange={(e) => setConceptForm({ ...conceptForm, code: e.target.value })} className={`${inputClass} disabled:opacity-50`} />
                <select value={conceptForm.domainCode} onChange={(e) => setConceptForm({ ...conceptForm, domainCode: e.target.value })} className={inputClass}>
                  <option value="">Domain…</option>
                  {domains.map((d) => <option key={d.code} value={d.code}>{d.title}</option>)}
                </select>
                <input placeholder="Title (English)" value={conceptForm.title} onChange={(e) => setConceptForm({ ...conceptForm, title: e.target.value })} className={inputClass} />
                <input placeholder="Title (Arabic)" dir="rtl" value={conceptForm.titleArabic} onChange={(e) => setConceptForm({ ...conceptForm, titleArabic: e.target.value })} className={inputClass} />
              </div>
              <textarea placeholder="Definition" value={conceptForm.definition} onChange={(e) => setConceptForm({ ...conceptForm, definition: e.target.value })} rows={2} className={inputClass} />
              <textarea placeholder="Why it matters" value={conceptForm.whyItMatters} onChange={(e) => setConceptForm({ ...conceptForm, whyItMatters: e.target.value })} rows={2} className={inputClass} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="number" min={1} max={5} placeholder="Difficulty (1-5)" value={conceptForm.difficulty} onChange={(e) => setConceptForm({ ...conceptForm, difficulty: Number(e.target.value) })} className={inputClass} />
                <input type="number" min={1} placeholder="Order within domain" value={conceptForm.order} onChange={(e) => setConceptForm({ ...conceptForm, order: Number(e.target.value) })} className={inputClass} />
              </div>
              <textarea placeholder="Prerequisite concept codes, one per line" value={conceptPrereqText} onChange={(e) => setConceptPrereqText(e.target.value)} rows={3} className={inputClass} />
              <button onClick={submitConcept} disabled={saving || !conceptForm.code || !conceptForm.domainCode} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-5 py-2 text-sm">
                {saving ? 'Saving…' : editingConceptCode ? 'Save changes' : 'Create concept'}
              </button>
            </div>
          )}

          {tab === 'lesson' && (
            <div className="space-y-3">
              <select value={editingLessonCode} onChange={(e) => loadLesson(e.target.value)} className={inputClass}>
                <option value="">+ New lesson</option>
                {lessons.map((l) => <option key={l.code} value={l.code}>{l.title} ({l.code})</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="code (e.g. l-my-lesson)" value={lessonForm.code} disabled={!!editingLessonCode} onChange={(e) => setLessonForm({ ...lessonForm, code: e.target.value })} className={`${inputClass} disabled:opacity-50`} />
                <select value={lessonForm.unitCode} onChange={(e) => setLessonForm({ ...lessonForm, unitCode: e.target.value })} className={inputClass}>
                  <option value="">Unit…</option>
                  {units.map((u) => <option key={u.code} value={u.code}>{u.title}</option>)}
                </select>
                <input placeholder="Title (English)" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className={inputClass} />
                <input placeholder="Title (Arabic)" dir="rtl" value={lessonForm.titleArabic} onChange={(e) => setLessonForm({ ...lessonForm, titleArabic: e.target.value })} className={inputClass} />
              </div>
              <textarea placeholder="Summary" value={lessonForm.summary} onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })} rows={2} className={inputClass} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="number" min={1} placeholder="Order within unit" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })} className={inputClass} />
                <input type="number" min={1} placeholder="Estimated minutes" value={lessonForm.estimatedMinutes} onChange={(e) => setLessonForm({ ...lessonForm, estimatedMinutes: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <textarea placeholder={'Concepts taught, one per line as conceptCode:role\ne.g. c-word-classes:introduces  (role: introduces | reinforces | reviews)'} value={lessonConceptsText} onChange={(e) => setLessonConceptsText(e.target.value)} rows={3} className={inputClass} />
              </div>
              <textarea placeholder="Observe-stage sentence codes, one per line (optional)" value={lessonObserveText} onChange={(e) => setLessonObserveText(e.target.value)} rows={2} className={inputClass} />
              <textarea placeholder="Discovery prompt (the question learners answer before the explanation)" value={lessonForm.discoveryPrompt} onChange={(e) => setLessonForm({ ...lessonForm, discoveryPrompt: e.target.value })} rows={2} className={inputClass} />
              <textarea placeholder="Micro-explanation" value={lessonForm.microExplanation} onChange={(e) => setLessonForm({ ...lessonForm, microExplanation: e.target.value })} rows={3} className={inputClass} />
              <textarea placeholder="Deeper detail (optional)" value={lessonForm.deeperDetail} onChange={(e) => setLessonForm({ ...lessonForm, deeperDetail: e.target.value })} rows={2} className={inputClass} />
              <button onClick={submitLesson} disabled={saving || !lessonForm.code || !lessonForm.unitCode} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-5 py-2 text-sm">
                {saving ? 'Saving…' : editingLessonCode ? 'Save changes' : 'Create lesson'}
              </button>
            </div>
          )}

          {tab === 'exercise' && (
            <div className="space-y-3">
              <p className="text-xs text-ink-500">
                New exercises only (no in-place editing yet — see docs/ROADMAP.md) and the expected answer must be
                plain text; a handful of exercise types whose answer is a list or structured value aren&apos;t
                authorable here.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={exerciseForm.conceptCode} onChange={(e) => setExerciseForm({ ...exerciseForm, conceptCode: e.target.value })} className={inputClass}>
                  <option value="">Concept…</option>
                  {allConceptOptions.map((c) => <option key={c.code} value={c.code}>{c.title}</option>)}
                </select>
                <select value={exerciseForm.type} onChange={(e) => setExerciseForm({ ...exerciseForm, type: e.target.value })} className={inputClass}>
                  {EXERCISE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={exerciseForm.lessonCode} onChange={(e) => setExerciseForm({ ...exerciseForm, lessonCode: e.target.value })} className={inputClass}>
                  <option value="">No specific lesson (optional)</option>
                  {allLessonOptions.map((l) => <option key={l.code} value={l.code}>{l.title}</option>)}
                </select>
                <select value={exerciseForm.sentenceCode} onChange={(e) => setExerciseForm({ ...exerciseForm, sentenceCode: e.target.value })} className={inputClass}>
                  <option value="">No linked sentence (optional)</option>
                  {allSentenceOptions.filter((s) => s.code).map((s) => <option key={s.code} value={s.code}>{s.text}</option>)}
                </select>
              </div>
              <input placeholder="Objective (what this exercise checks)" value={exerciseForm.objective} onChange={(e) => setExerciseForm({ ...exerciseForm, objective: e.target.value })} className={inputClass} />
              <textarea placeholder="Prompt" value={exerciseForm.prompt} onChange={(e) => setExerciseForm({ ...exerciseForm, prompt: e.target.value })} rows={2} className={inputClass} />
              <input placeholder="Prompt (Arabic, optional)" dir="rtl" value={exerciseForm.promptArabic} onChange={(e) => setExerciseForm({ ...exerciseForm, promptArabic: e.target.value })} className={inputClass} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Expected answer (plain text)" value={exerciseForm.expectedAnswer} onChange={(e) => setExerciseForm({ ...exerciseForm, expectedAnswer: e.target.value })} className={inputClass} />
                <input type="number" min={1} max={5} placeholder="Difficulty (1-5)" value={exerciseForm.difficulty} onChange={(e) => setExerciseForm({ ...exerciseForm, difficulty: Number(e.target.value) })} className={inputClass} />
              </div>
              <textarea placeholder="Accepted answer variants, one per line (optional)" value={acceptedVariantsText} onChange={(e) => setAcceptedVariantsText(e.target.value)} rows={2} className={inputClass} />
              <textarea placeholder="Hints, one per line, gentlest first (at least one required)" value={hintsText} onChange={(e) => setHintsText(e.target.value)} rows={3} className={inputClass} />
              <textarea placeholder="Explanation shown after answering" value={exerciseForm.explanation} onChange={(e) => setExerciseForm({ ...exerciseForm, explanation: e.target.value })} rows={2} className={inputClass} />
              <button onClick={submitExercise} disabled={saving || !exerciseForm.conceptCode} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-5 py-2 text-sm">
                {saving ? 'Saving…' : 'Create exercise'}
              </button>
            </div>
          )}

          {status && (
            <p className={`text-sm mt-3 ${status.kind === 'ok' ? 'text-jade-700 dark:text-jade-300' : 'text-red-600'}`}>{status.text}</p>
          )}
        </div>
      )}
    </div>
  );
}
