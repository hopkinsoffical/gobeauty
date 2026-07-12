"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUGGESTED_SEARCHES } from "@/lib/data/marketplace";

interface Props {
  initialQuery?: string;
  basePath?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

export default function MarketplaceSearch({
  initialQuery = "",
  basePath = "/marketplace",
  placeholder = "Search by service, client need, product, supplier, or brand",
  showSuggestions = true,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const go = (query?: string) => {
    const text = (query ?? q).trim();
    router.push(text ? `${basePath}?q=${encodeURIComponent(text)}` : basePath);
  };

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-card focus-within:border-brand-300 focus-within:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]"
      >
        <svg
          className="ml-2 h-5 w-5 flex-none text-ink-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-11 min-w-0 flex-1 border-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-faint"
          aria-label="Search marketplace"
        />
        <button
          type="submit"
          className="flex-none rounded-xl bg-brand-500 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-brand-600"
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_SEARCHES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQ(s);
                go(s);
              }}
              className="rounded-pill border border-line bg-white/90 px-3.5 py-1.5 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
