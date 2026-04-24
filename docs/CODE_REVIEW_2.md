# Code Quality & Architecture Review — LearnByPlay (Follow-up)

**Reviewed**: 2025 (follow-up to `docs/CODE_REVIEW.md`)  
**Commit**: `57cdb05` ("chore: project improvements - documentation, tooling, and DX")  
**Scope**: New P0/P1 issues only — items already covered in `CODE_REVIEW.md` are not repeated.

---

## Summary of Previous-Review Status

Several items from the first review have been addressed:

| Previous Finding | Status |
|---|---|
| P0-1 · WAL files in Git | **Partially fixed** — `.gitignore` now excludes `data/`, `*.db-shm`, `*.db-wal`, but the tracked files were **not** removed via `git rm --cached`. They still appear in the index. |
| P0-2 · SQL injection in `db.ts` | **Fixed** — table names are now quoted and iterated from a compile-time `ALLOWED_TABLES` constant. |
| P0-3 · No input validation on server actions | **Fixed** — `validateString`, `validateEnum`, `validateDate` added with length caps and allowlist checks. |
| P1-1 · `data.ts` God Module | **Fixed** — split into `data/games.ts`, `data/lessons.ts`, `data/sessions.ts`, `data/dashboard.ts`, `data/mappers.ts`, etc. |
| P1-2 · N+1 dashboard query | **Fixed** — replaced with `getAllLessonsGroupedByGame()` bulk query. |
| P1-3 · Inline return types | **Fixed** — `DashboardSnapshot`, `DashboardMetrics`, `SkillHeatmapEntry`, `CatalogInsights` extracted to `types.ts`. |
| P1-5 · `parseJson` no error handling | **Fixed** — now has try/catch with fallback parameter. |
| P1-7 · `FlashBanner` hardcoded redirect | **Fixed** — now uses `usePathname()` to build a clean URL. |
| P1-8 · Hardcoded DB path | **Fixed** — reads `process.env.LEARNBYPLAY_DB_PATH` with fallback. |
| P1-9 · Duplicated error boundaries | **Fixed** — shared `ErrorFallback` component extracted. |
| P2-2 · Inline mappers inconsistency | **Fixed** — `mapClassroom` and `mapSession` extracted to `mappers.ts`. |
| P2-6 · Inefficient `getCatalogInsights` | **Fixed** — now uses `COUNT(*)` queries. |
| P0-4 · Zero test coverage | **Still open** — no test files or test runner. |
| P1-4 · Hardcoded seed SQL | **Still open** — demo classrooms/sessions still raw SQL in `db.ts:95-111`. |
| P1-6 · PDF route mixes concerns | **Fixed** — rendering extracted to `src/lib/pdf.ts`, route is now a thin adapter. |
| P1-10 · Inline business content | **Still open** — testimonials/pricing still inline in `page.tsx`. |

---

## New Critical Findings — P0

### P0-NEW-1 · Destructive server actions have no authorization or ownership checks

**Files**: `src/app/actions.ts:166-192`

```ts
// deleteClassroomAction — line 166
const id = Number(formData.get("id"));
// ...
db.prepare("DELETE FROM sessions WHERE classroom_id = ?").run(id);
db.prepare("DELETE FROM classrooms WHERE id = ?").run(id);
```

```ts
// deleteSessionAction — line 181
const id = Number(formData.get("id"));
// ...
db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
```

Both `deleteClassroomAction` and `deleteSessionAction` accept a raw `id` from the form and delete the corresponding row without:

1. **Authentication** — there is no session/user concept; any client can call these actions.
2. **Ownership verification** — even if auth existed, there is no check that the caller owns the target record.
3. **CSRF protection beyond Next.js defaults** — Next.js server actions do bind to the origin, but the lack of any auth means the attack surface is still wide open.

The same applies to `createClassroomAction`, `logSessionAction`, and `toggleFavoriteLessonAction` — any visitor can create/modify data.

**Impact**: In the current single-user MVP this is tolerable, but as soon as the app is deployed for multiple teachers, any user can delete any other user's classrooms and sessions by forging a form post with a guessed integer `id`.

**Fix**: Introduce a minimal authentication layer (e.g., NextAuth.js or a simple session cookie) and add ownership checks:

```ts
export async function deleteClassroomAction(formData: FormData) {
  const user = await requireAuth(); // throws/redirects if not logged in
  const id = Number(formData.get("id"));
  // ...
  const classroom = db.prepare("SELECT * FROM classrooms WHERE id = ? AND user_id = ?").get(id, user.id);
  if (!classroom) {
    redirect("/dashboard?error=not-found");
  }
  // proceed with delete
}
```

---

### P0-NEW-2 · WAL/SHM files still tracked in Git index despite `.gitignore` update

**Files**: `data/learnbyplay.db-shm`, `data/learnbyplay.db-wal`

