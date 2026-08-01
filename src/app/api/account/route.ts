import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function DELETE() {
  const user = await requireUser();
  await prisma.user.delete({ where: { id: user.id } });
  return NextResponse.json({ ok: true });
}
