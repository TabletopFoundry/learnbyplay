---
title: Why LearnByPlay
sidebar_position: 2
---

# Why LearnByPlay?

Board-game-based learning works. The literature on it is decades old: cooperative play boosts retention, structured turns build executive function, and well-designed games naturally produce the practice repetitions a worksheet can't.

The barrier has never been the games. It's been the **defensibility**. Teachers who pull out Settlers of Catan on a Tuesday get questions: *Which standard is this? Where's the rubric? How do you assess it? What evidence do you have that the lesson worked?*

LearnByPlay exists to make those questions trivial to answer.

## The problem with the alternatives

| Approach | What's missing |
|----------|----------------|
| **Spreadsheet of games + handwritten plans** | No standards tagging, no print-ready format, no evidence trail. Doesn't survive a teacher leaving the building. |
| **BoardGameGeek + Pinterest** | Great for discovery, useless for compliance. No grade band filters, no Common Core mapping, no lesson structure. |
| **Commercial LMS modules** | $$$, locked to a vendor, often a single subject, and the catalog rarely matches the games already in your closet. |
| **Generic teacher-pay-teacher PDFs** | One-off plans with no shared spine, no consistent rubric format, no aggregate reporting. |

## What LearnByPlay does differently

### 1. Standards are first-class

Every game and every lesson is keyed to a specific standard code (Common Core math, CASEL SEL competencies). The catalog browser filters on these codes — not on tags or guesses.

### 2. Lesson plans follow one shape

Every lesson uses the same skeleton: objectives → materials → pre-game → facilitation → post-game reflection → rubric → variants. Teachers learn the shape once. Subs can pick up any plan cold. Administrators can compare apples to apples.

### 3. The classroom tools are built-in

You don't ship students to a separate app for a timer or grouping. The session timer announces phase changes. The group generator is one click. The simplified rules viewer is readable on a Chromebook from across the room.

### 4. Evidence is automatic

Log a session against a class. The skill heatmap updates. The standards coverage view updates. When the principal walks in, you have a report — not a story.

### 5. It runs anywhere

SQLite on disk, Next.js on top. No cloud account, no per-seat licensing, no student data leaving the building. Drop it on a school server, a Raspberry Pi, or a teacher's laptop and it works.

## When LearnByPlay is *not* the right fit

We try to be honest about this:

- **You need a full SIS / gradebook.** LearnByPlay tracks sessions and skill coverage; it is not a gradebook replacement.
- **You want a polished consumer app for parents at home.** This is a teacher tool first. Parents are welcome to use it, but the UX assumes a classroom context.
- **You can't run Node.js anywhere.** The app needs a Node ≥ 20 runtime. If your district forbids self-hosting, a managed deployment is your only path.

If those caveats don't apply, **[the Quickstart](./getting-started/quickstart)** takes about 5 minutes.
