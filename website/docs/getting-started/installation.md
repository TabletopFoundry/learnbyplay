---
title: Installation
sidebar_position: 2
---

# Installation

This guide covers the full installation surface: prerequisites, environment configuration, production builds, and verification.

## System requirements

| Component | Minimum | Notes |
|-----------|---------|-------|
| Node.js | 20.0.0 | Pinned in [`.nvmrc`](https://github.com/TabletopFoundry/learnbyplay/blob/main/.nvmrc) |
| npm | 9.0.0 | Bundled with Node 20+ |
| Disk space | ~500 MB | Source + `node_modules` + SQLite DB |
| RAM | 512 MB | Comfortable on a $30 Raspberry Pi |
| OS | Linux, macOS, Windows (WSL recommended) | `better-sqlite3` compiles native code |

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
nvm use
```

## Clone and install

```bash
git clone https://github.com/TabletopFoundry/learnbyplay.git
cd learnbyplay
npm install
```

The first install may take 60–120 seconds because `better-sqlite3` builds a native module against your local Node ABI.

## Environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

The full surface is small and documented in `.env.example`:

| Variable | Default | When to set |
|----------|---------|-------------|
| `LEARNBYPLAY_DB_PATH` | `data/learnbyplay.db` | You want the DB on a different volume (e.g. `/var/lib/learnbyplay/db.sqlite`). |
| `LEARNBYPLAY_ENABLE_SEEDING` | `false` in production, on otherwise | You want the demo dataset loaded into a production-like environment. |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Used for sitemap, robots, and OpenGraph metadata. Set this for any non-local deployment. |

:::caution
`LEARNBYPLAY_ENABLE_SEEDING=true` is only respected when `NODE_ENV=production`. In dev and test the seed runs unconditionally — that's how the catalog stays populated for you.
:::

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the Next.js dev server with hot reload. |
| `npm run build` | Produce a production build in `.next/`. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Strict TypeScript check (no emit). |
| `npm test` | Run Vitest unit tests once. |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:coverage` | Vitest with V8 coverage. |
| `npm run check` | Full gate: lint + typecheck + test + build. |

## Production build

```bash
npm run build
npm run start
```

By default the production server listens on port 3000. To bind elsewhere:

```bash
PORT=8080 npm run start
```

## Verifying the install

After `npm run dev` or `npm run start`, confirm three signals:

```bash
# Database connectivity
curl -s http://localhost:3000/api/health | jq
# {"status":"healthy","timestamp":"..."}

# Catalog is populated
curl -sI http://localhost:3000/games
# HTTP/1.1 200 OK

# PDF generation works
curl -sI http://localhost:3000/api/lessons/fraction-tracks/pdf
# Content-Type: application/pdf
```

If any of these fail, see [Troubleshooting](../troubleshooting).

## Upgrading

LearnByPlay uses Semantic Versioning. To upgrade:

```bash
git pull
npm install
npm run build
```

Schema migrations are applied automatically on the next request to `getDb()`. Demo seed data is re-applied when the internal `seed_version` token changes.

## Uninstall / clean reset

```bash
# Stop the server, then:
rm -rf data/learnbyplay.db data/learnbyplay.db-wal data/learnbyplay.db-shm
rm -rf .next node_modules
```

On next `npm install && npm run dev` you get a pristine instance.
