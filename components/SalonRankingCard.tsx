import Image from "next/image";
import Link from "next/link";
import type { Salon, SalonBadge, GoogleVisibility } from "@/lib/types";

const BADGE_STYLES: Record<SalonBadge, string> = {
  "Top Rated": "bg-amber-100 text-amber-800",
  "Fast Growing": "bg-emerald-100 text-emerald-800",
  "Review Leader": "bg-sky-100 text-sky-800",
  "Hidden Gem": "bg-violet-100 text-violet-800",
  "Needs More Reviews": "bg-rose-100 text-rose-800",
};

const VISIBILITY_DOT: Record<GoogleVisibility, string> = {
  High: "bg-emerald-500",
  Medium: "bg-amber-500",
  Low: "bg-rose-500",
};

function PriceLevel({ level }: { level?: 1 | 2 | 3 }) {
  if (!level) return null;
  return (
    <span className="text-ink-muted" aria-label={`Price level ${level} of 3`}>
      <span className="text-ink">{"$".repeat(level)}</span>
      <span className="opacity-30">{"$".repeat(3 - level)}</span>
    </span>
  );
}

export default function SalonRankingCard({ salon }: { salon: Salon }) {
  const isTop = salon.rank === 1;
  return (
    <article
      data-rank={salon.rank}
      className={`group relative grid grid-cols-[110px_1fr] gap-4 rounded-2xl border bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover sm:grid-cols-[200px_1fr] sm:gap-5 sm:p-5 ${
        isTop ? "border-amber-200" : "border-line"
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft sm:aspect-[4/3]">
        <Image
          src={salon.image}
          alt={`${salon.name} interior`}
          fill
          sizes="(min-width: 640px) 200px, 110px"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        {/* Rank badge */}
        <div
          className={`absolute left-2 top-2 inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-pill px-2 font-display text-[15px] leading-none shadow-sm ${
            isTop
              ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white"
              : "bg-white text-ink"
          }`}
          aria-label={`Ranked #${salon.rank}`}
        >
          #{salon.rank}
        </div>
        {/* Heart save */}
        <button
          type="button"
          aria-label={`Save ${salon.name}`}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink-soft shadow-sm transition hover:text-brand-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-[17px] font-bold leading-tight text-ink sm:text-[19px]">
            <Link
              href={`/salon/${salon.slug}`}
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_1.5px]"
            >
              {salon.name}
            </Link>
          </h3>
          <span
            className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11.5px] font-bold tracking-wide ${BADGE_STYLES[salon.badge]}`}
          >
            {salon.badge}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
            <span className="text-amber-500" aria-hidden>
              ★
            </span>
            {salon.rating.toFixed(1)}
          </span>
          <span className="text-ink-muted">
            ({salon.reviewCount.toLocaleString()} reviews)
          </span>
          <PriceLevel level={salon.priceLevel} />
          <span className="opacity-30" aria-hidden>
            ·
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
              salon.openNow ? "text-emerald-700" : "text-ink-muted"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                salon.openNow ? "bg-emerald-500" : "bg-ink-faint"
              }`}
              aria-hidden
            />
            {salon.openNow ? "Open now" : "Closed"}
          </span>
        </div>

        <p className="text-[13.5px] text-ink-muted">
          {salon.address} · {salon.city}
        </p>

        {salon.tagline && (
          <p className="line-clamp-2 text-[14px] leading-snug text-ink-soft">
            {salon.tagline}
          </p>
        )}

        {/* Score chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface-soft px-2.5 py-1 text-[12px] font-semibold text-ink">
            <span
              className={`h-1.5 w-1.5 rounded-full ${VISIBILITY_DOT[salon.googleVisibility]}`}
              aria-hidden
            />
            <span className="font-medium text-ink-muted">Visibility</span>
            {salon.googleVisibility}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 px-2.5 py-1 text-[12px] font-semibold text-amber-900">
            <span className="font-medium text-amber-700">AI Growth</span>
            {salon.aiGrowthScore}
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-1 flex flex-wrap gap-2">
          <Link
            href={`/salon/${salon.slug}/report`}
            className="rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-ink-soft"
          >
            View Report
          </Link>
          <Link
            href="#owner-cta"
            className="rounded-pill border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
          >
            Claim This Salon
          </Link>
        </div>
      </div>
    </article>
  );
}
