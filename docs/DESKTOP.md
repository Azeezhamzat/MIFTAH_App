# Desktop app (Electron)

Miftāḥ can be packaged as an installable desktop app for Linux, Windows, and macOS. There is no separate desktop
codebase — `electron/main.js` runs the exact same Next.js server the web app uses (built with `output: 'standalone'`
in `next.config.js`) as a local child process, against a SQLite database kept in the OS's per-user app-data
directory, and shows it in a plain `BrowserWindow`. Every feature — settings, the Claude API key, offline study,
AI-drafted lessons — works identically, because it's the same app.

## How it works

- **First launch**: the app copies a pre-seeded curriculum database (`build-resources/app-data/template.db`,
  produced by `npm run db:seed` before packaging) into the OS's app-data directory
  (`app.getPath('userData')` — e.g. `~/.config/miftah` on Linux, `~/Library/Application Support/miftah` on macOS,
  `%APPDATA%/miftah` on Windows), and generates a random `NEXTAUTH_SECRET` persisted in `config.json` there so
  sessions survive restarts.
- **The server bundle** (`.next/standalone` plus `public/`, `.next/static/`, and the Prisma schema) is packed into
  `app-data/standalone.tar.gz` at build time rather than shipped as a raw directory. This works around a real
  electron-builder behavior: it specially intercepts any directory literally named `node_modules` — including
  inside `extraResources` — and silently drops it, assuming it belongs to its own dependency-resolution packing
  rather than a verbatim copy. Packing it as one opaque tarball sidesteps that; `electron/main.js` extracts it into
  app-data on first launch (and re-extracts if the packaged app's version changes, so updates take effect).
- **Cross-platform Prisma**: `prisma/schema.prisma`'s `generator client` block lists `binaryTargets` for every
  target OS (`windows`, `darwin`, `darwin-arm64`, plus Linux glibc/musl), so `npx prisma generate` bundles the
  right native query-engine binary for whichever platform the packaged app runs on.

## Building locally

```bash
npm run db:push
npm run db:seed          # produces the pre-seeded prisma/dev.db shipped as the first-run template
npm run dist:linux       # or dist:win / dist:mac
```

This was built and verified end-to-end in a Linux sandbox: the resulting `.AppImage`/`.deb` actually launch, start
the bundled server, read/write the bundled SQLite database via the bundled Prisma engine, and serve a real login →
dashboard flow — not just "the build didn't error."

**Platform restrictions are real, not this project's limitation:**
- `dist:win` from Linux needs Wine installed (for the NSIS installer's exe-signing step) — without it, build on
  Windows itself, or use the GitHub Actions workflow below.
- `dist:mac` **cannot** run on Linux or Windows at all — Apple's tooling (`hdiutil`, code-signing) only exists on
  macOS. This isn't a gap in this app's setup; it's an Apple platform restriction with no workaround.

## Getting Windows and macOS builds without owning that hardware

`.github/workflows/build-desktop.yml` is a manual (`workflow_dispatch`) GitHub Actions workflow that builds all
three installers on GitHub's own native Linux/Windows/macOS runners and uploads them as downloadable build
artifacts. Trigger it from the repo's **Actions** tab whenever you want fresh installers — nothing is published
anywhere public, the artifacts just sit on the workflow run for you to download.

## Known limitations

- **No auto-update.** Installing a new version does not migrate the running app; you reinstall the new build,
  which reuses the existing app-data database untouched (schema changes would need a manual migration step — not
  a concern yet since the schema is still evolving pre-1.0).
- **Single local database per install**, matching the web app's SQLite-by-default design (see
  [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) for switching to Postgres if you ever want the desktop and web versions to
  share data).
- **Unsigned installers.** None of these builds are code-signed (no Apple Developer ID or Windows code-signing
  certificate involved) — expect an "unidentified developer" / SmartScreen warning on first launch, which is
  normal for a personal, unpublished app and not a sign of anything wrong with the build.
