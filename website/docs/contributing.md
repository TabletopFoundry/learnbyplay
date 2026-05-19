---
title: Contributing
sidebar_position: 95
---

# Contributing

LearnByPlay is open source under the MIT license. PRs are welcome — whether you're fixing a typo in a lesson plan or adding a new classroom tool.

## Code of conduct

Be kind. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Disrespectful behavior — toward contributors, students, or teachers — gets you removed from the project.

## What we welcome

- 🎲 **New games** — well-researched, standards-aligned entries to the catalog.
- 📋 **New lesson plans** — using games already in the catalog, following the existing shape.
- 🐛 **Bug fixes** — with a test reproducing the bug when feasible.
- ♿ **Accessibility fixes** — always high-priority.
- 📝 **Documentation** — typos, clarifications, new examples.
- 🧰 **New classroom tools** — small, focused, no login required.

## What we don't accept

- Drive-by formatter PRs that touch hundreds of files.
- Dependency churn (e.g. swapping the test runner because you prefer X).
- "Add my product" PRs.
- AI-generated lesson plans without a real teacher having taught them.

## Setup

```bash
git clone https://github.com/<your-username>/learnbyplay.git
cd learnbyplay
nvm use
npm install
npm run dev
```

You should be at `http://localhost:3000` in under a minute.

## The contribution loop

1. **Open an issue first** for anything larger than a typo. We'll help scope it before you write code.
2. **Branch from `main`**: `git checkout -b feat/your-feature-name`.
3. **Make the change.** Keep PRs focused — one concern per PR.
4. **Run the gate**: `npm run check`.
5. **Push and open a PR.** Link the issue with `Closes #N`.
6. A maintainer reviews. Address feedback. Land it.

## Coding conventions

- **TypeScript**: strict mode. No `any` in new code.
- **Files**: `kebab-case.tsx` for components, `kebab-case.ts` for modules.
- **Components**: `PascalCase` export names. Reusables go in `src/components/`.
- **Data**: queries live in `src/lib/data/*`, mutations live in `src/app/actions.ts`.
- **Styling**: Tailwind utility classes. Match existing patterns for spacing, color, radius.
- **No SQL in pages.** Always go through the data layer.

## Commit messages

Conventional Commits:

```
feat(games): add player-count filter
fix(timer): prevent phase skip on rapid clicks
docs(troubleshooting): clarify better-sqlite3 install on Windows
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Adding a game

1. Open `src/lib/seed/games.ts`.
2. Add a new entry matching the `Game` interface.
3. Every `standards` code must already exist in `src/lib/seed/standards.ts` — or add the standard first.
4. Add at least one `simplifiedRules` entry.
5. Add a `classroomFit` and `copiesNote`.
6. Bump `SEED_VERSION` in `src/lib/db.ts`.
7. Verify with `npm run dev`: the game appears in `/games`.

PR description should include:

- Why this game earns a slot (which standards it justifies).
- Whether you've taught with it (yes/no — both fine; we just want to know).
- A link to publisher info.

## Adding a lesson

1. Open `src/lib/seed/lessons.ts`.
2. Add an entry matching the `LessonPlan` interface.
3. `gameSlug` must exist. `standards` must be a subset of the game's standards.
4. Include at least one duration variant.
5. Bump `SEED_VERSION`.

PR description should include:

- Whether you've taught this lesson with a real class.
- What worked and what you'd change next time.

## Tests

We use Vitest. Tests live in `src/lib/__tests__/` and adjacent `*.test.ts` files.

- New data-layer functions need unit tests for the happy path and one error case.
- New server actions need tests for the validation branches.
- UI components don't need tests unless they encapsulate non-trivial logic.

Run with `npm test`.

## CI

GitHub Actions runs `npm run check` against Node 20 and 22 on every PR. Your PR can't merge until both pass. If CI fails:

- Click into the failing job.
- Reproduce locally with `nvm use 20 && npm run check`.
- Push the fix.

## Releasing (maintainers only)

1. Update `CHANGELOG.md` under a new version heading.
2. Bump `version` in `package.json`.
3. Tag: `git tag v0.x.y && git push --tags`.
4. GitHub Release notes are drawn from the changelog entry.

## License

By contributing, you agree your work is released under the project's MIT license.

Thanks for helping make standards-aligned game-based learning a normal part of school. 🎲
