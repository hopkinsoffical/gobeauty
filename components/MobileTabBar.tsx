"use client";

import { useAuth } from "@/lib/auth/useAuth";

const TABS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3 3 12h3v8h5v-5h2v5h5v-8h3z" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "create",
    label: "Create",
    cta: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "you",
    label: "You",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function MobileTabBar() {
  const { user, openAuth } = useAuth();

  const handleClick = (id: string) => {
    if (id === "create") openAuth("sign-in");
  };

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-line bg-white px-1.5 py-1.5 md:hidden"
      style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom))" }}
    >
      {TABS.map((t) => {
        const isActive =
          t.id === "home" ||
          (t.id === "you" && !!user);
        if (t.cta) {
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleClick(t.id)}
              aria-label={t.label}
              className="flex h-11 w-11 flex-none items-center justify-center self-center rounded-full bg-brand-500 text-white shadow-[0_4px_14px_rgba(232,90,130,0.40)]"
            >
              <span className="block h-6 w-6">{t.icon}</span>
            </button>
          );
        }
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => handleClick(t.id)}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10.5px] font-semibold",
              isActive ? "text-brand-500" : "text-ink-muted",
            ].join(" ")}
          >
            <span className="block h-[22px] w-[22px]">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
