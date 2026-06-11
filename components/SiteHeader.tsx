"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "For Professionals", href: "#for-businesses" },
  { label: "Products", href: "#shop-products" },
  { label: "About", href: "#about" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-8">
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="#login"
            className="text-[14px] font-medium text-ink-soft transition hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="#signup"
            className="rounded-pill bg-brand-500 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Sign up
          </Link>
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
            <div className="mt-2 flex gap-3">
              <Link href="#login" className="flex-1 rounded-pill border border-line py-2 text-center text-[14px] font-semibold text-ink">
                Log in
              </Link>
              <Link href="#signup" className="flex-1 rounded-pill bg-brand-500 py-2 text-center text-[14px] font-semibold text-white">
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
