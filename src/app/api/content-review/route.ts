import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const review = await prisma.contentReview.create({
    data: {
      entityType: body.entityType,
      entityId: body.entityId,
      workflowState: body.workflowState ?? 'linguistic_review',
      reviewerNote: body.reviewerNote,
      reviewerRole: user.role,
    },
  });
  return NextResponse.json({ review });
}
