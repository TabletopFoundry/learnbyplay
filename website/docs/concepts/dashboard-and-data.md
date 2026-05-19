---
title: Dashboard and data
sidebar_position: 5
---

# Dashboard and data

`/dashboard` is the evidence layer. It's where a teacher answers *"what did my classes actually practice this month?"* and an administrator answers *"is this initiative producing instruction?"*.

## What's on it

The dashboard renders one `DashboardSnapshot`:

```ts
interface DashboardSnapshot {
  classrooms: Classroom[];
  sessions: SessionRecord[];
  favoriteLessons: FavoriteLessonSummary[];
  metrics: DashboardMetrics;
  skillsHeatmap: SkillHeatmapEntry[];
}

interface DashboardMetrics {
  classCount: number;
  sessionCount: number;
  favoriteCount: number;
  standardsCovered: number;
  totalGames: number;
  totalStandards: number;
}
```

Visually:

1. **Metric strip** — class count, session count, standards covered, favorites.
2. **Classrooms** — cards with student count and recent session count.
3. **Recent sessions** — most recent logged sessions across all classes.
4. **Favorite lessons** — bookmarked plans, with who saved them.
5. **Skill heatmap** — frequency of each skill across all logged sessions.

## Sessions

A session is one immutable row:

```ts
interface SessionRecord {
  id: number;
  classroomId: number;
  classroomName: string;
  gameSlug: string;
  gameName: string;
  lessonSlug: string;
  lessonTitle: string;
  sessionDate: string;     // ISO date
  notes: string;
  skills: string[];        // derived from the linked game's skills
}
```

Sessions are created via the `logSessionAction` server action (see [Reference → Server actions](../reference/server-actions)). They reference classrooms, games, and lessons by foreign key. Deleting a classroom cascades to its sessions.

## The skill heatmap

The heatmap aggregates `skills` across all logged sessions and buckets them into three levels:

```ts
interface SkillHeatmapEntry {
  skill: string;
  count: number;
  level: 'high' | 'medium' | 'low';
}
```

Thresholds are computed relative to the maximum count in the current snapshot — not absolute — so the heatmap stays useful whether you've logged 4 sessions or 400.

## Favorites

Favorites are simple bookmarks scoped to a `teacher_name`:

```sql
CREATE TABLE favorites (
  teacher_name TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (teacher_name, lesson_slug)
);
```

The current demo uses a single `Lead Teacher` identity. A real deployment can extend the schema with a teacher table — see [Reference → Data model](../reference/data-model).

## What gets recalculated when

| Action | Revalidates |
|--------|-------------|
| Add classroom | `/dashboard` |
| Log session | `/dashboard` |
| Delete classroom | `/dashboard` |
| Delete session | `/dashboard` |
| Toggle favorite | `/dashboard`, `/games`, `/lessons/[slug]` |

Revalidation uses Next.js `revalidatePath`. Page caches are invalidated on the next render — typically within milliseconds of the action returning.

## Reading the data programmatically

The dashboard reads through `src/lib/data/dashboard.ts`:

```ts
import {getDashboardSnapshot} from '@/lib/data/dashboard';

const snapshot = getDashboardSnapshot();
console.log(snapshot.metrics.standardsCovered);
```

All queries are synchronous — `better-sqlite3` is a synchronous binding. That's intentional: it makes server components straightforward and removes a class of race conditions.

See [Reference → Data model](../reference/data-model) for the full query surface.
