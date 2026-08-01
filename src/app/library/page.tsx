import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ArabicText from '@/components/ArabicText';

export default async function LibraryPage() {
  const user = await requireOnboardedUser();
  const passages = await prisma.readingPassage.findMany({ orderBy: { level: 'asc' } });

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Reading Library</h1>
        <p className="text-sm text-ink-500 mb-8">Vocalized to unvocalized, controlled to connected — apply grammar to real reading.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {passages.map((p) => (
            <Link key={p.id} href={`/library/${p.id}`} className="card p-5 hover:border-jade-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{p.title}</p>
                <span className="text-xs text-ink-400">Level {p.level}/9</span>
              </div>
              <ArabicText text={p.textVocalized.slice(0, 40) + '…'} className="text-ink-500" />
            </Link>
          ))}
        </div>
      </div>
    </NavShell>
  );
}
