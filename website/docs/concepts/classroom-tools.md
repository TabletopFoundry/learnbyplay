---
title: Classroom tools
sidebar_position: 4
---

# Classroom tools

Three live tools at `/tools` are designed to be projected on a board or opened on a Chromebook with the class in front of you. They are intentionally small and have zero login friction.

## Group generator

Solves the "how do I split 27 students into balanced groups of 4 without favoritism?" problem.

**Inputs**

- A list of student names (paste from a roster, one per line).
- Target group size (2–6).
- Optional: shuffle seed for reproducibility.

**Output**

- N balanced groups, with the last group absorbing remainders.
- A "regenerate" button if a group composition is awkward.

**Implementation**: `src/components/group-generator.tsx`. Names are held in component state only — nothing is persisted to the database.

## Session timer

A phased timer that announces phase changes audibly and visually.

**Inputs**

- A sequence of phases — each with a name and minutes.
- Defaults to the active lesson's recommended sequence when launched from a lesson page.

**Behavior**

- Counts down the current phase.
- On phase end: plays a chime (respects browser autoplay rules), flashes the phase name, advances to the next phase.
- Pause / resume / skip controls.

**Why it matters**: a clear audible cue cuts 5+ minutes of transition noise out of every session.

**Implementation**: `src/components/session-timer.tsx`. State lives in React; the timer survives a page refresh via `sessionStorage`.

## Rules viewer

A simplified rules card derived from each game's `simplifiedRules` array. Designed for projection — large type, short bullets, no images.

**Behavior**

- Renders 4–8 numbered steps from the game's seed entry.
- Includes the `classroomFit` blurb and `copiesNote` so you remember how many copies you need.
- Keyboard navigation: arrow keys move between games.

The simplified rules are a *teaching adaptation*, not the publisher's rulebook. Use them to launch play; reach for the official rules for edge cases.

## When *not* to use the tools

- **Game requires app companion.** A few modern games (e.g. asymmetric campaign games) assume the publisher's app. LearnByPlay tools won't replace that.
- **High-stakes assessment.** The timer is great for pacing; it is not a testing-accommodation tool.
- **Anonymous grouping.** The group generator stores names client-side only, but if your district forbids any list of student names in a web app, paste initials instead.

## Extending the tools

Adding a new classroom tool means:

1. Create a component in `src/components/`.
2. Register it on the `/tools` page in `src/app/tools/page.tsx`.
3. If it needs persistence, plumb through `src/app/actions.ts` — never call SQLite from the client.

See [Reference → Server actions](../reference/server-actions) for the mutation pattern.
