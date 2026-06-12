"use client";
import { useState, ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  count?: number;
  content: ReactNode;
}

export default function ProfileTabs({
  boardsCount,
  looksCount,
  boardsContent,
  looksContent,
}: {
  boardsCount: number;
  looksCount: number;
  boardsContent: ReactNode;
  looksContent: ReactNode;
}) {
  const [active, setActive] = useState<"boards" | "looks" | "about">("boards");
  const tabs: Tab[] = [
    { key: "boards", label: "Boards", count: boardsCount, content: boardsContent },
    { key: "looks", label: "Looks", count: looksCount, content: looksContent },
    {
      key: "about",
      label: "About",
      content: <AboutTabContent />,
    },
  ];

  return (
    <div>
      <div className="border-y border-line sticky top-12 bg-white z-20">
        <div className="mx-auto max-w-screen-md px-1 flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key as any)}
              className={[
                "flex-1 py-3 text-xs md:text-sm font-bold transition border-b-2",
                active === t.key
                  ? "text-ink border-ink"
                  : "text-ink-muted border-transparent hover:text-ink",
              ].join(" ")}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span className="ml-1 text-ink-faint font-semibold">{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-screen-md px-4 pt-4">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}

function AboutTabContent() {
  return (
    <div className="py-6 text-center text-ink-muted text-sm">
      About section coming soon — showcase favorite products, services, etc.
    </div>
  );
}
