"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { IconSearch } from "@/components/products/icons";
import { buildProductsHref } from "@/lib/products-url";

export default function ProductSearch({
  initialQuery = "",
  activeFilters = [],
  category = "",
}: {
  initialQuery?: string;
  activeFilters?: string[];
  category?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(
      buildProductsHref({
        q,
        filters: activeFilters,
        category: category || undefined,
      }),
    );
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl" role="search">
      <label htmlFor="products-search" className="sr-only">
        Search products, brands, or ingredients
      </label>
      <div className="flex items-center gap-2 rounded-full border border-[var(--beauty-border)] bg-white py-1.5 pl-4 pr-1.5 shadow-card transition focus-within:border-brand-300 focus-within:shadow-[0_0_0_4px_rgba(235,79,120,0.12)]">
        <IconSearch className="h-5 w-5 shrink-0 text-[var(--beauty-muted)]" />
        <input
          id="products-search"
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, brands, or ingredients…"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-[var(--beauty-text)] outline-none placeholder:text-[var(--beauty-muted)]"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-[var(--beauty-pink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
