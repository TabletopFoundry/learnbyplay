import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

import { DEFAULT_FAVORITE_TEACHER } from "@/lib/constants";
import { classroomsSeed, favoritesSeed, gamesSeed, lessonsSeed, pdArticlesSeed, sessionsSeed, standardsSeed } from "@/lib/seed";

const defaultDbPath = path.join(process.cwd(), "data", "learnbyplay.db");
const dbPath = process.env.LEARNBYPLAY_DB_PATH ?? defaultDbPath;
const dataDirectory = path.dirname(dbPath);
const SEED_VERSION = "2";
const shouldSeedDemoData = process.env.LEARNBYPLAY_ENABLE_SEEDING === "true" || process.env.NODE_ENV !== "production";

declare global {
  var __learnByPlayDb: Database.Database | undefined;
}

function serialize(value: unknown) {
  return JSON.stringify(value);
}

function migrateFavoritesSchema(db: Database.Database) {
  const columns = db.prepare("PRAGMA table_info(favorites)").all() as Array<{ name: string }>;
  if (columns.length === 0 || columns.some((column) => column.name === "teacher_name")) {
    return;
  }

  db.pragma("foreign_keys = OFF");
  db.transaction(() => {
    db.exec("ALTER TABLE favorites RENAME TO favorites_legacy");
    db.exec(`
      CREATE TABLE favorites (
        teacher_name TEXT NOT NULL,
        lesson_slug TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (teacher_name, lesson_slug),
        FOREIGN KEY (lesson_slug) REFERENCES lessons(slug)
      )
    `);
    db.prepare(
      "INSERT INTO favorites (teacher_name, lesson_slug, created_at) SELECT ?, lesson_slug, created_at FROM favorites_legacy",
    ).run(DEFAULT_FAVORITE_TEACHER);
    db.exec("DROP TABLE favorites_legacy");
  })();
  db.pragma("foreign_keys = ON");
}

