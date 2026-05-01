import { getDb } from "@/lib/db";
import type { CatalogFilters, Game } from "@/lib/types";
import { mapGame, parseJson } from "./mappers";

export function getGames(filters: CatalogFilters = {}): Game[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.gradeBand) {
    conditions.push("grade_band = ?");
    params.push(filters.gradeBand);
  }
  if (filters.maxPlayTime) {
    conditions.push("play_time_max <= ?");
    params.push(filters.maxPlayTime);
  }
  if (filters.groupSize) {
    conditions.push("max_players >= ?");
    params.push(filters.groupSize);
  }
  if (filters.maxComplexity) {
    conditions.push("complexity <= ?");
    params.push(filters.maxComplexity);
  }

  if (filters.subject) {
    conditions.push("EXISTS (SELECT 1 FROM json_each(subjects) WHERE json_each.value = ?)");
    params.push(filters.subject);
  }
  if (filters.standard) {
    conditions.push("EXISTS (SELECT 1 FROM json_each(standards) WHERE json_each.value = ?)");
    params.push(filters.standard);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const games: Game[] = db.prepare(`SELECT slug, name, publisher, tagline, description, subjects, grade_band, age_range, min_players, max_players, play_time_min, play_time_max, complexity, setup_time_min, mechanics, skills, materials, simplified_rules, standards, classroom_fit, copies_note FROM games ${whereClause} ORDER BY name`).all(...params).map((row: unknown) => mapGame(row as Record<string, unknown>));

  const sort = filters.sort ?? "fit";
  return [...games].sort((left: Game, right: Game) => {
    if (sort === "time") {
      return left.playTimeMax - right.playTimeMax;
    }
    if (sort === "complexity") {
      return left.complexity - right.complexity;
    }
    if (sort === "standards") {
      return right.standards.length - left.standards.length;
    }
    return right.standards.length - left.standards.length || left.playTimeMax - right.playTimeMax;
  });
}

export function getNearMatches(filters: CatalogFilters): Game[] {
  const relaxed = { ...filters };
  delete relaxed.standard;
  delete relaxed.maxComplexity;
  return getGames(relaxed).slice(0, 6);
}

export function getFeaturedGames(limit = 6): Game[] {
  return getGames({ sort: "standards" }).slice(0, limit);
}

export function getGameBySlug(slug: string): Game | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM games WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
  return row ? mapGame(row) : null;
}

export type RulesViewerGame = { slug: string; name: string; simplifiedRules: string[] };

export function getRulesViewerGames(limit = 15): RulesViewerGame[] {
  const db = getDb();
  const rows = db.prepare("SELECT slug, name, simplified_rules FROM games ORDER BY name LIMIT ?").all(limit) as Record<string, unknown>[];
  return rows.map((row) => ({
    slug: String(row.slug),
    name: String(row.name),
    simplifiedRules: parseJson<string[]>(String(row.simplified_rules), []),
  }));
}
