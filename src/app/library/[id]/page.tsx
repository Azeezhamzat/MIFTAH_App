import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import PassageReader from './PassageReader';

export default async function PassagePage({ params }: { params: { id: string } }) {
  const user = await requireOnboardedUser();
  const passage = await prisma.readingPassage.findUnique({ where: { id: params.id } });
  if (!passage) notFound();

  const sentenceIds = JSON.parse(passage.sentenceIds) as string[];
  const sentences = await prisma.arabicSentence.findMany({ where: { id: { in: sentenceIds } } });

  return (
    <NavShell userName={user.name}>
      <PassageReader
        passage={{
          title: passage.title,
          level: passage.level,
          textVocalized: passage.textVocalized,
          vocabPreview: JSON.parse(passage.vocabPreview),
          comprehensionQuestions: JSON.parse(passage.comprehensionQuestions),
          recurringStructures: JSON.parse(passage.recurringStructures),
          sentences: sentences.map((s) => ({ id: s.id, textVocalized: s.textVocalized, translationEnglish: s.translationEnglish })),
        }}
      />
    </NavShell>
  );
}
