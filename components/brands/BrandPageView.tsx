import Link from "next/link";
import type { BrandDetail, BrandListing, ProductCard } from "@/lib/gbApi";
import {
  bestSellers,
  brandIntro,
  brandStats,
  topRated,
} from "@/lib/brand-page";
import BrandProductCard from "@/components/brands/BrandProductCard";
import BrandProductCatalog from "@/components/brands/BrandProductCatalog";

function Stat({
  value,
  label,
  sub,
  href,
}: {
  value: string;
  label: string;
  sub?: string;
  /** When set, the whole stat card is a link (e.g. product count → product list). */
  href?: string;
}) {
  const inner = (
    <>
      <p className="font-display text-2xl tabular-nums text-ink sm:text-[28px]">
        {value}
        {href && (
          <span className="ml-1 text-[14px] font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
            →
          </span>
        )}
      </p>
      <p className="mt-0.5 text-[12.5px] font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      {sub && <p className="mt-0.5 text-[11.5px] text-ink-faint">{sub}</p>}
    </>
  );

  const className =
    "rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card sm:px-5" +
    (href
      ? " group block transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      : "");

  if (href) {
    return (
      <a href={href} className={className} aria-label={`View ${label.toLowerCase()}: ${value}`}>
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}

function ProductRail({
  id,
  title,
  subtitle,
  products,
  rankLabel,
}: {
  id: string;
  title: string;
  subtitle: string;
  products: ProductCard[];
  rankLabel?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl text-ink md:text-[28px]">{title}</h2>
          <p className="mt-1 text-[14px] text-ink-muted">{subtitle}</p>
        </div>
        <a
          href="#all-products"
          className="text-[13.5px] font-semibold text-brand-700 hover:underline"
        >
          View all →
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p, i) => (
          <BrandProductCard
            key={p.slug}
            p={p}
            rank={i + 1}
            rankLabel={rankLabel}
          />
        ))}
      </div>
    </section>
  );
}

