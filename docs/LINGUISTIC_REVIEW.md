# Linguistic review guide

Miftāḥ's content workflow states (stored per-item via the `ContentReview` model, browsable and flaggable in
`/studio`) are: **draft → linguistic_review → pedagogical_review → yoruba_review → technical_validation → approved
→ published → retired**. This guide is for whoever performs the `linguistic_review` and `pedagogical_review` steps.

## What to check on a new or edited Arabic sentence

1. **Vocalization is correct and complete** for the stated diacritic level. Check every word against a reliable
   grammar reference, not just intuition — this app's whole premise is that endings are evidence of roles, so a
   wrong ending teaches a wrong rule.
2. **Every token's `role` is the standard traditional term** (or an explicitly marked alternative). If two
   traditional grammarians would disagree, use `AlternativeAnalysis` rather than picking one silently.
3. **`markerType` is accurate**: `visible` only for an audible short vowel change, `secondary` for dual/sound-plural
   suffixes, `estimated` only where the case is genuinely blocked from being pronounced (not merely "hard to hear").
4. **`explanation` is written in plain English for a non-native adult learner** — not a restatement of the
   traditional Arabic grammar term. `traditionalExplanation`, if present, is where the traditional Arabic phrasing
   belongs.
5. **`governedByPosition` and `Dependency` rows are consistent** — if a preposition governs a noun, both the token's
   `governedByPosition` and a `preposition_object` dependency should exist and agree.
6. **Qur'anic, hadith, or classical source text is never altered.** If `sourceType` is anything other than
   `original`, the `textVocalized` must match the verified source exactly, `sourceRef` must be accurate, and any
   transformation exercise must use a different (original) sentence instead of modifying the source text — per the
   spec's Qur'anic/classical content safeguards.

## What to check on a new concept or lesson

1. **`whyItMatters` is not a restatement of `definition`.** It should answer "why does a learner need this," not
   just "what is this."
2. **Prerequisites are real prerequisites**, not just "related" concepts — ask "could a learner produce or
   recognize this without first knowing X?" If yes, X is not a hard prerequisite (mark it `recommended` instead, if
   you extend the model).
3. **The `observeSentenceCodes` genuinely demonstrate the contrast the lesson is about**, and the terminology in
   `microExplanation` does not leak into the discovery-stage prompt (meaning-before-labels is the whole point).
4. **Run `npm test`** — the content-integrity suite catches structural errors (broken references, cycles,
   duplicate codes) automatically, so a human reviewer should focus on linguistic and pedagogical correctness, not
   on cross-reference bookkeeping.

## What to check on an exercise

1. **`expectedAnswer` is actually correct** and, ideally, the *most natural* correct answer (since grading also
   accepts free-text overlap, an overly narrow expected answer produces false negatives for correct learner
   answers — add `acceptedVariants` liberally).
2. **`misconceptionTags` are genuinely diagnostic** — a wrong answer to this specific exercise should actually
   indicate the tagged misconception, not just be "some kind of wrong."
3. **Hints escalate** — hint 1 should nudge without giving away the answer; the last hint can be close to explicit.
4. Multiple-choice is not overused — check the exercise-type distribution in `content/exercises/*.ts` against the
   spec's requirement that recognition-only multiple-choice not dominate the exercise mix.

## The Yorùbá-language review pass

Yorùbá contrast notes live in `src/lib/tutor/yorubaNotes.ts` — a small, deliberately curated list. A Yorùbá-language
reviewer should verify:

1. Every claim about Yorùbá grammar is **actually true of Yorùbá**, not an assumption.
2. Orthography and any tone marks are correct.
3. The note is genuinely useful for a Yorùbá-L1 learner of Arabic specifically — not a generic "languages differ"
   observation.

**Do not add a Yorùbá claim anywhere in the app (including via the Living Teacher) without going through this
list.** The Living Teacher is coded to refuse to invent a Yorùbá claim outside this reviewed set and to say so
plainly instead (`src/lib/tutor/engine.ts`, the `yoruba_fallback` intent) — that guarantee only holds if every
future Yorùbá note is added here, reviewed, and not fabricated ad hoc elsewhere.

## Technical validation

The final pre-publish gate: run `npm test` and `npm run build`, spot-check the item in the actual running app
(light + dark theme, RTL rendering, mobile width), and confirm it doesn't regress any of the checks in
`docs/ARCHITECTURE.md`'s data-model section. AI-assisted content additions should never skip straight to `published`
— route them through this full chain, per the spec's requirement that AI-generated content remain unpublished until
it passes both automated checks and human review.
