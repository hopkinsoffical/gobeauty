import Link from "next/link";
import type { Supplier } from "@/lib/marketplace/types";
import { PROFILE_STATUS_LABEL } from "@/lib/marketplace/types";

export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  const statusLabel = PROFILE_STATUS_LABEL[supplier.profileStatus];
  return (
    <Link
      href={`/marketplace/suppliers/${supplier.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-[14px] font-bold text-white"
          style={{ background: supplier.logoColor }}
          aria-hidden
        >
          {supplier.logoInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15.5px] font-bold text-ink">{supplier.name}</h3>
            {supplier.featured && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
                Featured
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">{supplier.supplierType}</p>
        </div>
      </div>

      <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft line-clamp-2">
        {supplier.shortDescription}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {supplier.bestFitBusinessTypes.slice(0, 3).map((b) => (
          <span
            key={b}
            className="rounded-full bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted"
          >
            {b}
          </span>
        ))}
      </div>

      <p className="mt-2 text-[12px] text-ink-faint line-clamp-1">
        {supplier.productCategories.slice(0, 4).join(" · ")}
      </p>

      {(supplier.country || supplier.shippingMarkets.length > 0) && (
        <p className="mt-1.5 text-[12px] text-ink-muted">
          {supplier.shippingMarkets[0] || supplier.country}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
          {statusLabel}
        </span>
        <span className="text-[13px] font-bold text-brand-600 transition group-hover:translate-x-0.5">
          View Supplier →
        </span>
      </div>
    </Link>
  );
}
