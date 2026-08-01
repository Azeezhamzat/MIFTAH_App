import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { answerQuestion } from '@/lib/tutor/engine';
import { decryptSecret } from '@/lib/crypto';
import { enhanceAnswerWithClaude, isSupportedModel } from '@/lib/tutor/claude';

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

  let finalText = answer.text;
  let enhancedByClaude = false;

  const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId: user.id } });
  if (learnerProfile?.anthropicApiKeyEncrypted && isSupportedModel(learnerProfile.anthropicModel)) {
    try {
      const apiKey = decryptSecret(learnerProfile.anthropicApiKeyEncrypted);
      const enhanced = await enhanceAnswerWithClaude({
        apiKey,
        model: learnerProfile.anthropicModel,
        question,
        groundedAnswer: answer.text,
        uncertain: answer.uncertain,
      });
      if (enhanced) {
        finalText = enhanced;
        enhancedByClaude = true;
      }
    } catch {
      // Decryption or enhancement failed — silently keep the grounded answer.
    }
  }

  const tutorMessage = await prisma.tutorMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'tutor',
      text: finalText,
      groundedOn: JSON.stringify(answer.groundedOn),
      uncertain: answer.uncertain,
      intent: answer.intent,
    },
  });

  return NextResponse.json({ ...answer, text: finalText, enhancedByClaude, messageId: tutorMessage.id });
}