The `.gitignore` was updated (P0-1 from the first review) to exclude `data/`, `*.db-shm`, and `*.db-wal`. However, `git ls-files data/` still shows both WAL files tracked. `.gitignore` only prevents **new** files from being tracked — already-tracked files must be explicitly untracked.

Every write to the database changes these binary files, bloating the repo and causing merge conflicts.

**Fix** (one-time):
```bash
git rm --cached data/learnbyplay.db-shm data/learnbyplay.db-wal
git commit -m "fix: remove tracked WAL/SHM files from index"
```

---

## New Architectural Concerns — P1

### P1-NEW-1 · `SessionTimer` interval is torn down and recreated every second

**File**: `src/components/session-timer.tsx:18-43`

```ts
useEffect(() => {
  if (!running || completed) return;

  const interval = window.setInterval(() => {
    setSecondsLeft((value) => {
      // ...
      if (currentPhase >= defaultPhases.length - 1) { /* ... */ }
      const nextPhase = currentPhase + 1;
      setCurrentPhase(nextPhase);           // ← triggers re-render
      return defaultPhases[nextPhase].minutes * 60;
    });
  }, 1000);

  return () => window.clearInterval(interval);
}, [currentPhase, running, completed]);   // ← currentPhase in deps
```

`currentPhase` is in the dependency array, so every time the phase advances (and on every re-render where `currentPhase` might appear stale), the entire effect tears down the interval and creates a new one. During phase transitions this causes a brief timing glitch (the new interval starts from scratch, so the first tick after a phase change may be delayed or doubled depending on render timing).

More critically, `setCurrentPhase(nextPhase)` inside the `setSecondsLeft` updater is a **side-effect inside a state updater function**. React may call state updaters multiple times (e.g., in StrictMode during development), leading to skipped phases or double-advances.

**Fix**: Use a `useRef` for `currentPhase` inside the interval callback so the effect doesn't depend on it, and move `setCurrentPhase` outside the `setSecondsLeft` updater:

```tsx
const phaseRef = useRef(currentPhase);
phaseRef.current = currentPhase;

useEffect(() => {
  if (!running || completed) return;

  const interval = window.setInterval(() => {
    setSecondsLeft((prev) => {
      if (prev > 1) return prev - 1;
      // Signal phase transition via a separate state update
      return 0; // handled below
    });
  }, 1000);

  return () => window.clearInterval(interval);
}, [running, completed]); // currentPhase removed

// Separate effect for phase transitions
useEffect(() => {
  if (secondsLeft === 0 && running && !completed) {
    if (phaseRef.current >= defaultPhases.length - 1) {
      setRunning(false);
      setCompleted(true);
    } else {
      const next = phaseRef.current + 1;
      setCurrentPhase(next);
      setSecondsLeft(defaultPhases[next].minutes * 60);
    }
  }
}, [secondsLeft, running, completed]);
```

---

### P1-NEW-2 · `parseJson` logs potentially sensitive raw data to console

**File**: `src/lib/data/mappers.ts:3-9`

```ts
export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error(`Failed to parse JSON: ${value.slice(0, 100)}`);
    return fallback;
  }
}
```

If a database column ever contains user-supplied or sensitive text that fails to parse, the first 100 characters are logged to the server console/stdout. In production environments where logs are aggregated (e.g., Vercel, Datadog), this can leak data.

**Fix**: Log a structured message without the raw value, or at minimum redact it:

```ts
export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error("Failed to parse JSON column value (length=%d)", value.length);
    return fallback;
  }
}
```

---

### P1-NEW-3 · Focus trap in mobile nav crashes when `focusable` NodeList is empty

**File**: `src/components/site-header.tsx:42-51`

```ts
if (e.key === "Tab" && navRef.current) {
  const focusable = navRef.current.querySelectorAll<HTMLElement>("a, button");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];   // ← undefined if length === 0
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();           // safe — optional chaining
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();          // safe — optional chaining
  }
}
```

