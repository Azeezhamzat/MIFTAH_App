import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import LabExplorer from './LabExplorer';
import { labFamilies, brokenExamples } from '../../../content/sentenceLab';

export default async function SentenceLabPage() {
  const user = await requireOnboardedUser();

  const allCodes = Array.from(new Set(labFamilies.flatMap((f) => f.variants.map((v) => v.sentenceCode))));
  const sentences = await prisma.arabicSentence.findMany({
    where: { code: { in: allCodes } },
    include: { tokens: { orderBy: { position: 'asc' } } },
  });

  const sentenceByCode = Object.fromEntries(
    sentences.map((s) => [
      s.code!,
      {
        code: s.code!,
        textVocalized: s.textVocalized,
        translationEnglish: s.translationEnglish,
        tokens: s.tokens.map((t) => ({
          position: t.position,
          surfaceVocalized: t.surfaceVocalized,
          lemma: t.lemma,
          role: t.role,
          grammaticalCase: t.grammaticalCase,
          mood: t.mood,
          marker: t.marker,
          explanation: t.explanation,
        })),
      },
    ]),
  );

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Sentence Laboratory</h1>
        <p className="text-sm text-ink-500 mb-8">
          Flip one feature at a time and watch every dependent word, ending, and translation update.
        </p>
        <LabExplorer families={labFamilies} sentenceByCode={sentenceByCode} brokenExamples={brokenExamples} />
      </div>
    </NavShell>
  );
}
