import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDb, redirect, revalidatePath } = vi.hoisted(() => ({
  getDb: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/db", () => ({ getDb }));

import { createClassroomAction, deleteClassroomAction, logSessionAction } from "@/app/actions";

describe("actions", () => {
  beforeEach(() => {
    getDb.mockReset();
    revalidatePath.mockReset();
    redirect.mockClear();
  });

  it("rejects fractional student counts before touching the database", async () => {
    const formData = new FormData();
    formData.set("name", "Room 14");
    formData.set("subject", "Math");
    formData.set("gradeBand", "3-5");
    formData.set("studentCount", "24.5");

    await expect(createClassroomAction(null, formData)).resolves.toEqual({
      success: false,
      errorFields: ["validation"],
      message: "Please check your input.",
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("wraps session logging in a transaction before returning a missing reference error", async () => {
    const transaction = vi.fn((callback: () => boolean) => () => callback());
    const prepare = vi.fn((sql: string) => {
      if (sql.includes("FROM classrooms")) {
        return { get: vi.fn(() => ({ id: 1 })) };
      }
      if (sql.includes("FROM games")) {
        return { get: vi.fn(() => ({ slug: "prime-climb" })) };
      }
      if (sql.includes("FROM lessons")) {
        return { get: vi.fn(() => undefined) };
      }
      return { run: vi.fn() };
    });

    getDb.mockReturnValue({ transaction, prepare });

    const formData = new FormData();
    formData.set("classroomId", "1");
    formData.set("gameSlug", "prime-climb");
    formData.set("lessonSlug", "missing-lesson");
    formData.set("sessionDate", "2025-05-07");
    formData.set("notes", "Tried to log a session");

    await expect(logSessionAction(null, formData)).resolves.toEqual({
      success: false,
      errorFields: ["reference"],
      message: "One or more selected items no longer exist. Please refresh and try again.",
    });
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it("uses the transactional delete result to handle missing classrooms", async () => {
    const transaction = vi.fn(() => () => 0);
    getDb.mockReturnValue({ transaction, prepare: vi.fn() });

    const formData = new FormData();
    formData.set("id", "999");

    await expect(deleteClassroomAction(formData)).rejects.toThrow("REDIRECT:/dashboard?error=not-found");
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
