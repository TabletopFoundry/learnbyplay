---
title: Configuration
sidebar_position: 1
---

# Configuration reference

LearnByPlay is configured by environment variables. There is no separate config file by design — the same `.env.local` works for dev, the same `.env` works for prod.

## Full variable list

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `LEARNBYPLAY_DB_PATH` | `./data/learnbyplay.db` | No | Filesystem path to the SQLite database. Created on first run if missing. |
| `LEARNBYPLAY_ENABLE_SEEDING` | `false` in production; effectively `true` otherwise | No | Force-enable demo seeding even in production. |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Recommended for prod | Used by sitemap, robots.txt, and OpenGraph metadata. |
| `NODE_ENV` | `development` | No | Set to `production` for production builds. Next.js handles this automatically. |
| `PORT` | `3000` | No | Port the Next.js server binds to. |

## Behavior matrix

| `NODE_ENV` | `LEARNBYPLAY_ENABLE_SEEDING` | Demo data seeded? |
|------------|------------------------------|-------------------|
| `development` | (any) | ✅ Yes |
| `test` | (any) | ✅ Yes |
| `production` | unset / `false` | ❌ No |
| `production` | `true` | ✅ Yes |

## Where the values are read

| File | Variable | Purpose |
|------|----------|---------|
| `src/lib/db.ts` | `LEARNBYPLAY_DB_PATH` | SQLite file path |
| `src/lib/db.ts` | `LEARNBYPLAY_ENABLE_SEEDING` | Seed gate |
| `src/lib/constants.ts` | `NEXT_PUBLIC_BASE_URL` | Public URL for SEO/OG |

## Build-time vs runtime

| Variable | Phase |
|----------|-------|
| `LEARNBYPLAY_DB_PATH` | Runtime |
| `LEARNBYPLAY_ENABLE_SEEDING` | Runtime |
| `NEXT_PUBLIC_BASE_URL` | **Build time** — `NEXT_PUBLIC_*` vars are inlined into the client bundle. Change requires rebuild. |

If you change `NEXT_PUBLIC_BASE_URL`, rerun `npm run build` before `npm run start`.

## Loading order

Next.js loads `.env` files in this order (later wins):

1. `.env`
2. `.env.local` (ignored by git)
3. `.env.development` / `.env.production`
4. `.env.development.local` / `.env.production.local`

Use `.env.local` for secrets and per-developer overrides. Commit `.env.example`, not real values.

## Validating configuration

After setting env vars, verify:

```bash
# DB path is honored
ls -la "$(node -e "console.log(process.env.LEARNBYPLAY_DB_PATH || 'data/learnbyplay.db')")"

# Health check
curl -s http://localhost:${PORT:-3000}/api/health
```

If the health check returns `unhealthy`, the DB path is unreachable. Check directory permissions.
