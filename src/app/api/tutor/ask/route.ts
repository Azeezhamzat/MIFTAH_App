import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { answerQuestion } from '@/lib/tutor/engine';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const question = String(body.question ?? '');
  const contextConceptCode = body.contextConceptCode as string | undefined;
  const contextSentenceId = body.contextSentenceId as string | undefined;

  let conversation = await prisma.tutorConversation.findFirst({
    where: { userId: user.id, contextType: 'general' },
    orderBy: { createdAt: 'desc' },
  });
  if (!conversation) {
    conversation = await prisma.tutorConversation.create({
      data: { userId: user.id, contextType: 'general' },
    });
  }

  await prisma.tutorMessage.create({
    data: { conversationId: conversation.id, role: 'learner', text: question },
  });

  const answer = await answerQuestion({ userId: user.id, question, contextConceptCode, contextSentenceId });

  const tutorMessage = await prisma.tutorMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'tutor',
      text: answer.text,
      groundedOn: JSON.stringify(answer.groundedOn),
      uncertain: answer.uncertain,
      intent: answer.intent,
    },
  });

  return NextResponse.json({ ...answer, messageId: tutorMessage.id });
}
