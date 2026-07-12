import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconSparkles } from "@/components/products/icons";
import type { CategoryCardData } from "@/types/product-landing";

const TONE: Record<CategoryCardData["tone"], string> = {
  blush: "from-[#FFF0F4] to-[#FFE8EF]",
  lavender: "from-[#F4EEFF] to-[#F8F0FF]",
  sage: "from-[#F1F8F2] to-[#E8F4EB]",
  peach: "from-[#FFF4ED] to-[#FFEDE0]",
};

export default function CategoryCard({ category }: { category: CategoryCardData }) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none sm:p-7",
        TONE[category.tone],
      ].join(" ")}
    >
      <Link
        href={category.href}
        className="absolute inset-0 z-0"
        aria-label={category.ctaLabel}
      />
      <div className="relative z-10 grid gap-5 sm:grid-cols-[1fr_minmax(140px,42%)] sm:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--beauty-pink)] shadow-sm">
              <IconSparkles className="h-4 w-4" />
            </span>
            {category.popularLabel && (
              <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--beauty-pink)]">
                {category.popularLabel}
              </span>
            )}
          </div>
          <h3 className="font-display text-[26px] text-[var(--beauty-text)] sm:text-[28px]">
            {category.title}
          </h3>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--beauty-muted)]">
            {category.description}
          </p>
          <p className="mt-2 text-[13px] font-semibold tabular-nums text-[var(--beauty-text)]">
            {category.countLabel}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.chips.map((chip) => (
              <li key={chip.label}>
                <Link
                  href={chip.href}
                  className="relative z-20 inline-flex min-h-9 items-center rounded-full bg-white/85 px-3 py-1 text-[12.5px] font-semibold text-[var(--beauty-text)] ring-1 ring-[var(--beauty-border)] transition hover:ring-brand-300"
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={category.href}
            className="relative z-20 mt-5 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[var(--beauty-pink)] transition hover:text-[var(--beauty-pink-dark)]"
          >
            {category.ctaLabel}
            <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[200px] sm:max-w-none">
          <div className="relative h-full min-h-[160px] w-full overflow-hidden rounded-2xl bg-white/40">
            <Image
              src={category.imageSrc}
              alt={category.imageAlt}
              fill
              sizes="(max-width: 640px) 200px, 240px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
