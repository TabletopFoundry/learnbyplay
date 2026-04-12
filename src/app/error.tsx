"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-rose-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Something needs another try</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">We couldn&apos;t load LearnByPlay right now.</h1>
        <p className="mt-3 text-slate-600">Please retry. If the issue continues, restart the local app so the SQLite seed and routes can refresh cleanly.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
