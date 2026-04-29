# Contributing to LearnByPlay

Thank you for considering contributing to LearnByPlay! This guide will help you get started.

## Prerequisites

- **Node.js** ≥ 20 (we recommend using [nvm](https://github.com/nvm-sh/nvm) — see `.nvmrc`)
- **npm** ≥ 9
- **Git**

## Getting Started

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/board-games.git
   cd board-games/09-learnbyplay
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Verify everything works**: Open [http://localhost:3000](http://localhost:3000) and browse the app.

## Project Structure

```
src/
├── app/          # Next.js App Router pages and API routes
├── components/   # Reusable React components
└── lib/
    ├── data/     # Data access layer (queries)
    ├── seed/     # Database seed data
    ├── db.ts     # SQLite connection and schema
    ├── types.ts  # TypeScript interfaces
    └── utils.ts  # Shared utilities
```

## Development Workflow

### Before You Start

- Check [existing issues](https://github.com/josedab/board-games/issues) for something to work on, or open a new one to discuss your idea.
- Issues labeled `good first issue` are great starting points.

### Making Changes

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the coding conventions below.

3. **Run checks** before committing:

   ```bash
   npm run lint        # ESLint
   npm run typecheck   # TypeScript type checking
   npm test            # Unit tests
   npm run build       # Build verification
   ```

   Or run all checks at once:

   ```bash
   npm run check       # lint + typecheck + test + build
   ```

4. **Commit** with a descriptive message (see commit format below).

5. **Push** and open a Pull Request against `main`.

## Coding Conventions

- **TypeScript**: Strict mode is enabled. All new code must be fully typed — avoid `any`.
- **Styling**: Use Tailwind CSS utility classes. Follow existing patterns for spacing, colors, and border radius.
- **Components**: Place reusable components in `src/components/`. Page-specific markup stays in the page file.
- **Data layer**: All database queries go through `src/lib/data/`. Use the existing mapper pattern from `src/lib/data/mappers.ts`.
- **Server actions**: Form mutations use Next.js Server Actions in `src/app/actions.ts`.
- **Naming**: Use `kebab-case` for files, `PascalCase` for components, `camelCase` for variables/functions.

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:

```
feat(games): add player count filter to catalog
fix(timer): prevent phase skip on rapid clicks
docs: add deployment guide to README
```

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Include a clear description of what changed and why.
- Ensure all CI checks pass (lint, type check, build).
- Add screenshots for UI changes.
- Link related issues using `Closes #123` in the PR description.

## Reporting Bugs

Please use the [Bug Report template](https://github.com/josedab/board-games/issues/new?template=bug_report.md) and include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and Node.js version
- Screenshots if applicable

## Requesting Features

Use the [Feature Request template](https://github.com/josedab/board-games/issues/new?template=feature_request.md) and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Database Reset

If you need a fresh database during development:

```bash
rm data/learnbyplay.db
npm run dev
```

The database is automatically recreated and seeded on next startup.

---

Thank you for contributing! 🎲
