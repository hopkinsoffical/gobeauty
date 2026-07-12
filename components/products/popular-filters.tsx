"use client";

import Link from "next/link";
import { useState } from "react";
import { FILTERS } from "@/data/products-landing";
import { FilterIcon, IconPlus, IconSliders } from "@/components/products/icons";
import FilterDrawer from "@/components/products/filter-drawer";
import { buildProductsHref, toggleFilter } from "@/lib/products-url";

export default function PopularFilters({
  active = [],
  q = "",
  category = "",
}: {
  active?: string[];
  q?: string;
  category?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const primary = FILTERS.filter((f) => f.primary);

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 lg:px-8" aria-labelledby="popular-filters-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="popular-filters-heading" className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]">
          Popular Filters
        </h2>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[var(--beauty-pink)] transition hover:text-[var(--beauty-pink-dark)]"
        >
          <IconSliders className="h-4 w-4" />
          More filters
        </button>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin md:flex-wrap md:overflow-visible">
        {primary.map((f) => {
          const on = active.includes(f.key);
          return (
            <Link
              key={f.key}
              href={buildProductsHref({
                q,
                category: category || undefined,
                filters: toggleFilter(active, f.key),
              })}
              aria-pressed={on}
              className={[
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition duration-200",
                on
                  ? "border-[var(--beauty-pink)] bg-[var(--beauty-pink)] text-white shadow-sm"
                  : "border-[var(--beauty-border)] bg-white text-[var(--beauty-text)] hover:border-brand-300 hover:bg-[var(--beauty-pink-light)]",
              ].join(" ")}
            >
              <FilterIcon name={f.icon} className="h-4 w-4" />
              {f.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-[var(--beauty-border)] bg-white px-4 py-2 text-[13.5px] font-semibold text-[var(--beauty-muted)] transition hover:border-brand-300 hover:text-[var(--beauty-pink)]"
        >
          <IconPlus className="h-4 w-4" />
          More +
        </button>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={active}
        q={q}
        category={category}
      />
    </section>
  );
}
