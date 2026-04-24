"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const links = [
  { href: "/games", label: "Browse games" },
  { href: "/dashboard", label: "Teacher dashboard" },
  { href: "/tools", label: "Classroom tools" },
  { href: "/pd", label: "PD & admin FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Move focus to first nav link when menu opens
  useEffect(() => {
    if (menuOpen && navRef.current) {
      const firstLink = navRef.current.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  }, [menuOpen]);

  // Escape key handler
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
      // Focus trap: cycle focus within the nav
      if (e.key === "Tab" && navRef.current) {
        const focusable = navRef.current.querySelectorAll<HTMLElement>("a, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header role="banner" className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-lg font-bold text-amber-800" aria-hidden="true">
              LP
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">LearnByPlay</p>
              <p className="text-sm text-slate-600">
                <span className="sr-only">LearnByPlay: </span>
                Board games aligned to standards and classroom routines
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:inline-flex"
            >
              Explore the catalog
            </Link>
            <button
              type="button"
              ref={toggleRef}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-slate-200 p-2.5 text-slate-700 transition hover:border-amber-300 hover:text-slate-900 sm:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden flex-wrap gap-2 sm:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-amber-400 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile navigation drawer */}
        {menuOpen && (
          <nav ref={navRef} id="mobile-nav" aria-label="Mobile navigation" className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:hidden">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-50 text-amber-900"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/games"
              onClick={closeMenu}
              className="mt-1 rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Explore the catalog
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
