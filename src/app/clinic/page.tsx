import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ClinicView from './ClinicView';

export default async function ClinicPage() {
  const user = await requireOnboardedUser();

  const logs = await prisma.misconceptionLog.findMany({
    where: { userId: user.id },
    include: { misconception: true },
    orderBy: { detectedAt: 'desc' },
  });

  const allExercises = await prisma.exercise.findMany({ include: { hints: { orderBy: { level: 'asc' } } } });

  const items = logs.map((log) => {
    const repairExercise = allExercises.find((e) => {
      const tags = JSON.parse(e.misconceptionTags) as string[];
      return tags.includes(log.misconception.code);
    });
    return {
      logId: log.id,
      status: log.status,
      detectedAt: log.detectedAt.toISOString(),
      misconception: {
        code: log.misconception.code,
        title: log.misconception.title,
        description: log.misconception.description,
        evidencePattern: log.misconception.evidencePattern,
        correctModel: log.misconception.correctModel,
        contrastExample: log.misconception.contrastExample,
        repairGuidance: log.misconception.repairGuidance,
      },
      repairExercise: repairExercise
        ? {
            id: repairExercise.id,
            type: repairExercise.type,
            objective: repairExercise.objective,
            prompt: repairExercise.prompt,
            promptArabic: repairExercise.promptArabic,
            difficulty: repairExercise.difficulty,
            hints: repairExercise.hints.map((h) => ({ level: h.level, text: h.text })),
          }
        : null,
    };
  });

  return (
    <NavShell userName={user.name}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Misconception Clinic</h1>
        <p className="text-sm text-ink-500 mb-8">
          Your personal collection of recurring errors, detected from real attempts — not a generic list.
        </p>
        <ClinicView items={items} />
      </div>
    </NavShell>
  );
}
