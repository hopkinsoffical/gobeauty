"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

const NAV_LINKS = [
  { label: "Get This Look", href: "#hero" },
  { label: "Book Pros", href: "#services" },
  { label: "DIY Guides", href: "#diy" },
  { label: "Shop Top 3", href: "#shop-products" },
];

const EXTRA_LINKS = [
  { label: "For Businesses", href: "#for-businesses" },
  { label: "Sign In", href: "#login" },
  { label: "Contact Us", href: "/contact" },
];

function maskUsername(name: string) {
  if (!name) return "";
  if (name.length <= 4) return name[0] + "***";
  return name.slice(0, 2) + "***" + name.slice(-2);
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, openAuth, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <div className="flex flex-none items-center gap-8">
          <Link href="/" aria-label="goBeauty.ai home" className="flex items-center">
            <Image
              src="/gobeauty-logo.png"
              alt="goBeauty.ai"
              width={1230}
              height={360}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-[14px] font-medium text-ink-soft lg:flex"
          >
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search input (Pinterest-style) */}
        <div className="hidden max-w-[640px] flex-1 items-center gap-2 rounded-pill border border-line bg-white px-4 py-1.5 transition focus-within:border-brand-300 focus-within:shadow-[0_0_0_4px_rgba(232,90,130,0.10)] lg:flex">
          <svg className="h-[18px] w-[18px] flex-none text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search a look, service, or ‘glass skin’…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="button"
            onClick={() => openAuth("sign-in")}
            className="inline-flex flex-none items-center gap-1.5 rounded-pill bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-ink-soft"
          >
            <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M3 17l5-5 4 4 3-3 6 6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span>Upload a look</span>
          </button>
        </div>

        {/* Desktop actions */}
        <div className="hidden flex-none items-center gap-3 sm:flex">
          <Link href="#for-businesses" className="text-[14px] font-medium text-ink-soft transition hover:text-ink">
            For Businesses
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-pill border border-line bg-surface-soft px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                  {(profile?.username ?? "U")[0].toUpperCase()}
                </div>
                <span className="text-[13px] font-semibold text-ink">
                  {profile ? maskUsername(profile.username) : "···"}
                </span>
              </div>
              <button
                onClick={signOut}
                className="text-[13.5px] font-medium text-ink-muted transition hover:text-ink"
              >
                退出
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
              <button
                onClick={() => openAuth("sign-up")}
                className="rounded-pill bg-brand-500 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-brand-600"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-tint sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line-soft bg-white px-5 pb-5 pt-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-ink-soft transition hover:text-ink"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-line-soft pt-3">
              <Link href="#for-businesses" className="block py-2 text-[15px] font-medium text-ink-soft transition hover:text-ink" onClick={() => setMenuOpen(false)}>
                For Businesses
              </Link>
              <Link href="/contact" className="block py-2 text-[15px] font-medium text-ink-soft transition hover:text-ink" onClick={() => setMenuOpen(false)}>
                Contact Us
              </Link>
            </div>
            {user ? (
              <div className="mt-1 flex items-center justify-between rounded-xl border border-line bg-surface-soft px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[12px] font-bold text-white">
                    {(profile?.username ?? "U")[0].toUpperCase()}
                  </div>
                  <span className="text-[14px] font-semibold text-ink">
                    {profile ? maskUsername(profile.username) : "···"}
                  </span>
                </div>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-[13px] text-ink-muted hover:text-ink">
                  退出
                </button>
              </div>
            ) : (
              <div className="mt-1 flex gap-3">
                <button onClick={() => { openAuth("sign-in"); setMenuOpen(false); }} className="flex-1 rounded-pill border border-line py-2.5 text-center text-[14px] font-semibold text-ink">
                  Sign In
                </button>
                <button onClick={() => { openAuth("sign-up"); setMenuOpen(false); }} className="flex-1 rounded-pill bg-brand-500 py-2.5 text-center text-[14px] font-semibold text-white">
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
