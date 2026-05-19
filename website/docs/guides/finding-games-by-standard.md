---
title: Finding games by standard
sidebar_position: 2
---

# Finding games by standard

The catalog at `/games` is built around standards. Use the URL to scope it precisely.

## The basic flow

1. Open `/games`.
2. Pick a **subject** from the filter sidebar.
3. Pick a **grade band**.
4. (Optional) Pick a **specific standard** code.
5. (Optional) Trim by **max play time**, **group size**, or **max complexity**.
6. Sort by `fit` (default), `time`, `complexity`, or `standards` (count of aligned codes).

## Filter combinations that scale

These are the lookup patterns that survive a year of planning.

### "What can I teach this standard with?"

Drill straight to a code:

```
/games?standard=CCSS.MATH.3.NF.A.3&sort=complexity
```

You get every game aligned to the code, sorted from gentlest entry point to deepest.

### "I have 30 minutes and 4 students per group."

```
/games?gradeBand=6-8&maxPlayTime=30&groupSize=4&sort=time
```

The catalog filters by **upper bound** play time — so `maxPlayTime=30` returns games whose `playTimeMax ≤ 30`.

### "Show me everything accessible for a substitute."

```
/games?gradeBand=3-5&maxComplexity=2
```

Complexity 1–2 games have minimal rules surface — a competent sub can run them with the lesson plan alone.

### "I want SEL practice."

```
/games?subject=SEL
```

SEL standards in the seed are CASEL competencies. Games here are cooperative or negotiation-heavy.

## Sort options explained

| Sort | Meaning | When to use |
|------|---------|-------------|
| `fit` (default) | Heuristic: matches your filters tightly, prioritizes mid-complexity. | Most browsing. |
| `time` | Ascending by `playTimeMin`. | When the block length is the binding constraint. |
| `complexity` | Ascending by `complexity`. | Picking an entry point for a class new to game-based learning. |
| `standards` | Descending by number of aligned standard codes. | Looking for a "Swiss-army" game that hits multiple targets. |

## Shareable links

Every filter combination is a stable URL. Send a link to a co-teacher:

```
https://your-deployment.example.com/games?subject=Math&gradeBand=3-5&maxComplexity=3&sort=standards
```

The page server-renders with those filters applied. No "click here, then click there" instructions.

## When you can't find a fit

Three honest options:

1. **Loosen a filter.** Drop `maxComplexity` by one. Bump `maxPlayTime` by 10.
2. **Open the standard page.** Some standards have only one or two aligned games in the demo dataset. That's a curation gap, not a search failure.
3. **Add a game.** If you've taught a great game that hits the standard, add it to `src/lib/seed/games.ts`. See [Concepts → Games and standards](../concepts/games-and-standards).

## Bookmark patterns that work

Keep three or four bookmarks per subject you teach:

- `/games?subject=Math&gradeBand=3-5&maxPlayTime=20` — math warmups
- `/games?subject=Math&gradeBand=3-5&maxPlayTime=45` — full math block
- `/games?subject=Math&gradeBand=3-5&maxComplexity=2&sort=fit` — sub day
- `/games?subject=SEL&gradeBand=3-5` — advisory / morning meeting

After a month, these are the only catalog pages you'll open.
