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

export async function createClassroomAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  let name: string;
  let subject: string;
  let gradeBand: string;
  let studentCount: number;

  try {
    name = validateString(formData.get("name"), 200);
    subject = validateEnum(formData.get("subject") ?? "Math", SUBJECTS);
    gradeBand = validateEnum(formData.get("gradeBand") ?? "3-5", GRADE_BANDS);
    studentCount = Number(formData.get("studentCount") ?? 0);
  } catch (err) {
    if (err instanceof ValidationError) {
      return { success: false, errorFields: ["validation"], message: "Please check your input." };
    }
    throw err;
  }

  const errors: string[] = [];
  if (!name) errors.push("name");
  if (Number.isNaN(studentCount) || studentCount <= 0 || studentCount > 999) errors.push("studentCount");

  if (errors.length > 0) {
    return { success: false, errorFields: errors, message: `Please fix the following field${errors.length > 1 ? "s" : ""}: ${errors.join(", ")}.` };
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO classrooms (name, subject, grade_band, student_count, created_at) VALUES (?, ?, ?, ?, DATE('now'))",
  ).run(name, subject, gradeBand, studentCount);

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function logSessionAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  let classroomId: number;
  let gameSlug: string;
  let lessonSlug: string;
  let sessionDate: string;
  let notes: string;

  try {
    classroomId = validatePositiveInt(formData.get("classroomId"));
    gameSlug = validateString(formData.get("gameSlug"), 200);
    lessonSlug = validateString(formData.get("lessonSlug"), 200);
    sessionDate = validateDate(formData.get("sessionDate"));
    notes = validateString(formData.get("notes"), 2000);
  } catch (err) {
    if (err instanceof ValidationError) {
      return { success: false, errorFields: ["validation"], message: "Please check your input." };
    }
    throw err;
  }

  const errors: string[] = [];
  if (!gameSlug) errors.push("game");
  if (!lessonSlug) errors.push("lesson");
  if (!sessionDate) errors.push("date");

  if (errors.length > 0) {
    return { success: false, errorFields: errors, message: `Please complete the following field${errors.length > 1 ? "s" : ""}: ${errors.join(", ")}.` };
  }

  const db = getDb();

  // Verify referenced entities exist before inserting
  const classroomExists = db.prepare("SELECT 1 FROM classrooms WHERE id = ?").get(classroomId);
  const gameExists = db.prepare("SELECT 1 FROM games WHERE slug = ?").get(gameSlug);
  const lessonExists = db.prepare("SELECT 1 FROM lessons WHERE slug = ?").get(lessonSlug);
  if (!classroomExists || !gameExists || !lessonExists) {
    return { success: false, errorFields: ["reference"], message: "One or more selected items no longer exist. Please refresh and try again." };
  }

  db.prepare(
    "INSERT INTO sessions (classroom_id, game_slug, lesson_slug, session_date, notes) VALUES (?, ?, ?, ?, ?)",
  ).run(classroomId, gameSlug, lessonSlug, sessionDate, notes);

  revalidatePath("/dashboard");
  redirect("/dashboard?logged=1");
}

export async function toggleFavoriteLessonAction(formData: FormData) {
  const lessonSlug = validateString(formData.get("lessonSlug"), 200);
  const redirectTo = getRedirectTarget(formData, "/dashboard");

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
  } catch {
    redirect("/dashboard?error=classroom&fields=id");
  }

  const db = getDb();

  // Verify the classroom exists before attempting deletion
  const classroom = db.prepare("SELECT 1 FROM classrooms WHERE id = ?").get(id);
  if (!classroom) {
    redirect("/dashboard?error=not-found");
  }

  // Sessions are automatically deleted via ON DELETE CASCADE
  db.prepare("DELETE FROM classrooms WHERE id = ?").run(id);

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=classroom");
}

export async function deleteSessionAction(formData: FormData) {
  let id: number;
  try {
    id = validatePositiveInt(formData.get("id"));
  } catch {
    redirect("/dashboard?error=session&fields=id");
  }

  const db = getDb();

  // Verify the session exists before attempting deletion
  const session = db.prepare("SELECT 1 FROM sessions WHERE id = ?").get(id);
  if (!session) {
    redirect("/dashboard?error=not-found");
  }

  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=session");
}