function seedDatabase(db: Database.Database) {
  if (!shouldSeedDemoData) {
    return;
  }

  const meta = db.prepare("SELECT value FROM _meta WHERE key = 'seed_version'").get() as { value: string } | undefined;
  if (meta?.value === SEED_VERSION) return;

  const insertStandard = db.prepare(`
    INSERT INTO standards (code, framework, subject, grade_band, description)
    VALUES (@code, @framework, @subject, @gradeBand, @description)
    ON CONFLICT(code) DO UPDATE SET
      framework = excluded.framework,
      subject = excluded.subject,
      grade_band = excluded.grade_band,
      description = excluded.description
  `);
  const insertGame = db.prepare(`
    INSERT INTO games (
      slug, name, publisher, tagline, description, subjects, grade_band, age_range,
      min_players, max_players, play_time_min, play_time_max, complexity, setup_time_min,
      mechanics, skills, materials, simplified_rules, standards, classroom_fit, copies_note
    ) VALUES (
      @slug, @name, @publisher, @tagline, @description, @subjects, @gradeBand, @ageRange,
      @minPlayers, @maxPlayers, @playTimeMin, @playTimeMax, @complexity, @setupTimeMin,
      @mechanics, @skills, @materials, @simplifiedRules, @standards, @classroomFit, @copiesNote
    )
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      publisher = excluded.publisher,
      tagline = excluded.tagline,
      description = excluded.description,
      subjects = excluded.subjects,
      grade_band = excluded.grade_band,
      age_range = excluded.age_range,
      min_players = excluded.min_players,
      max_players = excluded.max_players,
      play_time_min = excluded.play_time_min,
      play_time_max = excluded.play_time_max,
      complexity = excluded.complexity,
      setup_time_min = excluded.setup_time_min,
      mechanics = excluded.mechanics,
      skills = excluded.skills,
      materials = excluded.materials,
      simplified_rules = excluded.simplified_rules,
      standards = excluded.standards,
      classroom_fit = excluded.classroom_fit,
      copies_note = excluded.copies_note
  `);
  const insertLesson = db.prepare(`
    INSERT INTO lessons (
      slug, game_slug, title, summary, standards, grade_band, learning_objectives,
      materials_needed, pre_game_activity, facilitation_guide, post_game_reflection,
      assessment_rubric, teacher_prep, variants
    ) VALUES (
      @slug, @gameSlug, @title, @summary, @standards, @gradeBand, @learningObjectives,
      @materialsNeeded, @preGameActivity, @facilitationGuide, @postGameReflection,
      @assessmentRubric, @teacherPrep, @variants
    )
    ON CONFLICT(slug) DO UPDATE SET
      game_slug = excluded.game_slug,
      title = excluded.title,
      summary = excluded.summary,
      standards = excluded.standards,
      grade_band = excluded.grade_band,
      learning_objectives = excluded.learning_objectives,
      materials_needed = excluded.materials_needed,
      pre_game_activity = excluded.pre_game_activity,
      facilitation_guide = excluded.facilitation_guide,
      post_game_reflection = excluded.post_game_reflection,
      assessment_rubric = excluded.assessment_rubric,
      teacher_prep = excluded.teacher_prep,
      variants = excluded.variants
  `);
  const insertArticle = db.prepare(`
    INSERT INTO pd_articles (slug, title, category, audience, summary, sections)
    VALUES (@slug, @title, @category, @audience, @summary, @sections)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      audience = excluded.audience,
      summary = excluded.summary,
      sections = excluded.sections
  `);
  const insertClassroom = db.prepare(`
    INSERT INTO classrooms (id, name, subject, grade_band, student_count, created_at)
    VALUES (@id, @name, @subject, @gradeBand, @studentCount, @createdAt)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      subject = excluded.subject,
      grade_band = excluded.grade_band,
      student_count = excluded.student_count,
      created_at = excluded.created_at
  `);
  const insertSession = db.prepare(`
    INSERT INTO sessions (id, classroom_id, game_slug, lesson_slug, session_date, notes)
    VALUES (@id, @classroomId, @gameSlug, @lessonSlug, @sessionDate, @notes)
    ON CONFLICT(id) DO UPDATE SET
      classroom_id = excluded.classroom_id,
      game_slug = excluded.game_slug,
      lesson_slug = excluded.lesson_slug,
      session_date = excluded.session_date,
      notes = excluded.notes
  `);
  const insertFavorite = db.prepare(`
    INSERT INTO favorites (teacher_name, lesson_slug, created_at)
    VALUES (@teacherName, @lessonSlug, @createdAt)
    ON CONFLICT(teacher_name, lesson_slug) DO UPDATE SET
      created_at = excluded.created_at
  `);

  db.transaction(() => {
    for (const standard of standardsSeed) {
      insertStandard.run(standard);
    }

    for (const item of gamesSeed) {
      insertGame.run({
        ...item,
        subjects: serialize(item.subjects),
        mechanics: serialize(item.mechanics),
        skills: serialize(item.skills),
        materials: serialize(item.materials),
        simplifiedRules: serialize(item.simplifiedRules),
        standards: serialize(item.standards),
      });
    }

    for (const item of lessonsSeed) {
      insertLesson.run({
        ...item,
        standards: serialize(item.standards),
        learningObjectives: serialize(item.learningObjectives),
        materialsNeeded: serialize(item.materialsNeeded),
        preGameActivity: serialize(item.preGameActivity),
        facilitationGuide: serialize(item.facilitationGuide),
        postGameReflection: serialize(item.postGameReflection),
        assessmentRubric: serialize(item.assessmentRubric),
        teacherPrep: serialize(item.teacherPrep),
        variants: serialize(item.variants),
      });
    }

    for (const item of pdArticlesSeed) {
      insertArticle.run({ ...item, sections: serialize(item.sections) });
    }

    for (const classroom of classroomsSeed) {
      insertClassroom.run(classroom);
    }

    for (const session of sessionsSeed) {
      insertSession.run(session);
    }

    for (const favorite of favoritesSeed) {
      insertFavorite.run(favorite);
    }

    db.prepare("INSERT OR REPLACE INTO _meta (key, value) VALUES ('seed_version', ?)").run(SEED_VERSION);
  })();
}

function createDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS standards (
      code TEXT PRIMARY KEY,
      framework TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
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

    CREATE TABLE IF NOT EXISTS lessons (
      slug TEXT PRIMARY KEY,
      game_slug TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      standards TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      learning_objectives TEXT NOT NULL,
      materials_needed TEXT NOT NULL,
      pre_game_activity TEXT NOT NULL,
      facilitation_guide TEXT NOT NULL,
      post_game_reflection TEXT NOT NULL,
      assessment_rubric TEXT NOT NULL,
      teacher_prep TEXT NOT NULL,
      variants TEXT NOT NULL,
      FOREIGN KEY (game_slug) REFERENCES games(slug)
    );

    CREATE TABLE IF NOT EXISTS pd_articles (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      audience TEXT NOT NULL,
      summary TEXT NOT NULL,
      sections TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS classrooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      student_count INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER NOT NULL,
      game_slug TEXT NOT NULL,
      lesson_slug TEXT NOT NULL,
      session_date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (game_slug) REFERENCES games(slug),
      FOREIGN KEY (lesson_slug) REFERENCES lessons(slug)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      teacher_name TEXT NOT NULL,
      lesson_slug TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (teacher_name, lesson_slug),
      FOREIGN KEY (lesson_slug) REFERENCES lessons(slug)
    );

    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  migrateFavoritesSchema(db);
  seedDatabase(db);
  return db;
}

export function getDb() {
  if (!global.__learnByPlayDb) {
    global.__learnByPlayDb = createDatabase();
  }

  return global.__learnByPlayDb;
}
