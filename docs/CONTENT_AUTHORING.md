# Content-authoring guide

All curriculum content lives in `content/*.ts` as plain, human-editable TypeScript objects — never inside a
component. `prisma/seed.ts` loads it into the database. This guide covers how to add each content type.

## General workflow

1. Edit the relevant file(s) in `content/`.
2. Run `npm run db:seed` (this **clears and re-seeds** the whole database — safe in development, never run against
   production data without a migration plan).
3. Run `npm test` — the content-integrity suite (`tests/content-integrity.test.ts`) will catch broken cross-references
   (a lesson pointing at a concept that doesn't exist, a dependency pointing at a token position that doesn't exist,
   a prerequisite cycle, etc.) before you even open the app.
4. Visually check the new content in the app (lesson player, X-Ray, Forge, etc. as relevant).

## Adding a concept

Edit `content/concepts.ts`. Each concept needs:

- `code` — a stable, kebab-case key (e.g. `c-idafa`). **Never change an existing code** once lessons/exercises
  reference it — codes are the natural key the seed script resolves.
- `domainCode` — one of the 8 domains in `content/domains.ts` (A–H).
- `definition` / `whyItMatters` — written for the learner, not a grammarian. `whyItMatters` should say why this
  concept matters *for reading or producing Arabic*, not just restate the definition.
- `prerequisites` — an array of concept `code`s. The test suite verifies no cycles exist.
- `nahwWadih` / `tuhfahSaniyyah` (optional) — chapter references for the Reference Companion.

## Adding a root, pattern, or lexeme

- `content/roots.ts`: `radicals` (space-separated letters, e.g. `"ك ت ب"`) + `meaningCore`. Optionally tag
  `irregularity` (`sound | hamzated | doubled | assimilated | hollow | defective`) for your own bookkeeping — this
  field is content-authoring metadata only and isn't persisted (see `prisma/seed.ts`'s `Root.create` call).
- `content/patterns.ts`: `label` (must be unique — it's the natural key), `skeleton` (the pattern written with
  ف/ع/ل as radical placeholders, e.g. `"فَاعِل"`), `category`, and an optional `meaningTendency`.
- `content/lexemes.ts`: link a `rootRadicals` + `patternLabel` to a real, verified `vocalized` word. **Only add a
  lexeme if the word is real and the derivation is correct** — the Morphology Forge explicitly distinguishes
  verified lexemes from mechanical (unverified) letter-substitution, and that distinction is only honest if the
  verified list stays accurate. Weak roots (hamzated/doubled/hollow/defective/assimilated) very often do *not*
  combine with a pattern the naive way — double-check any weak-root lexeme against a dictionary before adding it.

## Adding an annotated sentence

Edit (or add a new file under) `content/sentences/`. Each `SentenceSeed` needs a unique `code`, the vocalized and
unvocalized text, an English translation, and a `tokens` array. Every token should include:

- `position` (1-indexed, sequential, no gaps — enforced by tests)
- `role` and `explanation` (plain English) — required
- Whatever morphological fields are relevant: `rootRadicals`, `patternLabel`, `grammaticalCase`, `mood`, `marker`,
  `markerType` (`visible | secondary | estimated`), etc. — fields that don't apply to a given token (e.g. `person`
  on a particle) should simply be omitted.
- `governedByPosition` (optional) if another token in the sentence governs this one — this powers the "governing
  element" field in the Iʿrāb X-Ray and the reason-from-scratch mode.

Add a `dependencies` array for each syntactic relationship you want visualized (verb→subject, preposition→object,
mubtada→khabar, etc.) — see `content/sentenceTypes.ts` for the full shape and any `content/sentences/*.ts` file for
worked examples.

**Accuracy matters more than volume here.** A single well-annotated sentence with a correct, pedagogically useful
`explanation` per token is worth more than five thin ones. If you're not certain of an analysis, add it to
`alternatives` rather than asserting it as the primary one, and flag it via the Content Studio's review workflow.

## Adding a lesson

Edit `content/lessons.ts`. A lesson needs:

- `unitCode` (must exist in `content/units.ts`)
- `concepts: [{ conceptCode, role }]` — at least one, `role` is `introduces | reinforces | reviews`
- `observeSentenceCodes` — 2–4 sentence codes for the "meaning before labels" contrast set shown before any
  terminology is introduced (per the spec's inductive-first pedagogy)
- `discoveryPrompt` — a guided question the learner reflects on before the explanation is revealed
- `microExplanation` — the simplest accurate explanation, written to stand alone (don't assume the learner
  remembers the discovery prompt's exact wording)
- `deeperDetail` (optional) — an expandable "go deeper" note

## Adding exercises

Exercises live under `content/exercises/*.ts`, grouped by unit for readability, aggregated in
`content/exercises/index.ts`. Every `ExerciseSeed` needs `conceptCode`, `type` (see the `ExerciseType` union in
`src/lib/types.ts` for the full list — 20 types are supported, and multiple-choice should not dominate per the
spec), `prompt`, `expectedAnswer`, `explanation`, and a **hint ladder** (`hints: string[]`, ordered gentle → nearly-
the-answer). Add `misconceptionTags: ['mis-...']` when a wrong answer to this exercise is diagnostic of a specific
misconception in `content/misconceptions.ts` — this is what lets the Misconception Clinic auto-detect from real
attempts rather than needing separate diagnostic quizzes.

`invalidPlausible` (optional) lets you pre-empt the single most common wrong answer with an explanation of
specifically why it's tempting and wrong — this feeds the "a tempting but incorrect alternative" feedback panel.

Beyond hand-authored exercises, `prisma/seed.ts` algorithmically generates two supplementary drills per sentence in
the bank (a vocalization drill and a role-identification drill) directly from the verified token data — this is a
legitimate way to grow exercise count without hand-authoring near-duplicates; see the "Generating supplementary
drill exercises" section of `seed.ts` if you want to add more generated drill types (e.g. a `transform_sentence`
drill generated from the Sentence Laboratory's `content/sentenceLab.ts` families would be a natural next one).

## Adding a misconception

Edit `content/misconceptions.ts`. Each needs a `code`, a description of the error pattern (`evidencePattern`), the
`correctModel`, a `contrastExample` (a minimal pair showing right vs. wrong), and `repairGuidance`. Link it to at
least one concept via `conceptCodes`, and tag it on any exercise in `content/exercises/*.ts` whose wrong answer is
diagnostic of it.

## Adding a reading passage

Edit `content/readingPassages.ts`. Reuse existing annotated sentences where possible via `sentenceCodes` (this
powers the "syntax map" that lets a learner open any passage sentence directly in the Iʿrāb X-Ray) — the passage
text itself can include additional connecting words not in the sentence bank, listed in `vocabPreview`.
