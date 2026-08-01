import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ConstellationView from './ConstellationView';

const MASTERED_LABELS = new Set(['reliable', 'strong']);

export default async function CurriculumPage() {
  const user = await requireOnboardedUser();

  const [domains, concepts, masteries, refMappings] = await Promise.all([
    prisma.domain.findMany({ orderBy: { order: 'asc' } }),
    prisma.concept.findMany({
      include: { prerequisites: { include: { prerequisite: true } }, domain: true },
      orderBy: [{ domain: { order: 'asc' } }, { order: 'asc' }],
    }),
    prisma.conceptMastery.findMany({ where: { userId: user.id } }),
    prisma.referenceMapping.findMany({ include: { referenceWork: true } }),
  ]);

  const masteryByConceptId = new Map(masteries.map((m) => [m.conceptId, m]));
  const domainIndex = new Map(domains.map((d, i) => [d.id, i]));
  const conceptsByDomain = new Map<string, typeof concepts>();
  for (const c of concepts) {
    const arr = conceptsByDomain.get(c.domainId) ?? [];
    arr.push(c);
    conceptsByDomain.set(c.domainId, arr);
  }

  const COL_WIDTH = 200;
  const ROW_HEIGHT = 88;

  const nodes = concepts.map((c) => {
    const col = domainIndex.get(c.domainId)!;
    const siblings = conceptsByDomain.get(c.domainId)!;
    const row = siblings.findIndex((s) => s.id === c.id);
    const mastery = masteryByConceptId.get(c.id);
    const prereqsMet = c.prerequisites.every((p) => {
      const m = masteryByConceptId.get(p.prerequisiteId);
      return m && MASTERED_LABELS.has(m.label);
    });
    let status: 'mastered' | 'developing' | 'fragile' | 'locked' | 'recommended' = 'locked';
    if (mastery && MASTERED_LABELS.has(mastery.label)) status = 'mastered';
    else if (mastery && mastery.label === 'needs_review') status = 'fragile';
    else if (mastery) status = 'developing';
    else if (prereqsMet) status = 'recommended';

    return {
      id: c.id,
      code: c.code,
      title: c.title,
      titleArabic: c.titleArabic,
      definition: c.definition,
      whyItMatters: c.whyItMatters,
      domainTitle: c.domain.title,
      x: col * COL_WIDTH + 100,
      y: row * ROW_HEIGHT + 60,
      status,
      overallScore: mastery?.overallScore ?? 0,
      label: mastery?.label ?? null,
      prerequisites: c.prerequisites.map((p) => ({ code: p.prerequisite.code, title: p.prerequisite.title })),
      references: refMappings.filter((r) => r.conceptId === c.id).map((r) => ({ work: r.referenceWork.titleEnglish, chapter: r.chapter })),
    };
  });

  const edges = concepts.flatMap((c) =>
    c.prerequisites.map((p) => ({
      fromCode: p.prerequisite.code,
      toCode: c.code,
    })),
  );

  const connectedByCode = new Map<string, Set<string>>();
  for (const e of edges) {
    if (!connectedByCode.has(e.fromCode)) connectedByCode.set(e.fromCode, new Set());
    if (!connectedByCode.has(e.toCode)) connectedByCode.set(e.toCode, new Set());
    connectedByCode.get(e.fromCode)!.add(e.toCode);
    connectedByCode.get(e.toCode)!.add(e.fromCode);
  }
  const nodesWithConnections = nodes.map((n) => ({ ...n, connectedCodes: Array.from(connectedByCode.get(n.code) ?? []) }));

  const width = domains.length * COL_WIDTH + 100;
  const height = Math.max(...concepts.map((c) => (conceptsByDomain.get(c.domainId)?.length ?? 1))) * ROW_HEIGHT + 100;

  return (
    <NavShell userName={user.name}>
      <div className="px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Grammar Constellation</h1>
        <p className="text-sm text-ink-500 mb-6 max-w-2xl">
          Columns are grammatical domains; each node is a concept. Lines show prerequisite relationships. Select a
          concept to see why it matters, what it depends on, and your evidence.
        </p>
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          {[
            ['mastered', 'bg-jade-500'], ['developing', 'bg-indigo-400'], ['fragile', 'bg-red-400'],
            ['recommended', 'bg-gold-500'], ['locked', 'bg-ink-300 dark:bg-ink-600'],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
            </span>
          ))}
        </div>
        <ConstellationView
          nodes={nodesWithConnections}
          edges={edges}
          domains={domains.map((d) => d.title)}
          width={width}
          height={height}
          colWidth={COL_WIDTH}
        />
      </div>
    </NavShell>
  );
}
