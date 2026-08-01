import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    include: { learnerProfile: true, languageProfile: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');
  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.learnerProfile) redirect('/onboarding');
  if (!user.learnerProfile.placementCompletedAt) redirect('/placement');
  return user;
}
