import { getDb } from "@/lib/db";
import type { CatalogInsights, DashboardSnapshot, SessionRecord, SkillHeatmapEntry } from "@/lib/types";
import { parseJson } from "./mappers";
import { getClassrooms, getSessions } from "./sessions";
import { getFavoriteLessons } from "./lessons";

export function getDashboardSnapshot(): DashboardSnapshot {
  const classrooms = getClassrooms();
  const sessions = getSessions();
  const favoriteLessons = getFavoriteLessons();

  // Collect standards from game slugs in sessions using a single query
  const gameSlugSet = new Set(sessions.map((s: SessionRecord) => s.gameSlug));
  const standardsFromGames = new Set<string>();
  if (gameSlugSet.size > 0) {
    const db = getDb();
    const placeholders = Array.from(gameSlugSet).map(() => "?").join(",");
    const rows = db.prepare(`SELECT standards FROM games WHERE slug IN (${placeholders})`).all(...Array.from(gameSlugSet)) as Array<{ standards: string }>;
    for (const row of rows) {
      const standards = parseJson<string[]>(row.standards, []);
      for (const s of standards) {
        standardsFromGames.add(s);
      }
    }
  }

  const skillCounts = sessions.reduce<Record<string, number>>((accumulator, session: SessionRecord) => {
    for (const skill of session.skills) {
      accumulator[skill] = (accumulator[skill] ?? 0) + 1;
    }
    return accumulator;
  }, {});

  const skillsHeatmap: SkillHeatmapEntry[] = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]: [string, number]) => ({
      skill,
      count,
      level: count >= 4 ? "high" as const : count >= 2 ? "medium" as const : "low" as const,
    }));

  const db = getDb();
  const gameCount = (db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number }).count;
  const standardCount = (db.prepare("SELECT COUNT(*) as count FROM standards").get() as { count: number }).count;
  const favoriteCount = (db.prepare("SELECT COUNT(*) as count FROM favorites").get() as { count: number }).count;

  return {
    classrooms,
    sessions,
    favoriteLessons,
    metrics: {
      classCount: classrooms.length,
      sessionCount: sessions.length,
      favoriteCount,
      standardsCovered: standardsFromGames.size,
      totalGames: gameCount,
      totalStandards: standardCount,
    },
    skillsHeatmap,
  };
}

export function getCatalogInsights(): CatalogInsights {
  const db = getDb();
  const gameCount = (db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number }).count;
  const lessonCount = (db.prepare("SELECT COUNT(*) as count FROM lessons").get() as { count: number }).count;
  const standardCount = (db.prepare("SELECT COUNT(*) as count FROM standards").get() as { count: number }).count;
  return {
    games: gameCount,
    lessons: lessonCount,
    standards: standardCount,
  };
}
