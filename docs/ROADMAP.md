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
  was built as a deterministic, knowledge-base-constrained engine rather than an LLM wrapper. This remains the
  entire experience with no key connected. An optional enhancement was added later, and was subsequently changed at
  this app's sole user's explicit request: pasting an Anthropic API key (Settings) no longer just has Claude
  rephrase the rule engine's answer under a no-new-facts constraint — it lets the Living Teacher answer with
  Claude's own full knowledge of Arabic, using the rule engine's findings only as optional context. This is a
  conscious departure from the spec's original grounding requirement, made because this is a single-user personal
  app and its one user decided their own understanding should come first. The key remains fully optional, encrypted
  at rest, and never required — the grounded, curriculum-only experience is still exactly what a learner gets
  without one.
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

1. **~~Content volume below the spec's stretch targets.~~ Resolved — all numeric targets are now met.** Seeded: 40
   concepts (target: full domain coverage — met), 37 lessons (target ≥30 — met), 311 exercises — 111 hand-authored
   plus 200 algorithmically generated from the sentence bank (target ≥250 — met, up from 185), 100 fully-annotated
   sentences (target ≥100 — met, up from 47), 34 roots (target ≥25 — met). What remains open is not raw count but
   *even breadth*: the deepest, most example-rich coverage still concentrates in 5 core units (nominal sentence,
   verbal sentence, case foundations, roots & patterns, basic verb conjugation) — meeting "≥100 sentences" is not
   the same claim as "every unit has textbook-level depth," and a future pass could still choose to grow the
   thinner units (advanced analysis, weak verbs) further even though no numeric target requires it. The pipeline
   (`content/*.ts` → `prisma/seed.ts`, validated by `tests/content-integrity.test.ts`) scales with no code changes
   — it's pure content-authoring time, tracked in `docs/CONTENT_AUTHORING.md`.
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
9. **"Too boring and basic" feedback was addressed on three specific fronts, not a general redesign.** This app's
   user asked for commercial-app-level quality but, when asked which aspects mattered most, specifically named
   richer practice interactions, being able to choose any topic directly, and deeper lesson content — not
   gamification, visual polish, or audio, which remain undone by explicit choice. See `/lessons` (the new lesson
   catalog), the click-to-answer exercise UI (`src/lib/exerciseChoices.ts`), and the Explain-stage word-by-word
   breakdown (`src/components/SentenceBreakdown.tsx`).
10. **"Still not strong or deep" was followed up with a second, unanswered round of clarification, then resolved
    against two concrete, verifiable gaps found by direct inspection rather than guessed at.** A second "not deep
    enough" report came in with no answer to the specific follow-up question of which aspect was thin. Rather than
    guess at vague "more polish," the codebase itself was audited: 35 of the 37 lessons had no `deeperDetail`
    field at all, meaning the Explain stage's "Go deeper" button silently didn't render for 95% of lessons — a
    real gap, not a subjective one. Separately, all 15 authored `Misconception` rows (evidence pattern, correct
    model, contrast example, repair guidance) were only ever surfaced in the standalone Misconception Clinic, never
    inside the lesson flow itself where a learner first meets the concept. Both are now fixed: every one of the 37
    lessons has a genuine, linguistically substantive `deeperDetail` paragraph (worked examples, exceptions,
    cross-references — not filler), and the Explain stage now shows a "Common mistakes at this stage" section
    listing every misconception tied to that lesson's concepts, mirrored into the offline bundle
    (`src/lib/offline/types.ts`, `src/app/api/offline/bundle/route.ts`) for parity. This addresses explanation
    *depth* specifically; content *breadth* (item 1 above), the AI tutor experience, and overall visual polish were
    not in scope for this round and remain open if that turns out to be what "still not deep" actually meant.
