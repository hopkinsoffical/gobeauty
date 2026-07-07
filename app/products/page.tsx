import type { Metadata } from "next";
import Link from "next/link";
import { BADGE_LABELS, listProducts } from "@/lib/gbApi";
import { ProductCardTile } from "@/components/gb/ProductBits";

export const metadata: Metadata = {
  title: "Products — ingredient-checked beauty",
  description:
    "Shop beauty products with full ingredient transparency: INCI breakdowns, benefit and concern analysis, and side-by-side comparisons.",
};

export const revalidate = 300;

function filterHref(q: string, active: string[], key: string) {
  const next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (next.length) params.set("badge", next.join(","));
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; badge?: string };
}) {
  const q = searchParams.q ?? "";
  const active = (searchParams.badge ?? "").split(",").filter((k) => k in BADGE_LABELS);
  const { products } = await listProducts(q, { badge: active.join(",") });

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <p className="mt-1 text-ink-soft">
          Every product decoded: full INCI list, what each ingredient does, and what to watch for.
        </p>
        <form className="mt-4" action="/products">
          {active.length > 0 && <input type="hidden" name="badge" value={active.join(",")} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products or brands…"
            className="w-full max-w-md rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(BADGE_LABELS).map(([key, label]) => {
            const on = active.includes(key);
            return (
              <Link
                key={key}
                href={filterHref(q, active, key)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                  on
                    ? "bg-brand-600 text-white ring-brand-600"
                    : "bg-white text-ink-soft ring-line hover:ring-brand-300"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      {products.length === 0 ? (
        <p className="text-ink-muted">
          No products found{q ? ` for “${q}”` : ""}
          {active.length > 0 && " with those filters"}.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCardTile key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
