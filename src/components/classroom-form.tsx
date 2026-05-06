"use client";

import { useActionState } from "react";

import { createClassroomAction, type ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

interface ClassroomFormProps {
  subjects: readonly string[];
  gradeBands: readonly string[];
}

export function ClassroomForm({ subjects, gradeBands }: ClassroomFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(createClassroomAction, null);

  return (
    <>
      {state && !state.success && state.message ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700" aria-live="polite">
          {state.message}
        </p>
      ) : null}
      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Class name
          <input
            name="name"
            required
            aria-invalid={state?.errorFields?.includes("name") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("name") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="Room 22 Fraction Lab"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">Subject
          <select
            name="subject"
            aria-invalid={state?.errorFields?.includes("subject") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("subject") ? "border-rose-400" : "border-slate-200"}`}
          >
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Grade band
          <select
            name="gradeBand"
            aria-invalid={state?.errorFields?.includes("gradeBand") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("gradeBand") ? "border-rose-400" : "border-slate-200"}`}
          >
            {gradeBands.map((gradeBand) => <option key={gradeBand}>{gradeBand}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Student count
          <input
            name="studentCount"
            type="number"
            min={1}
            required
            aria-invalid={state?.errorFields?.includes("studentCount") || undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${state?.errorFields?.includes("studentCount") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="24"
          />
        </label>
        <div className="md:col-span-2">
          <SubmitButton label="Create class" pendingLabel="Creating…" />
        </div>
      </form>
    </>
  );
}
