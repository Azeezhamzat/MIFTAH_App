# مِفْتَاح — Miftāḥ

**See the system. Build the language.**

Miftāḥ is a complete, interactive personal teacher of Arabic Naḥw (syntax) and Ṣarf (morphology) for a non-native
adult learner — built around discovery-based lessons, four signature laboratories, a knowledge-base-grounded
conversational tutor, an explainable mastery and spaced-review engine, and a personalized misconception clinic.

This is a real, running application with a seeded curriculum, not a mockup: 40 concepts, 37 lessons, 62 fully
annotated Arabic sentences, 34 roots, 23 morphological patterns, 85 lexemes, 230 exercises, 15 tracked
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
| Lesson player (Observe → Discover → Explain → Practice → Reflect) | ✅ Functional |
| Exercise engine (20 exercise types, hint ladders, rich feedback) | ✅ Functional |
| Mastery model (6 dimensions, humane labels, explainable) | ✅ Functional |
| Spaced review scheduler (SM-2-derived, same-day guard) | ✅ Functional |
| Misconception Clinic (detection, repair loop, retest) | ✅ Functional |
| Iʿrāb X-Ray (full token inspector, dependencies, reason-from-scratch) | ✅ Functional |
| Sentence Laboratory (real transformation families, break-the-sentence) | ✅ Functional |
| Morphology Forge (root+pattern composition, verified vs. mechanical) | ✅ Functional |
| Living Teacher (grounded, non-LLM, admits uncertainty) | ✅ Functional |
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
| Full 250-exercise / 100-sentence content targets | ⚠️ Partial — see below |

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
curriculum data everything else uses — by design, per the spec's requirement that an unconstrained model must never
be the sole source of grammatical truth. A learner may optionally paste their own Anthropic API key in Settings
(stored AES-256-GCM encrypted) to have Claude additionally rephrase the already-grounded answer; the rule engine
still performs all retrieval and Claude is constrained by a system prompt to never add facts beyond what it's given.

## Design

Deep indigo, jade, warm parchment, charcoal ink, muted sand, and restrained gold — full light/dark theming, RTL-safe
Arabic rendering throughout (`ArabicText` component with direction isolation), reduced-motion support, and
diacritic-level controls. See `tailwind.config.ts` for the full palette and `src/app/globals.css` for the
accessibility primitives (focus rings, high-contrast mode, combining-mark handling).

## Assumptions & known limitations

- **No external LLM by default.** The Living Teacher is intentionally a grounded rule/knowledge-base engine, not a
  call to an LLM API — this matches the spec's explicit requirement and means it never hallucinates a grammatical
  claim, but it also means its range is bounded by what's in the curriculum's knowledge base (concepts,
  misconceptions, sentences, Yorùbá contrast notes). It says so explicitly whenever a question falls outside that
  range. A learner can optionally connect their own Anthropic API key (Settings → "Living Teacher enhancement") so
  Claude rephrases/expands the already-grounded answer under a strict system prompt forbidding any fact beyond what
  was retrieved — grounding and retrieval stay entirely in the rule engine either way, and any failure of the Claude
  call (bad key, rate limit, network) silently falls back to the plain grounded answer.
- **Placement scoring is deterministic-adaptive, not IRT-adaptive.** It presents a fixed, difficulty-ordered bank of
  18 questions and computes a recommended starting unit from per-skill-area accuracy against curriculum prerequisite
  order — genuinely adaptive in *outcome*, not in *item selection during the test*. True item-response-theory
  adaptivity is a reasonable Phase 5 enhancement once a larger item bank exists.
- **Grammar Constellation renders prerequisite edges as straight SVG lines on a deterministic grid**, not a
  force-directed layout — fully functional and navigable, but a canvas/force-graph library would look more organic
  at a larger scale.
- **Seeded content covers 5 complete units** (nominal sentence, verbal sentence, case foundations, roots & patterns,
  basic verb conjugation) plus solid foundational and advanced-preview material, rather than the full 30-lesson /
  250-exercise / 100-sentence targets. This was a deliberate choice to preserve linguistic accuracy and pedagogical
  depth per item rather than pad counts — the content-authoring pipeline (`content/*.ts` → `prisma/seed.ts`) is built
  to scale to the full targets without any architecture changes. See `docs/ROADMAP.md`.
