import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ArabicText from '@/components/ArabicText';

export default async function XRayIndexPage() {
  const user = await requireOnboardedUser();
  const sentences = await prisma.arabicSentence.findMany({ orderBy: [{ difficulty: 'asc' }, { createdAt: 'asc' }] });

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Iʿrāb X-Ray</h1>
        <p className="text-sm text-ink-500 mb-8">Select any sentence to inspect every word's morphology, syntax, and dependencies — or try Reason-from-Scratch mode.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {sentences.map((s) => (
            <Link key={s.id} href={`/xray/${s.id}`} className="card p-5 hover:border-jade-400 transition-colors">
              <ArabicText text={s.textVocalized} size="lg" as="div" />
              <p className="text-sm text-ink-500 mt-2">{s.translationEnglish}</p>
              <p className="text-xs text-ink-400 mt-2">Difficulty {s.difficulty}/5</p>
            </Link>
          ))}
        </div>
      </div>
    </NavShell>
  );
}
