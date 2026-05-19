---
title: Exporting PDFs
sidebar_position: 4
---

# Exporting lesson plan PDFs

Every lesson plan exports to a print-ready PDF. Use it for sub folders, parent nights, compliance binders, or just because some teachers still prefer paper.

## The endpoint

```
GET /api/lessons/[slug]/pdf
```

Examples:

```bash
# Save a PDF to disk
curl -o fraction-tracks.pdf \
  http://localhost:3000/api/lessons/fraction-tracks/pdf

# Preview headers
curl -sI http://localhost:3000/api/lessons/fraction-tracks/pdf
# Content-Type: application/pdf
# Content-Disposition: attachment; filename="fraction-tracks.pdf"
```

## What's in the PDF

The PDF strips all app chrome and includes:

1. **Title and summary**
2. **Standards alignment** (codes + framework)
3. **Grade band and duration**
4. **Learning objectives**
5. **Materials needed**
6. **Teacher prep**
7. **Pre-game activity**
8. **Facilitation guide**
9. **Post-game reflection prompts**
10. **Assessment rubric** as a real table
11. **Duration variants** (each as a sub-section)

Formatting is portrait, letter-sized, with generous margins. It prints cleanly on a school copier.

## What's *not* in the PDF

- No screenshots of the app UI.
- No QR codes back to the live site.
- No marketing.

The PDF is the lesson, not an advertisement for the lesson.

## Bulk export

There's no built-in "export all" UI yet, but the endpoint composes with a shell loop:

```bash
mkdir -p exports
for slug in $(curl -s http://localhost:3000/api/lessons/index | jq -r '.[]'); do
  curl -s -o "exports/${slug}.pdf" \
    "http://localhost:3000/api/lessons/${slug}/pdf"
done
```

:::note
The `/api/lessons/index` listing endpoint is on the roadmap. For now, copy slugs from `/games` pages or query the database directly:
```bash
sqlite3 data/learnbyplay.db "SELECT slug FROM lessons;"
```
:::

## Embedding the PDF link

From a lesson page, the **Download PDF** button is the rendered version of:

```tsx
<a href={`/api/lessons/${lesson.slug}/pdf`} download>
  Download PDF
</a>
```

You can paste the URL into a Google Classroom assignment, a Canvas module, or an email — the PDF generates on each request.

## Caching and performance

PDF generation is server-side via `pdf-lib`. A single lesson PDF generates in 50–200 ms on a modern laptop. There's no on-disk cache — the file is regenerated each request because the cost is low and the staleness risk isn't worth managing.

If you serve hundreds of PDF requests per minute, add a reverse-proxy cache with a short TTL (5 minutes is plenty — lessons rarely change mid-day).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `404 Not Found` | Bad slug | Check `/lessons/[slug]` first; the slug must exist in the lessons table. |
| Empty PDF | Lesson row missing fields | Validate the lesson seed entry against `LessonPlan` in `src/lib/types.ts`. |
| Garbled characters | Custom font missing | Stick to the default PDF fonts unless you bundle the font file. |
| Browser opens PDF inline | Browser ignored `Content-Disposition` | Use `curl -o` or right-click → Save As. |
