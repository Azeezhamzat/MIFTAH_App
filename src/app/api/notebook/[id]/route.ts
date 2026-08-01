import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const item = await prisma.vocabularyItem.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.vocabularyItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
