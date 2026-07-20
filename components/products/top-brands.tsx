import Link from "next/link";
import { TOP_BRANDS } from "@/data/products-landing";

export default function TopBrands() {
  return (
    <section
      className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-8"
      aria-labelledby="top-brands-heading"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2
            id="top-brands-heading"
            className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]"
          >
            Top Brands
          </h2>
          <p className="mt-1 text-[15px] text-[var(--beauty-muted)]">
            Discover trusted brands loved by our community.
          </p>
        </div>
        <Link
          href="/brands/kbeauty"
          className="shrink-0 text-[14px] font-semibold text-[var(--beauty-pink)] transition hover:text-[var(--beauty-pink-dark)]"
        >
          View all K-beauty brands
        </Link>
      </div>

      <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-7">
        {TOP_BRANDS.map((b) => (
          <li key={b.name} className="min-w-[140px] flex-1 md:min-w-0">
            <Link
              href={b.href}
              className="flex h-[88px] items-center justify-center rounded-2xl border border-[var(--beauty-border)] bg-white px-3 text-center shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-cardHover motion-reduce:transform-none"
            >
              <span className="font-display text-[15px] leading-snug text-[var(--beauty-text)]">
                {b.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
