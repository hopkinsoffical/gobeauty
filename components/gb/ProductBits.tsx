import Link from "next/link";
import type { Badges, Effect, Ingredient, ProductCard } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";

export function BadgeChips({ badges, limit }: { badges: Badges; limit?: number }) {
  const on = Object.entries(badges).filter(([, v]) => v);
  const shown = limit ? on.slice(0, limit) : on;
  if (!on.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map(([k]) => (
        <span
          key={k}
          className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
        >
          {BADGE_LABELS[k] ?? k}
        </span>
      ))}
      {limit && on.length > limit && (
        <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-xs text-ink-muted">
          +{on.length - limit}
        </span>
      )}
    </div>
  );
}

const RATING_STYLE: Record<string, string> = {
  superstar: "bg-brand-100 text-brand-800 ring-brand-200",
  goodie: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  neutral: "bg-surface-soft text-ink-muted ring-line",
  icky: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function RatingPill({ rating }: { rating: Ingredient["rating"] }) {
  if (!rating) return null;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${RATING_STYLE[rating]}`}
    >
      {rating}
    </span>
  );
}

export function EffectChips({ effects, tone }: { effects: Effect[]; tone: "benefit" | "concern" }) {
  if (!effects.length) return <p className="text-sm text-ink-muted">None detected.</p>;
  const cls =
    tone === "benefit"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-amber-50 text-amber-800 ring-amber-200";
  return (
    <div className="flex flex-wrap gap-2">
      {effects.map((e) => (
        <span
          key={e.slug}
          title={e.description ?? undefined}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ${cls}`}
        >
          {e.name}
          <span className="rounded-full bg-white/70 px-1.5 text-xs tabular-nums">{e.count}</span>
        </span>
      ))}
    </div>
  );
}

export function ProductCardTile({ p }: { p: ProductCard }) {
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex h-32 items-center justify-center rounded-xl bg-surface-soft text-4xl">
        {p.images[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0].url} alt={p.images[0].alt ?? p.name} className="max-h-full rounded-xl object-contain" />
        ) : (
          <span aria-hidden>🧴</span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{p.brand}</p>
        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-brand-700">
          {p.name}
        </h3>
        {p.category && <p className="text-xs text-ink-faint">{p.category}</p>}
      </div>
      <BadgeChips badges={p.badges} limit={3} />
    </Link>
  );
}
