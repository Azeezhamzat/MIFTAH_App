import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import TeacherChat from './TeacherChat';

export default async function TeacherPage() {
  const user = await requireOnboardedUser();
  const concepts = await prisma.concept.findMany({ orderBy: { order: 'asc' }, select: { code: true, title: true } });

  return (
    <NavShell userName={user.name}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-semibold mb-2">Living Teacher</h1>
        <p className="text-sm text-ink-500 mb-8">
          Answers are grounded in this app's verified grammatical knowledge base — not an open-ended guess. When it
          isn't sure, it says so.
        </p>
        <TeacherChat concepts={concepts} />
      </div>
    </NavShell>
  );
}
