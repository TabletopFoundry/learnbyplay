export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-72 rounded-full bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="h-4 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 h-8 w-16 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-3xl bg-white shadow-sm" />
          <div className="h-72 rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
