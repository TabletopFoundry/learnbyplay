# LearnByPlay — Fourth-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW_3.md`. Several third-pass issues were addressed (open redirect sanitized, `ValidationError` class separates validation from runtime errors, delete actions added for classrooms and sessions, sessions empty state, filter sidebar collapse, game card `aria-label`, focus trap and Escape key on mobile nav). This audit focuses exclusively on **genuinely new P0/P1 issues** not documented in any prior review.

---

## Executive Summary

The project has matured significantly across four review cycles. The most severe accessibility, navigation, and security issues from prior rounds have been resolved. What remains are data-integrity hazards in the SQLite layer (foreign keys declared but never enforced, non-atomic toggle operations, unvalidated references on insert), a delete-without-confirmation pattern that risks accidental data loss, and a few UX gaps around form state preservation and the delete button's destructive affordance. These are the last meaningful blockers before the app is classroom-pilot-ready.

---

## Findings — New Issues Only

### P0 — Critical

#### P0-1: `PRAGMA foreign_keys` is never enabled — all FK constraints are inert

**Location:** `src/lib/db.ts:117-118`

The schema declares 5 `FOREIGN KEY` constraints (lessons→games, sessions→classrooms, sessions→games, sessions→lessons, favorites→lessons). However, SQLite **disables foreign key enforcement by default** — it must be explicitly enabled per-connection with `PRAGMA foreign_keys = ON`. The code sets `journal_mode = WAL` but never enables foreign keys.

**Impact:** Any `INSERT` into `sessions` or `favorites` with a non-existent `classroom_id`, `game_slug`, or `lesson_slug` will silently succeed. The `deleteClassroomAction` manually deletes child sessions (line 160) because cascading behavior doesn't work — but if a teacher deletes a game from seed data in the future, orphaned sessions will remain with broken JOIN references, causing the dashboard `getSessions()` query to silently drop rows (it uses `JOIN`, not `LEFT JOIN`).

**Fix:**
```typescript
// In createDatabase(), after line 118:
db.pragma("foreign_keys = ON");
```

---

#### P0-2: `deleteClassroomAction` and `deleteSessionAction` have no confirmation — single-click data loss

**Location:** `src/app/dashboard/page.tsx:118-121, 167-170`

Both delete buttons are plain `<form>` submissions with a `SubmitButton` that immediately executes the server action on click. There is no confirmation dialog, no undo mechanism, and no soft-delete. Deleting a classroom also cascades to delete all associated sessions (actions.ts:160). In a classroom setting where teachers are often tapping on touch screens while standing, an accidental tap on the small "Delete" button permanently destroys data.

**Fix:** Add a client-side `onSubmit` handler with `window.confirm("Delete this classroom and all its sessions?")` or, better, a two-step UI pattern (click "Delete" → shows "Confirm delete" / "Cancel" inline). The cascade behavior should also be communicated: "This will also delete N sessions."

---

### P1 — High

#### P1-1: `logSessionAction` does not verify that `classroomId`, `gameSlug`, or `lessonSlug` exist

**Location:** `src/app/actions.ts:90-126`

The action validates that fields are non-empty strings/numbers, but never checks whether the referenced classroom, game, or lesson actually exists in the database before inserting. With FK enforcement disabled (P0-1), a crafted or stale form submission (e.g., submitting a form after the referenced classroom was deleted in another tab) will insert a session row with dangling references. The dashboard's `getSessions()` uses `JOIN` — the orphan row will silently disappear from the UI but remain in the database.

**Fix:** Before inserting, verify each FK target exists:
```typescript
const classroomExists = db.prepare("SELECT 1 FROM classrooms WHERE id = ?").get(classroomId);
const gameExists = db.prepare("SELECT 1 FROM games WHERE slug = ?").get(gameSlug);
const lessonExists = db.prepare("SELECT 1 FROM lessons WHERE slug = ?").get(lessonSlug);
if (!classroomExists || !gameExists || !lessonExists) {
  redirect("/dashboard?error=session&fields=reference");
}
```
Alternatively, enabling `PRAGMA foreign_keys = ON` (P0-1) and catching constraint errors would cover this.

---

#### P1-2: `toggleFavoriteLessonAction` is not atomic — race-prone read-then-write

**Location:** `src/app/actions.ts:137-148`

The toggle action performs a `SELECT` to check if a favorite exists, then conditionally `DELETE`s or `INSERT`s — two separate statements with no transaction. If a user double-clicks the favorite button (or submits from two tabs), the read-then-write can race:

1. Request A reads: no favorite exists → prepares INSERT
2. Request B reads: no favorite exists → prepares INSERT
3. Both INSERT → `UNIQUE constraint` error (or duplicate if PKs allow it)

Similarly, two concurrent unfavorite attempts could both read "exists" and both DELETE — harmless but wasteful.

