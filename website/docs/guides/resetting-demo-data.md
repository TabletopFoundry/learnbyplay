---
title: Resetting demo data
sidebar_position: 7
---

# Resetting demo data

Three reset levels, from gentlest to nuclear.

## Level 1: Reset just the dashboard data

Wipe sessions, classrooms, and favorites — keep the catalog of games, lessons, standards, and PD articles.

```bash
sqlite3 data/learnbyplay.db <<'SQL'
DELETE FROM sessions;
DELETE FROM classrooms;
DELETE FROM favorites;
SQL
```

Restart the dev server. The catalog is untouched; the dashboard is empty.

## Level 2: Force a full re-seed

If you want every game, lesson, standard, and PD article refreshed against the current seed files:

```bash
sqlite3 data/learnbyplay.db "DELETE FROM _meta WHERE key='seed_version';"
```

Restart. On the next request, `seedDatabase()` sees no `seed_version` row, runs the full upsert transaction, and stamps the current `SEED_VERSION` back in `_meta`.

This refreshes content rows but preserves your dashboard data (classes, sessions, favorites) — useful when you've edited a lesson plan and want it reflected without losing logged sessions.

## Level 3: Nuke and pave

For a pristine instance:

```bash
# Stop the dev server first.
rm -f data/learnbyplay.db data/learnbyplay.db-wal data/learnbyplay.db-shm
npm run dev
```

On next boot the app:

1. Creates a fresh database at `data/learnbyplay.db`.
2. Runs the schema DDL.
3. Seeds the full demo dataset.

You're back to the install-time state.

## When seeding doesn't run

Seeding is skipped when:

- `NODE_ENV=production` **and** `LEARNBYPLAY_ENABLE_SEEDING` is not `true`.
- `_meta.seed_version` matches the current `SEED_VERSION` constant in `src/lib/db.ts`.

If you've changed seed files and they're not showing up, check both conditions.

## Verifying a fresh seed

```bash
sqlite3 data/learnbyplay.db <<'SQL'
SELECT 'games', COUNT(*) FROM games
UNION ALL SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL SELECT 'standards', COUNT(*) FROM standards
UNION ALL SELECT 'classrooms', COUNT(*) FROM classrooms
UNION ALL SELECT 'sessions', COUNT(*) FROM sessions;
SQL
```

Expected for the bundled demo seed:

```
games|45
lessons|21
standards|30
classrooms|8
sessions|32
```

## Backing up before a reset

If your dashboard data matters to you, copy the file first:

```bash
cp data/learnbyplay.db data/learnbyplay.backup.$(date +%F).db
```

`better-sqlite3` uses WAL mode, so a hot copy of just `.db` may miss in-flight writes. For a consistent backup while the server is running:

```bash
sqlite3 data/learnbyplay.db ".backup 'data/learnbyplay.backup.$(date +%F).db'"
```
