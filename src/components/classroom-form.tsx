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
  const errorFields = new Set(state?.errorFields ?? []);
  const fieldErrors = {
    name: errorFields.has("name") ? "Enter a class name." : undefined,
    subject: errorFields.has("subject") ? "Choose a valid subject." : undefined,
    gradeBand: errorFields.has("gradeBand") ? "Choose a valid grade band." : undefined,
    studentCount: errorFields.has("studentCount")
      ? "Enter a whole-number student count between 1 and 999."
      : undefined,
  };

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
            aria-invalid={errorFields.has("name") || undefined}
            aria-describedby={fieldErrors.name ? "classroom-name-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("name") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="Room 22 Fraction Lab"
          />
          {fieldErrors.name ? <span id="classroom-name-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.name}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Subject
          <select
            name="subject"
            aria-invalid={errorFields.has("subject") || undefined}
            aria-describedby={fieldErrors.subject ? "classroom-subject-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("subject") ? "border-rose-400" : "border-slate-200"}`}
          >
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
          {fieldErrors.subject ? <span id="classroom-subject-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.subject}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Grade band
          <select
            name="gradeBand"
            aria-invalid={errorFields.has("gradeBand") || undefined}
            aria-describedby={fieldErrors.gradeBand ? "classroom-grade-band-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("gradeBand") ? "border-rose-400" : "border-slate-200"}`}
          >
            {gradeBands.map((gradeBand) => <option key={gradeBand}>{gradeBand}</option>)}
          </select>
          {fieldErrors.gradeBand ? <span id="classroom-grade-band-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.gradeBand}</span> : null}
        </label>
        <label className="text-sm font-medium text-slate-700">Student count
          <input
            name="studentCount"
            type="number"
            min={1}
            required
            aria-invalid={errorFields.has("studentCount") || undefined}
            aria-describedby={fieldErrors.studentCount ? "classroom-student-count-error" : undefined}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 ${errorFields.has("studentCount") ? "border-rose-400" : "border-slate-200"}`}
            placeholder="24"
          />
          {fieldErrors.studentCount ? <span id="classroom-student-count-error" className="mt-2 block text-sm text-rose-700">{fieldErrors.studentCount}</span> : null}
        </label>
        <div className="md:col-span-2">
          <SubmitButton label="Create class" pendingLabel="Creating…" />
        </div>
      </form>
    </>
  );
}
