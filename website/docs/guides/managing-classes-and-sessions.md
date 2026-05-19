---
title: Managing classes and sessions
sidebar_position: 5
---

# Managing classes and sessions

The dashboard at `/dashboard` is the operational surface for your classes. Three workflows cover 95% of teacher use.

## Workflow 1: Add a class

Click **Add classroom**. Required fields:

| Field | Validation |
|-------|-----------|
| Name | 1–200 chars, required |
| Subject | One of `Math`, `Science`, `Social Studies`, `ELA`, `SEL` |
| Grade band | One of `K-2`, `3-5`, `6-8`, `9-12` |
| Student count | Positive integer ≤ 999 |

Submit. The new class shows up immediately because the action calls `revalidatePath('/dashboard')`.

### Naming convention that works

Use a name a sub would recognize: `Period 3 — Algebra 1`, not `Algebra`. The dashboard sorts alphabetically, so `Period 1 …`, `Period 2 …` keeps your day in order.

## Workflow 2: Log a session

Click **Log session**. Fields:

| Field | Validation |
|-------|-----------|
| Classroom | Must exist |
| Game | Must exist |
| Lesson | Must exist |
| Date | Valid ISO date, not in the future |
| Notes | ≤ 2000 chars |

The form validates references atomically — if a class, game, or lesson got deleted between page load and submit, the action returns an error.

### Notes hygiene

Good notes describe the **lesson**, not the **students**. They become your future self's memory of what worked.

| ✅ Good | ❌ Bad |
|--------|--------|
| "30-min variant was tight; use 45 next time." | "Class was chatty today." |
| "Pre-game activity nailed the vocab transfer." | "Bao got it, Diego didn't." |
| "Round 2 should swap to cooperative scoring." | "It went fine." |

## Workflow 3: Delete a class or session

Click the delete control on a class or session card. The action confirms, then cascades:

- Deleting a class **deletes its sessions** (`ON DELETE CASCADE`).
- Deleting a session leaves the class intact.

Both operations are irreversible. The dashboard re-renders with the row gone.

## Favoriting lessons

On any lesson page, click the ★ to favorite. Favorites:

- Are scoped to the `teacher_name` (currently `Lead Teacher` in the demo).
- Appear in the **Favorite lessons** row on the dashboard.
- Are cheap to add/remove — the toggle is one click.

Use favorites as a "next week" shortlist, not as a permanent library.

## Reading the heatmap

The skill heatmap shows which skills have been practiced across all logged sessions, bucketed into `high`, `medium`, `low`. The buckets are relative to the **max count in your current dataset**, so a fresh install with 3 sessions still produces a useful gradient.

**Questions to ask yourself weekly:**

- Are any high-priority skills sitting in `low`?
- Is one skill dominating `high` because I keep using the same fun game?
- Does the heatmap match what my pacing guide says I should be teaching?

The answers shape next week's plan.

## Reset the dashboard data

For a clean slate (preserving the game/lesson seed):

```bash
sqlite3 data/learnbyplay.db <<'SQL'
DELETE FROM sessions;
DELETE FROM classrooms;
DELETE FROM favorites;
SQL
```

Restart the dev server. Catalogs and lesson plans are intact; the dashboard is empty.

For a full reset including catalogs, see [Resetting demo data](./resetting-demo-data).
