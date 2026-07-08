"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

// PRD v2 §5 — top-level channel navigation.
const NAV_LINKS = [
  { label: "Get This Look", href: "/get-this-look" },
  { label: "Find Pros", href: "/find-pros" },
  { label: "Local Rankings", href: "/local-rankings" },
  { label: "Shop Pro-Recommended Products", href: "/shop-products" },
  { label: "Looks & Trends", href: "/looks-trends" },
];

const BUSINESS_LINKS = [
  { label: "For Beauty Professionals", href: "/for-beauty-pros" },
  { label: "For Beauty Brands", href: "/brands" },
];

function maskUsername(name: string) {
  if (!name) return "";
  if (name.length <= 4) return name[0] + "***";
  return name.slice(0, 2) + "***" + name.slice(-2);
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, profile, openAuth, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Close overlays on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/get-this-look?q=${encodeURIComponent(q)}` : "/get-this-look");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 md:px-5">
        {/* Logo — left (PRD §5 mobile header rule) */}
        <Link href="/" aria-label="goBeauty.ai home" className="flex flex-none items-center">
          <Image
            src="/gobeauty-logo.png"
            alt="goBeauty.ai"
            width={1230}
            height={360}
            className="h-10 w-auto object-contain md:h-11"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden min-w-0 items-center gap-5 text-[13.5px] font-semibold text-ink-soft lg:flex"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "whitespace-nowrap transition hover:text-ink",
                pathname?.startsWith(l.href) ? "text-brand-600" : "",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
          <span aria-hidden className="h-4 w-px bg-line" />
          {BUSINESS_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "whitespace-nowrap transition hover:text-ink",
                pathname?.startsWith(l.href) ? "text-brand-600" : "",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop account actions */}
        <div className="hidden flex-none items-center gap-3 lg:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/u/me"
                className="flex items-center gap-2 rounded-pill border border-line bg-surface-soft px-3 py-1.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                  {(profile?.username ?? "U")[0].toUpperCase()}
                </span>
                <span className="text-[13px] font-semibold text-ink">
                  {profile ? maskUsername(profile.username) : "···"}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-[13.5px] font-medium text-ink-muted transition hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth("sign-in")}
                className="text-[14px] font-medium text-ink-soft transition hover:text-ink"
              >
                Sign In
              </button>
              <Link
                href="/get-this-look"
                className="rounded-pill bg-brand-500 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-brand-600"
              >
                Upload a Look
              </Link>
            </>
          )}
        </div>

        {/* Mobile: search + menu icons on the right (PRD §5) */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-tint"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
            }}
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-tint"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search sheet */}
      {searchOpen && (
        <div className="border-t border-line-soft bg-white px-4 pb-4 pt-3 lg:hidden">
          <form
            role="search"
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-1 focus-within:border-brand-300"
          >
            <svg className="h-[18px] w-[18px] flex-none text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a look, service, or ‘glass skin’…"
              className="h-11 min-w-0 flex-1 border-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              className="flex-none rounded-pill bg-brand-500 px-4 py-2 text-[13px] font-semibold text-white"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="border-t border-line-soft bg-white px-5 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex h-12 items-center text-[15.5px] font-semibold text-ink transition hover:text-brand-600"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-line-soft pt-2">
              {BUSINESS_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex h-12 items-center text-[15px] font-medium text-ink-soft transition hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            {user ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-surface-soft px-4 py-3">
                <Link href="/u/me" className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[12px] font-bold text-white">
                    {(profile?.username ?? "U")[0].toUpperCase()}
                  </span>
                  <span className="text-[14px] font-semibold text-ink">
                    {profile ? maskUsername(profile.username) : "···"}
                  </span>
                </Link>
                <button onClick={signOut} className="text-[13px] text-ink-muted hover:text-ink">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openAuth("sign-in")}
                  className="h-11 flex-1 rounded-pill border border-line text-center text-[14px] font-semibold text-ink"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth("sign-up")}
                  className="h-11 flex-1 rounded-pill bg-brand-500 text-center text-[14px] font-semibold text-white"
                >
                  Sign up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
