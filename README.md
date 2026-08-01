# مِفْتَاح — Miftāḥ

**See the system. Build the language.**

Miftāḥ is a complete, interactive personal teacher of Arabic Naḥw (syntax) and Ṣarf (morphology) for a non-native
adult learner — built around discovery-based lessons, four signature laboratories, a knowledge-base-grounded
conversational tutor, an explainable mastery and spaced-review engine, and a personalized misconception clinic.

This is a real, running application with a seeded curriculum, not a mockup: 40 concepts, 37 lessons, 47 fully
annotated Arabic sentences, 34 roots, 23 morphological patterns, 85 lexemes, 185 exercises, 15 tracked
misconceptions, an 18-question adaptive placement assessment, and 3 connected reading passages, all backed by a
real database and a real mastery/spaced-repetition engine.

## Quick start

```bash
npm install
cp .env.example .env          # generates DATABASE_URL + a NEXTAUTH_SECRET placeholder — replace the secret
npm run db:push               # create the SQLite schema
npm run db:seed                # seed the full curriculum + a demo account
npm run dev                    # http://localhost:3000
```

Demo login (pre-seeded with realistic progress so the dashboard, review queue, and analytics have real data on
first visit): **demo@miftah.app / learnarabic**

Or sign up fresh and go through onboarding → the 12–18 minute adaptive placement assessment yourself.

Run the test suite:

```bash
npm test
```

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
| Content-authoring / linguistic review studio | ⚠️ Functional but reduced (see roadmap) |
| Offline PWA lesson caching | ⚠️ Manifest present; full offline cache is roadmap |
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
dependency: the Living Teacher is a grounded, knowledge-base-constrained rule engine over the same curriculum data
everything else uses — by design, per the spec's requirement that an unconstrained model must never be the sole
source of grammatical truth.

## Design

Deep indigo, jade, warm parchment, charcoal ink, muted sand, and restrained gold — full light/dark theming, RTL-safe
Arabic rendering throughout (`ArabicText` component with direction isolation), reduced-motion support, and
diacritic-level controls. See `tailwind.config.ts` for the full palette and `src/app/globals.css` for the
accessibility primitives (focus rings, high-contrast mode, combining-mark handling).

## Assumptions & known limitations

- **No external LLM.** The Living Teacher is intentionally a grounded rule/knowledge-base engine, not a call to an
  LLM API — this matches the spec's explicit requirement and means it never hallucinates a grammatical claim, but it
  also means its range is bounded by what's in the curriculum's knowledge base (concepts, misconceptions, sentences,
  Yorùbá contrast notes). It says so explicitly whenever a question falls outside that range.
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
