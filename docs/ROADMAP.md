# Assumptions & roadmap

This build followed the spec's own explicit permission: *"If the full scope cannot be completed immediately, build
fewer features to production quality while preserving the complete architecture and clearly marking future
implementation phases."* Below is the honest accounting.

## Assumptions made

- **Greenfield project, no existing repo conventions to preserve** — the repository was empty at the start of this
  session, so stack choices (Next.js/TypeScript/Prisma/SQLite/Tailwind/NextAuth) were made fresh per the spec's
  fallback guidance for a greenfield app.
- **No external LLM/API key was available or requested** in this environment, and the spec explicitly requires the
  Living Teacher to be grounded and not let an unconstrained model be the sole source of grammatical truth — so it
  was built as a deterministic, knowledge-base-constrained engine rather than an LLM wrapper. This is a design
  choice consistent with the spec's own requirement, not a fallback taken due to a missing capability.
- **The initial learner profile from spec §1** (Yorùbá L1, English instructional language, MSA-primary orientation,
  intensive study cadence) is encoded as the onboarding defaults and the demo account's profile, but the app is not
  hard-coded to only that learner — `LanguageProfile`/`LearnerProfile` are per-user and the onboarding flow lets any
  learner set their own values.
- **SQLite for the reference build**, swappable to Postgres with a one-line schema change (see
  `docs/DEPLOYMENT.md`) — chosen to keep local setup dependency-free.

## What's fully built (see README's status table for the complete list)

The core learning loop (placement → dashboard → lesson player → exercise engine → mastery/SRS → review queue →
misconception clinic), all four signature laboratories, the grounded tutor, the knowledge graph, reading library,
notebook, analytics, reference companion, settings, and account data controls are all real, working, tested against
a real seeded database — not mocked.

## Known gaps, and why they're gaps rather than architecture limits

1. **Content volume below the spec's stretch targets.** Seeded: 40 concepts (target: full domain coverage — met),
   37 lessons (target ≥30 — met), 185 exercises (target ≥250 — partial), 47 fully-annotated sentences (target
   ≥100 — partial), 34 roots (target ≥25 — met). The gap is entirely in hand-authoring volume for exercises and
   sentences, which is genuinely slow to do well (each annotated sentence requires per-token linguistic review).
   The pipeline (`content/*.ts` → `prisma/seed.ts`, validated by `tests/content-integrity.test.ts`) scales to the
   full targets with no code changes — it's pure content-authoring time, tracked in
   `docs/CONTENT_AUTHORING.md`.
2. **Content-authoring studio is browse-and-flag, not a full in-app editor.** `/studio` lets a reviewer browse
   seeded lessons/exercises/sentences/concepts and push them through the review-workflow states
   (`ContentReview` rows), but authoring new content still happens by editing `content/*.ts` and re-seeding, not
   through a UI form. A full WYSIWYG authoring UI (with vocalization helpers, dependency-arc drawing, live RTL
   preview, and version diffing) is a substantial standalone project — worth scoping separately once the content
   pipeline's shape has stabilized from real use.
3. **Placement is deterministic-adaptive, not item-response-theory adaptive.** See `docs/README.md`'s assumptions
   section — true IRT-based item selection needs a much larger, difficulty-calibrated item bank than 18 questions
   to be worth the complexity.
4. **Grammar Constellation uses a deterministic grid layout with straight SVG connectors**, not a force-directed
   graph library. Fully functional (every node clickable, every edge real, mastery-driven coloring) but would
   benefit visually from a proper graph-layout library at a much larger concept count.
5. **No offline service worker.** The manifest is in place (installable PWA), but pre-caching lesson content for
   offline study is not implemented.
6. **No automated audio/pronunciation features.** The spec mentions audio controls and transcripts under
   accessibility; this build supports adjustable diacritic levels and full RTL/screen-reader-friendly markup, but
   does not include recorded or synthesized audio.
7. **Teach-back and oral-explanation recording are text-only.** The spec's `TeachBackRecorder` component is
   implemented as a text-based teach-back flow (in the lesson player's practice stage and the Misconception Clinic's
   repair flow); voice recording is not implemented.

## Suggested Phase 5/6 order (if continuing this project)

1. Expand `content/sentences/*.ts` toward 100+ fully annotated sentences, prioritizing Domain C/D depth and a few
   verified Qur'anic examples with the safeguards in `docs/LINGUISTIC_REVIEW.md`.
2. Expand exercise banks toward 250+, leaning on the algorithmic-drill-generation pattern already in `seed.ts`
   (e.g. a generated `transform_sentence` drill per Sentence Laboratory family).
3. Build the full in-app content-authoring editor (structured forms over the same `content/*.ts` shapes, with a
   "commit to file + reseed" or a direct-to-database mode with proper versioning).
4. Add a service worker for offline lesson caching.
5. Add pronunciation audio (recorded or TTS) with transcripts, and voice recording for teach-back.
6. Move the placement assessment to IRT-based adaptive item selection once the question bank is large enough to
   support it.
