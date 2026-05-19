---
title: Troubleshooting & FAQ
sidebar_position: 90
---

# Troubleshooting and FAQ

## Install and build

### `better-sqlite3` fails to install

Symptom:

```
npm ERR! gyp ERR! build error
npm ERR! Failed at the better-sqlite3@... install script
```

Cause: `better-sqlite3` needs a C++ toolchain to compile native bindings.

Fix:

- **macOS**: `xcode-select --install`
- **Debian/Ubuntu**: `sudo apt install build-essential python3`
- **Windows**: use WSL or install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

Then `rm -rf node_modules package-lock.json && npm install`.

### `Module not found: Can't resolve '@/lib/...'`

Cause: the `@/` path alias isn't being resolved.

Fix: confirm `tsconfig.json` includes:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Restart the dev server.

### Build fails with `Type error: ...`

LearnByPlay runs in strict TypeScript. Run `npm run typecheck` for a clean list of errors.

The most common drift is a seed entry missing a required field. Open `src/lib/types.ts`, find the interface in the error, and fill in the missing field.

## Runtime

### `/api/health` returns `unhealthy`

Cause: the SQLite file can't be opened or queried.

Diagnostics:

```bash
ls -la "$(node -p "process.env.LEARNBYPLAY_DB_PATH || 'data/learnbyplay.db'")"
sqlite3 "$(node -p "process.env.LEARNBYPLAY_DB_PATH || 'data/learnbyplay.db'")" "SELECT 1;"
```

Fixes:

- Wrong path → set `LEARNBYPLAY_DB_PATH` to an absolute path.
- Permission denied → `chmod 600` on the file and `chmod 700` on the directory, owned by the Node process user.
- Disk full → `df -h`.

### "Catalog is empty after restart"

Cause: seeding didn't run.

Likely reason: you're in `production` and `LEARNBYPLAY_ENABLE_SEEDING` is not set.

Fixes:

- Dev: ensure `NODE_ENV` is `development` (the default).
- Prod: set `LEARNBYPLAY_ENABLE_SEEDING=true` *or* import your own catalog.

To force a re-seed without restarting Node, clear the version marker:

```bash
sqlite3 data/learnbyplay.db "DELETE FROM _meta WHERE key='seed_version';"
```

The next HTTP request re-seeds.

### Sessions don't show in the dashboard

Cause: the dashboard caches per request, but `revalidatePath` should invalidate after a mutation. If you're seeing stale data:

- Hard-refresh the page (Cmd/Ctrl+Shift+R).
- Confirm the session was actually inserted: `sqlite3 data/learnbyplay.db "SELECT * FROM sessions ORDER BY id DESC LIMIT 5;"`
- Check the server logs for a redirect to `/dashboard?logged=1`.

### Timer audio doesn't play

Cause: browser autoplay policy.

Fix: click **Start** in the same tab to give the page user-gesture context. After that, phase chimes play normally. If you switch tabs and back, you may need to click once more — do this *before* class.

### PDF download is blank or corrupted

Causes (in order of likelihood):

1. The lesson is missing a required field — check `npm run typecheck`.
2. A custom font is referenced but not bundled. Stick to `pdf-lib`'s default fonts.
3. The endpoint hit a runtime error — check server logs.

Reproduce on the CLI:

```bash
curl -v http://localhost:3000/api/lessons/<slug>/pdf -o out.pdf
file out.pdf
```

`file out.pdf` should say `PDF document, version 1.7`.

## FAQ

### Is LearnByPlay free?

Yes. MIT-licensed. No paid tier.

### Does it phone home?

No. There's no telemetry, no analytics, no remote configuration. The app runs entirely on the server you put it on.

### Can students log in?

No. The current model is teacher-facing. Adding student auth is on the roadmap but not implemented.

### How many concurrent users does it support?

A 1 vCPU / 1 GB RAM VPS comfortably serves a school's worth of teachers — hundreds of daily users, dozens concurrent. SQLite with WAL mode handles this easily for read-mostly workloads.

### Can I add my own games?

Yes. Edit `src/lib/seed/games.ts`, bump `SEED_VERSION` in `src/lib/db.ts`, restart. See [Concepts → Games and standards](./concepts/games-and-standards).

### Does it work offline?

The app needs the Node process running, but it has no external dependencies — so a LAN-only Raspberry Pi deployment is fine. No internet required after install.

### Does it integrate with Google Classroom / Canvas / Schoology?

Not directly. PDFs of lesson plans paste into any LMS as an attachment or link. A dedicated LMS integration is a roadmap item.

### Can I run it in a container?

Yes. There's no official image, but a minimal Dockerfile is:

```dockerfile
FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
VOLUME /app/data
EXPOSE 3000
CMD ["npm","run","start"]
```

Mount a volume at `/app/data` so the SQLite file persists across container restarts.

### Where do I report a bug?

[github.com/TabletopFoundry/learnbyplay/issues](https://github.com/TabletopFoundry/learnbyplay/issues). Use the Bug template — include Node version, OS, and steps to reproduce.

### How do I contribute?

See [Contributing](./contributing).
