import Link from "next/link";
import type { ProductCard } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";

export default function BrandProductCard({
  p,
  rank,
  rankLabel,
}: {
  p: ProductCard;
  rank?: number;
  rankLabel?: string;
}) {
  const img = p.images[0]?.url;
  const badges = Object.entries(p.badges || {})
    .filter(([, v]) => v)
    .slice(0, 2)
    .map(([k]) => BADGE_LABELS[k] ?? k);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--beauty-border)] bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none">
      {rank != null && (
        <span className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white shadow-md">
          #{rank}
        </span>
      )}
      <Link
        href={`/products/${p.slug}`}
        className="relative block aspect-[4/5] bg-[var(--beauty-blush)]"
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={p.images[0]?.alt || p.name}
            className="h-full w-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
            🧴
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {rankLabel && (
          <p className="text-[10.5px] font-bold uppercase tracking-wide text-brand-600">
            {rankLabel}
          </p>
        )}
        {p.category && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--beauty-muted)]">
            {p.category}
          </p>
        )}
        <h3 className="font-display text-[16px] leading-snug text-[var(--beauty-text)] group-hover:text-[var(--beauty-pink-dark)]">
          <Link href={`/products/${p.slug}`}>{p.name}</Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[13px] text-[var(--beauty-muted)]">
          {p.ratingAvg != null && (
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--beauty-text)]">
              <span className="text-amber-400" aria-hidden>
                ★
              </span>
              {p.ratingAvg.toFixed(1)}
            </span>
          )}
          {p.ratingCount > 0 && (
            <span title="Community reviews — popularity signal">
              {p.ratingCount.toLocaleString()} reviews
            </span>
          )}
        </div>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700 ring-1 ring-emerald-100"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
