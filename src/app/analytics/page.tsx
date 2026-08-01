import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import MasteryIndicator from '@/components/MasteryIndicator';
import type { MasteryLabel } from '@/lib/types';

export default async function AnalyticsPage() {
  const user = await requireOnboardedUser();

  const [attempts, masteries, misconceptionLogs, learnerProfile] = await Promise.all([
    prisma.attempt.findMany({ where: { userId: user.id }, orderBy: { attemptedAt: 'asc' } }),
    prisma.conceptMastery.findMany({ where: { userId: user.id }, include: { concept: { include: { domain: true } } } }),
    prisma.misconceptionLog.findMany({ where: { userId: user.id } }),
    prisma.learnerProfile.findUnique({ where: { userId: user.id } }),
  ]);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAttempts === 0 ? null : Math.round((correctAttempts / totalAttempts) * 100);

  const labelCounts: Record<string, number> = {};
  for (const m of masteries) labelCounts[m.label] = (labelCounts[m.label] ?? 0) + 1;

  const byDomain = new Map<string, { total: number; mastered: number }>();
  for (const m of masteries) {
    const key = m.concept.domain.title;
    const entry = byDomain.get(key) ?? { total: 0, mastered: 0 };
    entry.total += 1;
    if (m.label === 'reliable' || m.label === 'strong') entry.mastered += 1;
    byDomain.set(key, entry);
  }

  const last14 = new Map<string, number>();
  const now = new Date();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 86_400_000);
    last14.set(d.toISOString().slice(0, 10), 0);
  }
  for (const a of attempts) {
    const key = a.attemptedAt.toISOString().slice(0, 10);
    if (last14.has(key)) last14.set(key, (last14.get(key) ?? 0) + 1);
  }
  const maxDay = Math.max(1, ...Array.from(last14.values()));

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-serif font-semibold">Progress analytics</h1>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-serif font-semibold">{learnerProfile?.currentStreak ?? 0}</p>
            <p className="text-xs text-ink-500">Day streak</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-serif font-semibold">{totalAttempts}</p>
            <p className="text-xs text-ink-500">Total attempts</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-serif font-semibold">{accuracy === null ? '—' : `${accuracy}%`}</p>
            <p className="text-xs text-ink-500">Overall accuracy</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-serif font-semibold">{misconceptionLogs.filter((m) => m.status === 'active').length}</p>
            <p className="text-xs text-ink-500">Active misconceptions</p>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Activity, last 14 days</h2>
          <div className="card p-6 flex items-end gap-1.5 h-32">
            {Array.from(last14.entries()).map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-jade-500 rounded-t"
                  style={{ height: `${(count / maxDay) * 100}%`, minHeight: count > 0 ? '4px' : '0px' }}
                  title={`${day}: ${count} attempts`}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Mastery distribution</h2>
          {masteries.length === 0 ? (
            <p className="text-sm text-ink-500">No concepts studied yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(labelCounts).map(([label, count]) => (
                <div key={label} className="card px-4 py-3 flex items-center gap-2">
                  <MasteryIndicator label={label as MasteryLabel} size="sm" />
                  <span className="text-sm text-ink-600 dark:text-ink-300">{count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Mastery by domain</h2>
          <div className="space-y-2">
            {Array.from(byDomain.entries()).map(([domain, stat]) => (
              <div key={domain} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{domain}</span>
                  <span className="text-xs text-ink-500">{stat.mastered}/{stat.total} mastered</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                  <div className="h-full bg-jade-500" style={{ width: `${(stat.mastered / stat.total) * 100}%` }} />
                </div>
              </div>
            ))}
            {byDomain.size === 0 && <p className="text-sm text-ink-500">Nothing tracked yet.</p>}
          </div>
        </section>
      </div>
    </NavShell>
  );
}
