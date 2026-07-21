import Link from "next/link";
import ProductCard from "@/components/products/product-card";
import type { ProductRecGroup } from "@/lib/skin/types";
import { METRIC_META } from "@/lib/skin/metrics";

export default function SkinProductRecs({ groups }: { groups: ProductRecGroup[] }) {
  const hasAny = groups.some((g) => g.items.length > 0);
  if (!hasAny) {
    return (
      <section className="rounded-3xl border border-dashed border-line bg-surface-soft px-6 py-10 text-center">
        <h2 className="font-display text-xl text-ink">Products for your skin</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-muted">
          We couldn&apos;t load matching products right now. Browse the skincare library
          instead.
        </p>
        <Link
          href="/products?category=skincare"
          className="mt-4 inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Browse skincare
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink">Products for your skin</h2>
          <p className="mt-1 text-[14px] text-ink-muted">
            Matched from goBeauty&apos;s ingredient-checked catalog — not paid placements.
          </p>
        </div>
        <Link
          href="/products?category=skincare"
          className="text-[13.5px] font-semibold text-brand-700 hover:underline"
        >
          View all skincare →
        </Link>
      </div>

      <div className="space-y-8">
        {groups.map((g) =>
          g.items.length === 0 ? null : (
            <div key={g.concern}>
              <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
                {g.label}
                <span className="ml-2 font-medium normal-case text-ink-faint">
                  · {METRIC_META[g.concern]?.label ?? g.concern}
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((p) => (
                  <ProductCard key={p.slug} mode="api" product={p} />
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
