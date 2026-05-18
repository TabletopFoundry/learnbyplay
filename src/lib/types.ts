import type { GradeBand, Subject } from "@/lib/constants";

export type { Subject, GradeBand };

export interface Standard {
  code: string;
  framework: string;
  subject: Subject | "Advisory";
  gradeBand: GradeBand;
  description: string;
}

export interface Game {
  slug: string;
  name: string;
  publisher: string;
  tagline: string;
  description: string;
  subjects: Subject[];
  gradeBand: GradeBand;
  ageRange: string;
  minPlayers: number;
  maxPlayers: number;
  playTimeMin: number;
  playTimeMax: number;
  complexity: number;
  setupTimeMin: number;
  mechanics: string[];
  skills: string[];
  materials: string[];
  simplifiedRules: string[];
  standards: string[];
  classroomFit: string;
  copiesNote: string;
}

export interface LessonSequenceItem {
  phase: string;
  minutes: number;
  guidance: string;
}

export interface LessonVariant {
  duration: number;
  label: string;
  focus: string;
  sequence: LessonSequenceItem[];
}

export interface RubricRow {
  criterion: string;
  exceeds: string;
  meets: string;
  developing: string;
}

export interface LessonPlan {
  slug: string;
  gameSlug: string;
  title: string;
  summary: string;
  standards: string[];
  gradeBand: string;
  learningObjectives: string[];
  materialsNeeded: string[];
  preGameActivity: string[];
  facilitationGuide: string[];
  postGameReflection: string[];
  assessmentRubric: RubricRow[];
  teacherPrep: string[];
  variants: LessonVariant[];
}

export interface FavoriteLessonSummary extends LessonPlan {
  savedBy: string[];
  savedCount: number;
}

export interface PDArticle {
  slug: string;
  title: string;
  category: string;
  audience: string;
  summary: string;
  sections: Array<{ heading: string; body: string[] }>;
}

export interface Classroom {
  id: number;
  name: string;
  subject: string;
  gradeBand: GradeBand;
  studentCount: number;
  createdAt: string;
}

export interface SessionRecord {
  id: number;
  classroomId: number;
  classroomName: string;
  gameSlug: string;
  gameName: string;
  lessonSlug: string;
  lessonTitle: string;
  sessionDate: string;
  notes: string;
  skills: string[];
}

export type SortOption = "fit" | "time" | "complexity" | "standards";

export interface CatalogFilters {
  subject?: string;
  gradeBand?: string;
  standard?: string;
  maxPlayTime?: number;
  groupSize?: number;
  maxComplexity?: number;
  sort?: SortOption;
}

export interface DashboardMetrics {
  classCount: number;
  sessionCount: number;
  favoriteCount: number;
  standardsCovered: number;
  totalGames: number;
  totalStandards: number;
}

export interface SkillHeatmapEntry {
  skill: string;
  count: number;
  level: "high" | "medium" | "low";
}

export interface DashboardSnapshot {
  classrooms: Classroom[];
  sessions: SessionRecord[];
  favoriteLessons: FavoriteLessonSummary[];
  metrics: DashboardMetrics;
  skillsHeatmap: SkillHeatmapEntry[];
}

export interface CatalogInsights {
  games: number;
  lessons: number;
  standards: number;
}
