import Link from 'next/link';
import { requireOnboardedUser } from '@/lib/session';
import { getDashboardData } from '@/lib/engine/recommend';
import NavShell from '@/components/NavShell';
import MasteryIndicator from '@/components/MasteryIndicator';
import type { MasteryLabel } from '@/lib/types';

const SESSION_LENGTHS = [
  { minutes: 3, label: '3 min', sub: 'Retrieval burst' },
  { minutes: 7, label: '7 min', sub: 'Focused review' },
  { minutes: 15, label: '15 min', sub: 'Compact lesson' },
  { minutes: 25, label: '25 min', sub: 'Complete lesson' },
  { minutes: 45, label: '45 min', sub: 'Intensive study' },
  { minutes: 0, label: 'Open', sub: 'Until you stop' },
];

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const data = await getDashboardData(user.id);

  return (
    <NavShell userName={user.name}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <div>
          <p className="text-sm text-ink-500">Welcome back,</p>
          <h1 className="text-3xl font-serif font-semibold">{user.name.split(' ')[0]}</h1>
          {data.streak > 0 && (
            <p className="text-sm text-jade-700 dark:text-jade-300 mt-1">{data.streak}-day study streak</p>
          )}
        </div>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">What should I study now?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.recommendations.map((r) => (
              <Link key={r.title} href={r.href} className="card p-5 hover:border-jade-400 hover:shadow-sm transition-all block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-jade-700 dark:text-jade-300">{r.kind.replace('_', ' ')}</span>
                  <span className="text-xs text-ink-400">~{r.estimatedMinutes} min</span>
                </div>
                <p className="font-medium text-ink-900 dark:text-parchment-50">{r.title}</p>
                <p className="text-sm text-ink-500 mt-1">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">How long do you have?</h2>
          <div className="flex flex-wrap gap-3">
            {SESSION_LENGTHS.map((s) => (
              <Link
                key={s.label}
                href={data.nextNewConcept ? `/lessons/by-concept/${data.nextNewConcept.code}?length=${s.minutes}` : '/review'}
                className="rounded-xl border border-ink-900/10 dark:border-white/10 px-4 py-3 text-center hover:border-jade-400 transition-colors"
              >
                <p className="font-semibold text-ink-900 dark:text-parchment-50">{s.label}</p>
                <p className="text-xs text-ink-500">{s.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">What needs review</h2>
            {data.dueReviews.length === 0 ? (
              <p className="text-sm text-ink-500">Nothing is due right now — good time for something new.</p>
            ) : (
              <ul className="space-y-3">
                {data.reviewExplanations.map((r) => (
                  <li key={r.conceptTitle} className="text-sm">
                    <p className="font-medium text-ink-800 dark:text-ink-100">{r.conceptTitle}</p>
                    <p className="text-ink-500 text-xs mt-0.5">{r.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/review" className="inline-block mt-4 text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              Open review queue →
            </Link>
          </section>

          <section className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">What misconception is holding me back</h2>
            {data.activeMisconceptions.length === 0 ? (
              <p className="text-sm text-ink-500">No active misconceptions detected — keep it that way in the Misconception Clinic.</p>
            ) : (
              <ul className="space-y-3">
                {data.activeMisconceptions.map((m) => (
                  <li key={m.id} className="text-sm">
                    <p className="font-medium text-ink-800 dark:text-ink-100">{m.misconception.title}</p>
                    <p className="text-ink-500 text-xs mt-0.5">{m.misconception.description}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/clinic" className="inline-block mt-4 text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              Open Misconception Clinic →
            </Link>
          </section>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">What I'm learning</h2>
            <Link href="/curriculum" className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              View full constellation →
            </Link>
          </div>
          {data.masteries.length === 0 ? (
            <p className="text-sm text-ink-500">Your mastery map will appear here once you start your first lesson.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.masteries.map((m) => (
                <div key={m.id} className="card px-3 py-2 flex items-center gap-2">
                  <span className="text-sm">{m.concept.title}</span>
                  <MasteryIndicator label={m.label as MasteryLabel} size="sm" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-4 gap-4">
          {[
            { href: '/xray', label: 'Iʿrāb X-Ray' },
            { href: '/lab', label: 'Sentence Laboratory' },
            { href: '/forge', label: 'Morphology Forge' },
            { href: '/teacher', label: 'Ask the Living Teacher' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="card p-4 text-center hover:border-jade-400 transition-colors">
              <p className="text-sm font-medium">{l.label}</p>
            </Link>
          ))}
        </section>
      </div>
    </NavShell>
  );
}
