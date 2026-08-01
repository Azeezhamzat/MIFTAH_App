import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import NotebookView from './NotebookView';

export default async function NotebookPage() {
  const user = await requireOnboardedUser();
  const [items, lexemes, roots] = await Promise.all([
    prisma.vocabularyItem.findMany({ where: { userId: user.id }, include: { lexeme: { include: { root: true } } }, orderBy: { addedAt: 'desc' } }),
    prisma.lexeme.findMany({ include: { root: true } }),
    prisma.root.findMany({ orderBy: { radicals: 'asc' } }),
  ]);

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Root & vocabulary notebook</h1>
        <p className="text-sm text-ink-500 mb-8">Save words you meet in lessons, the laboratory, or your reading.</p>
        <NotebookView
          items={items.map((i) => ({
            id: i.id,
            arabic: i.lexeme?.vocalized ?? i.freeformArabic ?? '',
            meaning: i.lexeme?.meaningEnglish ?? i.freeformMeaning ?? '',
            root: i.lexeme?.root?.radicals ?? null,
            note: i.note,
            masteryLevel: i.masteryLevel,
          }))}
          lexemes={lexemes.map((l) => ({ id: l.id, vocalized: l.vocalized, meaningEnglish: l.meaningEnglish, rootRadicals: l.root?.radicals ?? null }))}
          roots={roots.map((r) => ({ radicals: r.radicals, meaningCore: r.meaningCore }))}
        />
      </div>
    </NavShell>
  );
}
