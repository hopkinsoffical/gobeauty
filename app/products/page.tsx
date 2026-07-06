import type { Metadata } from "next";
import { listProducts } from "@/lib/gbApi";
import { ProductCardTile } from "@/components/gb/ProductBits";

export const metadata: Metadata = {
  title: "Products — ingredient-checked beauty",
  description:
    "Shop beauty products with full ingredient transparency: INCI breakdowns, benefit and concern analysis, and side-by-side comparisons.",
};

export const revalidate = 300;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const { products } = await listProducts(q);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <p className="mt-1 text-ink-soft">
          Every product decoded: full INCI list, what each ingredient does, and what to watch for.
        </p>
        <form className="mt-4" action="/products">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products or brands…"
            className="w-full max-w-md rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </form>
      </header>

      {products.length === 0 ? (
        <p className="text-ink-muted">No products found{q ? ` for “${q}”` : ""}.</p>
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
