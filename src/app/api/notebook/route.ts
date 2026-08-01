import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const item = await prisma.vocabularyItem.create({
    data: {
      userId: user.id,
      lexemeId: body.lexemeId || undefined,
      freeformArabic: body.freeformArabic || undefined,
      freeformMeaning: body.freeformMeaning || undefined,
      note: body.note || undefined,
    },
  });
  return NextResponse.json({ item });
}
