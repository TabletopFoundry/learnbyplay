---
title: Games and standards
sidebar_position: 2
---

# Games and standards

## The catalog model

Every game in LearnByPlay has a fixed shape, defined in `src/lib/types.ts`:

```ts
interface Game {
  slug: string;            // url-safe id, e.g. "fraction-tracks"
  name: string;
  publisher: string;
  tagline: string;
  description: string;
  subjects: Subject[];     // "Math" | "Science" | "Social Studies" | "ELA" | "SEL"
  gradeBand: GradeBand;    // "K-2" | "3-5" | "6-8" | "9-12"
  ageRange: string;
  minPlayers: number;
  maxPlayers: number;
  playTimeMin: number;     // minutes
  playTimeMax: number;
  complexity: number;      // 1 (Starter) – 5 (Expert)
  setupTimeMin: number;
  mechanics: string[];
  skills: string[];
  materials: string[];
  simplifiedRules: string[];
  standards: string[];     // standard codes
  classroomFit: string;
  copiesNote: string;      // "1 copy per 4 students"
}
```

Two fields drive most of the planning UX:

- `subjects` and `gradeBand` power the catalog filters.
- `standards` is an array of **codes**, not free-text tags. Each code resolves to a row in the `standards` table.

## The standards model

```ts
interface Standard {
  code: string;            // e.g. "CCSS.MATH.3.NF.A.3"
  framework: string;       // "Common Core" | "CASEL" | ...
  subject: Subject | "Advisory";
  gradeBand: GradeBand;
  description: string;     // the verbatim standard text
}
```

The demo dataset ships **30 standards**:

- **Common Core Math** codes spanning K–12 (e.g. `K.CC.A.1`, `5.NF.B.4`, `HSA.SSE.A.1`).
- **CASEL SEL** competencies (e.g. `CASEL.SELF.AWARENESS`, `CASEL.RELATIONSHIP.SKILLS`).

You can add your own — see [Reference → Data model](../reference/data-model).

## How alignment is encoded

Alignment is a many-to-many through code references:

```
game.standards = ["CCSS.MATH.3.NF.A.3", "CCSS.MATH.3.NF.A.1"]
lesson.standards = ["CCSS.MATH.3.NF.A.3"]
```

The catalog UI joins these to render the alignment chips on each card. No fuzzy matching; if a game claims a code, the lesson plan must justify it.

## Complexity vs grade band

These are **independent axes** and they often diverge:

| Game | Grade band | Complexity |
|------|-----------|-----------|
| Sum Swamp | K–2 | 1 (Starter) |
| Prime Climb | 3–5 | 3 (Moderate) |
| Wingspan | 6–8 | 4 (Stretch) |
| Power Grid | 9–12 | 5 (Expert) |

When filtering the catalog, drop `Max complexity` *below* the grade-band default to surface accessible entry points; raise it for advanced groups or co-taught settings.

## Filtering in the catalog

The `/games` route accepts these query params:

| Param | Type | Example |
|-------|------|---------|
| `subject` | `Subject` | `?subject=Math` |
| `gradeBand` | `GradeBand` | `?gradeBand=3-5` |
| `standard` | standard code | `?standard=CCSS.MATH.3.NF.A.3` |
| `maxPlayTime` | minutes | `?maxPlayTime=30` |
| `groupSize` | players per group | `?groupSize=4` |
| `maxComplexity` | 1–5 | `?maxComplexity=3` |
| `sort` | `fit` \| `time` \| `complexity` \| `standards` | `?sort=fit` |

These compose, so a fully scoped link like:

```
/games?subject=Math&gradeBand=3-5&maxPlayTime=30&maxComplexity=3
```

is a perfectly shareable lesson-planning bookmark.

## Adding a new game

See [Reference → Data model](../reference/data-model) for the seed format. A new game requires:

1. A unique `slug`.
2. At least one valid `standards` code (must exist in the standards seed).
3. Realistic `playTimeMin` / `playTimeMax` — the catalog filters depend on them.

After editing `src/lib/seed/games.ts`, bump `SEED_VERSION` in `src/lib/db.ts` and restart the dev server. Your new game shows up in the catalog.
