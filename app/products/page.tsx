import type { Metadata } from "next";
import Link from "next/link";
import { BADGE_LABELS, listCategories, listProducts } from "@/lib/gbApi";
import type { CategoryNode, CategoryRef } from "@/lib/gbApi";
import { ProductCardTile } from "@/components/gb/ProductBits";
import { CategoryChip } from "@/components/gb/CategoryBits";

export const metadata: Metadata = {
  title: "Products — ingredient-checked skincare & makeup",
  description:
    "Browse skincare and makeup by category with full ingredient transparency: INCI breakdowns, benefit and concern analysis, and side-by-side comparisons.",
};

export const revalidate = 300;

function filterHref(q: string, category: string, active: string[], key: string) {
  const next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (next.length) params.set("badge", next.join(","));
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

/** Chips for one root: level-1 groups always, deeper levels when they have products. */
function rootChips(root: CategoryNode): CategoryRef[] {
  const chips: CategoryRef[] = [];
  const walk = (n: CategoryNode, depth: number) => {
    if (depth > 0 && (depth === 1 || n.productCount > 0)) {
      chips.push({ slug: n.slug, name: n.name, productCount: n.productCount });
    }
    n.children.forEach((ch) => walk(ch, depth + 1));
  };
  walk(root, 0);
  return chips;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; badge?: string; category?: string };
}) {
  const q = searchParams.q ?? "";
  const category = searchParams.category ?? "";
  const active = (searchParams.badge ?? "").split(",").filter((k) => k in BADGE_LABELS);
  const [{ products }, cats] = await Promise.all([
    listProducts(q, { badge: active.join(","), category }),
    listCategories().catch(() => ({ categories: [] as CategoryNode[] })),
  ]);
  const browsing = !q && !category && active.length === 0;
  const categoryName = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <p className="mt-1 text-ink-soft">
          Every product decoded: full INCI list, what each ingredient does, and what to watch for.
        </p>
        <form className="mt-4" action="/products">
          {active.length > 0 && <input type="hidden" name="badge" value={active.join(",")} />}
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products or brands…"
            className="w-full max-w-md rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {category && (
            <Link
              href={`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white"
            >
              in {categoryName} ✕
            </Link>
          )}
          {Object.entries(BADGE_LABELS).map(([key, label]) => {
            const on = active.includes(key);
            return (
              <Link
                key={key}
                href={filterHref(q, category, active, key)}
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

      {browsing && cats.categories.length > 0 && (
        <section className="mb-10" aria-label="Browse by category">
          <div className="grid gap-4 md:grid-cols-2">
            {cats.categories.map((root) => (
              <div key={root.slug} className="rounded-2xl border border-line bg-surface-soft p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-xl text-ink">
                    <Link href={`/products/${root.slug}`} className="hover:text-brand-700">
                      {root.name}
                    </Link>
                  </h2>
                  <span className="text-xs tabular-nums text-ink-muted">
                    {root.productCount} products
                  </span>
                </div>
                {root.description && (
                  <p className="mt-1 text-sm text-ink-muted">{root.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {rootChips(root).map((c) => (
                    <CategoryChip key={c.slug} c={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {products.length === 0 ? (
        <p className="text-ink-muted">
          No products found{q ? ` for “${q}”` : ""}
          {(active.length > 0 || category) && " with those filters"}.
        </p>
      ) : (
        <>
          {browsing && <h2 className="mb-4 font-display text-xl text-ink">All products</h2>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCardTile key={p.slug} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
