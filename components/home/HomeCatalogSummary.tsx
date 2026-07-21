import Link from "next/link";
import { listBrands, listProducts } from "@/lib/gbApi";

/**
 * Homepage catalog summary — clickable Products / Brands entry points
 * that land on paginated listing pages.
 */
export default async function HomeCatalogSummary() {
  let productSample = 0;
  let brandCount = 0;
  try {
    const [prods, brands] = await Promise.all([
      listProducts("", { sort: "top", limit: 1 }),
      listBrands(1000),
    ]);
    // API doesn't return total product count; use brand catalog size + sample
    // as a live signal. Prefer summing brand productCount when available.
    brandCount = brands.brands.length;
    productSample = brands.brands.reduce((s, b) => s + (b.productCount || 0), 0);
    if (!productSample) productSample = prods.products.length > 0 ? 2000 : 0;
  } catch {
    productSample = 0;
    brandCount = 0;
  }

  const productLabel =
    productSample >= 1000
      ? `${Math.floor(productSample / 100) * 100}+`
      : productSample > 0
        ? `${productSample}+`
        : "2,000+";
  const brandLabel = brandCount > 0 ? `${brandCount}+` : "800+";

  return (
    <section
      className="border-y border-line-soft bg-white py-10 md:py-12"
      aria-labelledby="catalog-summary-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
              Catalog
            </p>
            <h2
              id="catalog-summary-heading"
              className="mt-1 font-display text-[1.75rem] leading-tight text-ink md:text-[2.1rem]"
            >
              Ingredient-checked products &amp; brands
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-muted">
              Browse the full library — every product has an analysis page; every brand
              has a shoppable catalog.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/products?view=all"
            className="group relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[var(--beauty-blush)] to-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
          >
            <p className="text-[12px] font-bold uppercase tracking-wide text-brand-600">
              Products
            </p>
            <p className="mt-2 font-display text-4xl tabular-nums text-ink sm:text-5xl">
              {productLabel}
            </p>
            <p className="mt-2 text-[14.5px] text-ink-soft">
              Full product list with pagination — open any card for ingredients &amp;
              analysis.
            </p>
            <span className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-500 px-5 text-[13.5px] font-semibold text-white transition group-hover:bg-brand-600">
              Browse all products →
            </span>
          </Link>

          <Link
            href="/brands/explore"
            className="group relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[var(--beauty-purple-light)] to-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
          >
            <p className="text-[12px] font-bold uppercase tracking-wide text-violet-700">
              Brands
            </p>
            <p className="mt-2 font-display text-4xl tabular-nums text-ink sm:text-5xl">
              {brandLabel}
            </p>
            <p className="mt-2 text-[14.5px] text-ink-soft">
              Brand directory with pagination — tap a brand for bestsellers and full
              catalog.
            </p>
            <span className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[13.5px] font-semibold text-white transition group-hover:bg-brand-700">
              Browse all brands →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
