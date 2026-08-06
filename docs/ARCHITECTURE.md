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
  they're graded). `Exercise.lessonId` is optional: hand-authored exercises tied to one specific lesson set it,
  while the drill exercises `seed.ts` generates from the sentence bank leave it null and carry only a `conceptId`.
  A lesson's Practice stage (`src/app/lessons/[code]/page.tsx`, mirrored in the offline bundle route) queries both
  — its own `lessonId` matches plus every unassigned exercise sharing one of its concepts — capped at 8 per
  sitting, so the much larger concept-linked pool (previously reachable only from `/review` or `/offline`) is
  actually used where a learner meets the concept for the first time.
- **Mastery & review**: `ConceptMastery` (six dimension scores + overall + humane label + distinct-days-practiced
  counter) and `ReviewSchedule` (interval/ease/repetitions/dueAt/lastReason) are both keyed `(userId, conceptId)`.
- **Misconceptions**: `Misconception` (static, authored) and `MisconceptionLog` (per-user, per-detection, with a
  `status` lifecycle: `active → repaired → retested_pass/fail`). `Misconception` rows are tagged to one or more
  `Concept`s via `MisconceptionConcept`; both `src/app/lessons/[code]/page.tsx` and the offline bundle route use
  that join to surface every misconception relevant to a lesson's concepts directly inside the lesson's Explain
  stage ("Common mistakes at this stage"), not only inside the standalone Misconception Clinic.

## Request flow: an exercise attempt

1. Client (`ExercisePlayer`) posts `{ response, hintsUsed, responseTimeMs, confidence }` to
   `POST /api/exercises/[id]/attempt`.
2. `gradeAndRecordAttempt` (`src/lib/engine/grade.ts`):
   - Grades the response (`src/lib/grading.ts`: exact/variant match first, lenient keyword-overlap fallback). This
     deterministic pass is the entire grading experience with no Anthropic key connected, and is what the offline
     study mode (`ExercisePlayer`'s `offlineGrading` prop) reuses client-side with no server round-trip at all.
   - If that still says wrong, the exercise's type is one of `AI_GRADABLE_EXERCISE_TYPES` (`src/lib/types.ts` — the
     open-ended, prose-answer types like `explain_rule`/`teach_back`/`free_production`, never the closed-form types
     where exact wording is the point), and the learner has connected an Anthropic key, `gradeWithAI`
     (`src/lib/tutor/claude.ts`) asks Claude to judge semantic equivalence against the exercise's already-verified
     expected answer and explanation — never to independently assert what's grammatically correct. A returned
     verdict can upgrade `isCorrect`/`score` and adds `aiFeedback` to the response; any failure (no key, decryption
     error, API error) silently keeps the deterministic grade, so this is strictly additive.
   - Records an `Attempt` row (with whichever of the above grades ultimately applied).
   - Updates `ConceptMastery` via `applyEvidence` (maps the exercise's `type` to the mastery dimension(s) it's
     evidence for) and `scoreToLabel` (the same-day-mastery-illusion guard lives here).
   - Updates `ReviewSchedule` via `scheduleNextReview`.
   - If incorrect and the exercise carries a `misconceptionTags[0]`, logs (or leaves alone, if already active) a
     `MisconceptionLog`.
3. Response returns rich feedback (correct answer, why, a tempting-but-wrong alternative if catalogued, and any
   newly logged misconception) — never a bare correct/incorrect.

## The Living Teacher: grounded by default, unrestricted by choice

`src/lib/tutor/engine.ts` implements intent matching (word-level case questions, "harder example," "explain more
simply," Yorùbā-note lookup, missing-prerequisite computation from real mastery data, alternative-analysis lookup,
teach-back invitations) with a final fallback to keyword-overlap search across `Concept` and `Misconception` rows.
Every grounded answer either cites the database rows it drew from (`groundedOn`) or explicitly says it doesn't
have a verified answer. With no Anthropic API key connected, this rule engine is the entire Living Teacher, and no
call to an external LLM happens anywhere in this path.

