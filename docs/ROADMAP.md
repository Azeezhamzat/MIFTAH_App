# Assumptions & roadmap

This build followed the spec's own explicit permission: *"If the full scope cannot be completed immediately, build
fewer features to production quality while preserving the complete architecture and clearly marking future
implementation phases."* Below is the honest accounting.

## Assumptions made

- **Greenfield project, no existing repo conventions to preserve** — the repository was empty at the start of this
  session, so stack choices (Next.js/TypeScript/Prisma/SQLite/Tailwind/NextAuth) were made fresh per the spec's
  fallback guidance for a greenfield app.
- **No external LLM/API key was available or requested at initial build time**, and the spec explicitly requires the
  Living Teacher to be grounded and not let an unconstrained model be the sole source of grammatical truth — so it
  was built as a deterministic, knowledge-base-constrained engine rather than an LLM wrapper. This is a design
  choice consistent with the spec's own requirement, not a fallback taken due to a missing capability. An optional
  enhancement was added later: a learner may paste their own Anthropic API key (Settings) to have Claude rephrase
  the rule engine's already-grounded answer under a strict no-new-facts system prompt — retrieval and grounding
  remain entirely in the deterministic engine, and the key is fully optional, encrypted at rest, and never required.
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

1. **Content volume below the spec's stretch targets, though narrowed since the initial build.** Seeded: 40
   concepts (target: full domain coverage — met), 37 lessons (target ≥30 — met), 230 exercises — 106 hand-authored
   plus 124 algorithmically generated from the sentence bank (target ≥250 — partial, up from 185), 62
   fully-annotated sentences (target ≥100 — partial, up from 47), 34 roots (target ≥25 — met). The remaining gap
   is entirely in hand-authoring volume for exercises and sentences, which is genuinely slow to do well (each
   annotated sentence requires per-token linguistic review). The pipeline (`content/*.ts` → `prisma/seed.ts`,
   validated by `tests/content-integrity.test.ts`) scales to the full targets with no code changes — it's pure
   content-authoring time, tracked in `docs/CONTENT_AUTHORING.md`.
2. **Content-authoring studio is browse-and-flag plus AI-assisted drafting, not a full in-app editor.** `/studio`
   lets a reviewer browse seeded lessons/exercises/sentences/concepts and push them through the review-workflow
   states (`ContentReview` rows). It can also draft an entirely new lesson using a connected Anthropic API key
   (`POST /api/studio/generate-lesson`): Claude may only cite already-verified example sentences from a closed
   list (any invented code is dropped server-side) and writes everything — the lesson row and its exercises — with
   `status: 'draft'`, which every learner-facing query filters out (`lessons/[code]`, the review queue, the
   Misconception Clinic, the offline bundle, the Living Teacher's retrieval, and the grading endpoint itself all
   check `status: 'published'`). Nothing a draft contains reaches a learner until a human clicks "Approve &
   publish" in `/studio`. What's still missing is hand-authoring new content directly through a form — that still
   happens by editing `content/*.ts` and re-seeding, or via the AI-drafting path above. A full WYSIWYG authoring UI
   (vocalization helpers, dependency-arc drawing, live RTL preview, version diffing) remains a substantial
   standalone project.
3. **Placement is deterministic-adaptive, not item-response-theory adaptive.** See `docs/README.md`'s assumptions
   section — true IRT-based item selection needs a much larger, difficulty-calibrated item bank than 18 questions
   to be worth the complexity.
4. **Grammar Constellation uses a deterministic grid layout with straight SVG connectors**, not a force-directed
   graph library. Fully functional (every node clickable, every edge real, mastery-driven coloring) but would
   benefit visually from a proper graph-layout library at a much larger concept count.
5. ~~No offline service worker.~~ **Resolved.** `/offline` downloads the full curriculum — every lesson and the
   complete exercise bank, not just lesson-attached exercises — into IndexedDB, and `public/sw.js` keeps
   already-visited pages reachable with no connection at all. Grading happens locally offline (reusing
   `src/lib/grading.ts`) and attempts queue up to sync through the normal grading/mastery/SRS pipeline once back
   online, so offline study never bypasses the single source of truth for mastery.
6. **No automated audio/pronunciation features.** The spec mentions audio controls and transcripts under
   accessibility; this build supports adjustable diacritic levels and full RTL/screen-reader-friendly markup, but
   does not include recorded or synthesized audio.
7. **Teach-back and oral-explanation recording are text-only.** The spec's `TeachBackRecorder` component is
   implemented as a text-based teach-back flow (in the lesson player's practice stage and the Misconception Clinic's
   repair flow); voice recording is not implemented.
8. **Installable-app packaging is real but platform-uneven, for reasons outside this app's control.** See
   [`docs/DESKTOP.md`](DESKTOP.md) and [`docs/MOBILE.md`](MOBILE.md). The Linux desktop build (Electron, wrapping
   the same Next.js server + a bundled SQLite database) was built and verified end-to-end — a real `.AppImage`/
   `.deb` that boots, reads/writes its bundled database, and serves a working login → dashboard flow. Windows and
   macOS builds are configured identically but couldn't be produced in this environment (no Wine for the Windows
   cross-build's signing step; macOS builds are only possible on real Apple hardware, a platform restriction, not a
   gap here) — a GitHub Actions workflow builds both on native runners instead. The Android app is a Capacitor
   WebView shell around a running Miftāḥ server (there is no practical way to run the Node/Prisma/SQLite stack
   itself inside an Android app) — it reuses the offline PWA mechanism for genuine offline study once the
   curriculum has been downloaded once, but building the actual APK needs the Android SDK, which this sandbox also
   lacks; a second GitHub Actions workflow builds the debug APK on a runner that has it.

## Suggested Phase 5/6 order (if continuing this project)

1. Expand `content/sentences/*.ts` toward 100+ fully annotated sentences, prioritizing Domain C/D depth and a few
   verified Qur'anic examples with the safeguards in `docs/LINGUISTIC_REVIEW.md`.
2. Expand exercise banks toward 250+, leaning on the algorithmic-drill-generation pattern already in `seed.ts`
   (e.g. a generated `transform_sentence` drill per Sentence Laboratory family).
3. Build the full in-app content-authoring editor (structured forms over the same `content/*.ts` shapes, with a
   "commit to file + reseed" or a direct-to-database mode with proper versioning) — the AI-drafting path in
   `/studio` covers lesson/exercise generation, but hand-authoring still means editing `content/*.ts` directly.
4. Add pronunciation audio (recorded or TTS) with transcripts, and voice recording for teach-back.
5. Move the placement assessment to IRT-based adaptive item selection once the question bank is large enough to
   support it.
