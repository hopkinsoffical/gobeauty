import Link from "next/link";
import CategoryCard from "@/components/products/category-card";
import { CATEGORIES } from "@/data/products-landing";

export default function CategoryGrid() {
  return (
    <section
      className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-10 lg:px-8"
      aria-labelledby="browse-categories-heading"
    >
      <div className="mb-6 max-w-xl">
        <h2
          id="browse-categories-heading"
          className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]"
        >
          Browse Categories
        </h2>
        <p className="mt-1.5 text-[15px] text-[var(--beauty-muted)]">
          Explore products by category and find what’s right for you.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/products?view=all"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--beauty-border)] bg-white px-7 text-[14.5px] font-semibold text-[var(--beauty-text)] transition hover:border-brand-300 hover:bg-[var(--beauty-pink-light)]"
        >
          Explore all categories
        </Link>
      </div>
    </section>
  );
}
