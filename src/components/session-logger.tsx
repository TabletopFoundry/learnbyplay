"use client";

import { useActionState, useMemo, useState } from "react";

import type { ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Classroom, LessonPlan } from "@/lib/types";

type GameOption = { slug: string; name: string };

interface SessionLoggerProps {
  classrooms: Classroom[];
  games: GameOption[];
  lessonsByGame: Record<string, LessonPlan[]>;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function SessionLogger({ classrooms, games, lessonsByGame, action }: SessionLoggerProps) {
  const [selectedGameSlug, setSelectedGameSlug] = useState("");
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);

  const filteredLessons = useMemo(() => {
    if (!selectedGameSlug) return [];
    return lessonsByGame[selectedGameSlug] ?? [];
  }, [selectedGameSlug, lessonsByGame]);

  return (
    <>
      {state && !state.success && state.message ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700" aria-live="polite">
          {state.message}
        </p>
      ) : null}
      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Class
          <select
            name="classroomId"
            required
            aria-invalid={state?.errorFields?.includes("classroomId") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("classroomId") ? "border-rose-400" : "border-slate-200"}`}
          >
            <option value="">Select a class</option>
            {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Game
          <select
            name="gameSlug"
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("gameSlug") ? "border-rose-400" : "border-slate-200"}`}
            required
            aria-invalid={state?.errorFields?.includes("gameSlug") || undefined}
            value={selectedGameSlug}
            onChange={(e) => setSelectedGameSlug(e.target.value)}
          >
            <option value="">Select a game</option>
            {games.map((game) => <option key={game.slug} value={game.slug}>{game.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Lesson plan
          <select
            name="lessonSlug"
            required
            aria-invalid={state?.errorFields?.includes("lessonSlug") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("lessonSlug") ? "border-rose-400" : "border-slate-200"}`}
          >
            <option value="">
              {selectedGameSlug ? (filteredLessons.length === 0 ? "No lessons for this game" : "Select a lesson") : "Select a game first"}
            </option>
            {filteredLessons.map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Session date
          <input
            name="sessionDate"
            type="date"
            required
            aria-invalid={state?.errorFields?.includes("sessionDate") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("sessionDate") ? "border-rose-400" : "border-slate-200"}`}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">Notes
          <input
            name="notes"
            aria-invalid={state?.errorFields?.includes("notes") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("notes") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="Quick observation or reminder"
          />
        </label>
        <div className="md:col-span-2">
          <SubmitButton label="Log session" pendingLabel="Logging…" />
        </div>
      </form>
    </>
  );
}
