"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { GRADE_BANDS, SUBJECTS } from "@/lib/constants";
import { getDb } from "@/lib/db";
import { sanitizeRedirectTo, validateDate, validateEnum, validatePositiveInt, validateString, ValidationError } from "@/lib/validation";

export type ActionState = {
  success: boolean;
  errorFields?: string[];
  message?: string;
} | null;

function getRedirectTarget(formData: FormData, fallback: string) {
  const value = formData.get("redirectTo");
  if (typeof value !== "string" || value.length === 0) return fallback;
  return sanitizeRedirectTo(value, fallback);
}

function validateField<T>(field: string, errors: Set<string>, getValue: () => T): T | undefined {
  try {
    return getValue();
  } catch (err) {
    if (err instanceof ValidationError) {
      errors.add(field);
      return undefined;
    }
    throw err;
  }
}

export async function createClassroomAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const errors = new Set<string>();
  const name = validateField("name", errors, () => validateString(formData.get("name"), 200));
  const subject = validateField("subject", errors, () => validateEnum(formData.get("subject") ?? "Math", SUBJECTS));
  const gradeBand = validateField("gradeBand", errors, () => validateEnum(formData.get("gradeBand") ?? "3-5", GRADE_BANDS));
  const studentCount = validateField("studentCount", errors, () => validatePositiveInt(formData.get("studentCount")));

  if (!name) errors.add("name");
  if (typeof studentCount === "number" && studentCount > 999) errors.add("studentCount");

  if (
    errors.size > 0 ||
    name === undefined ||
    subject === undefined ||
    gradeBand === undefined ||
    studentCount === undefined
  ) {
    const errorFields = Array.from(errors);
    return {
      success: false,
      errorFields,
      message: `Please fix the highlighted field${errorFields.length === 1 ? "" : "s"}.`,
    };
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO classrooms (name, subject, grade_band, student_count, created_at) VALUES (?, ?, ?, ?, DATE('now'))",
  ).run(name, subject, gradeBand, studentCount);

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function logSessionAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const errors = new Set<string>();
  const classroomId = validateField("classroomId", errors, () => validatePositiveInt(formData.get("classroomId")));
  const gameSlug = validateField("gameSlug", errors, () => validateString(formData.get("gameSlug"), 200));
  const lessonSlug = validateField("lessonSlug", errors, () => validateString(formData.get("lessonSlug"), 200));
  const sessionDate = validateField("sessionDate", errors, () => validateDate(formData.get("sessionDate")));
  const notes = validateField("notes", errors, () => validateString(formData.get("notes"), 2000));

  if (!gameSlug) errors.add("gameSlug");
  if (!lessonSlug) errors.add("lessonSlug");
  if (!sessionDate) errors.add("sessionDate");

  if (
    errors.size > 0 ||
    classroomId === undefined ||
    gameSlug === undefined ||
    lessonSlug === undefined ||
    sessionDate === undefined ||
    notes === undefined
  ) {
    const errorFields = Array.from(errors);
    return {
      success: false,
      errorFields,
      message: `Please fix the highlighted field${errorFields.length === 1 ? "" : "s"}.`,
    };
  }

  const db = getDb();
  const logResult = db.transaction(() => {
    const classroomExists = db.prepare("SELECT 1 FROM classrooms WHERE id = ?").get(classroomId);
    const gameExists = db.prepare("SELECT 1 FROM games WHERE slug = ?").get(gameSlug);
    const lessonExists = db.prepare("SELECT 1 FROM lessons WHERE slug = ?").get(lessonSlug);

    if (!classroomExists || !gameExists || !lessonExists) {
      return false;
    }

    db.prepare(
      "INSERT INTO sessions (classroom_id, game_slug, lesson_slug, session_date, notes) VALUES (?, ?, ?, ?, ?)",
    ).run(classroomId, gameSlug, lessonSlug, sessionDate, notes);

    return true;
  })();

  if (!logResult) {
    return {
      success: false,
      errorFields: ["classroomId", "gameSlug", "lessonSlug"],
      message: "One or more selected items no longer exist. Please refresh and try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?logged=1");
}

export async function toggleFavoriteLessonAction(formData: FormData) {
  const redirectTo = getRedirectTarget(formData, "/dashboard");

  let lessonSlug: string;
  try {
    lessonSlug = validateString(formData.get("lessonSlug"), 200);
  } catch (err) {
    if (err instanceof ValidationError) {
      redirect(redirectTo);
    }
    throw err;
  }

  if (!lessonSlug) {
    redirect(redirectTo);
  }

  const db = getDb();
  db.transaction(() => {
    const deleted = db.prepare("DELETE FROM favorites WHERE lesson_slug = ?").run(lessonSlug);
    if (deleted.changes === 0) {
      db.prepare("INSERT INTO favorites (lesson_slug, created_at) VALUES (?, DATE('now'))").run(lessonSlug);
    }
  })();

  revalidatePath("/dashboard");
  revalidatePath("/games");
  revalidatePath("/lessons/[slug]", "page");
  redirect(redirectTo);
}

export async function deleteClassroomAction(formData: FormData) {
  let id: number;
  try {
    id = validatePositiveInt(formData.get("id"));
  } catch (err) {
    if (err instanceof ValidationError) {
      redirect("/dashboard?error=classroom&fields=id");
    }
    throw err;
  }

  const db = getDb();
  const deleted = db.transaction(() => db.prepare("DELETE FROM classrooms WHERE id = ?").run(id).changes)();

  if (deleted === 0) {
    redirect("/dashboard?error=not-found");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=classroom");
}

export async function deleteSessionAction(formData: FormData) {
  let id: number;
  try {
    id = validatePositiveInt(formData.get("id"));
  } catch (err) {
    if (err instanceof ValidationError) {
      redirect("/dashboard?error=session&fields=id");
    }
    throw err;
  }

  const db = getDb();
  const deleted = db.transaction(() => db.prepare("DELETE FROM sessions WHERE id = ?").run(id).changes)();

  if (deleted === 0) {
    redirect("/dashboard?error=not-found");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=session");
}