export default function BrandPageView({
  brand,
  related,
}: {
  brand: BrandDetail;
  related: BrandListing[];
}) {
  const stats = brandStats(brand.products);
  const intro = brandIntro(brand, stats);
  const popular = topRated(brand.products, 8);
  const sellers = bestSellers(brand.products, 8);
  const heroImg =
    brand.products.find((p) => p.images[0]?.url)?.images[0]?.url ?? null;
  const siteHost = brand.website
    ? brand.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <div className="bg-[var(--beauty-white)] text-[var(--beauty-text)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-pink-light)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(235,79,120,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1200px] px-4 pb-10 pt-8 md:px-6 md:pb-12 md:pt-10 lg:px-8">
          <nav className="mb-6 text-[13px] text-ink-muted">
            <Link href="/products" className="hover:text-brand-700">
              Products
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/brands/kbeauty" className="hover:text-brand-700">
              Brands
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{brand.name}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
            <div>
              <div className="flex flex-wrap items-start gap-4">
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="h-16 w-16 rounded-2xl border border-line bg-white object-contain p-1.5 shadow-card sm:h-20 sm:w-20"
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-white font-display text-2xl text-brand-600 shadow-card sm:h-20 sm:w-20"
                    aria-hidden
                  >
                    {brand.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
                    Brand
                    {brand.country ? ` · ${brand.country}` : ""}
                  </p>
                  <h1 className="mt-1 font-display text-[36px] leading-tight tracking-tight text-ink sm:text-5xl">
                    {brand.name}
                  </h1>
                  {siteHost && brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-2 inline-flex text-[14px] font-semibold text-brand-700 hover:underline"
                    >
                      {siteHost} ↗
                    </a>
                  )}
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
                {intro}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#bestsellers"
                  className="inline-flex min-h-11 items-center rounded-full bg-brand-500 px-5 text-[13.5px] font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.28)] hover:bg-brand-600"
                >
                  Bestsellers
                </a>
                <a
                  href="#popular"
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-[13.5px] font-semibold text-ink hover:border-brand-300"
                >
                  Top rated
                </a>
                <a
                  href="#all-products"
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-[13.5px] font-semibold text-ink hover:border-brand-300"
                >
                  All products
                </a>
              </div>
            </div>

            {heroImg && (
              <div className="relative mx-auto hidden h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white shadow-card lg:flex xl:h-48 xl:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImg}
                  alt={`${brand.name} product`}
                  className="max-h-32 max-w-32 object-contain xl:max-h-36 xl:max-w-36"
                />
              </div>
            )}
          </div>

          {/* Stats — product count links to full catalog on this page */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              value={String(stats.productCount)}
              label="Products"
              sub={stats.productCount > 0 ? "Tap to view all →" : "Ingredient-checked"}
              href={stats.productCount > 0 ? "#all-products" : undefined}
            />
            <Stat
              value={stats.avgRating != null ? stats.avgRating.toFixed(1) : "—"}
              label="Avg rating"
              sub={stats.avgRating != null ? "Community ★" : "Not enough ratings"}
            />
            <Stat
              value={
                stats.totalReviews >= 1000
                  ? `${(stats.totalReviews / 1000).toFixed(1)}k`
                  : stats.totalReviews.toLocaleString()
              }
              label="Reviews"
              sub="Popularity / sales signal"
            />
            <Stat
              value={String(stats.categories.length)}
              label="Categories"
              sub={stats.categories[0]?.name ?? "—"}
              href={stats.categories.length > 0 ? "#all-products" : undefined}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] space-y-14 px-4 py-10 md:px-6 md:py-14 lg:px-8">
        {/* About + category breakdown */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-ink sm:text-2xl">About {brand.name}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{intro}</p>
            <ul className="mt-5 grid gap-2 text-[13.5px] text-ink-muted sm:grid-cols-2">
              <li className="rounded-xl bg-surface-soft px-3 py-2">
                Full INCI lists decoded
              </li>
              <li className="rounded-xl bg-surface-soft px-3 py-2">
                Free-from badges analyzed
              </li>
              <li className="rounded-xl bg-surface-soft px-3 py-2">
                Community ratings aggregated
              </li>
              <li className="rounded-xl bg-surface-soft px-3 py-2">
                Compare formulas side-by-side
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-ink sm:text-2xl">Shop by category</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              How this brand&apos;s catalog breaks down.
            </p>
            {stats.categories.length === 0 ? (
              <p className="mt-4 text-ink-muted">No categories yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {stats.categories.slice(0, 8).map((c) => {
                  const pct = Math.round((c.count / Math.max(1, stats.productCount)) * 100);
                  return (
                    <li key={c.name}>
                      <a
                        href={`#all-products`}
                        className="group block rounded-xl border border-line-soft px-3 py-2.5 transition hover:border-brand-300 hover:bg-[var(--beauty-blush)]"
                      >
                        <div className="flex items-center justify-between gap-2 text-[13.5px]">
                          <span className="font-semibold text-ink group-hover:text-brand-700">
                            {c.name}
                          </span>
                          <span className="tabular-nums text-ink-muted">
                            {c.count} · {pct}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-soft">
                          <div
                            className="h-full rounded-full bg-brand-400/80"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <ProductRail
          id="bestsellers"
          title="Bestsellers"
          subtitle="Most reviewed products — community popularity as a sales / demand signal (not first-party checkout volume)."
          products={sellers}
          rankLabel="Best seller"
        />

        <ProductRail
          id="popular"
          title="Top rated"
          subtitle="Highest Bayesian rating among products with enough reviews."
          products={popular}
          rankLabel="Top rated"
        />

        <BrandProductCatalog
          products={brand.products}
          categories={stats.categories}
          brandName={brand.name}
        />

        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink md:text-[28px]">
              More brands to explore
            </h2>
            <p className="mt-1 text-[14px] text-ink-muted">
              Other ingredient-checked brands on goBeauty.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/brands/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
                >
                  <div className="flex h-24 items-center justify-center bg-[var(--beauty-blush)] p-3 sm:h-28">
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.image}
                        alt=""
                        className="max-h-16 max-w-16 object-contain sm:max-h-[4.5rem] sm:max-w-[4.5rem]"
                      />
                    ) : (
                      <span className="font-display text-xl text-brand-600">
                        {r.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <p className="truncate text-[13.5px] font-bold text-ink group-hover:text-brand-700">
                      {r.name}
                    </p>
                    <p className="text-[11.5px] text-ink-muted">
                      {r.productCount} products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-center text-[12.5px] text-ink-faint">
          Ratings and review counts are community signals used as popularity /
          demand proxies. They are not verified retail sales figures.
        </p>
      </div>
    </div>
  );
}