**Fix:** Wrap in a transaction and use `INSERT OR IGNORE` / `DELETE` unconditionally, or use SQLite's `INSERT ... ON CONFLICT`:
```typescript
db.transaction(() => {
  const deleted = db.prepare("DELETE FROM favorites WHERE lesson_slug = ?").run(lessonSlug);
  if (deleted.changes === 0) {
    db.prepare("INSERT INTO favorites (lesson_slug, created_at) VALUES (?, DATE('now'))").run(lessonSlug);
  }
})();
```

---

#### P1-3: Dashboard form state is lost on validation error redirect

**Location:** `src/app/actions.ts:66-69, 116-118`, `src/app/dashboard/page.tsx:78-98`

When `createClassroomAction` or `logSessionAction` fails validation, the action redirects to `/dashboard?error=...&fields=...`. This is a full navigation — all form inputs the teacher had filled in are cleared. If a teacher fills out 4 fields and has a single validation error, they lose all input and must re-enter everything.

**Fix:** Use React 19's `useActionState` (or Next.js server action return values) to return validation errors without navigating. The form can then preserve its input values and display field-level errors inline. This is a pattern change but eliminates the most common friction point in the CRUD flow.

---

#### P1-4: `SessionLogger` action prop typed as sync — suppresses async type checking

**Location:** `src/components/session-logger.tsx:14`

The `action` prop is typed as `(formData: FormData) => void` but receives `logSessionAction`, which is `async`. While this works at runtime (React handles the Promise), the type signature suppresses TypeScript's ability to enforce `await` patterns or catch unhandled rejections. This was noted in UX_REVIEW_2 (P2-11) and UX_REVIEW_3 (P2-6) as P2, but given it's survived two review cycles unfixed and masks real async errors, elevating to P1.

**Fix:**
```typescript
action: (formData: FormData) => Promise<void>;
```

---

#### P1-5: `ErrorFallback` renders `title` as `<p>` and `description` as `<h1>` — inverted semantics

**Location:** `src/components/error-fallback.tsx:14-15`

The error fallback renders the `title` prop ("Something needs another try") as a `<p>` with kicker styling, and the `description` prop ("We couldn't load LearnByPlay right now.") as the `<h1>`. Screen readers announce the description as the page heading. This was noted in UX_REVIEW_3 (P1-2) but remains unfixed — re-flagging as it directly impacts screen reader navigation on error states.

**Fix:** Swap the elements: make `title` the `<h1>` and `description` a `<p>`. Adjust font sizes to preserve visual hierarchy.

---

#### P1-6: `tools/page.tsx` still loads all 37 games — only uses 15

**Location:** `src/app/tools/page.tsx:11`

`getGames()` loads all 37 games, parses 6 JSON columns per game, then `.slice(0, 15)` discards 22 of them. Only 3 fields are used (`slug`, `name`, `simplifiedRules`). This was noted in UX_REVIEW_3 (P1-8) but remains unfixed — the wasted work grows linearly with catalog size.

**Fix:** Add a dedicated query: `SELECT slug, name, simplified_rules FROM games ORDER BY name LIMIT 15` and a minimal mapper.

---

## What's Been Fixed Well Since UX_REVIEW_3

1. **Open redirect** — `sanitizeRedirectTo()` validates `redirectTo` starts with `/`, blocks `//`, and re-serializes via `new URL()`. Solid fix.
2. **Error swallowing** — `ValidationError` class now separates validation failures (redirect) from runtime errors (re-throw). Proper pattern.
3. **Delete functionality** — `deleteClassroomAction` and `deleteSessionAction` added with cascade logic.
4. **Focus trap** — Mobile nav has Tab cycling, Escape key handling, and auto-focus on first link.
5. **Touch target** — Hamburger button now uses `min-h-[44px] min-w-[44px]`.
6. **Mobile nav removed redundant `role`** — now uses `aria-label="Mobile navigation"` only.

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 2 | FK enforcement disabled, destructive delete with no confirmation |
| **P1** | 6 | Unvalidated FK references, non-atomic toggle, form state loss, unfixed carry-overs |

---

## Recommended Action Order

1. **P0-1** — Add `db.pragma("foreign_keys = ON")` — one line, immediate data integrity improvement.
2. **P0-2** — Add confirmation to delete buttons — prevents accidental data loss in classroom use.
3. **P1-2** — Wrap favorite toggle in a transaction — prevents race conditions on double-click.
4. **P1-1** — Validate FK references before insert in `logSessionAction` — or rely on P0-1 + error handling.
5. **P1-3** — Migrate dashboard forms to `useActionState` for inline validation errors.
6. **P1-4** — Fix `SessionLogger` action prop type to `Promise<void>`.
7. **P1-5** — Swap `<p>` / `<h1>` in `ErrorFallback`.
8. **P1-6** — Add dedicated `getRulesViewerGames()` query for tools page.
