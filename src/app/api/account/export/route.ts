import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function GET() {
  const user = await requireUser();
  const [learnerProfile, languageProfile, goals, masteries, reviewSchedules, attempts, vocabularyItems, misconceptionLogs, placementAttempts] =
    await Promise.all([
      prisma.learnerProfile.findUnique({ where: { userId: user.id } }),
      prisma.languageProfile.findUnique({ where: { userId: user.id } }),
      prisma.learningGoal.findMany({ where: { userId: user.id } }),
      prisma.conceptMastery.findMany({ where: { userId: user.id } }),
      prisma.reviewSchedule.findMany({ where: { userId: user.id } }),
      prisma.attempt.findMany({ where: { userId: user.id } }),
      prisma.vocabularyItem.findMany({ where: { userId: user.id } }),
      prisma.misconceptionLog.findMany({ where: { userId: user.id } }),
      prisma.placementAttempt.findMany({ where: { userId: user.id } }),
    ]);

  const exportData = {
    account: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    learnerProfile,
    languageProfile,
    goals,
    masteries,
    reviewSchedules,
    attempts,
    vocabularyItems,
    misconceptionLogs,
    placementAttempts,
    exportedAt: new Date().toISOString(),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="miftah-data-export.json"',
    },
  });
}
