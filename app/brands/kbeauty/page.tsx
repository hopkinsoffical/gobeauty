import type { Metadata } from "next";
import Link from "next/link";
import {
  KBEAUTY_BRANDS,
  KBEAUTY_STATS,
  KBEAUTY_TIER_LABEL,
  kbeautyByLetter,
  kbeautyGbSlug,
  kbeautyMarketplacePriority,
  type MarketplaceTier,
} from "@/data/kbeauty-brands";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "K-Beauty Brands A–Z — Korean skincare & makeup",
  description: `Browse ${KBEAUTY_STATS.total}+ Korean beauty brands on goBeauty — from COSRX and Beauty of Joseon to rising US-market favorites. Ingredient-decoded products and salon marketplace profiles.`,
  alternates: { canonical: "/brands/kbeauty" },
};

const TIER_BADGE: Record<MarketplaceTier, string> = {
  1: "bg-brand-500/15 text-brand-700",
  2: "bg-violet-500/10 text-violet-700",
  3: "bg-sky-500/10 text-sky-700",
};

export default function KBeautyBrandsPage() {
  const byLetter = kbeautyByLetter();
  const letters = Object.keys(byLetter).sort();
  const priority = kbeautyMarketplacePriority();

  return (
    <>
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] text-white">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-12 md:pb-14 md:pt-14">
          <nav className="text-[13px] text-white/55" aria-label="Breadcrumb">
            <Link href="/brands" className="hover:text-white">
              Brands
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white/85">K-Beauty A–Z</span>
          </nav>
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            Korean beauty catalog
          </p>
          <h1 className="mt-2 max-w-[640px] font-display text-[2rem] leading-[1.12] md:text-[2.75rem]">
            {KBEAUTY_STATS.total} K-beauty brands, A–Z
          </h1>
          <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/70">
            Full goBeauty K-beauty brand list for product intelligence and the
            salon marketplace.{" "}
            <strong className="font-semibold text-white/90">
              {KBEAUTY_STATS.marketplacePriority} US-priority brands
            </strong>{" "}
            are featured first for marketplace discovery.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/marketplace/suppliers"
              className="inline-flex h-11 items-center justify-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white transition hover:bg-brand-600"
            >
              Marketplace suppliers
            </Link>
            <Link
              href="/products?q=korean"
              className="inline-flex h-11 items-center justify-center rounded-pill border border-white/25 bg-white/5 px-6 text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              Shop K-beauty products
            </Link>
          </div>
        </div>
      </section>

      {/* Jump letters */}
      <div className="sticky top-0 z-20 border-b border-line-soft bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] flex-wrap gap-1 px-5 py-3">
          {letters.map((L) => (
            <a
              key={L}
              href={`#letter-${L}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold text-ink-soft transition hover:bg-brand-500/10 hover:text-brand-700"
            >
              {L}
            </a>
          ))}
        </div>
      </div>

      {/* Marketplace priority (top 30) */}
      <section className="border-b border-line-soft bg-surface-soft">
        <div className="mx-auto max-w-[1100px] px-5 py-10 md:py-12">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            US marketplace priority
          </h2>
          <p className="mt-1.5 max-w-[560px] text-[14px] text-ink-soft">
            Highest-traffic K-beauty brands for the US market — featured first
            on the goBeauty salon marketplace.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {([1, 2, 3] as MarketplaceTier[]).map((tier) => {
              const list = priority.filter((b) => b.marketplaceTier === tier);
              return (
                <div
                  key={tier}
                  className="rounded-2xl border border-line bg-white p-5 shadow-card"
                >
                  <p
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TIER_BADGE[tier]}`}
                  >
                    {KBEAUTY_TIER_LABEL[tier]}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {list.map((b) => (
                      <li key={b.slug}>
                        <Link
                          href={`/brands/${kbeautyGbSlug(b)}`}
                          className="text-[14px] font-semibold text-ink hover:text-brand-700"
                        >
                          {b.name}
                        </Link>
                        <span className="text-[12px] text-ink-muted">
                          {" "}
                          ·{" "}
                          <Link
                            href={`/marketplace/suppliers/${b.slug}`}
                            className="hover:text-brand-600"
                          >
                            marketplace
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full A–Z */}
      <section className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
        <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
          All brands
        </h2>
        <p className="mt-1 text-[14px] text-ink-soft">
          {KBEAUTY_BRANDS.length} brands in the goBeauty K-beauty catalog.
        </p>

        <div className="mt-8 space-y-10">
          {letters.map((L) => (
            <div key={L} id={`letter-${L}`} className="scroll-mt-24">
              <h3 className="flex items-baseline gap-3 border-b border-line pb-2 font-display text-2xl text-brand-600">
                {L}
                <span className="text-[13px] font-sans font-medium text-ink-muted">
                  {byLetter[L].length} brand{byLetter[L].length === 1 ? "" : "s"}
                </span>
              </h3>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {byLetter[L].map((b) => (
                  <li key={b.slug} className="flex items-center gap-2">
                    <Link
                      href={`/brands/${kbeautyGbSlug(b)}`}
                      className="text-[14.5px] font-semibold text-ink transition hover:text-brand-700"
                    >
                      {b.name}
                    </Link>
                    {b.marketplaceTier != null && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${TIER_BADGE[b.marketplaceTier]}`}
                        title={KBEAUTY_TIER_LABEL[b.marketplaceTier]}
                      >
                        T{b.marketplaceTier}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line-soft bg-surface-soft">
        <div className="mx-auto max-w-[640px] px-5 py-12 text-center">
          <h2 className="font-display text-[1.4rem] text-ink">
            Own a K-beauty brand?
          </h2>
          <p className="mt-2 text-[14px] text-ink-soft">
            Claim your profile, list products, and reach salon owners through
            goBeauty.
          </p>
          <Link
            href="/brands/list-your-products"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white transition hover:bg-brand-600"
          >
            List your products
          </Link>
        </div>
      </section>
    </>
  );
}
