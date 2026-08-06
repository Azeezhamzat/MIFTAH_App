'use client';

import { useState, useEffect } from 'react';

interface Message {
  role: 'learner' | 'tutor';
  text: string;
  uncertain?: boolean;
  enhancedByClaude?: boolean;
}

const SUGGESTIONS = [
  'Why is this word accusative?',
  'Give me a harder example.',
  'Explain this more simply.',
  'Is Yorùbá influencing my mistake?',
  'What prerequisite am I missing?',
  'Test me without multiple choice.',
];

export default function TeacherChat({ concepts, initialQuestion }: { concepts: { code: string; title: string }[]; initialQuestion?: string }) {
  const [contextConceptCode, setContextConceptCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'tutor', text: 'Ask me anything about what you\'re studying. Pick a concept below to focus my answers, or just ask.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Arriving from "Ask the Living Teacher about this" on a missed exercise
    // — send that question immediately rather than making the learner retype it.
    if (initialQuestion) send(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'learner', text }]);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/tutor/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, contextConceptCode: contextConceptCode || undefined }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: 'tutor', text: data.text, uncertain: data.uncertain, enhancedByClaude: data.enhancedByClaude }]);
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wide text-ink-400 mb-1">Focus on a concept (optional)</label>
        <select
          value={contextConceptCode}
          onChange={(e) => setContextConceptCode(e.target.value)}
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
        >
          <option value="">No specific focus</option>
          {concepts.map((c) => <option key={c.code} value={c.code}>{c.title}</option>)}
        </select>
      </div>

      <div className="card p-5 h-96 overflow-y-auto scrollbar-thin space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] ${m.role === 'learner' ? 'ml-auto text-right' : ''}`}>
            <div
              className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'learner'
                  ? 'bg-indigo-700 text-white'
                  : m.uncertain
                    ? 'bg-gold-400/10 text-ink-800 dark:text-ink-100'
                    : 'bg-parchment-100 dark:bg-ink-800 text-ink-800 dark:text-ink-100'
              }`}
            >
              {m.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
            </div>
            {m.enhancedByClaude && (
              <p className="text-[10px] uppercase tracking-wide text-indigo-500 dark:text-indigo-300 mt-1">Answered by Claude — not limited to this app&apos;s built-in curriculum</p>
            )}
          </div>
        ))}
        {loading && <p className="text-xs text-ink-400">Thinking…</p>}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)} className="text-xs rounded-full border border-ink-900/10 dark:border-white/10 px-3 py-1.5 hover:border-jade-400">
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Ask a question…"
          className="flex-1 rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={() => send(input)} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium px-5 text-sm">
          Send
        </button>
      </div>
    </div>
  );
}
