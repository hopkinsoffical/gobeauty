"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// PRD v2 §5 / FR-009 — mobile bottom navigation: Home | Upload | Find Pros |
// Shop | More, with Upload as the highlighted center action.
const TABS = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 10.5V20h13v-9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "find-pros",
    label: "Find Pros",
    href: "/find-pros",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-6-5.1-6-10a6 6 0 0 1 12 0c0 4.9-6 10-6 10z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2.4" />
      </svg>
    ),
  },
  {
    id: "upload",
    label: "Upload",
    href: "/get-this-look",
    cta: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="M3 17l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop-products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "More",
    href: "#more",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const MORE_LINKS = [
  { label: "Looks & Trends", href: "/looks-trends" },
  { label: "Local Rankings", href: "/local-rankings" },
  { label: "Product Library", href: "/products" },
  { label: "Products for Salons", href: "/marketplace" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "For Beauty Professionals", href: "/beauty-pros" },
  { label: "For Beauty Brands", href: "/brands" },
  { label: "Services", href: "/services" },
  { label: "List Your Products", href: "/brands/list-your-products" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => setMoreOpen(false), [pathname]);

  return (
    <>
      {/* "More" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-ink/30" aria-hidden />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-24 shadow-[0_-12px_40px_rgba(15,20,25,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />
            <nav aria-label="More" className="grid grid-cols-2 gap-2">
              {MORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex h-12 items-center rounded-xl border border-line-soft bg-surface-soft px-4 text-[14px] font-semibold text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-line bg-white px-1.5 py-1.5 md:hidden"
        style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom))" }}
      >
        {TABS.map((t) => {
          const isActive =
            t.id === "more"
              ? moreOpen
              : t.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(t.href);

          if (t.cta) {
            return (
              <Link
                key={t.id}
                href={t.href}
                aria-label="Upload a look"
                className="flex h-12 w-12 flex-none items-center justify-center self-center rounded-full bg-brand-500 text-white shadow-[0_4px_14px_rgba(232,90,130,0.40)]"
              >
                <span className="block h-6 w-6">{t.icon}</span>
              </Link>
            );
          }

          if (t.id === "more") {
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                aria-label={t.label}
                aria-expanded={moreOpen}
                className={[
                  "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10.5px] font-semibold transition",
                  isActive ? "text-brand-500" : "text-ink-muted",
                ].join(" ")}
              >
                <span className="block h-[22px] w-[22px]">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={t.id}
              href={t.href}
              aria-label={t.label}
              className={[
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10.5px] font-semibold transition",
                isActive ? "text-brand-500" : "text-ink-muted",
              ].join(" ")}
            >
              <span className="block h-[22px] w-[22px]">{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
