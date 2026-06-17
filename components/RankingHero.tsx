import Link from "next/link";

interface RankingHeroProps {
  city: string;
  state: string;
  /** "May 2026" */
  updatedLabel: string;
  salonsAnalyzed: number;
  reviewsScanned: number;
}

export default function RankingHero({
  city,
  state,
  updatedLabel,
  salonsAnalyzed,
  reviewsScanned,
}: RankingHeroProps) {
  return (
    <section
      aria-labelledby="rank-hero-h1"
      className="relative overflow-hidden"
    >
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-brand-50 via-brand-50/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-12%] -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-brand-200/50 to-amber-100/30 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:pt-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted"
        >
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden className="opacity-50">
            /
          </span>
          <Link href="/best-nail-salons" className="hover:text-ink">
            Best Nail Salons
          </Link>
          <span aria-hidden className="opacity-50">
            /
          </span>
          <span className="text-ink">
            {city}, {state}
          </span>
        </nav>

        <span className="mb-5 inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-brand-700 shadow-sm ring-1 ring-brand-100">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Updated {updatedLabel} · Top 10
        </span>

        <h1
          id="rank-hero-h1"
          className="font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl"
        >
          Best Nail Salons
          <br className="hidden sm:block" /> in {city}, {state}
        </h1>

        <p className="mt-5 max-w-2xl text-[17px] text-ink-soft md:text-[18.5px]">
          Ranked by Google visibility, customer reviews, rating quality, and
          AI Growth Score.
        </p>
        <p className="mt-2 max-w-2xl text-[14.5px] text-ink-muted md:text-[15px]">
          We analyzed local salons based on Google ranking signals, review
          volume, review quality, and online booking readiness.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="#top-salons"
            className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 text-[15px] font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-ink-soft"
          >
            View Top Salons
            <span aria-hidden>↓</span>
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-pill border border-brand-300 bg-white px-6 py-3 text-[15px] font-semibold text-brand-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500"
          >
            <span aria-hidden>📸</span>
            Analyze a beauty photo
          </Link>
          <Link
            href="#owner-cta"
            className="inline-flex items-center gap-2 rounded-pill border border-line bg-white px-6 py-3 text-[15px] font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-ink"
          >
            Get My Free Salon Report
          </Link>
        </div>

        <dl className="mt-9 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line-soft pt-7 sm:grid-cols-4">
          <Stat label="Salons analyzed" value={salonsAnalyzed.toString()} />
          <Stat
            label="Reviews scanned"
            value={`${reviewsScanned.toLocaleString()}+`}
          />
          <Stat label="Ranking signals" value="6" />
          <Stat label="Refresh" value="Monthly" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="order-2 mt-1 text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted">
        {label}
      </dt>
      <dd className="order-1 font-display text-2xl leading-none text-ink">
        {value}
      </dd>
    </div>
  );
}
