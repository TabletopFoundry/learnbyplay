---
title: Running a classroom session
sidebar_position: 3
---

# Running a classroom session

The classroom tools at `/tools` are designed for the room, not the prep period. Here's how to use them in practice.

## The setup that works

Open two tabs:

1. **Tab 1**: The lesson plan, `/lessons/[slug]`.
2. **Tab 2**: The classroom tools, `/tools`.

Project tab 2 on the front board. Keep tab 1 on your laptop for reference.

## Group generator: avoid the three traps

The group generator is one paste, one click. Three failure modes to avoid:

### Trap 1: Putting all the chatty kids together

The default shuffle is random — it does not balance for behavior. If you need behavior-balanced groups, do a manual swap *after* generation. The tool is fast enough that regenerating until you like the mix is fine.

### Trap 2: Groups of 5 in a 4-player game

Some games hard-cap at 4 players. The lesson's `materials` section tells you the player count per copy. Set the group generator to match — if you have 6 copies and 24 students, that's groups of 4.

### Trap 3: Pasting names with extra whitespace

The generator splits on newlines and trims. But empty lines become an empty "student" slot. Clean your paste:

```
Aanya
Bao
Caleb
Diego
```

Not:

```

Aanya

Bao
```

## Session timer: the single biggest win

A phased timer with audible cues is the single highest-leverage tool in the app. It buys you back 5–10 minutes per period of recovered transition time.

### Loading phases

When you open a timer from a lesson page, the lesson's `sequence` is pre-loaded. You can also configure phases manually:

```
Setup          — 3 min
Warm-up        — 5 min
Round 1        — 10 min
Mid-game check — 2 min
Round 2        — 10 min
Reflection     — 5 min
```

### Using it well

- **Start the timer when groups sit down**, not when you've finished giving instructions.
- **Project the timer face**, not just the lesson plan. Students self-pace when they can see the clock.
- **Honor the phase boundaries.** If the chime rings mid-turn, "finish this turn and move on" — not "two more turns."
- **Use the pause** for one whole-class moment if a clarification is needed. Don't let the timer eat instruction time.

### Browser autoplay

Modern browsers require a user gesture before audio plays. The first time you click "Start" in a fresh tab, the chime is enabled. If you swap tabs and back, you may need to click once more — try this before class, not during.

## Rules viewer: read it together

The rules viewer is for the *first* time a class plays a game. Read the simplified rules aloud once, with the class, before generating groups.

After the first session, most classes won't need the viewer again — they'll remember. Skip it on subsequent sessions to save time.

## A repeatable in-class script

This script takes 4–5 minutes from bell to first die roll.

1. **"Take out your warmup."** Project the pre-game activity. (2 min.)
2. **"Look up here."** Switch projection to the rules viewer. Read steps aloud. (2 min.)
3. **"Your groups are up here."** Switch to the group generator output. Students move. (1 min.)
4. **"Timer starts now."** Start the session timer. Play begins.

After three sessions, the class internalizes the pattern. By session five, students start setting up before you give the cue.

## Reflection: don't skip it

The most common mistake is letting play run to the bell. The post-game reflection is where the *game* becomes a *lesson*. Cut a round short if you have to. Five minutes of reflection beats five extra minutes of play.

## Related

- [Run your first real lesson](./first-lesson)
- [Concepts → Classroom tools](../concepts/classroom-tools)
- [Managing classes and sessions](./managing-classes-and-sessions)
