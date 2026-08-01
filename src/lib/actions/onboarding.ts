'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export interface FormState {
  error?: string;
}

export async function saveOnboardingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const motherTongue = String(formData.get('motherTongue') ?? 'yoruba');
  const instructionalLanguage = String(formData.get('instructionalLanguage') ?? 'english');
  const arabicOrientation = String(formData.get('arabicOrientation') ?? 'msa');
  const studyIntensity = String(formData.get('studyIntensity') ?? 'standard');
  const dailyGoalMinutes = Number(formData.get('dailyGoalMinutes') ?? 20);
  const yorubaNotesEnabled = formData.get('yorubaNotesEnabled') === 'on';
  const goalText = String(formData.get('goalText') ?? '').trim();

  if (!goalText) {
    return { error: 'Tell us what you want to be able to do in Arabic — this shapes your first sessions.' };
  }

  await prisma.languageProfile.upsert({
    where: { userId: user.id },
    update: { motherTongue, instructionalLanguage },
    create: { userId: user.id, motherTongue, instructionalLanguage },
  });

  await prisma.learnerProfile.upsert({
    where: { userId: user.id },
    update: { arabicOrientation, studyIntensity, dailyGoalMinutes, yorubaNotesEnabled },
    create: {
      userId: user.id,
      arabicOrientation,
      studyIntensity,
      dailyGoalMinutes,
      yorubaNotesEnabled,
    },
  });

  await prisma.learningGoal.create({
    data: { userId: user.id, text: goalText, priority: 1 },
  });

  redirect('/placement');
}
