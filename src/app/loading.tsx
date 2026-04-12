export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 rounded-full bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-40 rounded-2xl bg-slate-200" />
              <div className="mt-4 h-6 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
