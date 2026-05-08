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
  const errorFields = new Set(state?.errorFields ?? []);
  const fieldErrors = {
    classroomId: errorFields.has("classroomId") ? "Choose a class from the list." : undefined,
    gameSlug: errorFields.has("gameSlug") ? "Choose a game from the list." : undefined,
    lessonSlug: errorFields.has("lessonSlug") ? "Choose a lesson from the list." : undefined,
    sessionDate: errorFields.has("sessionDate") ? "Choose a valid session date." : undefined,
    notes: errorFields.has("notes") ? "Keep notes under 2,000 characters." : undefined,
  };

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
            aria-invalid={errorFields.has("classroomId") || undefined}
            aria-describedby={fieldErrors.classroomId ? "session-classroom-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("classroomId") ? "border-rose-400" : "border-slate-200"}`}
          >
            <option value="">Select a class</option>
            {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
          </select>
          {fieldErrors.classroomId ? <span id="session-classroom-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.classroomId}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Game
          <select
            name="gameSlug"
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("gameSlug") ? "border-rose-400" : "border-slate-200"}`}
            required
            aria-invalid={errorFields.has("gameSlug") || undefined}
            aria-describedby={fieldErrors.gameSlug ? "session-game-error" : undefined}
            value={selectedGameSlug}
            onChange={(e) => setSelectedGameSlug(e.target.value)}
          >
            <option value="">Select a game</option>
            {games.map((game) => <option key={game.slug} value={game.slug}>{game.name}</option>)}
          </select>
          {fieldErrors.gameSlug ? <span id="session-game-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.gameSlug}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Lesson plan
          <select
            name="lessonSlug"
            required
            aria-invalid={errorFields.has("lessonSlug") || undefined}
            aria-describedby={fieldErrors.lessonSlug ? "session-lesson-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("lessonSlug") ? "border-rose-400" : "border-slate-200"}`}
          >
            <option value="">
              {selectedGameSlug ? (filteredLessons.length === 0 ? "No lessons for this game" : "Select a lesson") : "Select a game first"}
            </option>
            {filteredLessons.map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}
          </select>
          {fieldErrors.lessonSlug ? <span id="session-lesson-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.lessonSlug}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Session date
          <input
            name="sessionDate"
            type="date"
            required
            aria-invalid={errorFields.has("sessionDate") || undefined}
            aria-describedby={fieldErrors.sessionDate ? "session-date-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("sessionDate") ? "border-rose-400" : "border-slate-200"}`}
          />
          {fieldErrors.sessionDate ? <span id="session-date-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.sessionDate}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Notes
          <input
            name="notes"
            aria-invalid={errorFields.has("notes") || undefined}
            aria-describedby={fieldErrors.notes ? "session-notes-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("notes") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="Quick observation or reminder"
          />
          {fieldErrors.notes ? <span id="session-notes-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.notes}</span> : null}
        </label>
        <div className="md:col-span-2">
          <SubmitButton label="Log session" pendingLabel="Logging…" />
        </div>
      </form>
    </>
  );
}
