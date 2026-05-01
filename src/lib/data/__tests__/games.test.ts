import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let db: Database.Database;

vi.mock("@/lib/db", () => ({
  getDb: () => db,
}));

import { getGames } from "@/lib/data/games";

function insertGame(overrides: Record<string, unknown>) {
  db.prepare(
    `INSERT INTO games (
      slug, name, publisher, tagline, description, subjects, grade_band, age_range,
      min_players, max_players, play_time_min, play_time_max, complexity, setup_time_min,
      mechanics, skills, materials, simplified_rules, standards, classroom_fit, copies_note
    ) VALUES (
      @slug, @name, @publisher, @tagline, @description, @subjects, @grade_band, @age_range,
      @min_players, @max_players, @play_time_min, @play_time_max, @complexity, @setup_time_min,
      @mechanics, @skills, @materials, @simplified_rules, @standards, @classroom_fit, @copies_note
    )`,
  ).run({
    slug: "test-game",
    name: "Test Game",
    publisher: "Publisher",
    tagline: "Tagline",
    description: "Description",
    subjects: JSON.stringify(["Math"]),
    grade_band: "3-5",
    age_range: "8-12",
    min_players: 2,
    max_players: 4,
    play_time_min: 15,
    play_time_max: 30,
    complexity: 2,
    setup_time_min: 5,
    mechanics: JSON.stringify(["drafting"]),
    skills: JSON.stringify(["strategy"]),
    materials: JSON.stringify(["cards"]),
    simplified_rules: JSON.stringify(["rule"]),
    standards: JSON.stringify(["CCSS.3.OA"]),
    classroom_fit: "Great for class",
    copies_note: "1 per group",
    ...overrides,
  });
}

beforeEach(() => {
  db = new Database(":memory:");
  db.exec(`
    CREATE TABLE games (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      publisher TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      subjects TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      age_range TEXT NOT NULL,
      min_players INTEGER NOT NULL,
      max_players INTEGER NOT NULL,
      play_time_min INTEGER NOT NULL,
      play_time_max INTEGER NOT NULL,
      complexity INTEGER NOT NULL,
      setup_time_min INTEGER NOT NULL,
      mechanics TEXT NOT NULL,
      skills TEXT NOT NULL,
      materials TEXT NOT NULL,
      simplified_rules TEXT NOT NULL,
      standards TEXT NOT NULL,
      classroom_fit TEXT NOT NULL,
      copies_note TEXT NOT NULL
    );
  `);
});

afterEach(() => {
  db.close();
});

describe("getGames exact-match filters", () => {
  it("matches subjects by exact JSON value instead of substring", () => {
    insertGame({ slug: "math", name: "Math Match" });
    insertGame({
      slug: "math-club",
      name: "Math Club",
      subjects: JSON.stringify(["Math Club"]),
      standards: JSON.stringify(["CCSS.3.OA.1"]),
    });

    expect(getGames({ subject: "Math" }).map((game) => game.slug)).toEqual(["math"]);
  });

  it("matches standards by exact JSON value instead of substring", () => {
    insertGame({ slug: "oa", name: "Operations & Algebraic Thinking" });
    insertGame({
      slug: "oa-extended",
      name: "Operations Extended",
      subjects: JSON.stringify(["Science"]),
      standards: JSON.stringify(["CCSS.3.OA.1"]),
    });

    expect(getGames({ standard: "CCSS.3.OA" }).map((game) => game.slug)).toEqual(["oa"]);
  });
});
