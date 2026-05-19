---
title: HTTP API
sidebar_position: 3
---

# HTTP API

LearnByPlay's public HTTP surface is intentionally small — two endpoints. Mutations happen via Next.js Server Actions (form posts to the same origin), not REST.

## `GET /api/health`

Liveness + DB connectivity check.

**Request**

```bash
curl http://localhost:3000/api/health
```

**Response** — `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

**Response** — `503 Service Unavailable` when the SQLite connection cannot be opened or queried:

```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

Headers:

```
Cache-Control: no-store, max-age=0
Content-Type: application/json
```

### Usage in monitoring

```bash
# Uptime Kuma / Healthchecks.io — alert if status != 200
curl -fsS https://learnbyplay.example.com/api/health
```

```yaml
# docker-compose healthcheck
healthcheck:
  test: ["CMD", "curl", "-fsS", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 3s
  retries: 3
```

## `GET /api/lessons/[slug]/pdf`

Render a lesson plan as a print-ready PDF.

**Request**

```bash
curl -o fraction-tracks.pdf \
  http://localhost:3000/api/lessons/fraction-tracks/pdf
```

**Response** — `200 OK`

Body is a `application/pdf` document. Headers:

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="fraction-tracks.pdf"
```

**Response** — `404 Not Found` when the slug does not exist:

```json
{ "error": "Lesson not found" }
```

### Performance characteristics

- ~50–200 ms per PDF on a modern laptop.
- No on-disk cache. Each request regenerates.
- Suitable for hundreds of requests/minute behind a 5-minute reverse-proxy cache.

## Server actions (form posts)

The following mutations are Server Actions, not REST endpoints. They are invoked via `<form action={serverAction}>` from server components and use Next.js's `multipart/form-data` action protocol.

| Action | Form fields | Effect |
|--------|-------------|--------|
| `createClassroomAction` | `name`, `subject`, `gradeBand`, `studentCount` | Insert classroom, redirect `/dashboard?created=1`. |
| `logSessionAction` | `classroomId`, `gameSlug`, `lessonSlug`, `sessionDate`, `notes` | Insert session, redirect `/dashboard?logged=1`. |
| `toggleFavoriteLessonAction` | `lessonSlug`, `redirectTo` | Toggle favorite, redirect to `redirectTo`. |
| `deleteClassroomAction` | `id` | Cascade-delete a classroom and its sessions. |
| `deleteSessionAction` | `id` | Delete a session. |

See [Server actions](./server-actions) for full validation rules and error shapes.

## What's not exposed

Intentional non-API surfaces:

- **No `/api/games` JSON listing.** Use the data layer or query the SQLite file directly.
- **No write API for catalog data.** Games, lessons, standards are seed-managed.
- **No auth endpoints.** Demo is single-tenant.

If you need a public read API for an integration, the data-layer functions in `src/lib/data/*` are the cleanest path — wrap them in a route handler that returns JSON. Keep the route at `/api/v1/...` so future versions can break safely.
