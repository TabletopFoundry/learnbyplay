"use client";

interface ErrorFallbackProps {
  title: string;
  description: string;
  buttonLabel?: string;
  reset: () => void;
}

export function ErrorFallback({ title, description, buttonLabel = "Try again", reset }: ErrorFallbackProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">{title}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{description}</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
