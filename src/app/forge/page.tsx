import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ForgeExplorer from './ForgeExplorer';

export default async function ForgePage() {
  const user = await requireOnboardedUser();

  const [roots, patterns, lexemes] = await Promise.all([
    prisma.root.findMany({ orderBy: { radicals: 'asc' } }),
    prisma.pattern.findMany({ orderBy: { label: 'asc' } }),
    prisma.lexeme.findMany({ include: { root: true, pattern: true } }),
  ]);

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Morphology Forge</h1>
        <p className="text-sm text-ink-500 mb-8">Pour a root into a pattern and watch a real Arabic word take shape.</p>
        <ForgeExplorer
          roots={roots.map((r) => ({ radicals: r.radicals, meaningCore: r.meaningCore }))}
          patterns={patterns.map((p) => ({ label: p.label, skeleton: p.skeleton, category: p.category, meaningTendency: p.meaningTendency }))}
          lexemes={lexemes.map((l) => ({
            vocalized: l.vocalized,
            unvocalized: l.unvocalized,
            meaningEnglish: l.meaningEnglish,
            partOfSpeech: l.partOfSpeech,
            notes: l.notes,
            rootRadicals: l.root?.radicals ?? null,
            patternLabel: l.pattern?.label ?? null,
          }))}
        />
      </div>
    </NavShell>
  );
}
