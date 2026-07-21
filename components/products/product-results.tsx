import Link from "next/link";
import ProductCard from "@/components/products/product-card";
import type { ProductCard as ApiProduct } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";
import { FILTERS } from "@/data/products-landing";
import { buildProductsHref, toggleFilter } from "@/lib/products-url";

export default function ProductResults({
  q,
  category,
  activeFilters,
  products,
  sort = "relevance",
  isDiscovery = false,
}: {
  q: string;
  category: string;
  activeFilters: string[];
  products: ApiProduct[];
  sort?: string;
  isDiscovery?: boolean;
}) {
  const categoryLabel = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const title = q
    ? `Results for “${q}”`
    : category
      ? `${categoryLabel}`
      : isDiscovery
        ? "Top products"
        : "All products";

  return (
    <section
      className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-8"
      aria-labelledby="results-heading"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="results-heading" className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]">
            {title}
          </h2>
          <p className="mt-1 text-[14px] text-[var(--beauty-muted)]">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <form action="/products" method="get" className="flex items-center gap-2">
          {q && <input type="hidden" name="q" value={q} />}
          {category && <input type="hidden" name="category" value={category} />}
          {activeFilters.length > 0 && (
            <>
              <input type="hidden" name="filters" value={activeFilters.map((k) => k.replace(/_/g, "-")).join(",")} />
              <input type="hidden" name="badge" value={activeFilters.join(",")} />
            </>
          )}
          <label htmlFor="sort" className="text-[13px] font-semibold text-[var(--beauty-muted)]">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="h-11 rounded-full border border-[var(--beauty-border)] bg-white px-4 text-[13.5px] font-semibold text-[var(--beauty-text)] outline-none focus:border-brand-300"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Top rated</option>
            <option value="name">Name A–Z</option>
          </select>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-full border border-[var(--beauty-border)] bg-white px-4 text-[13px] font-semibold text-[var(--beauty-text)] transition hover:border-brand-300"
          >
            Apply
          </button>
        </form>
      </div>

      {activeFilters.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">
          {activeFilters.map((key) => {
            const label =
              FILTERS.find((f) => f.key === key)?.label ?? BADGE_LABELS[key] ?? key;
            return (
              <li key={key}>
                <Link
                  href={buildProductsHref({
                    q,
                    category: category || undefined,
                    filters: toggleFilter(activeFilters, key),
                    sort,
                  })}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--beauty-pink-light)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--beauty-pink-dark)]"
                >
                  {label}
                  <span aria-hidden>×</span>
                  <span className="sr-only">Remove {label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={buildProductsHref({ q, category: category || undefined })}
              className="inline-flex min-h-10 items-center rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-[var(--beauty-muted)] underline-offset-2 hover:underline"
            >
              Clear all
            </Link>
          </li>
        </ul>
      )}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--beauty-border)] bg-[var(--beauty-blush)] px-6 py-14 text-center">
          <p className="font-display text-xl text-[var(--beauty-text)]">No products found</p>
          <p className="mx-auto mt-2 max-w-md text-[14.5px] text-[var(--beauty-muted)]">
            Try a different search or remove a filter. You can also browse by category.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--beauty-pink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
          >
            Back to discovery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} mode="api" product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
