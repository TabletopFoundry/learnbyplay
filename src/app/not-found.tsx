import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">That lesson or game isn&apos;t available.</h1>
        <p className="mt-3 text-slate-600">Try the main catalog to browse standards-aligned games, saved lessons, and classroom tools.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/games" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Browse games
          </Link>
          <Link href="/dashboard" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900">
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
