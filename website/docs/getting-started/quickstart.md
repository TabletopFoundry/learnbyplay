---
title: Quickstart
sidebar_position: 1
---

# Quickstart

Get a working LearnByPlay instance running locally in under 5 minutes.

## Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Node.js | ≥ 20 | Next.js 16 runtime |
| npm | ≥ 9 | Bundled with Node 20+ |
| Git | any recent | Cloning the repo |

Check your versions:

```bash
node --version   # v20.x or higher
npm --version    # 9.x or higher
```

## 1. Clone the repository

```bash
git clone https://github.com/TabletopFoundry/learnbyplay.git
cd learnbyplay
```

## 2. Install dependencies

```bash
npm install
```

This installs Next.js, React 19, `better-sqlite3`, `pdf-lib`, and the rest of the runtime. The first install may take a minute because `better-sqlite3` compiles a native binding.

## 3. Start the dev server

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.2.6
- Local:    http://localhost:3000
- ready in 1.2s
```

## 4. Open the app

Visit **[http://localhost:3000](http://localhost:3000)**.

On first request, LearnByPlay:

1. Creates `data/learnbyplay.db` if it doesn't exist.
2. Runs schema migrations.
3. Seeds the demo dataset (45 games, 21 lessons, 30 standards, 8 classrooms, 32 sessions) — but only in non-production environments.

You'll land on a fully populated catalog. Try:

- **`/games`** — the curriculum browser.
- **`/lessons/fraction-tracks`** — a full lesson plan.
- **`/dashboard`** — the teacher dashboard with sample sessions logged.
- **`/tools`** — the group generator and session timer.

## 5. Verify everything is wired up

Health check the SQLite connection:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{"status":"healthy","timestamp":"2025-01-15T12:34:56.789Z"}
```

## What's next

- **[Run your first lesson](./first-lesson-in-5-minutes)** — open a plan, generate groups, log the session.
- **[Installation](./installation)** — environment variables, database paths, production builds.
- **[Core Concepts](../concepts/overview)** — the mental model behind games, standards, and lessons.

:::tip
Want a clean slate? Stop the server, delete `data/learnbyplay.db`, and start `npm run dev` again. The demo data is re-seeded transactionally on next boot.
:::
