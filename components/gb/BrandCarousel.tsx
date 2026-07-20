import Link from "next/link";
import type { BrandListing } from "@/lib/gbApi";

// Single-row marquee of partner brands. Pure CSS animation (keyframes in
// globals.css) — no client JS. Content is doubled so the -50% translate
// loops seamlessly. Duration scales with list length so card speed stays
// roughly constant (~1 card / 1.8s) even with hundreds of brands.
export default function BrandCarousel({ brands }: { brands: BrandListing[] }) {
  if (brands.length < 4) return null;
  const doubled = [...brands, ...brands];
  const durationSec = Math.max(40, Math.round(brands.length * 1.8));
  return (
    <div className="gb-marquee overflow-hidden">
      <div
        className="gb-marquee-track gap-3 pr-3"
        style={{ ["--gb-marquee-duration" as string]: `${durationSec}s` }}
      >
        {doubled.map((b, idx) => (
          <Link
            key={`${b.slug}-${idx}`}
            href={`/brands/${b.slug}`}
            aria-hidden={idx >= brands.length || undefined}
            tabIndex={idx >= brands.length ? -1 : undefined}
            className="group flex w-[168px] flex-none flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-4 transition hover:border-brand-300 hover:shadow-card"
          >
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface-soft ring-1 ring-line/60">
              {b.logoUrl || b.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.logoUrl ?? b.image ?? ""}
                  alt={b.name}
                  loading="lazy"
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              ) : (
                <span className="font-display text-xl text-brand-600">{b.name[0]}</span>
              )}
            </span>
            <span className="w-full truncate text-center text-[13.5px] font-semibold text-ink group-hover:text-brand-700">
              {b.name}
            </span>
            <span className="text-[11.5px] text-ink-muted">
              {b.productCount} product{b.productCount === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
