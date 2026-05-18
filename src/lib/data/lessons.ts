import { DEFAULT_FAVORITE_TEACHER } from "@/lib/constants";
import { getDb } from "@/lib/db";
import type { FavoriteLessonSummary, LessonPlan } from "@/lib/types";
import { mapLesson } from "./mappers";

export function getLessonsByGameSlug(gameSlug: string): LessonPlan[] {
  const db = getDb();
  return db.prepare("SELECT * FROM lessons WHERE game_slug = ? ORDER BY title").all(gameSlug).map((row: unknown) => mapLesson(row as Record<string, unknown>));
}

export function getLessonBySlug(slug: string): LessonPlan | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM lessons WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
  return row ? mapLesson(row) : null;
}

export function getFavoriteLessons(): FavoriteLessonSummary[] {
  const db = getDb();
  return db
    .prepare(`
      SELECT l.*, GROUP_CONCAT(f.teacher_name, '||') AS teacher_names, COUNT(*) AS saved_count, MAX(f.created_at) AS latest_saved_at
      FROM favorites f
      JOIN lessons l ON l.slug = f.lesson_slug
      GROUP BY l.slug
      ORDER BY latest_saved_at DESC, l.title ASC
    `)
    .all()
    .map((row: unknown) => {
      const lesson = mapLesson(row as Record<string, unknown>);
      const teacherNames = String((row as Record<string, unknown>).teacher_names ?? "")
        .split("||")
        .filter(Boolean);
      return {
        ...lesson,
        savedBy: teacherNames,
        savedCount: Number((row as Record<string, unknown>).saved_count ?? teacherNames.length),
      };
    });
}

export function isFavoriteLesson(slug: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT lesson_slug FROM favorites WHERE lesson_slug = ? AND teacher_name = ?").get(slug, DEFAULT_FAVORITE_TEACHER) as { lesson_slug?: string } | undefined;
  return Boolean(row?.lesson_slug);
}

export function getAllLessonsGroupedByGame(): Record<string, LessonPlan[]> {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM lessons ORDER BY game_slug, title").all();
  const grouped: Record<string, LessonPlan[]> = {};
  for (const row of rows) {
    const lesson = mapLesson(row as Record<string, unknown>);
    (grouped[lesson.gameSlug] ??= []).push(lesson);
  }
  return grouped;
}
