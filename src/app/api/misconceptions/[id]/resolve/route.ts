import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const log = await prisma.misconceptionLog.findUnique({ where: { id: params.id } });
  if (!log || log.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.misconceptionLog.update({
    where: { id: params.id },
    data: { status: 'repaired', retestAt: new Date(Date.now() + 3 * 86_400_000) },
  });
  return NextResponse.json({ ok: true });
}
