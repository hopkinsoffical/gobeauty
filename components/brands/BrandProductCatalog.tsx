"use client";

import { useMemo, useState } from "react";
import type { ProductCard } from "@/lib/gbApi";
import BrandProductCard from "@/components/brands/BrandProductCard";
import { sortProducts, type BrandSortKey } from "@/lib/brand-page";

export default function BrandProductCatalog({
  products,
  categories,
  brandName,
}: {
  products: ProductCard[];
  categories: { name: string; count: number }[];
  brandName: string;
}) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<BrandSortKey>("popular");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") {
      list = list.filter((p) => (p.category || "Other") === category);
    }
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          (p.category || "").toLowerCase().includes(needle),
      );
    }
    return sortProducts(list, sort);
  }, [products, category, sort, q]);

  return (
    <section id="all-products" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink md:text-[28px]">
            All {brandName} products
          </h2>
          <p className="mt-1 text-[14px] text-ink-muted">
            {filtered.length} of {products.length} product
            {products.length === 1 ? "" : "s"}
            {category !== "all" ? ` in ${category}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="brand-product-search">
            Search products
          </label>
          <input
            id="brand-product-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full min-w-[180px] rounded-full border border-line bg-white px-4 text-[13.5px] text-ink outline-none focus:border-brand-300 sm:w-52"
          />
          <label className="sr-only" htmlFor="brand-sort">
            Sort
          </label>
          <select
            id="brand-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as BrandSortKey)}
            className="h-11 rounded-full border border-line bg-white px-4 text-[13.5px] font-semibold text-ink outline-none focus:border-brand-300"
          >
            <option value="popular">Most reviewed</option>
            <option value="rating">Top rated</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {categories.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            role="tab"
            aria-selected={category === "all"}
            onClick={() => setCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
              category === "all"
                ? "bg-brand-500 text-white"
                : "border border-line bg-white text-ink-soft hover:border-brand-300"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={category === c.name}
              onClick={() => setCategory(c.name)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                category === c.name
                  ? "bg-brand-500 text-white"
                  : "border border-line bg-white text-ink-soft hover:border-brand-300"
              }`}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface-soft px-6 py-12 text-center">
          <p className="font-display text-xl text-ink">No products match</p>
          <p className="mt-1 text-[14px] text-ink-muted">Try another category or clear search.</p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQ("");
            }}
            className="mt-4 inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-[13px] font-semibold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <BrandProductCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
