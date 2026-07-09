import Link from "next/link";
import type { CategoryProduct, CategoryRef } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";
import { BadgeChips } from "@/components/gb/ProductBits";

export function Stars({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-block leading-none" aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="text-line" aria-hidden>
        ★★★★★
      </span>
      <span
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-amber-400"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        ★★★★★
      </span>
    </span>
  );
}

export function fmtUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function RankedProductRow({ p, rank }: { p: CategoryProduct; rank: number }) {
  const meta = [
    p.brandCountry,
    `${p.ingredientCount} ingredients`,
    p.priceCents != null ? `from ${fmtUsd(p.priceCents)}` : null,
  ].filter(Boolean);
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-cardHover sm:gap-5 sm:p-5"
    >
      <div className="relative hidden h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-surface-soft sm:flex">
        {p.images[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0].url}
            alt={p.images[0].alt ?? p.name}
            className="max-h-full rounded-xl object-contain"
          />
        ) : (
          <span className="text-3xl" aria-hidden>
            🧴
          </span>
        )}
        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-card">
          {rank}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-brand-600 sm:hidden">#{rank}</span>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{p.brand}</p>
        </div>
        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-brand-700">
          {p.name}
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-muted">
          {p.ratingAvg != null && (
            <span className="inline-flex items-center gap-1.5">
              <Stars value={p.ratingAvg} />
              <span className="font-medium text-ink-soft">{p.ratingAvg.toFixed(1)}</span>
              <span className="text-ink-faint">({p.ratingCount})</span>
            </span>
          )}
          {meta.map((m) => (
            <span key={m as string} className="before:mr-2 before:content-['·'] first:before:hidden">
              {m}
            </span>
          ))}
        </p>
        {p.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
        )}
        <div className="mt-3">
          <BadgeChips badges={p.badges} limit={4} />
        </div>
      </div>
    </Link>
  );
}

export function CategoryChip({ c }: { c: CategoryRef }) {
  return (
    <Link
      href={`/products/${c.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-300"
    >
      {c.name}
      {c.productCount > 0 && (
        <span className="rounded-full bg-surface-tint px-1.5 text-xs tabular-nums text-brand-700">
          {c.productCount}
        </span>
      )}
    </Link>
  );
}

export function NarrowDownChips({ categorySlug }: { categorySlug: string }) {
  const featured: [string, string][] = [
    ["fragrance_free", BADGE_LABELS.fragrance_free],
    ["fungal_acne_safe", BADGE_LABELS.fungal_acne_safe],
    ["alcohol_free", BADGE_LABELS.alcohol_free],
    ["oil_free", BADGE_LABELS.oil_free],
    ["silicone_free", BADGE_LABELS.silicone_free],
    ["reef_safe", BADGE_LABELS.reef_safe],
    ["eu_allergen_free", BADGE_LABELS.eu_allergen_free],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {featured.map(([key, label]) => (
        <Link
          key={key}
          href={`/products?category=${categorySlug}&badge=${key}`}
          className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-300"
        >
          + {label}
        </Link>
      ))}
    </div>
  );
}
