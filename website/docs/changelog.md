---
title: Changelog
sidebar_position: 99
---

# Changelog

All notable changes to LearnByPlay are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2025-01-01

The initial public release.

### Added

- **Curriculum browser** — filter 45 games by subject, grade band, Common Core standard, play time, group size, and complexity. Query parameters compose and are shareable.
- **Lesson plans** — 21 ready-to-teach plans with learning objectives, materials, teacher prep, pre-game activity, facilitation guide, post-game reflection, rubrics, and duration variants.
- **PDF export** — `/api/lessons/[slug]/pdf` renders any lesson as a print-ready PDF via `pdf-lib`.
- **Classroom tools** — random group generator, phased session timer with audible phase changes, and simplified rules viewer at `/tools`.
- **Teacher dashboard** — classes, sessions, favorites, recent activity, and a relative skill-coverage heatmap.
- **Professional development library** — articles and an administrator FAQ at `/pd`.
- **Accessibility baseline** — skip-nav, ARIA landmarks, focus-visible styling, keyboard navigation, screen reader support.
- **SQLite persistence** — schema, transactional seeding, and `ON CONFLICT` upserts. Data lives at `data/learnbyplay.db` by default.
- **Demo dataset** — 45 games, 30 standards (Common Core math + CASEL), 21 lessons, 4 PD articles, 8 classrooms, 32 sessions, 11 favorites.
- **Health check** — `/api/health` returns JSON for liveness probes.
- **CI** — GitHub Actions runs lint, type check, tests, and build on Node 20 and 22 for every PR.
- **Community files** — `CONTRIBUTING.md`, MIT `LICENSE`, issue and PR templates.

---

For releases beyond `0.1.0`, see the [GitHub Releases page](https://github.com/TabletopFoundry/learnbyplay/releases).
