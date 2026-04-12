"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";

function getRedirectTarget(formData: FormData, fallback: string) {
  const value = formData.get("redirectTo");
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export async function createClassroomAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "Math");
  const gradeBand = String(formData.get("gradeBand") ?? "3-5");
  const studentCount = Number(formData.get("studentCount") ?? 0);

  if (!name || Number.isNaN(studentCount) || studentCount <= 0) {
    redirect("/dashboard?error=classroom");
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO classrooms (name, subject, grade_band, student_count, created_at) VALUES (?, ?, ?, ?, DATE('now'))",
  ).run(name, subject, gradeBand, studentCount);

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function logSessionAction(formData: FormData) {
  const classroomId = Number(formData.get("classroomId") ?? 0);
  const gameSlug = String(formData.get("gameSlug") ?? "");
  const lessonSlug = String(formData.get("lessonSlug") ?? "");
  const sessionDate = String(formData.get("sessionDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!classroomId || !gameSlug || !lessonSlug || !sessionDate) {
    redirect("/dashboard?error=session");
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO sessions (classroom_id, game_slug, lesson_slug, session_date, notes) VALUES (?, ?, ?, ?, ?)",
  ).run(classroomId, gameSlug, lessonSlug, sessionDate, notes);

  revalidatePath("/dashboard");
  redirect("/dashboard?logged=1");
}

export async function toggleFavoriteLessonAction(formData: FormData) {
  const lessonSlug = String(formData.get("lessonSlug") ?? "");
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
