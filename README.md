# مِفْتَاح — Miftāḥ

**See the system. Build the language.**

Miftāḥ is a complete, interactive personal teacher of Arabic Naḥw (syntax) and Ṣarf (morphology) for a non-native
adult learner — built around discovery-based lessons, four signature laboratories, a knowledge-base-grounded
conversational tutor, an explainable mastery and spaced-review engine, and a personalized misconception clinic.

This is a real, running application with a seeded curriculum, not a mockup: 40 concepts, 37 lessons, 100 fully
annotated Arabic sentences, 34 roots, 23 morphological patterns, 85 lexemes, 343 exercises, 15 tracked
misconceptions, an 18-question adaptive placement assessment, and 3 connected reading passages, all backed by a
real database and a real mastery/spaced-repetition engine.

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Then open **http://localhost:3000**.

> **Note for zsh users (default on macOS):** if you copy commands with trailing `# comments` into an interactive
> zsh prompt, zsh does not treat `#` as a comment there (unlike bash) — it passes everything after `#` as literal
> arguments to the command, which breaks it in confusing ways (`cp` erroring about a directory named after a word
> in the comment, or `next dev` erroring "Invalid project directory"). Paste each command on its own line with no
> trailing comment, as above, and this can't happen.

`.env.example` ships with a placeholder `NEXTAUTH_SECRET` — it works for local development, but replace it with a
real random value before deploying anywhere reachable by others:

```bash
openssl rand -base64 32
```

Paste the output as `NEXTAUTH_SECRET` in `.env`.

Demo login (pre-seeded with realistic progress so the dashboard, review queue, and analytics have real data on
first visit): **demo@miftah.app / learnarabic**

Or sign up fresh and go through onboarding → the 12–18 minute adaptive placement assessment yourself.

Run the test suite:

```bash
npm test
```

### Desktop app

To build an installable desktop app for your own machine instead of running `npm run dev`:

```bash
npm run dist:linux   # AppImage + .deb — verified end-to-end
npm run dist:win     # needs Wine on Linux, or run natively on Windows
npm run dist:mac     # must be built on macOS — Apple allows no workaround
```

See [`docs/DESKTOP.md`](docs/DESKTOP.md) — it also covers a GitHub Actions workflow that builds all three
installers for you on GitHub's own native runners, if you don't have Windows/Mac hardware handy.

## What's actually implemented

