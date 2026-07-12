"use client";

import Link from "next/link";
import type { MarketplaceProduct } from "@/lib/marketplace/types";

interface Props {
  product: MarketplaceProduct;
  supplierSlug: string;
  onAsk?: (product: MarketplaceProduct) => void;
}

export default function MarketplaceProductCard({ product, supplierSlug, onAsk }: Props) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-card transition hover:shadow-cardHover">
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-surface-soft to-brand-50">
        <span className="px-4 text-center text-[13px] font-semibold text-ink-muted">
          {product.brandName}
        </span>
      </div>
      <p className="mt-3 text-[11.5px] font-bold uppercase tracking-wide text-brand-600">
        {product.category}
      </p>
      <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-ink">
        {product.productName}
      </h3>
      <p className="mt-1 text-[12.5px] text-ink-muted">{product.brandName}</p>
      <dl className="mt-3 space-y-1 text-[12.5px] leading-snug text-ink-soft">
        <div>
          <dt className="inline font-semibold text-ink">Best for: </dt>
          <dd className="inline">{product.bestFitBusiness}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-ink">Use with: </dt>
          <dd className="inline">{product.treatmentPairing}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-ink">Salon use: </dt>
          <dd className="inline">{product.retailFit}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/marketplace/suppliers/${supplierSlug}`}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-pill border border-line bg-white text-[13px] font-semibold text-ink transition hover:bg-surface-tint"
        >
          View Product
        </Link>
        <button
          type="button"
          onClick={() => onAsk?.(product)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-pill bg-brand-500 text-[13px] font-semibold text-white transition hover:bg-brand-600"
        >
          Ask About This Product
        </button>
      </div>
    </article>
  );
}
