import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/session';
import { gradeAndRecordAttempt } from '@/lib/engine/grade';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const body = await req.json();
  const feedback = await gradeAndRecordAttempt({
    userId: user.id,
    exerciseId: params.id,
    response: String(body.response ?? ''),
    hintsUsed: Number(body.hintsUsed ?? 0),
    responseTimeMs: Number(body.responseTimeMs ?? 0),
    confidence: body.confidence ? Number(body.confidence) : undefined,
    sessionId: body.sessionId,
  });
  return NextResponse.json(feedback);
}
