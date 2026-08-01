# Architecture

## Stack

- **Next.js 14 App Router + TypeScript** — server components for data-heavy pages, client components for
  interactive laboratories.
- **Prisma + SQLite** (`prisma/schema.prisma`) — swap `provider`/`DATABASE_URL` for Postgres in production; the
  schema uses no SQLite-specific features other than storing enum-like fields as plain strings (SQLite has no native
  enum type — see the comment at the top of the schema).
- **NextAuth (credentials provider, JWT sessions)** — no external identity provider dependency.
- **Tailwind CSS** — design tokens in `tailwind.config.ts`, accessibility primitives in `src/app/globals.css`.
- **Vitest** — unit tests for pure logic (`src/lib/mastery`, `src/lib/srs`, `src/lib/grading`,
  `src/lib/placement`) and a content-integrity suite that validates the entire curriculum graph.

## Layered separation (per the spec's requirement to not hard-code content in components)

```
content/            Authored curriculum data (TS objects, human-editable, no DB dependency)
  domains.ts, units.ts, concepts.ts, lessons.ts, sentences/, exercises/, misconceptions.ts,
  roots.ts, patterns.ts, lexemes.ts, placementQuestions.ts, readingPassages.ts,
  referenceWorks.ts, sentenceLab.ts

prisma/
  schema.prisma      Full data model (see below)
  seed.ts            Loads content/* into the database, resolving natural-key
                      references (codes) into generated IDs, then adds algorithmically
                      derived drill exercises from the sentence bank.

src/lib/             Framework-agnostic logic, unit-tested in isolation
  mastery/           4-to-6-dimension mastery scoring, humane labels, "why review" explanations
  srs/               SM-2-derived spaced-repetition scheduler with a same-day-repetition guard
  grading/           Arabic-aware diacritic normalization + short-answer / free-text grading
  placement/         Placement-assessment scoring → recommended starting unit
  tutor/             The Living Teacher's grounded intent-matching engine + vetted Yorùbá notes
  engine/            Server-side orchestration (dashboard recommendations, exercise grading
                      that ties mastery + SRS + misconception-logging together)

src/app/             Routes (pages + API route handlers), one folder per screen
src/components/      Reusable, content-agnostic UI (ArabicText, MasteryIndicator, NavShell,
                      ExercisePlayer, SignOutButton)
```

Nothing in `src/components` or `src/app` hard-codes curriculum content — pages fetch from Prisma, components render
whatever data they're given.

## Data model highlights

See `prisma/schema.prisma` for the authoritative model. Key relationships:

- **Curriculum graph**: `Domain → Unit → Lesson → LessonConcept → Concept`, with `ConceptPrerequisite` forming a DAG
  (verified acyclic by `tests/content-integrity.test.ts`).
- **Linguistic data**: `ArabicSentence → Token → { Root, Pattern, AlternativeAnalysis }`, plus `Dependency` edges
  between tokens for the Iʿrāb X-Ray's relationship view. `Token` carries every field the spec's X-Ray section
  requires (surface forms, root, pattern, morphological features, case/mood, marker + marker type, governor,
  translation, plain-English + traditional explanation).
- **Assessment**: `Exercise → Hint`, `Exercise → Attempt`, with `Exercise.expectedAnswer` /
  `acceptedVariants` / `invalidPlausible` stored as JSON (SQLite has no native array/JSON column type in the
  Prisma sense, so these are `String` columns holding `JSON.stringify`d data — see `src/lib/grading.ts` for how
  they're graded).
- **Mastery & review**: `ConceptMastery` (six dimension scores + overall + humane label + distinct-days-practiced
  counter) and `ReviewSchedule` (interval/ease/repetitions/dueAt/lastReason) are both keyed `(userId, conceptId)`.
- **Misconceptions**: `Misconception` (static, authored) and `MisconceptionLog` (per-user, per-detection, with a
  `status` lifecycle: `active → repaired → retested_pass/fail`).

## Request flow: an exercise attempt

1. Client (`ExercisePlayer`) posts `{ response, hintsUsed, responseTimeMs, confidence }` to
   `POST /api/exercises/[id]/attempt`.
2. `gradeAndRecordAttempt` (`src/lib/engine/grade.ts`):
   - Grades the response (`src/lib/grading.ts`: exact/variant match first, lenient keyword-overlap fallback).
   - Records an `Attempt` row.
   - Updates `ConceptMastery` via `applyEvidence` (maps the exercise's `type` to the mastery dimension(s) it's
     evidence for) and `scoreToLabel` (the same-day-mastery-illusion guard lives here).
   - Updates `ReviewSchedule` via `scheduleNextReview`.
   - If incorrect and the exercise carries a `misconceptionTags[0]`, logs (or leaves alone, if already active) a
     `MisconceptionLog`.
3. Response returns rich feedback (correct answer, why, a tempting-but-wrong alternative if catalogued, and any
   newly logged misconception) — never a bare correct/incorrect.

## The Living Teacher's grounding

`src/lib/tutor/engine.ts` implements intent matching (word-level case questions, "harder example," "explain more
simply," Yorùbā-note lookup, missing-prerequisite computation from real mastery data, alternative-analysis lookup,
teach-back invitations) with a final fallback to keyword-overlap search across `Concept` and `Misconception` rows.
Every answer either cites the database rows it drew from (`groundedOn`) or explicitly says it doesn't have a
verified answer. There is no call to an external LLM anywhere in this path — this is deliberate (see the spec's
"do not allow an unconstrained language model to serve as the sole source of grammatical truth" requirement) and
means the tutor's honesty guarantees hold structurally, not by prompting.

## Why SQLite for the reference implementation

SQLite keeps the reference implementation dependency-free (no external database to provision) while exercising the
full relational model. `docs/DEPLOYMENT.md` covers switching to Postgres for a multi-instance production deployment
— the only change required is `datasource db { provider = "postgresql" }` and a connection string; no schema
changes are needed since the schema deliberately avoids SQLite-only features.
