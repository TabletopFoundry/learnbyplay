"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { GRADE_BANDS, SUBJECTS } from "@/lib/constants";
import { getDb } from "@/lib/db";

function getRedirectTarget(formData: FormData, fallback: string) {
  const value = formData.get("redirectTo");
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function validateString(value: unknown, maxLength = 500): string {
  const str = String(value ?? "").trim();
  if (str.length > maxLength) throw new Error("Input too long");
  return str;
}

function validateEnum<T extends string>(value: unknown, allowed: readonly T[]): T {
  const str = String(value ?? "");
  if (!(allowed as readonly string[]).includes(str)) throw new Error(`Invalid value: ${str}`);
  return str as T;
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(value: unknown): string {
  const str = String(value ?? "").trim();
  if (!ISO_DATE_REGEX.test(str)) throw new Error("Invalid date format");
  const parsed = new Date(str);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid date");
  return str;
}

export async function createClassroomAction(formData: FormData) {
  let name: string;
  let subject: string;
  let gradeBand: string;
  let studentCount: number;

  try {
    name = validateString(formData.get("name"), 200);
    subject = validateEnum(formData.get("subject") ?? "Math", SUBJECTS);
    gradeBand = validateEnum(formData.get("gradeBand") ?? "3-5", GRADE_BANDS);
    studentCount = Number(formData.get("studentCount") ?? 0);
  } catch {
    redirect(`/dashboard?error=classroom&fields=validation`);
  }

  const errors: string[] = [];
  if (!name) errors.push("name");
  if (Number.isNaN(studentCount) || studentCount <= 0 || studentCount > 999) errors.push("studentCount");

  if (errors.length > 0) {
    redirect(`/dashboard?error=classroom&fields=${errors.join(",")}`);
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO classrooms (name, subject, grade_band, student_count, created_at) VALUES (?, ?, ?, ?, DATE('now'))",
  ).run(name, subject, gradeBand, studentCount);

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function logSessionAction(formData: FormData) {
  let classroomId: number;
  let gameSlug: string;
  let lessonSlug: string;
  let sessionDate: string;
  let notes: string;

  try {
    classroomId = Number(formData.get("classroomId") ?? 0);
    gameSlug = validateString(formData.get("gameSlug"), 200);
    lessonSlug = validateString(formData.get("lessonSlug"), 200);
    sessionDate = validateDate(formData.get("sessionDate"));
    notes = validateString(formData.get("notes"), 2000);
  } catch {
    redirect(`/dashboard?error=session&fields=validation`);
  }

  const errors: string[] = [];
  if (!classroomId) errors.push("class");
  if (!gameSlug) errors.push("game");
  if (!lessonSlug) errors.push("lesson");
  if (!sessionDate) errors.push("date");

  if (errors.length > 0) {
    redirect(`/dashboard?error=session&fields=${errors.join(",")}`);
  }

  const db = getDb();
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
  const existing = db.prepare("SELECT lesson_slug FROM favorites WHERE lesson_slug = ?").get(lessonSlug) as { lesson_slug?: string } | undefined;

  if (existing?.lesson_slug) {
    db.prepare("DELETE FROM favorites WHERE lesson_slug = ?").run(lessonSlug);
  } else {
    db.prepare("INSERT INTO favorites (lesson_slug, created_at) VALUES (?, DATE('now'))").run(lessonSlug);
  }

  revalidatePath("/dashboard");
  revalidatePath("/games");
  revalidatePath("/lessons/[slug]", "page");
  redirect(redirectTo);
}
