import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import XRayViewer from './XRayViewer';

export default async function XRaySentencePage({ params }: { params: { id: string } }) {
  const user = await requireOnboardedUser();
  const sentence = await prisma.arabicSentence.findUnique({
    where: { id: params.id },
    include: {
      tokens: {
        include: { root: true, pattern: true, alternatives: true },
        orderBy: { position: 'asc' },
      },
      dependencies: true,
    },
  });
  if (!sentence) notFound();

  return (
    <NavShell userName={user.name}>
      <XRayViewer
        sentence={{
          id: sentence.id,
          textVocalized: sentence.textVocalized,
          translationEnglish: sentence.translationEnglish,
          notes: sentence.notes,
          tokens: sentence.tokens.map((t) => ({
            id: t.id,
            position: t.position,
            surfaceVocalized: t.surfaceVocalized,
            surfaceUnvocalized: t.surfaceUnvocalized,
            lemma: t.lemma,
            root: t.root?.radicals ?? null,
            rootMeaning: t.root?.meaningCore ?? null,
            pattern: t.pattern?.label ?? null,
            prefix: t.prefix,
            stem: t.stem,
            suffix: t.suffix,
            partOfSpeech: t.partOfSpeech,
            person: t.person,
            gender: t.gender,
            number: t.number,
            definiteness: t.definiteness,
            state: t.state,
            grammaticalCase: t.grammaticalCase,
            mood: t.mood,
            role: t.role,
            marker: t.marker,
            markerType: t.markerType,
            governedByTokenId: t.governedByTokenId,
            translation: t.translation,
            contextualMeaning: t.contextualMeaning,
            explanation: t.explanation,
            traditionalExplanation: t.traditionalExplanation,
            alternatives: t.alternatives.map((a) => ({ description: a.description, isTraditional: a.isTraditional, note: a.note })),
          })),
          dependencies: sentence.dependencies.map((d) => ({
            headTokenId: d.headTokenId,
            dependentTokenId: d.dependentTokenId,
            relation: d.relation,
            explanation: d.explanation,
          })),
        }}
      />
    </NavShell>
  );
}
