---
title: CLI scripts
sidebar_position: 6
---

# CLI scripts

The full list of npm scripts in `package.json`, what they do, and when to use them.

## Daily

### `npm run dev`

Start the Next.js dev server with Hot Module Reload.

- Binds `http://localhost:3000` by default. Override with `PORT=8080`.
- Creates and seeds the SQLite database on first request.
- Watches `src/` for changes.

### `npm run build`

Produce a production build in `.next/`.

- Compiles TypeScript with type checking.
- Generates the route manifest.
- Pre-renders static routes where possible.

Fails fast on TypeScript or ESLint errors.

### `npm run start`

Serve the production build.

- Requires a successful `npm run build` first.
- Binds `http://localhost:3000` by default.

## Quality gates

### `npm run lint`

Run ESLint with the Next.js + TypeScript ruleset. No autofix — pass `-- --fix` if you want fixes applied:

```bash
npm run lint -- --fix
```

### `npm run typecheck`

Run `tsc --noEmit` against the project. Strict mode is on; this catches type drift the IDE missed.

### `npm test`

Run Vitest once. Tests live in `src/lib/__tests__/` and `src/app/*.test.ts`.

### `npm run test:watch`

Vitest in watch mode. Useful while editing tests.

### `npm run test:coverage`

Run tests with V8 coverage. Output in `coverage/` (lcov + HTML).

```bash
npm run test:coverage
open coverage/index.html   # macOS
xdg-open coverage/index.html # Linux
```

### `npm run check`

The full gate. Equivalent to:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Run this before opening a pull request. CI runs the same chain — passing locally means CI passes.

## One-liners that are useful but not npm scripts

These aren't in `package.json` but are worth knowing.

### Inspect the database

```bash
sqlite3 data/learnbyplay.db
sqlite> .tables
sqlite> SELECT COUNT(*) FROM games;
sqlite> .schema games
```

### Backup the database

```bash
sqlite3 data/learnbyplay.db ".backup 'backup-$(date +%F).db'"
```

### Force re-seed

```bash
sqlite3 data/learnbyplay.db "DELETE FROM _meta WHERE key='seed_version';"
```

Next request to the app triggers a full upsert against the current seed files.

### Generate a PDF from the CLI

```bash
curl -o lesson.pdf http://localhost:3000/api/lessons/fraction-tracks/pdf
```

### Verify CI parity locally

```bash
nvm use            # pin to .nvmrc
npm ci             # install exactly from package-lock.json
npm run check      # the full gate
```

If `npm run check` is green and you used `npm ci`, CI will be green.
