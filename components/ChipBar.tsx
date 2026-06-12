"use client";

import { useState } from "react";

const CHIPS = [
  { id: "all", label: "All" },
  { id: "nails", label: "💅 Nails" },
  { id: "hair", label: "💆 Hair" },
  { id: "skin", label: "✨ Skin" },
  { id: "makeup", label: "💄 Makeup" },
  { id: "lashes", label: "👁️ Lashes & Brows" },
  { id: "kbeauty", label: "🇰🇷 K-Beauty" },
  { id: "aftercare", label: "🌿 Aftercare" },
  { id: "medspa", label: "🩹 Med Spa" },
];

export default function ChipBar() {
  const [active, setActive] = useState("all");

  return (
    <div
      className="sticky top-16 z-30 border-b border-line-soft bg-white/92 backdrop-blur-md"
      role="tablist"
      aria-label="Beauty categories"
    >
      <div className="mx-auto flex max-w-[1600px] flex-wrap gap-2 px-6 py-2.5">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={[
              "whitespace-nowrap rounded-pill border px-3.5 py-1.5 text-[13.5px] font-semibold transition",
              active === c.id
                ? "border-ink bg-ink text-white"
                : "border-line bg-transparent text-ink-soft hover:bg-surface-tint hover:text-ink",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          className="whitespace-nowrap rounded-pill border border-line bg-transparent px-3.5 py-1.5 text-[13.5px] font-semibold text-ink-soft transition hover:bg-surface-tint"
        >
          More ▾
        </button>
      </div>
    </div>
  );
}
