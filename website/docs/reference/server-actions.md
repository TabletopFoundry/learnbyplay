---
title: Server actions
sidebar_position: 5
---

# Server actions

All write paths in LearnByPlay go through Next.js Server Actions in `src/app/actions.ts`. This page documents each one — fields, validation, error shapes, redirects.

## `ActionState`

State-returning actions share one shape:

```ts
type ActionState = {
  success: boolean;
  errorFields?: string[];
  message?: string;
} | null;
```

`null` is the initial state passed by `useActionState`. A returned object always describes the result of the most recent submission.

## `createClassroomAction(_prevState, formData)`

Creates a classroom row.

| Field | Validation |
|-------|-----------|
| `name` | string, 1–200 chars, required |
| `subject` | enum: `Math`, `Science`, `Social Studies`, `ELA`, `SEL` (default `Math`) |
| `gradeBand` | enum: `K-2`, `3-5`, `6-8`, `9-12` (default `3-5`) |
| `studentCount` | positive integer ≤ 999 |

**On success**: redirects to `/dashboard?created=1`. Revalidates `/dashboard`.

**On failure**:

```ts
{
  success: false,
  errorFields: ["name", "studentCount"],
  message: "Please fix the highlighted fields.",
}
```

## `logSessionAction(_prevState, formData)`

Inserts a session row, atomically verifying that the classroom, game, and lesson all exist.

| Field | Validation |
|-------|-----------|
| `classroomId` | positive integer |
| `gameSlug` | string, 1–200 chars |
| `lessonSlug` | string, 1–200 chars |
| `sessionDate` | valid ISO date |
| `notes` | string, ≤ 2000 chars (may be empty) |

**On success**: redirects to `/dashboard?logged=1`. Revalidates `/dashboard`.

**On stale references** (one of the FK targets disappeared between page load and submit):

```ts
{
  success: false,
  errorFields: ["classroomId", "gameSlug", "lessonSlug"],
  message: "One or more selected items no longer exist. Please refresh and try again.",
}
```

## `toggleFavoriteLessonAction(formData)`

Idempotent toggle on `(teacher_name, lesson_slug)`. No state return — always redirects.

| Field | Validation |
|-------|-----------|
| `lessonSlug` | string, 1–200 chars, required |
| `redirectTo` | string; sanitized to same-origin paths, falls back to `/dashboard` |

The sanitizer rejects absolute URLs and `javascript:` schemes — open-redirect protection.

**Effect**:

- If a favorite row exists for the teacher + lesson, **delete** it.
- Otherwise **insert** with `created_at = today`.

Revalidates `/dashboard`, `/games`, and `/lessons/[slug]`.

## `deleteClassroomAction(formData)`

Deletes a classroom by id. Sessions linked to that classroom are deleted by `ON DELETE CASCADE`.

| Field | Validation |
|-------|-----------|
| `id` | positive integer |

**On success**: redirects to `/dashboard?deleted=classroom`.

**On missing id**: redirects to `/dashboard?error=not-found`.

## `deleteSessionAction(formData)`

Deletes a session row by id.

| Field | Validation |
|-------|-----------|
| `id` | positive integer |

**On success**: redirects to `/dashboard?deleted=session`.

**On missing id**: redirects to `/dashboard?error=not-found`.

## Validation helpers

All field validation goes through `src/lib/validation.ts`:

```ts
validateString(value, maxLen, { required: boolean }) // throws ValidationError
validatePositiveInt(value)                          // throws ValidationError
validateDate(value)                                 // throws ValidationError
validateEnum(value, allowedValues)                  // throws ValidationError
sanitizeRedirectTo(value, fallback)                 // returns safe path
```

The action layer catches `ValidationError` per field, collects field names into a `Set<string>`, and returns them in `errorFields` so the form can highlight specific inputs.

## Why server actions, not REST?

| Concern | Server actions | REST |
|---------|---------------|------|
| Form posts | Native progressive enhancement | Need client JS + fetch wiring |
| Type safety | TypeScript across the boundary | OpenAPI / hand-rolled types |
| Validation surface | One per action | One per endpoint, often duplicated |
| Auth | Inherited from request context | Re-checked per endpoint |

For an app whose entire write surface is forms, server actions are dramatically less code. The day a third-party integration needs to write data, add a `/api/v1` route — don't retrofit REST onto the form layer.
