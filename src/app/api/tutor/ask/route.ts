import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { answerQuestion } from '@/lib/tutor/engine';
import { decryptSecret } from '@/lib/crypto';
import { answerAsLivingTeacher, isSupportedModel } from '@/lib/tutor/claude';

const HISTORY_MESSAGES = 8;

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

  const priorMessages = await prisma.tutorMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_MESSAGES,
  });

  await prisma.tutorMessage.create({
    data: { conversationId: conversation.id, role: 'learner', text: question },
  });

  const answer = await answerQuestion({ userId: user.id, question, contextConceptCode, contextSentenceId });

  let finalText = answer.text;
  let enhancedByClaude = false;

  const [learnerProfile, langProfile] = await Promise.all([
    prisma.learnerProfile.findUnique({ where: { userId: user.id } }),
    prisma.languageProfile.findUnique({ where: { userId: user.id } }),
  ]);
  if (learnerProfile?.anthropicApiKeyEncrypted && isSupportedModel(learnerProfile.anthropicModel)) {
    try {
      const apiKey = decryptSecret(learnerProfile.anthropicApiKeyEncrypted);
      const learnerContext = langProfile
        ? `The learner's first language is ${langProfile.motherTongue}, and they study through ${langProfile.instructionalLanguage}. When a contrast with their first language would clarify something (e.g. word order, agreement, a grammatical category their language doesn't mark), draw on it.`
        : undefined;
      const enhanced = await answerAsLivingTeacher({
        apiKey,
        model: learnerProfile.anthropicModel,
        question,
        conversationHistory: priorMessages.reverse().map((m) => ({ role: m.role as 'learner' | 'tutor', text: m.text })),
        groundedAnswer: answer.text,
        learnerContext,
      });
      if (enhanced) {
        finalText = enhanced;
        enhancedByClaude = true;
      }
    } catch {
      // Decryption or the Claude call failed — silently keep the grounded answer.
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
