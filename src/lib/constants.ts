export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const SUBJECTS = ["Math", "Science", "Social Studies", "ELA", "SEL"] as const;
export type Subject = (typeof SUBJECTS)[number];

export const GRADE_BANDS = ["K-2", "3-5", "6-8", "9-12"] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export const DEFAULT_FAVORITE_TEACHER = "Lead Teacher";

export const COMPLEXITY_LABELS: Record<number, string> = {
  1: "Starter",
  2: "Accessible",
  3: "Moderate",
  4: "Stretch",
  5: "Expert",
};
