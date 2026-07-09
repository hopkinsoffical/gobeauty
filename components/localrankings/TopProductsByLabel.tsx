"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CategoryRef, ProductCard } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";

function ProductTile({ p }: { p: ProductCard }) {
  const img = p.images?.[0]?.url;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-ink-faint">
            No image
          </div>
        )}
      </div>
      <p className="mt-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
        {p.brand}
      </p>
      <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold leading-snug text-ink group-hover:text-brand-600">
        {p.name}
      </h3>
      <div className="mt-auto flex items-center gap-1.5 pt-2 text-[13px]">
        {p.ratingAvg !== null && (
          <>
            <span className="text-amber-500" aria-hidden>
              ★
            </span>
            <span className="font-semibold text-ink">
              {p.ratingAvg.toFixed(1)}
            </span>
            <span className="text-ink-muted">({p.ratingCount})</span>
          </>
        )}
        {p.category && (
          <span className="ml-auto truncate text-[12px] text-ink-muted">
            {p.category}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function TopProductsByLabel({
  initialProducts,
  categories,
}: {
  initialProducts: ProductCard[];
  categories: CategoryRef[];
}) {
  const [badge, setBadge] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<ProductCard[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqSeq = useRef(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      // initial list is server-rendered; only refetch on chip changes
      isFirst.current = false;
      return;
    }
    const seq = ++reqSeq.current;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (badge) params.set("badge", badge);
    if (category) params.set("category", category);
    fetch(`/api/top-products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { products: ProductCard[] }) => {
        if (seq === reqSeq.current) setProducts(data.products);
      })
      .catch(() => {
        if (seq === reqSeq.current)
          setError("Couldn't load products — please try again.");
      })
      .finally(() => {
        if (seq === reqSeq.current) setLoading(false);
      });
  }, [badge, category]);

  return (
    <section className="mx-auto max-w-[1000px] px-5 pb-14 pt-10" id="top-products">
      <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.9rem]">
        Top-rated products to match
      </h2>
      <p className="mt-1.5 max-w-[560px] text-[14.5px] text-ink-soft">
        The highest-rated products in our catalog — filter by category or any
        label that matters to you.
      </p>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="w-16 flex-none text-[12.5px] font-semibold uppercase tracking-wide text-ink-muted">
            Category
          </span>
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition ${
              category === ""
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(category === c.slug ? "" : c.slug)}
              className={`rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition ${
                category === c.slug
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Label (badge) chips */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="w-16 flex-none text-[12.5px] font-semibold uppercase tracking-wide text-ink-muted">
          Label
        </span>
        <button
          type="button"
          onClick={() => setBadge("")}
          className={`rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition ${
            badge === ""
              ? "bg-ink text-white"
              : "border border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          Any
        </button>
        {Object.entries(BADGE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setBadge(badge === key ? "" : key)}
            className={`rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition ${
              badge === key
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-[13.5px] font-medium text-rose-700">
          {error}
        </p>
      )}

      <div
        className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading
          ? Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-surface-soft"
              />
            ))
          : products.map((p) => <ProductTile key={p.slug} p={p} />)}
      </div>

      {!loading && products.length === 0 && !error && (
        <p className="mt-4 rounded-xl bg-surface-soft px-4 py-4 text-[14px] text-ink-soft">
          No products match that combination yet — try removing a filter.
        </p>
      )}
    </section>
  );
}
