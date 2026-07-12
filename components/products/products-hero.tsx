import Image from "next/image";
import Link from "next/link";
import ProductSearch from "@/components/products/product-search";
import ProductStats from "@/components/products/product-stats";
import { POPULAR_SEARCHES } from "@/data/products-landing";
import { buildProductsHref } from "@/lib/products-url";

export default function ProductsHero({
  initialQuery = "",
  activeFilters = [],
}: {
  initialQuery?: string;
  activeFilters?: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-pink-light)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(235,79,120,0.10),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-4 pb-24 pt-10 md:px-6 md:pb-28 md:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:px-8 lg:pb-32 lg:pt-16">
        <div className="relative z-10 max-w-xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--beauty-pink)]">
            Products
          </p>
          <h1 className="mt-3 font-display text-[40px] leading-[1.12] tracking-tight text-[var(--beauty-text)] sm:text-5xl lg:text-[52px]">
            Discover beauty products with{" "}
            <span className="text-[var(--beauty-pink)]">ingredient transparency.</span>
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--beauty-muted)] md:text-[17px]">
            Search products, explore safer ingredients, and make smarter beauty choices.
          </p>

          <div className="mt-7">
            <ProductSearch initialQuery={initialQuery} activeFilters={activeFilters} />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--beauty-muted)]">
              Popular searches
            </p>
            <ul className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <li key={s.query}>
                  <Link
                    href={buildProductsHref({ q: s.query, filters: activeFilters })}
                    className="inline-flex min-h-10 items-center rounded-full border border-[var(--beauty-border)] bg-white/80 px-3.5 py-1.5 text-[13.5px] font-semibold text-[var(--beauty-text)] transition hover:border-brand-300 hover:bg-white hover:text-brand-700"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[12/7] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFF8F9] to-[#FFF0F4] shadow-card sm:aspect-[5/3] lg:min-h-[420px] lg:aspect-auto lg:h-[520px]">
            <Image
              src="/images/products/products-hero.webp"
              alt="Premium skincare products on a soft stone platform with botanical accents"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px"
              className="object-cover object-right sm:object-[70%_center] lg:object-[72%_45%]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-14 max-w-[1440px] px-4 md:-mt-16 md:px-6 lg:px-8">
        <ProductStats />
      </div>
    </section>
  );
}
