import Link from "next/link";
import type { BrandListing } from "@/lib/gbApi";

// Two opposite-direction marquee bands of partner brands. Pure CSS animation
// (keyframes in globals.css) — no client JS. Each band's content is doubled
// so the -50% translate loops seamlessly.
function Band({ brands, reverse }: { brands: BrandListing[]; reverse?: boolean }) {
  const doubled = [...brands, ...brands];
  return (
    <div className="gb-marquee overflow-hidden">
      <div
        className={`gb-marquee-track gap-3 pr-3 ${reverse ? "gb-marquee-reverse" : ""}`}
        style={{ ["--gb-marquee-duration" as string]: `${Math.max(30, brands.length * 3.2)}s` }}
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

export default function BrandCarousel({ brands }: { brands: BrandListing[] }) {
  if (brands.length < 4) return null;
  const rowA = brands.filter((_, i) => i % 2 === 0);
  const rowB = brands.filter((_, i) => i % 2 === 1);
  return (
    <div className="space-y-3">
      <Band brands={rowA} />
      <Band brands={rowB} reverse />
    </div>
  );
}
