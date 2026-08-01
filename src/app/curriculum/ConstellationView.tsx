'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArabicText from '@/components/ArabicText';

interface Node {
  id: string; code: string; title: string; titleArabic: string; definition: string; whyItMatters: string;
  domainTitle: string; x: number; y: number; status: string; overallScore: number; label: string | null;
  prerequisites: { code: string; title: string }[];
  references: { work: string; chapter: string }[];
  connectedCodes: string[];
}
interface Edge { fromCode: string; toCode: string }

const STATUS_COLOR: Record<string, string> = {
  mastered: '#288a69',
  developing: '#5c6bce',
  fragile: '#dc2626',
  recommended: '#b5893f',
  locked: '#c3c8ce',
};

export default function ConstellationView({
  nodes, edges, width, height,
}: {
  nodes: Node[]; edges: Edge[]; domains: string[]; width: number; height: number; colWidth: number;
}) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const selected = nodes.find((n) => n.code === selectedCode) ?? null;
  const nodeByCode = new Map(nodes.map((n) => [n.code, n]));

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="card p-4 overflow-auto scrollbar-thin" style={{ maxHeight: '70vh' }}>
        <svg width={width} height={height} className="min-w-full">
          {edges.map((e, i) => {
            const from = nodeByCode.get(e.fromCode);
            const to = nodeByCode.get(e.toCode);
            if (!from || !to) return null;
            const highlighted = selected && (selected.code === e.fromCode || selected.code === e.toCode);
            return (
              <line
                key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={highlighted ? '#b5893f' : '#c3c8ce'}
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={highlighted ? undefined : '3 3'}
                opacity={highlighted ? 0.9 : 0.4}
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <circle
                r={selectedCode === n.code ? 10 : 7}
                fill={STATUS_COLOR[n.status]}
                stroke={selectedCode === n.code ? '#1c2252' : 'none'}
                strokeWidth={2}
                className="cursor-pointer"
                onClick={() => setSelectedCode(n.code)}
              />
              <text
                x={0} y={22}
                textAnchor="middle"
                fontSize={10}
                className="fill-ink-600 dark:fill-ink-300 cursor-pointer select-none"
                onClick={() => setSelectedCode(n.code)}
              >
                {n.title.length > 20 ? n.title.slice(0, 18) + '…' : n.title}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="card p-5">
        {!selected ? (
          <p className="text-sm text-ink-500">Select a concept node to see its details.</p>
        ) : (
          <div className="space-y-4 animate-rise-in">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">{selected.domainTitle}</p>
              <h2 className="text-lg font-serif font-semibold">{selected.title}</h2>
              <ArabicText text={selected.titleArabic} className="text-ink-500" />
            </div>
            <p className="text-sm text-ink-700 dark:text-ink-200">{selected.definition}</p>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Why it matters</p>
              <p className="text-sm text-ink-600 dark:text-ink-300">{selected.whyItMatters}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Status</p>
              <p className="text-sm capitalize" style={{ color: STATUS_COLOR[selected.status] }}>{selected.status} {selected.label && `(${selected.label})`}</p>
            </div>
            {selected.prerequisites.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Prerequisites</p>
                <ul className="text-sm text-ink-600 dark:text-ink-300 list-disc list-inside">
                  {selected.prerequisites.map((p) => <li key={p.code}>{p.title}</li>)}
                </ul>
              </div>
            )}
            {selected.references.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Reference mapping</p>
                {selected.references.map((r, i) => (
                  <p key={i} className="text-xs text-ink-500">{r.work}: {r.chapter}</p>
                ))}
              </div>
            )}
            <Link
              href={`/lessons/by-concept/${selected.code}`}
              className="block text-center rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-medium py-2.5"
            >
              Go to lesson
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
