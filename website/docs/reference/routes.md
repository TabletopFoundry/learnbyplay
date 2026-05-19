---
title: Routes
sidebar_position: 2
---

# Routes reference

Every URL in the deployed app, what it renders, and which data layer it calls.

## Public pages

| Route | Method | Description | Data source |
|-------|--------|-------------|-------------|
| `/` | GET | Landing page with featured games, sample testimonials, and CTAs. | Static |
| `/games` | GET | Curriculum browser with filters. | `src/lib/data/games.ts` |
| `/games/[slug]` | GET | Game detail: standards, skills, linked lessons, materials. | `src/lib/data/games.ts` |
| `/lessons/[slug]` | GET | Full lesson plan with objectives, sequence, rubric, variants. | `src/lib/data/lessons.ts` |
| `/dashboard` | GET | Teacher dashboard — classes, sessions, favorites, heatmap. | `src/lib/data/dashboard.ts` |
| `/tools` | GET | Group generator, session timer, rules viewer. | None (client-only state) |
| `/pd` | GET | Professional development article index. | `src/lib/data/articles.ts` |
| `/pd/[slug]` | GET | PD article detail. | `src/lib/data/articles.ts` |

## API routes

| Route | Method | Description | Response |
|-------|--------|-------------|----------|
| `/api/lessons/[slug]/pdf` | GET | Render a lesson as a print-ready PDF. | `application/pdf` |
| `/api/health` | GET | DB connectivity check. | `application/json` |

### `/api/health`

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

Returns `503` with `{"status":"unhealthy", ...}` if the SQLite connection fails.

### `/api/lessons/[slug]/pdf`

Generates a PDF on every request. No on-disk cache. Headers:

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="<slug>.pdf"
```

`404` if the slug doesn't resolve to a lesson row.

## SEO routes

| Route | Description |
|-------|-------------|
| `/sitemap.xml` | Auto-generated sitemap of all public routes. |
| `/robots.txt` | Allows crawling of public pages, disallows `/api/`. |

## Catalog query parameters

`/games` accepts:

| Param | Type | Example |
|-------|------|---------|
| `subject` | `Subject` | `?subject=Math` |
| `gradeBand` | `GradeBand` | `?gradeBand=3-5` |
| `standard` | standard code | `?standard=CCSS.MATH.3.NF.A.3` |
| `maxPlayTime` | number (minutes) | `?maxPlayTime=30` |
| `groupSize` | number | `?groupSize=4` |
| `maxComplexity` | 1–5 | `?maxComplexity=3` |
| `sort` | `fit` \| `time` \| `complexity` \| `standards` | `?sort=fit` |

All filters compose. Unknown values are ignored, not 400'd.

## Dashboard query parameters

`/dashboard` accepts feedback flags that show flash banners after a redirect:

| Param | Trigger |
|-------|---------|
| `?created=1` | After `createClassroomAction` |
| `?logged=1` | After `logSessionAction` |
| `?deleted=classroom` | After `deleteClassroomAction` |
| `?deleted=session` | After `deleteSessionAction` |
| `?error=classroom` | Failed classroom mutation |
| `?error=session` | Failed session mutation |
| `?error=not-found` | Resource missing on delete |
