import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { encryptSecret } from '@/lib/crypto';
import { isSupportedModel, validateAnthropicApiKey } from '@/lib/tutor/claude';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const apiKey = String(body.apiKey ?? '').trim();
  const model = String(body.model ?? 'claude-haiku-4-5');

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Enter an API key first.' }, { status: 400 });
  }
  if (!isSupportedModel(model)) {
    return NextResponse.json({ ok: false, error: 'Unsupported model.' }, { status: 400 });
  }

  const result = await validateAnthropicApiKey(apiKey, model);
  if (!result.valid) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  await prisma.learnerProfile.update({
    where: { userId: user.id },
    data: {
      anthropicApiKeyEncrypted: encryptSecret(apiKey),
      anthropicModel: model,
      anthropicKeyValidatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = await requireUser();
  await prisma.learnerProfile.update({
    where: { userId: user.id },
    data: { anthropicApiKeyEncrypted: null, anthropicKeyValidatedAt: null },
  });
  return NextResponse.json({ ok: true });
}
