import Link from "next/link";
import type { Supplier } from "@/lib/marketplace/types";
import { PROFILE_STATUS_LABEL } from "@/lib/marketplace/types";
import { supplierCover } from "@/lib/marketplace/visuals";

/** Image-first supplier card — name + one category chip, minimal copy. */
export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  const cover = supplierCover(supplier.slug);
  const statusLabel = PROFILE_STATUS_LABEL[supplier.profileStatus];

  return (
    <Link
      href={`/marketplace/suppliers/${supplier.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-surface-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-[12px] font-bold text-white shadow-md ring-2 ring-white/80"
          style={{ background: supplier.logoColor }}
          aria-hidden
        >
          {supplier.logoInitials}
        </span>
        {supplier.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 shadow-sm">
            Featured
          </span>
        )}
        <span className="absolute bottom-3 left-3 right-3 text-[11px] font-semibold uppercase tracking-wide text-white/90">
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-[15px] font-bold leading-snug text-ink">{supplier.name}</h3>
        <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-muted">
          {supplier.productCategories.slice(0, 3).join(" · ")}
        </p>
        <span className="mt-3 text-[13px] font-bold text-brand-600 transition group-hover:translate-x-0.5">
          View →
        </span>
      </div>
    </Link>
  );
}
