# LearnByPlay

LearnByPlay is a Next.js MVP for a board game education platform that connects commercial board games to curriculum standards, lesson plans, and teacher-friendly classroom tools.

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- SQLite via `better-sqlite3`
- `pdf-lib` for lesson plan PDF downloads

## Included MVP features

- EdTech landing page for teachers
- Game-to-curriculum browser with filters for subject, grade band, standards, play time, group size, and complexity
- Game detail pages with standards alignment, skills, and lesson plan links
- 12 detailed lesson plans with downloadable PDF exports
- Classroom tools: group generator, session timer, simplified rules viewer
- Teacher dashboard with class management, game usage tracking, skill coverage heatmap, and favorite lessons
- Professional development guide, best practices, and administrator FAQ

## Seed data

On first run, the app creates `data/learnbyplay.db` and seeds:

- 37 games
- 20 standards/competency records
- 12 detailed lesson plans
- 4 PD articles
- Sample classes, sessions, and favorites for the dashboard

## Getting started

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Key routes

- `/` — landing page
- `/games` — curriculum browser
- `/games/[slug]` — game detail
- `/lessons/[slug]` — lesson plan detail
- `/dashboard` — teacher dashboard
- `/tools` — classroom tools
- `/pd` — professional development content
- `/api/lessons/[slug]/pdf` — PDF export endpoint

## Notes

- The SQLite database is local to this project and is created automatically.
- To reset demo data, stop the app and delete `data/learnbyplay.db`, then restart.
- The PDF export is intentionally lightweight and optimized for quick local testing.
