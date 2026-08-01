import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ArabicText from '@/components/ArabicText';
import Link from 'next/link';

export default async function ReferencePage() {
  const user = await requireOnboardedUser();
  const works = await prisma.referenceWork.findMany({
    include: { mappings: { include: { concept: true } } },
  });

  return (
    <NavShell userName={user.name}>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-serif font-semibold mb-2">Reference Companion</h1>
          <p className="text-sm text-ink-500">
            See which lessons in this app correspond to a chapter in a classic reference — you are never required to
            read these books.
          </p>
        </div>
        {works.map((w) => (
          <section key={w.id}>
            <div className="flex items-baseline gap-3 mb-1">
              <ArabicText text={w.titleArabic} size="lg" />
              <span className="text-xs text-ink-400">{w.kind === 'inductive_primer' ? 'Inductive primer' : 'Classical matn commentary'}</span>
            </div>
            <p className="text-sm text-ink-500 mb-4">{w.titleEnglish} — {w.author}</p>
            {w.mappings.length === 0 ? (
              <p className="text-sm text-ink-400">No mappings recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {w.mappings.map((m) => (
                  <Link key={m.id} href={`/lessons/by-concept/${m.concept.code}`} className="card p-4 flex items-center justify-between hover:border-jade-400 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{m.concept.title}</p>
                      <p className="text-xs text-ink-500">{m.chapter}</p>
                    </div>
                    <span className="text-xs text-indigo-700 dark:text-indigo-300">Open lesson →</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </NavShell>
  );
}
