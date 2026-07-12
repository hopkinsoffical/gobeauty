import Link from "next/link";

/** Homepage marketplace entry — light B2B module (marketplace doc §3). */
export default function HomeMarketplaceModule() {
  return (
    <section className="border-y border-line-soft bg-white py-12 md:py-16" id="salon-products">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
            For salons, spas &amp; beauty professionals
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink md:text-[2.25rem]">
            Find products your business can use and sell
          </h2>
          <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
            Discover products for treatments, client aftercare, and your retail
            shelf. Explore new brands, request product information, and connect
            with suppliers.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/marketplace"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600"
            >
              Explore Salon Products
            </Link>
            <Link
              href="/brands/list-your-products"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white px-7 text-[15px] font-semibold text-ink transition hover:bg-surface-tint"
            >
              List Your Products
            </Link>
          </div>
        </div>

        {/* Premium product arrangement visual */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Treatment room", tone: "from-brand-100 to-brand-50", emoji: "✦" },
              { label: "Aftercare", tone: "from-violet-100 to-brand-50", emoji: "◎" },
              { label: "Retail shelf", tone: "from-rose-100 to-orange-50", emoji: "◇" },
              { label: "Sample kits", tone: "from-sky-100 to-violet-50", emoji: "○" },
            ].map((c, i) => (
              <div
                key={c.label}
                className={[
                  "rounded-2xl border border-line-soft bg-gradient-to-br p-5 shadow-card",
                  c.tone,
                  i % 2 === 1 ? "mt-4" : "",
                ].join(" ")}
              >
                <span className="text-[22px] text-brand-600/70" aria-hidden>
                  {c.emoji}
                </span>
                <p className="mt-3 text-[14px] font-bold text-ink">{c.label}</p>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  Professional products for salon use
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
