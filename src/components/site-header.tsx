import Link from "next/link";

const links = [
  { href: "/games", label: "Browse games" },
  { href: "/dashboard", label: "Teacher dashboard" },
  { href: "/tools", label: "Classroom tools" },
  { href: "/pd", label: "PD & admin FAQ" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-lg font-bold text-amber-800">
              LP
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">LearnByPlay</p>
              <p className="text-sm text-slate-600">Board games aligned to standards and classroom routines</p>
            </div>
          </Link>
          <Link
            href="/games"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:inline-flex"
          >
            Explore the catalog
          </Link>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