| Area | Status |
|---|---|
| Onboarding, learner/language profile, goals | ✅ Functional |
| Adaptive placement assessment + scoring engine | ✅ Functional (see [Assumptions](#assumptions--known-limitations)) |
| Daily dashboard (8 key questions from the spec) | ✅ Functional |
| Lesson catalog (`/lessons` — pick any of the 37 lessons directly, no gating) | ✅ Functional |
| Lesson player (Observe → Discover → Explain → Practice → Reflect, with a word-by-word grammatical breakdown, a "Common mistakes" section drawn from the misconception bank, and a full "Go deeper" explanation for every one of the 37 lessons) | ✅ Functional |
| Exercise engine (20 exercise types, hint ladders, rich feedback, click-to-answer for identify_role/identify_governor/select_ending exercises, a lesson's Practice stage draws on its full concept-linked exercise pool, capped at 8 per sitting — every one of the 37 lessons now reaches that full 8-exercise cap, not just the ones that happened to have enough hand-authored content already) | ✅ Functional |
| Mastery model (6 dimensions, humane labels, explainable) | ✅ Functional |
| Spaced review scheduler (SM-2-derived, same-day guard) | ✅ Functional |
| Misconception Clinic (detection, repair loop, retest) | ✅ Functional |
| Iʿrāb X-Ray (full token inspector, dependencies, reason-from-scratch) | ✅ Functional |
| Sentence Laboratory (real transformation families, break-the-sentence) | ✅ Functional |
| Morphology Forge (root+pattern composition, verified vs. mechanical) | ✅ Functional |
| Living Teacher (grounded by default; unrestricted Claude when a key is connected) — Claude is no longer confined to this one chat surface: it also optionally grades paraphrased open-ended exercise answers, and a wrong answer links straight into a prefilled Living Teacher question | ✅ Functional |
| Grammar Constellation (interactive prerequisite graph) | ✅ Functional |
| Reading Library (3 passages, vocab preview, comprehension, syntax map) | ✅ Functional |
| Root & vocabulary notebook | ✅ Functional |
| Progress analytics | ✅ Functional |
| Reference Companion (Naḥw al-Wāḍiḥ / al-Tuḥfah al-Saniyyah mappings) | ✅ Functional |
| Settings (theme, motion, diacritics, Yorùbá notes, Quiet Progress) | ✅ Functional |
| Account export & deletion | ✅ Functional |
| Content-authoring / linguistic review studio, incl. AI-drafted lessons | ✅ Functional (see [Assumptions](#assumptions--known-limitations)) |
| Offline PWA (full curriculum + exercise bank downloadable, local grading, sync queue) | ✅ Functional |
| Desktop app (Linux/Windows/macOS installers, Electron) | ✅ Functional — see [`docs/DESKTOP.md`](docs/DESKTOP.md) |
| Android app (Capacitor WebView + offline PWA) | ✅ Scaffolded & verified where this sandbox allows — see [`docs/MOBILE.md`](docs/MOBILE.md) |
| Full 250-exercise / 100-sentence content targets | ✅ Met — 311 exercises, 100 sentences (see below) |

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the honest, itemized gap list and what Phase 5/6 would add.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design, data model, request flow, technology choices
- [`docs/CONTENT_AUTHORING.md`](docs/CONTENT_AUTHORING.md) — how to add lessons, sentences, exercises, roots/patterns
- [`docs/LINGUISTIC_REVIEW.md`](docs/LINGUISTIC_REVIEW.md) — the review workflow and what a reviewer checks
- [`docs/REFERENCE_MAPPING.md`](docs/REFERENCE_MAPPING.md) — how concepts map to Naḥw al-Wāḍiḥ / al-Tuḥfah al-Saniyyah
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deploying beyond local SQLite
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — assumptions made and what's next

## Technology

Next.js 14 (App Router) + TypeScript, Tailwind CSS, Prisma + SQLite (swappable for Postgres — see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)), NextAuth (credentials + JWT sessions), Vitest. No external LLM API
dependency by default: the Living Teacher is a grounded, knowledge-base-constrained rule engine over the same
curriculum data everything else uses. A learner may optionally paste their own Anthropic API key in Settings
(stored AES-256-GCM encrypted) — as the app's sole user, they've chosen to have the Living Teacher stop being
limited to this app's curriculum once a key is connected, answering with Claude's own full knowledge of Arabic
instead. This is a deliberate, explicit trade-off: it's no longer possible to guarantee every answer traces back to
a specific verified row once that's turned on. The grounded rule engine's findings are still passed in as helpful,
non-binding context, and it remains the entire experience when no key is connected.

## Design

Deep indigo, jade, warm parchment, charcoal ink, muted sand, and restrained gold — full light/dark theming, RTL-safe
Arabic rendering throughout (`ArabicText` component with direction isolation), reduced-motion support, and
diacritic-level controls. See `tailwind.config.ts` for the full palette and `src/app/globals.css` for the
accessibility primitives (focus rings, high-contrast mode, combining-mark handling).

## Assumptions & known limitations

- **Click-to-answer covers the exercise types where it's safe to derive, not all 20 types.** `identify_role` and
  `identify_governor` exercises linked to a sentence now offer that sentence's own words as clickable choices
  instead of a text box — no new content-authoring needed, since the sentence's tokens are already an
  always-correct option set (`src/lib/exerciseChoices.ts`). `select_ending` exercises use explicitly authored
  choices where the answer format is a genuine two-option pick. Open-ended types (`explain_rule`, `teach_back`,
  `full_irab`, `analyze_passage`, `free_production`, etc.) are still free text on purpose — a real answer there
  can't be reduced to a button. If an exercise has no derivable or authored choices, it falls back to free text
  automatically, so nothing breaks.
- **The lesson's "word-by-word breakdown" reuses already-authored data, not new writing.** Every sentence in this
  app already has full per-token role/case/marker/explanation data (originally built for the Iʿrāb X-Ray tool);
  the Explain stage of every lesson now surfaces that same analysis inline, so depth didn't require re-authoring
  37 lessons' worth of new prose — it required surfacing data that already existed but wasn't shown there before.
- **"Lessons rush from a short explanation straight to testing" traced to a real query bug, not a content-depth
  problem — most of the practice content already existed and simply wasn't being shown.** A direct count found the
  curriculum held 230+ exercises, but a lesson's Practice stage only ever queried exercises explicitly authored
  *for that specific lesson* (`Exercise.lessonId`) — ignoring the larger pool of concept-linked drill exercises
  `prisma/seed.ts` generates from the sentence bank, which carry a `conceptId` but no `lessonId` and were only ever
  reachable from `/review` or `/offline`. 11 of the 37 lessons had just 1–2 practice items because of this; the
  average across all lessons was 2.8. The Practice stage (`src/app/lessons/[code]/page.tsx`, mirrored in the
  offline bundle) now pulls every exercise tagged with the lesson's own concepts, not only the lesson-specific
  subset — capped at 8 per sitting so the longest concept pools don't turn into a marathon. The new floor is 3 and
  the average is 6.2; a few of the very thinnest concepts (Form I verbs, doubled verbs, what makes an utterance
  complete) had a real content gap underneath the query bug too and got 1–2 newly hand-authored exercises each to
  clear a minimum of 3.
- **Exact-wording grading on open-ended exercises now has an optional AI-assisted second pass, not just a
  keyword-overlap fallback.** The deterministic grader (`src/lib/grading.ts`) still runs first and still works
  fully offline — exact/variant match, then a keyword-overlap check — but a keyword check will mark a genuinely
  correct, differently-worded explanation as a "0% match." For the exercise types where the answer is real prose
  rather than a specific grammatical term (`explain_rule`, `teach_back`, `analyze_passage`, `free_production`, and
  similarly open-ended types — see `AI_GRADABLE_EXERCISE_TYPES` in `src/lib/types.ts`), if the deterministic grade
  comes back wrong and the learner has connected their own Anthropic key, `gradeAndRecordAttempt`
  (`src/lib/engine/grade.ts`) asks Claude to judge semantic equivalence against the already-verified expected
  answer — the same "compare to verified truth, don't invent new truth" trust boundary `draftLessonWithClaude`
  already uses, not the unrestricted one the chat uses. Exercise types where the answer *is* a specific case
  ending, role label, or form (`identify_role`, `select_ending`, `complete_paradigm`, etc.) are deliberately
  excluded — there, exact wording is the actual point, and AI leniency would be the wrong kind of leniency. This
  is also the first place in the app besides the Living Teacher chat where a connected key does something: each
  wrong answer on an exercise now also links straight to a prefilled Living Teacher question about that specific
  mistake (`Ask the Living Teacher about this →`), so the tutor isn't a separate, undiscoverable page anymore.
- **No external LLM by default; unrestricted by explicit choice once a key is connected.** With no key, the Living
  Teacher is a grounded rule/knowledge-base engine, not a call to an LLM API — it never hallucinates a grammatical
  claim, but its range is bounded by the curriculum's knowledge base, and it says so explicitly when a question
  falls outside it. Connecting an Anthropic API key (Settings) turns this off on purpose: the app's sole user
  decided that their own understanding matters more than staying inside this app's chosen scope, so with a key,
  the Living Teacher answers using Claude's full knowledge, drawing on the rule engine's findings only as optional
  context. Any failure of the Claude call (bad key, rate limit, network) silently falls back to the plain grounded
  answer.
- **Placement scoring is deterministic-adaptive, not IRT-adaptive.** It presents a fixed, difficulty-ordered bank of
  18 questions and computes a recommended starting unit from per-skill-area accuracy against curriculum prerequisite
  order — genuinely adaptive in *outcome*, not in *item selection during the test*. True item-response-theory
  adaptivity is a reasonable Phase 5 enhancement once a larger item bank exists.
- **Grammar Constellation renders prerequisite edges as straight SVG lines on a deterministic grid**, not a
  force-directed layout — fully functional and navigable, but a canvas/force-graph library would look more organic
  at a larger scale.
- **The 30-lesson / 250-exercise / 100-sentence numeric targets are now all met** (37 lessons, 343 exercises, 100
  sentences), reached the same way the rest of this app's content has been grown throughout — real linguistic
  accuracy per item, not padding. Sentences were added deliberately spread across all 37 lessons (one or two fresh,
  differently-worded examples per lesson) rather than piled onto a handful of units, and every lesson's Practice
  stage now reaches the full 8-exercise cap — the practice-depth dimension specifically is now even across the
  whole curriculum, not concentrated in whichever units happened to be authored first. What is *not* claimed to be
  even is sentence-annotation depth per concept: the deepest, most example-rich token-level annotation still sits
  in 5 core units (nominal sentence, verbal sentence, case foundations, roots & patterns, basic verb conjugation).
  Meeting the numeric targets and evening out practice depth is not the same claim as "every domain has
  textbook-level breadth of annotated examples," and `docs/ROADMAP.md` is explicit about where that distinction
  still matters. The content-authoring pipeline (`content/*.ts` → `prisma/seed.ts`) continues to scale with no
  architecture changes if further breadth is wanted.
