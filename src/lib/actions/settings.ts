'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function updateSettingsAction(formData: FormData) {
  const user = await requireUser();
  await prisma.learnerProfile.update({
    where: { userId: user.id },
    data: {
      theme: String(formData.get('theme') ?? 'system'),
      reducedMotion: formData.get('reducedMotion') === 'on',
      diacriticLevel: String(formData.get('diacriticLevel') ?? 'full'),
      yorubaNotesEnabled: formData.get('yorubaNotesEnabled') === 'on',
      quietProgress: formData.get('quietProgress') === 'on',
      dailyGoalMinutes: Number(formData.get('dailyGoalMinutes') ?? 20),
      studyIntensity: String(formData.get('studyIntensity') ?? 'standard'),
      arabicOrientation: String(formData.get('arabicOrientation') ?? 'msa'),
    },
  });
  revalidatePath('/settings');
}