If `focusable.length === 0` (e.g., links haven't rendered yet, or the nav content changes), both `first` and `last` are `undefined`. The optional chaining on `focus()` prevents a crash, but `document.activeElement === undefined` evaluates to `false`, so the `else if` branch falls through and `e.preventDefault()` is never called — the focus trap silently breaks. This is not a crash, but it is a silent accessibility regression.

**Fix**: Guard the entire block:

```ts
if (e.key === "Tab" && navRef.current) {
  const focusable = navRef.current.querySelectorAll<HTMLElement>("a, button");
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  // ...
}
```

---

### P1-NEW-4 · `deleteClassroomAction` manually cascades deletes instead of using FK `ON DELETE CASCADE`

**File**: `src/app/actions.ts:173-175`

```ts
db.prepare("DELETE FROM sessions WHERE classroom_id = ?").run(id);
db.prepare("DELETE FROM classrooms WHERE id = ?").run(id);
```

**File**: `src/lib/db.ts:190-198` (schema)

```sql
CREATE TABLE IF NOT EXISTS sessions (
  -- ...
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id),  -- no ON DELETE CASCADE
  -- ...
);
```

The application manually deletes child sessions before deleting the classroom. This creates two problems:

1. **Non-atomic by default** — if the process crashes between the two statements, orphaned sessions or a stale classroom can remain. (SQLite's synchronous nature makes this unlikely but not impossible under signal interrupts.)
2. **Maintenance burden** — any new table referencing `classrooms.id` requires another manual delete line in the action. This is the "shotgun surgery" smell.

**Fix**: Add `ON DELETE CASCADE` to the FK definition and drop the manual child delete:

```sql
FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
```

```ts
// actions.ts — simplified
db.prepare("DELETE FROM classrooms WHERE id = ?").run(id);
// sessions are automatically deleted by the FK cascade
```

Since `better-sqlite3` uses `CREATE TABLE IF NOT EXISTS`, a schema migration or fresh DB creation is needed. For the MVP, deleting `data/learnbyplay.db` and restarting triggers a clean re-seed.

---

### P1-NEW-5 · `ConfirmDeleteForm` has dead ref and incorrect action type

**File**: `src/components/confirm-delete-form.tsx:8,25`

```ts
// Line 8 — action typed as synchronous void return
action: (formData: FormData) => void;

// Line 25 — ref declared but never read
const cancelRef = useRef<HTMLButtonElement>(null);
```

**Issue 1 — Dead `cancelRef`**: The ref is created and attached to the Cancel button but never read. This is dead code that misleads future maintainers into thinking focus management is in place.

**Issue 2 — Incorrect action type**: Server actions return `Promise<ActionState>` (or `Promise<void>` for the delete variants), but the prop is typed as `(formData: FormData) => void`. This works at runtime because React's `<form action={...}>` awaits the promise regardless, but the type signature is incorrect and suppresses type-checking of the return value.

**Fix**:
```ts
interface ConfirmDeleteFormProps {
  action: (formData: FormData) => Promise<void>;  // correct async signature
  // ...
}

// Remove cancelRef entirely, or implement focus-on-cancel behavior
```

---

### P1-NEW-6 · PDF `Content-Disposition` header is vulnerable to header injection via slug

**File**: `src/app/api/lessons/[slug]/pdf/route.ts:31`

```ts
"Content-Disposition": `attachment; filename="${lesson.slug}.pdf"`,
```

The `lesson.slug` comes from the database and is currently safe (alphanumeric + hyphens). However, if a slug ever contains `"` or newline characters, this would allow HTTP header injection (e.g., injecting additional headers or corrupting the response).

**Fix**: Sanitize or encode the filename:

```ts
const safeFilename = lesson.slug.replace(/[^a-z0-9_-]/gi, "_");
// ...
"Content-Disposition": `attachment; filename="${safeFilename}.pdf"`,
```

Or use the RFC 5987 `filename*` encoding for full Unicode safety.

---

## Refactoring Roadmap (New Items Only)

### High Impact, Low Effort
1. **Remove tracked WAL files from Git index** — `git rm --cached` (P0-NEW-2)
2. **Redact raw values in `parseJson` error logging** (P1-NEW-2)
3. **Guard focus trap against empty NodeList** (P1-NEW-3)
4. **Fix `ConfirmDeleteForm` dead ref and action type** (P1-NEW-5)
5. **Sanitize filename in PDF `Content-Disposition`** (P1-NEW-6)

### High Impact, High Effort
6. **Add authentication and ownership checks to all server actions** (P0-NEW-1)
7. **Refactor `SessionTimer` to avoid side effects in state updaters** (P1-NEW-1)

### Medium Impact, Low Effort
8. **Add `ON DELETE CASCADE` to FK definitions** and remove manual cascade code (P1-NEW-4)

---

## Positive Observations (Preserved & New)

Several items from the first review were addressed with high quality:

1. **Data layer decomposition** was clean — the `data/` module split follows domain boundaries and the barrel `index.ts` re-exports keep imports tidy.
2. **Input validation** in `actions.ts` is thorough — `validateString`, `validateEnum`, `validateDate` with regex, length caps, and clear error messages.
3. **Open redirect protection** via `sanitizeRedirectTo` correctly strips protocol-relative URLs and uses `URL` parsing as a safety net.
4. **`FlashBanner` fix** properly uses `usePathname()` and preserves non-flash query params.
5. **`getCatalogInsights`** now uses efficient `COUNT(*)` queries instead of fetching full result sets.
6. **Type system improvements** — `DashboardSnapshot`, `CatalogInsights`, and `SkillHeatmapEntry` are well-defined named types in `types.ts`.

---

*Follow-up review conducted against commit `57cdb05` on the `main` branch.*
