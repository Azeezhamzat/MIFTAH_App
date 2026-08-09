'use client';

import { useEffect, useState } from 'react';
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

const PADDING = 60;

// A small, dependency-free force-directed layout (repulsion between every pair of
// nodes + spring attraction along prerequisite edges + a weak pull toward each
// node's domain anchor, so domains still loosely cluster spatially even though
// the exact position of any one node is driven by its real prerequisite
// connectivity rather than a rigid grid). Runs once, client-side, in a plain
// synchronous loop — the graph is small (~40 concepts), so this settles in a few
// milliseconds with no animation-frame loop or external graph library needed.
function computeForceLayout(nodes: Node[], edges: Edge[], domains: string[]) {
  const n = nodes.length;
  if (n === 0) return { positions: new Map<string, { x: number; y: number }>(), width: 400, height: 300 };

  const domainIndexByTitle = new Map(domains.map((d, i) => [d, i]));
  const spread = 260 + n * 6;
  const cx = spread;
  const cy = spread;
  const domainRadius = spread * 0.6;
  const domainAnchors = domains.map((_, i) => {
    const angle = (2 * Math.PI * i) / domains.length - Math.PI / 2;
    return { x: cx + domainRadius * Math.cos(angle), y: cy + domainRadius * Math.sin(angle) };
  });

  // Deterministic initial placement near each node's domain anchor (golden-angle
  // spread avoids every node in a domain starting stacked on the same point).
  const sim = nodes.map((node, i) => {
    const anchor = domainAnchors[domainIndexByTitle.get(node.domainTitle) ?? 0];
    const angle = (i * 2.399963) % (2 * Math.PI);
    const jitter = 30 + (i % 5) * 8;
    return { x: anchor.x + Math.cos(angle) * jitter, y: anchor.y + Math.sin(angle) * jitter, vx: 0, vy: 0 };
  });

  const codeToIndex = new Map(nodes.map((node, i) => [node.code, i]));
  const edgeIdx = edges
    .map((e) => ({ a: codeToIndex.get(e.fromCode), b: codeToIndex.get(e.toCode) }))
    .filter((e): e is { a: number; b: number } => e.a !== undefined && e.b !== undefined);

  const REPULSION = 2800;
  const EDGE_LENGTH = 95;
  const EDGE_STRENGTH = 0.02;
  const DOMAIN_STRENGTH = 0.01;
  const CENTER_STRENGTH = 0.0015;
  const DAMPING = 0.85;
  const ITERATIONS = 260;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = sim[i].x - sim[j].x;
        const dy = sim[i].y - sim[j].y;
        const distSq = Math.max(1, dx * dx + dy * dy);
        const dist = Math.sqrt(distSq);
        const force = REPULSION / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        sim[i].vx += fx; sim[i].vy += fy;
        sim[j].vx -= fx; sim[j].vy -= fy;
      }
    }
    for (const { a, b } of edgeIdx) {
      const dx = sim[b].x - sim[a].x;
      const dy = sim[b].y - sim[a].y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = (dist - EDGE_LENGTH) * EDGE_STRENGTH;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      sim[a].vx += fx; sim[a].vy += fy;
      sim[b].vx -= fx; sim[b].vy -= fy;
    }
    for (let i = 0; i < n; i++) {
      const anchor = domainAnchors[domainIndexByTitle.get(nodes[i].domainTitle) ?? 0];
      sim[i].vx += (anchor.x - sim[i].x) * DOMAIN_STRENGTH;
      sim[i].vy += (anchor.y - sim[i].y) * DOMAIN_STRENGTH;
      sim[i].vx += (cx - sim[i].x) * CENTER_STRENGTH;
      sim[i].vy += (cy - sim[i].y) * CENTER_STRENGTH;
    }
    for (let i = 0; i < n; i++) {
      sim[i].vx *= DAMPING; sim[i].vy *= DAMPING;
      sim[i].x += sim[i].vx; sim[i].y += sim[i].vy;
    }
  }

  const minX = Math.min(...sim.map((s) => s.x));
  const minY = Math.min(...sim.map((s) => s.y));
  const maxX = Math.max(...sim.map((s) => s.x));
  const maxY = Math.max(...sim.map((s) => s.y));

  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, i) => {
    positions.set(node.code, { x: sim[i].x - minX + PADDING, y: sim[i].y - minY + PADDING });
  });

  return { positions, width: maxX - minX + PADDING * 2, height: maxY - minY + PADDING * 2 };
}

export default function ConstellationView({
  nodes, edges, domains, width, height,
}: {
  nodes: Node[]; edges: Edge[]; domains: string[]; width: number; height: number;
}) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [layout, setLayout] = useState<{ positions: Map<string, { x: number; y: number }>; width: number; height: number } | null>(null);
  const selected = nodes.find((n) => n.code === selectedCode) ?? null;
  const nodeByCode = new Map(nodes.map((n) => [n.code, n]));

  useEffect(() => {
    setLayout(computeForceLayout(nodes, edges, domains));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const positionOf = (n: Node) => layout?.positions.get(n.code) ?? { x: n.x, y: n.y };
  const canvasWidth = layout?.width ?? width;
  const canvasHeight = layout?.height ?? height;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="card p-4 overflow-auto scrollbar-thin" style={{ maxHeight: '70vh' }}>
        <svg width={canvasWidth} height={canvasHeight} className="min-w-full">
          {edges.map((e, i) => {
            const from = nodeByCode.get(e.fromCode);
            const to = nodeByCode.get(e.toCode);
            if (!from || !to) return null;
            const fromPos = positionOf(from);
            const toPos = positionOf(to);
            const highlighted = selected && (selected.code === e.fromCode || selected.code === e.toCode);
            return (
              <line
                key={i}
                x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                stroke={highlighted ? '#b5893f' : '#c3c8ce'}
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={highlighted ? undefined : '3 3'}
                opacity={highlighted ? 0.9 : 0.4}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
          {nodes.map((n) => {
            const pos = positionOf(n);
            return (
              <g key={n.id} transform={`translate(${pos.x},${pos.y})`} className="transition-transform duration-700 ease-out">
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
            );
          })}
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
