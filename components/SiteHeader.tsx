"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function SiteHeader() {
  const { user, loading, openAuth, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="GoBeauty home"
            className="flex items-center gap-1.5"
          >
            <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm" />
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Go
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Beauty
              </span>
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-[14.5px] font-medium text-ink-soft md:flex"
          >
            <Link href="/analyze" className="hover:text-ink">
              Analyze a photo
            </Link>
            <Link href="/#top-salons" className="hover:text-ink">
              Top salons
            </Link>
            <Link href="/#how-we-rank" className="hover:text-ink">
              How we rank
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="h-9 w-20 animate-pulse rounded-pill bg-line-soft" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-pill border border-line px-2.5 py-1.5 text-[13.5px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[12px] font-bold uppercase text-white">
                  {(user.email ?? "?").charAt(0)}
                </span>
                <span className="hidden max-w-[140px] truncate sm:inline">
                  {user.email}
                </span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-cardHover"
                >
                  <Link
                    href="/analyze"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-[14px] text-ink-soft hover:bg-surface-soft hover:text-ink"
                  >
                    Analyze a photo
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut();
                    }}
                    className="block w-full px-4 py-2 text-left text-[14px] text-ink-soft hover:bg-surface-soft hover:text-ink"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="hidden rounded-pill border border-line px-3.5 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink sm:inline-block"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="rounded-pill bg-ink px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ink-soft"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
