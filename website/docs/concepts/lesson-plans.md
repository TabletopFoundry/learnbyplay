---
title: Lesson plans
sidebar_position: 3
---

# Lesson plans

A lesson plan in LearnByPlay is a structured document — not a free-form text blob. The shape is enforced by `LessonPlan` in `src/lib/types.ts` and rendered identically across the app.

## Anatomy of a plan

```ts
interface LessonPlan {
  slug: string;
  gameSlug: string;                 // which game this plan teaches with
  title: string;
  summary: string;
  standards: string[];              // codes — must be ⊆ game's standards
  gradeBand: string;
  learningObjectives: string[];     // "SWBAT..." statements
  materialsNeeded: string[];
  preGameActivity: string[];        // 3–8 minute warm-up steps
  facilitationGuide: string[];      // teacher moves during play
  postGameReflection: string[];     // discussion prompts
  assessmentRubric: RubricRow[];    // exceeds / meets / developing
  teacherPrep: string[];            // do-this-before-class list
  variants: LessonVariant[];        // duration variants
}
```

## The fixed shape, by design

Every plan you open has the same eight sections in the same order:

1. **Title + summary** — one-sentence elevator pitch.
2. **Standards + grade band** — what this hits and who it's for.
3. **Learning objectives** — measurable SWBAT statements.
4. **Materials needed** — including how many copies of the game.
5. **Teacher prep** — what to do *before* class.
6. **Pre-game activity** — anchor prior knowledge, ~5 minutes.
7. **Facilitation guide** — teacher moves *during* play, phase by phase.
8. **Post-game reflection** — discussion prompts and exit-ticket ideas.
9. **Assessment rubric** — three-level rubric per criterion.
10. **Variants** — 30 / 45 / 60-minute versions with different focus.

A sub picking up a plan cold knows where to find what they need. An administrator reading three plans can compare them without translating between formats.

## Duration variants

A single lesson can ship 1–3 `variants`:

```ts
interface LessonVariant {
  duration: number;   // minutes
  label: string;      // "Express", "Standard", "Deep dive"
  focus: string;      // what gets emphasized in this variant
  sequence: LessonSequenceItem[]; // phase-by-phase, with minutes
}

interface LessonSequenceItem {
  phase: string;      // "Warm-up", "Setup", "Round 1", "Reflection"
  minutes: number;
  guidance: string;
}
```

This lets one plan serve a 30-minute resource block *and* a 60-minute math block without forking the lesson.

## Rubrics

Each rubric row has three performance levels. The labels are fixed — `exceeds`, `meets`, `developing` — so cross-class data has a chance of being comparable.

```ts
interface RubricRow {
  criterion: string;     // "Uses precise mathematical vocabulary"
  exceeds: string;       // observable evidence at this level
  meets: string;
  developing: string;
}
```

LearnByPlay deliberately does **not** include a 4th "Beginning" column or numeric points — both add reporting noise without adding instructional signal at this layer.

## PDF export

Every lesson exports to a print-ready PDF via `pdf-lib`:

```
GET /api/lessons/[slug]/pdf
```

The PDF strips all app chrome and renders only the plan, formatted for letter or A4. Use it for sub folders, parent nights, or compliance binders.

See [Guides → Exporting PDFs](../guides/exporting-pdfs).

## Adding a new lesson

1. Open `src/lib/seed/lessons.ts`.
2. Add an entry — every required field must be present.
3. Ensure `standards` is a subset of the linked game's standards.
4. Bump `SEED_VERSION` in `src/lib/db.ts`.
5. Restart `npm run dev`.

The lesson appears in the linked game's detail page, the catalog filter results, and the dashboard's lesson picker.
