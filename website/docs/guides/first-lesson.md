---
title: Run your first real lesson
sidebar_position: 1
---

# Run your first real lesson

The [Quickstart](../getting-started/first-lesson-in-5-minutes) is a happy-path walkthrough. This guide is the version you actually run on a Tuesday with 26 8th-graders.

## Before the bell

### 1. Pick the standard, then the game

Don't browse for "fun games" — start from the standard you owe instruction on this week.

```
/games?subject=Math&gradeBand=6-8&standard=CCSS.MATH.6.RP.A.3
```

This gives you only games that have *justified themselves* against that code. Discard anything with a `complexity` higher than you can teach in one session — usually 3 or below for an introduction, 4 for review.

### 2. Open the lesson plan and skim five things

- **Learning objectives** — can you say each one aloud in 10 seconds?
- **Materials needed** — do you actually have the right number of game copies?
- **Teacher prep** — what must happen before the bell? Often it's "punch out tokens" or "pre-sort fraction cards."
- **Facilitation guide** — what are the teacher moves *during* play?
- **Rubric** — what counts as "Meets" vs "Developing"?

If anything is unclear, fix it now, not in front of the class.

### 3. Print the PDF

```
GET /api/lessons/[slug]/pdf
```

Or just click **Download PDF** on the lesson page. Print one copy for your desk, one for the sub folder.

### 4. Pick a variant

Most plans ship 30 / 45 / 60-minute variants. Pick the one that fits your block. If you have a 50-minute period, take the 45-minute variant and add 5 minutes to reflection — not to play.

## During class

### 1. Anchor with the pre-game activity

Run the pre-game activity exactly as written — it's 3–8 minutes and it sets up the vocabulary kids will need during play. Skipping it usually shows up as a confused group five minutes into the game.

### 2. Generate groups

Open `/tools` in a second tab. Paste your roster, pick the group size from the lesson's recommendation, and project the groups on the board.

If you want repeatable groupings, set the seed — same input, same output.

### 3. Start the session timer

In the same tools tab, load the lesson's phase sequence into the timer. Start it as students sit down.

The audible cue at each phase boundary cuts your "transitions" loss by a lot. You'll feel the difference inside one period.

### 4. Work the facilitation guide

The facilitation guide is a list of teacher moves keyed to phases. Examples:

- **Setup**: "Walk one group through the first turn aloud."
- **Round 1**: "Listen for vocabulary — flag any group not using ratio language."
- **Round 2**: "Pause play for one minute. Ask: who's winning and why?"

The moves are intentional friction. Use them.

### 5. Run the reflection

The post-game reflection prompts are not optional. They're where the game becomes a lesson. Pick 2 of the 4 prompts and run them as a whole-class discussion or a 3-minute exit ticket.

## After the bell

### 1. Log the session — now, not later

Open `/dashboard`, click **Log session**, fill it in. The whole interaction is under 60 seconds. Do it before you move to the next class — the notes you write three days later will be worse.

### 2. Use the notes field for the lesson, not the students

Good notes: *"Round 3 ran long, cut to 4 next time. Groups 2 and 5 mastered ratio language; group 1 needs follow-up."*

Bad notes: *"Jordan was off-task again."* — that belongs in your gradebook or behavior log, not here.

### 3. Check the heatmap weekly

Every Friday, look at the skill heatmap on your dashboard. Two questions:

- Is anything *missing* — a skill your standards demand but no session has touched?
- Is anything *over-represented* — a skill you've been hitting because the game is fun, not because the kids need it?

Adjust next week's planning accordingly.

## A common failure mode

> *"I tried a game lesson once. It was chaos."*

Almost always traces to one of three causes:

1. **Skipped the pre-game activity.** Students didn't have the vocabulary or the goal in their head.
2. **No phase timer.** Open-ended play in a 7th-grade classroom becomes social hour by minute 12.
3. **No reflection.** Students leave thinking it was a fun game day, not a lesson.

Run the structure as designed for three sessions before deciding it doesn't work. By session three, you'll know whether this approach fits your class.

## Related

- [Finding games by standard](./finding-games-by-standard)
- [Running a classroom session](./running-a-classroom-session)
- [Exporting PDFs](./exporting-pdfs)
