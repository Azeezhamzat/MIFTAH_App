# Deployment

## Local / development

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Production build

```bash
npm run build
npm start
```

`next build` runs a full TypeScript + lint check as part of the build — a broken build means a real type error, not
just a lint nit.

## Switching from SQLite to Postgres

The schema (`prisma/schema.prisma`) deliberately avoids SQLite-only features (see the comment at its top about
enum-like fields being stored as strings). To move to Postgres:

1. Change the datasource block:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` to a Postgres connection string.
3. Run `npx prisma migrate dev --name init` (use migrations, not `db push`, once you have a real production
   database you want history for) and `npm run db:seed`.

No application code changes are required — all queries go through Prisma's generated client, which is
database-agnostic for everything this schema uses.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma connection string |
| `NEXTAUTH_SECRET` | Signs/encrypts session JWTs — generate with `openssl rand -hex 32`, never reuse the value in `.env.example` |
| `NEXTAUTH_URL` | Must match the deployed origin exactly (including protocol) |

## Things to configure before a real deployment

- **Secrets**: rotate `NEXTAUTH_SECRET`; never commit a real `.env`.
- **Rate limiting** on `/api/auth/*` and `/api/tutor/ask` — not implemented in this reference build; add at the
  reverse-proxy or middleware layer before exposing publicly.
- **Backups**: if staying on SQLite for a small single-instance deployment, back up the `.db` file directly; for
  Postgres, use your provider's standard backup/PITR tooling.
- **Analytics**: no third-party analytics are wired up. The in-app "Progress analytics" screen is purely first-party
  and reads only from this instance's own database — no external telemetry is sent anywhere, matching the spec's
  privacy-respecting-analytics requirement by simply not having any third-party analytics to configure.

## Offline / PWA status

`public/manifest.webmanifest` is present and the app is installable. Full offline lesson caching (a service worker
that pre-caches lesson content for offline study) is **not implemented** in this reference build — see
`docs/ROADMAP.md`.
