<div align="center">

# 🎲 LearnByPlay

**Turn great board games into trusted, standards-aligned instruction.**

[![CI](https://github.com/josedab/board-games/actions/workflows/ci.yml/badge.svg)](https://github.com/josedab/board-games/actions/workflows/ci.yml)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

LearnByPlay helps teachers find the right board game for a standard, launch a lesson with confidence, run structured play, and show administrators exactly what students practiced.

[Browse Games](#key-routes) · [Teacher Dashboard](#key-routes) · [Classroom Tools](#key-routes) · [Contributing](./CONTRIBUTING.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Curriculum Browser** | Filter 45 games by subject, grade band, Common Core standard, play time, group size, and complexity |
| 📋 **Lesson Plans** | 21 detailed, printable lesson plans with PDF export — complete with rubrics, sequences, and variants |
| 🧰 **Classroom Tools** | Random group generator, session timer with phase announcements, and simplified rules viewer |
| 📊 **Teacher Dashboard** | Class management, game usage tracking, skill coverage heatmap, and favorite lessons |
| 📚 **Professional Development** | PD articles, best practices guide, and administrator FAQ |
| ♿ **Accessible** | Skip-nav, ARIA landmarks, focus-visible styling, keyboard navigation, and screen reader support |

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| PDF Generation | [`pdf-lib`](https://pdf-lib.js.org/) |
| Runtime | Node.js ≥ 20 |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20 (see [`.nvmrc`](./.nvmrc))
- **npm** ≥ 9

### Quick Start

```bash
# Clone the repository
git clone https://github.com/josedab/board-games.git
cd board-games/09-learnbyplay

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the database is created on first run, and the rich demo dataset seeds automatically in non-production environments.

### Environment Variables

Copy the example environment file to get started:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `LEARNBYPLAY_DB_PATH` | `data/learnbyplay.db` | Path to the SQLite database file |
| `LEARNBYPLAY_ENABLE_SEEDING` | `false` in production, auto-enabled elsewhere | Set to `true` if you explicitly want the demo dataset seeded in production-like environments |

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run check` | Run all checks (lint + typecheck + test + build) |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/lessons/        # PDF export API endpoint
│   ├── dashboard/          # Teacher dashboard
│   ├── games/              # Game browser + detail pages
│   │   └── [slug]/         # Dynamic game detail
│   ├── lessons/[slug]/     # Lesson plan detail
│   ├── pd/                 # Professional development
│   ├── tools/              # Classroom tools
│   ├── actions.ts          # Server actions (create class, log session, toggle favorite)
│   ├── layout.tsx          # Root layout with header/footer
│   └── page.tsx            # Landing page
├── components/             # Reusable UI components
│   ├── game-art.tsx        # Generative game card art
│   ├── group-generator.tsx # Random student grouping tool
│   ├── session-timer.tsx   # Phased classroom timer
│   └── ...
├── lib/
│   ├── data/               # Data access layer (games, lessons, standards, dashboard)
│   ├── seed/               # Database seed data (45 games, 21 lessons, 30 standards, 8 classrooms, 32 sessions)
│   ├── db.ts               # SQLite connection + schema + seeding
│   ├── pdf.ts              # Lesson plan PDF generation
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # Subjects, grade bands, complexity labels
│   └── utils.ts            # Formatting utilities
docs/
├── PRD.md                  # Product requirements document
├── CODE_REVIEW.md          # Code quality review
├── UX_REVIEW.md            # UX review
└── IMPROVEMENTS.md         # Improvement roadmap
```

## 🗺 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with featured games, testimonials, and pricing |
| `/games` | Curriculum browser with filters |
| `/games/[slug]` | Game detail with standards alignment, skills, and linked lessons |
| `/lessons/[slug]` | Lesson plan with objectives, sequence, rubric, and PDF download |
| `/dashboard` | Teacher dashboard — classes, sessions, favorites, skill heatmap |
| `/tools` | Classroom tools — group generator, timer, rules viewer |
| `/pd` | Professional development articles and admin FAQ |
| `/api/lessons/[slug]/pdf` | PDF export endpoint |
| `/api/health` | Health check endpoint (JSON) |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Search engine directives |

## 🌱 Seed Data

The seed layer lives in `src/lib/seed/` and is applied from `src/lib/db.ts` using SQLite transactions and `ON CONFLICT` upserts so reruns refresh demo rows instead of duplicating them.


When demo seeding is enabled, the app seeds `data/learnbyplay.db` transactionally and idempotently with:

- **45 educational board games** spanning K-2, 3-5, 6-8, and 9-12
- **30 standards** using real Common Core Math codes plus CASEL-aligned SEL competencies
- **21 detailed lesson plans** with learning objectives, rubrics, reflection prompts, and multi-duration variants
- **4 PD articles** for teacher professional development
- **8 classrooms** with varied enrollment, including rooms with zero logged sessions
- **32 logged sessions** across classrooms, plus **11 lesson saves** from different teachers
- Edge cases such as single-standard games and multi-grade lesson plans

Production guard behavior:

- Demo seeding runs automatically in development and test environments.
- Production skips demo seeding unless `LEARNBYPLAY_ENABLE_SEEDING=true` is set explicitly.

> **Reset data**: Stop the server, delete `data/learnbyplay.db`, and restart.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up the development environment
- Code style and conventions
- Commit message format
- Pull request process

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
