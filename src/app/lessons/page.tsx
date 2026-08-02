import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import ArabicText from '@/components/ArabicText';
import MasteryIndicator from '@/components/MasteryIndicator';
import type { MasteryLabel } from '@/lib/types';

// A proper course catalog: every published lesson, grouped by domain and
// unit, so a learner can jump straight into any topic they want — not just
// whatever the recommendation engine picks next. Nothing here is gated by
// prerequisites; mastery status is shown as information, not a lock.
export default async function LessonsIndexPage() {
  const user = await requireOnboardedUser();

  const [domains, masteries] = await Promise.all([
    prisma.domain.findMany({
      orderBy: { order: 'asc' },
      include: {
        units: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { status: 'published' },
              orderBy: { order: 'asc' },
              include: { concepts: { include: { concept: true }, take: 1 } },
            },
          },
        },
      },
    }),
    prisma.conceptMastery.findMany({ where: { userId: user.id } }),
  ]);

  const masteryByConceptId = new Map(masteries.map((m) => [m.conceptId, m]));

  return (
    <NavShell userName={user.name}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-semibold mb-1">All lessons</h1>
          <p className="text-sm text-ink-500">
            Every lesson, in one place — pick whatever you want to study next. No lesson here is locked; mastery
            status is just information about where you already stand.
          </p>
        </div>

        <div className="space-y-10">
          {domains.map((domain) => {
            const unitsWithLessons = domain.units.filter((u) => u.lessons.length > 0);
            if (unitsWithLessons.length === 0) return null;
            return (
              <section key={domain.id}>
                <h2 className="text-lg font-serif font-semibold mb-1">{domain.title}</h2>
                <p className="text-sm text-ink-500 mb-4">{domain.subtitle}</p>
                <div className="space-y-6">
                  {unitsWithLessons.map((unit) => (
                    <div key={unit.id}>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-jade-700 dark:text-jade-300 mb-2">
                        {unit.title}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {unit.lessons.map((lesson) => {
                          const primaryConcept = lesson.concepts[0]?.concept;
                          const mastery = primaryConcept ? masteryByConceptId.get(primaryConcept.id) : undefined;
                          return (
                            <Link
                              key={lesson.id}
                              href={`/lessons/${lesson.code}`}
                              className="card p-4 hover:border-jade-400 border border-transparent transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-sm">{lesson.title}</p>
                                  <ArabicText text={lesson.titleArabic} className="text-xs text-ink-500" />
                                </div>
                                {mastery && <MasteryIndicator label={mastery.label as MasteryLabel} size="sm" />}
                              </div>
                              <p className="text-xs text-ink-500 mt-2 line-clamp-2">{lesson.summary}</p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </NavShell>
  );
}
