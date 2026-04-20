export function SiteFooter() {
  return (
    <footer role="contentinfo" className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-semibold text-slate-900">LearnByPlay</p>
          <p className="mt-2">Helping teachers discover, run, and justify game-based learning with confidence.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Included in this MVP</p>
          <ul className="mt-2 space-y-1">
            <li>37 curriculum-mapped games</li>
            <li>12 detailed lesson plans</li>
            <li>Dashboard, live tools, and PD content</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Built for educators</p>
          <p className="mt-2">Responsive, printable, and seeded locally with SQLite so it runs fully on your machine.</p>
        </div>
      </div>
    </footer>
  );
}