If a learner has connected their own Anthropic API key (`src/app/settings/AnthropicKeyForm.tsx`, encrypted at rest
via `src/lib/crypto.ts`), the behavior changes deliberately: `src/app/api/tutor/ask/route.ts` still runs the rule
engine first, but passes its findings to `answerAsLivingTeacher` (`src/lib/tutor/claude.ts`) as optional,
non-binding context rather than a hard constraint. The system prompt explicitly tells Claude it is *not* restricted
to this app's curriculum, terminology, or scope, and may go beyond, correct, or set aside the rule engine's
findings entirely. This is a one-user product decision, not an oversight: the spec's original "don't let an
unconstrained model be the sole source of grammatical truth" principle is exactly what gets relaxed here, because
this app's only user decided their own understanding matters more than that guarantee. Conversation history (the
last 8 messages) and a short note on the learner's L1/instructional language are also passed along, so the tutor
behaves like it remembers the conversation and can draw Yorùbá-Arabic contrasts on its own. Any error (invalid key,
rate limit, network failure) causes `answerAsLivingTeacher` to return `null`, and the route falls back to the
grounded engine's own answer, so the chat never breaks.

## AI-assisted lesson drafting

The same connected API key can also draft new lessons — `POST /api/studio/generate-lesson` (triggered from
`/studio`'s "AI drafts" tab) calls `draftLessonWithClaude` (`src/lib/tutor/claude.ts`). This is a different trust
boundary from the Living Teacher's unrestricted chat above: a chat answer is read once and forgotten, while an
approved lesson draft becomes part of the app's own tracked curriculum, feeding the same mastery model every other
exercise does — so this path keeps a hard grounding safeguard the chat no longer has. Here Claude is asked to
*write* new pedagogical content and exercises, including grammatical claims it has no independent authority to
assert. Two structural safeguards keep this consistent with the app's grounding principle:

1. **Closed citation list.** Claude receives a fixed list of already-verified sentence codes and may only cite from
   it (enforced via Anthropic's tool-use / structured-output feature, `DRAFT_LESSON_TOOL`); any sentence code it
   invents is dropped server-side in `validateDraft` before anything is written to the database.
2. **A `status` gate, not a suggestion.** Every `Lesson` and `Exercise` row carries a `status` column
   (`"published"` by default for all hand-authored/seeded content). Claude's drafts are written with
   `status: "draft"`, and every learner-facing query in the app filters on `status: "published"` —
   `lessons/[code]`, `lessons/by-concept/[code]`, the review queue, the Misconception Clinic, the offline bundle,
   the Living Teacher's own retrieval, and (as defense in depth) `gradeAndRecordAttempt` itself, which refuses to
   grade a non-published exercise even if its id somehow reached a client. A draft becomes visible to the learner
   only when a human clicks "Approve & publish" in `/studio` (`POST /api/studio/drafts`), which is the one place
   this pipeline hands final judgment to a person rather than a model.

## Offline study

`/offline` (`src/app/offline/OfflineStudio.tsx`) downloads the entire published curriculum — every lesson and the
complete exercise bank, not only lesson-attached exercises — via `GET /api/offline/bundle` into IndexedDB
(`src/lib/offline/db.ts`). Because grading an exercise needs the answer key, the bundle necessarily ships
`expectedAnswer`/`acceptedVariants`/`explanation` to the client, unlike the normal online path, which never sends
those fields — an inherent, accepted trade-off of grading with no server round-trip, appropriate for a personal,
single-user deployment. Once downloaded, `LessonPlayer` and `ExercisePlayer` accept optional offline-grading props
that reuse `src/lib/grading.ts` (the exact function the server uses) for instant local feedback; each attempt is
queued in IndexedDB and replayed through the ordinary `POST /api/exercises/[id]/attempt` endpoint on reconnect
(`src/lib/offline/sync.ts`), so mastery and spaced-review scheduling still run through the single server-side
pipeline exactly once per attempt. `public/sw.js` is a hand-written service worker (network-first, falling back to
cache) that keeps already-visited pages — including `/offline` itself — reachable with no connection at all; it
cannot precache a fixed asset manifest the way a static-export PWA would, since the App Router renders most pages
per-request, so this is a pragmatic "cache what you've seen" strategy rather than a full pre-cache.

## Why SQLite for the reference implementation

SQLite keeps the reference implementation dependency-free (no external database to provision) while exercising the
full relational model. `docs/DEPLOYMENT.md` covers switching to Postgres for a multi-instance production deployment
— the only change required is `datasource db { provider = "postgresql" }` and a connection string; no schema
changes are needed since the schema deliberately avoids SQLite-only features.
