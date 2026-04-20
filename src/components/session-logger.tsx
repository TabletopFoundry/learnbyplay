"use client";

import { useMemo, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import type { Classroom, LessonPlan } from "@/lib/types";

type GameOption = { slug: string; name: string };

interface SessionLoggerProps {
  classrooms: Classroom[];
  games: GameOption[];
  lessonsByGame: Record<string, LessonPlan[]>;
  action: (formData: FormData) => void;
}

export function SessionLogger({ classrooms, games, lessonsByGame, action }: SessionLoggerProps) {
  const [selectedGameSlug, setSelectedGameSlug] = useState("");

  const filteredLessons = useMemo(() => {
    if (!selectedGameSlug) return [];
    return lessonsByGame[selectedGameSlug] ?? [];
  }, [selectedGameSlug, lessonsByGame]);

  return (
    <form action={action} className="mt-6 grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">Class
        <select name="classroomId" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required>
          <option value="">Select a class</option>
          {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700">Game
        <select
          name="gameSlug"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
          required
          value={selectedGameSlug}
          onChange={(e) => setSelectedGameSlug(e.target.value)}
        >
          <option value="">Select a game</option>
          {games.map((game) => <option key={game.slug} value={game.slug}>{game.name}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">Lesson plan
        <select name="lessonSlug" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required>
          <option value="">
            {selectedGameSlug ? (filteredLessons.length === 0 ? "No lessons for this game" : "Select a lesson") : "Select a game first"}
          </option>
          {filteredLessons.map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700">Session date
        <input name="sessionDate" type="date" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
      </label>
      <label className="text-sm font-medium text-slate-700">Notes
        <input name="notes" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Quick observation or reminder" />
      </label>
      <div className="md:col-span-2">
        <SubmitButton label="Log session" pendingLabel="Logging…" />
      </div>
    </form>
  );
}