11. **A third, specific round of feedback named exactly what "still deep" had left out — thin lessons that rush to
    testing, exact-wording grading, and an AI confined to one chat page — and each was traced to a concrete,
    verifiable cause rather than answered with more polish.**
    - *Lessons rush from a short explanation to testing*: turned out to be a real query bug, not a content problem.
      The Practice stage only ever queried exercises hand-authored *for that specific lesson*
      (`Exercise.lessonId`), silently ignoring the much larger pool of concept-linked drill exercises `seed.ts`
      already generates from the sentence bank (`conceptId` set, `lessonId` null) — reachable from `/review` and
      `/offline` but never from the lesson itself. 11 of 37 lessons had only 1–2 practice items as a result; the
      average was 2.8. `src/app/lessons/[code]/page.tsx` (mirrored in the offline bundle route) now pulls a
      lesson's full concept-linked pool, not only its own subset, capped at 8 per sitting — the new floor is 3 and
      the average is 6.2. A genuine remaining content gap under three of the thinnest concepts (Form I verbs,
      doubled verbs, what makes an utterance complete) got 1–2 newly hand-authored exercises each so the floor
      wasn't just "3, but two of them are duplicates of the same idea."
    - *Exact-wording grading marking correct paraphrases as "0% match"*: the deterministic grader
      (`src/lib/grading.ts`) is unchanged and still the entire experience offline — it was never going to stop
      being exact/variant-match-first, since that's what keeps grading working with no network and no API key. What
      changed is `gradeAndRecordAttempt` (`src/lib/engine/grade.ts`) now has an optional second pass: for exercise
      types whose answer is genuine prose (`AI_GRADABLE_EXERCISE_TYPES` in `src/lib/types.ts` —
      `explain_rule`, `teach_back`, `analyze_passage`, `free_production`, and similar), if the deterministic grade
      says wrong and a key is connected, Claude judges semantic equivalence against the already-verified expected
      answer (`gradeWithAI` in `src/lib/tutor/claude.ts`) — the same grounded-comparison trust boundary
      `draftLessonWithClaude` uses, not the unrestricted one the chat uses. Exercise types where the answer *is* a
      specific case ending or role label are deliberately excluded from this — there, exact wording is correct to
      require.
    - *AI limited to the Living Teacher, not integrated elsewhere*: the grading pass above is itself a second,
      learner-facing AI touchpoint. A third was added alongside it: every wrong exercise answer now shows an
      "Ask the Living Teacher about this →" link that opens `/teacher` with a prefilled question naming the exact
      exercise and the learner's own answer, instead of leaving them to retype the context from scratch on a
      separate page. AI-assisted lesson drafting (`/studio`) already existed as a fourth, non-learner-facing
      touchpoint — so "only the Living Teacher" was accurate before this round and isn't now.
    
    Content breadth beyond these targeted fixes was picked up immediately after in the very next round — see
    item 12 below — and the 250-exercise/100-sentence targets referenced above are now met.
12. **Content breadth: the 250-exercise/100-sentence targets are now met, reached by fixing a second unwired-content
    bug plus 38 newly authored sentences spread across every lesson, not concentrated in a few units.** Auditing the
    sentence bank the same way item 11 audited the exercise pool found 20 more fully-annotated, previously-authored
    sentences — a real imperative example, real jussive/subjunctive examples, all of كان's other sisters, three more
    passive-voice sentences, a masdar-as-subject example, a passive-participle example — that had never been
    referenced by any lesson's `observeSentenceCodes`. That silence had two effects: the sentences never appeared in
    any lesson's Observe/Explain stage, and their auto-generated drill exercises were silently misattributed to a
    coarse fallback concept (a `verb-`-prefixed code defaults to "fāʿil," regardless of what it's actually about)
    instead of the concept they actually demonstrate. Wiring those 20 in was free — no new content, just correct
    attribution. The remaining gap to 100 sentences/250 exercises was closed with 38 newly authored sentences (see
    `content/sentences/*.ts`), deliberately distributed one or two per lesson across all 37 lessons — including a
    few genuinely new grammatical points the bank hadn't covered yet (a Form IV causative, a Form X verb, an
    indefinite-mubtada-forces-fronted-khabar example, both textbook `مَحَلّ` cases — nominative and accusative). Final
    numbers: 100 sentences (up from 62), 311 exercises (up from 235), and the per-lesson practice floor from item 11
    rose again, from 3 to 5 (average 6.2 → 7.1), since every lesson now has more concept-linked material feeding its
    Practice stage. `docs/CONTENT_AUTHORING.md` documents the wiring requirement so this doesn't quietly recur.

## Suggested Phase 5/6 order (if continuing this project)

1. Grow sentence/exercise *breadth* further in the currently-thinner units (advanced analysis, weak verbs) even
   though the ≥100/≥250 numeric targets are now met — see item 12's note on even breadth vs. raw count.
2. Build the full in-app content-authoring editor (structured forms over the same `content/*.ts` shapes, with a
   "commit to file + reseed" or a direct-to-database mode with proper versioning) — the AI-drafting path in
   `/studio` covers lesson/exercise generation, but hand-authoring still means editing `content/*.ts` directly.
3. Add pronunciation audio (recorded or TTS) with transcripts, and voice recording for teach-back.
4. Move the placement assessment to IRT-based adaptive item selection once the question bank is large enough to
   support it.
