import Image from "next/image";
import Link from "next/link";
import { IconStar } from "@/components/products/icons";
import type { ProductCard as ApiProduct } from "@/lib/gbApi";
import { BADGE_LABELS } from "@/lib/gbApi";
import type { MockProduct } from "@/types/product-landing";

type Props =
  | { mode: "api"; product: ApiProduct }
  | { mode: "mock"; product: MockProduct };

export default function ProductCard(props: Props) {
  if (props.mode === "api") {
    const p = props.product;
    const badgeLabels = Object.entries(p.badges || {})
      .filter(([, v]) => v)
      .slice(0, 3)
      .map(([k]) => BADGE_LABELS[k] ?? k);
    const img = p.images[0]?.url;
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--beauty-border)] bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none">
        <Link href={`/products/${p.slug}`} className="relative block aspect-[4/5] bg-[var(--beauty-blush)]">
          {img ? (
            // External product CDN images may not be in next.config remotePatterns.
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
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--beauty-muted)]">
            {p.brand}
          </p>
          <h3 className="font-display text-[17px] leading-snug text-[var(--beauty-text)] group-hover:text-[var(--beauty-pink-dark)]">
            <Link href={`/products/${p.slug}`}>{p.name}</Link>
          </h3>
          {(p.ratingAvg != null || p.ratingCount > 0) && (
            <p className="flex items-center gap-1 text-[13px] text-[var(--beauty-muted)]">
              <IconStar className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-[var(--beauty-text)]">
                {p.ratingAvg?.toFixed(1) ?? "—"}
              </span>
              <span>({p.ratingCount})</span>
            </p>
          )}
          <span className="inline-flex w-fit rounded-full bg-[var(--beauty-pink-light)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--beauty-pink-dark)]">
            Ingredient-checked
          </span>
          {badgeLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {badgeLabels.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/products/${p.slug}`}
            className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--beauty-text)] px-4 text-[13.5px] font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
          >
            View analysis
          </Link>
        </div>
      </article>
    );
  }

  const p = props.product;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--beauty-border)] bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none">
      <Link href={`/products?q=${encodeURIComponent(p.name)}`} className="relative block aspect-[4/5] bg-[var(--beauty-blush)]">
        <Image src={p.imageSrc} alt={p.name} fill className="object-contain p-4" sizes="240px" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--beauty-muted)]">
          {p.brand}
        </p>
        <h3 className="font-display text-[17px] leading-snug text-[var(--beauty-text)]">{p.name}</h3>
        <p className="flex items-center gap-1 text-[13px] text-[var(--beauty-muted)]">
          <IconStar className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-[var(--beauty-text)]">{p.rating.toFixed(1)}</span>
          <span>({p.reviewCount})</span>
        </p>
        <span className="inline-flex w-fit rounded-full bg-[var(--beauty-pink-light)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--beauty-pink-dark)]">
          {p.analysisBadge}
        </span>
        <div className="flex flex-wrap gap-1">
          {p.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
            >
              {b}
            </span>
          ))}
        </div>
        <Link
          href={`/products?q=${encodeURIComponent(p.name)}`}
          className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--beauty-text)] px-4 text-[13.5px] font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
        >
          View analysis
        </Link>
      </div>
    </article>
  );
}
