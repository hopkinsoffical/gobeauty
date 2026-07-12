"use client";

import Link from "next/link";
import type { MarketplaceProduct } from "@/lib/marketplace/types";
import { productImage } from "@/lib/marketplace/visuals";

interface Props {
  product: MarketplaceProduct;
  supplierSlug: string;
  onAsk?: (product: MarketplaceProduct) => void;
}

/** Visual product tile — photo dominates; one-line fit tag. */
export default function MarketplaceProductCard({ product, supplierSlug, onAsk }: Props) {
  const img = productImage(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-cardHover">
      <Link href={`/marketplace/suppliers/${supplierSlug}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-ink shadow-sm">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[12px] font-medium text-ink-muted">{product.brandName}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[14.5px] font-bold leading-snug text-ink">
          {product.productName}
        </h3>
        <p className="mt-1.5 line-clamp-1 text-[12px] text-ink-soft">
          {product.bestFitBusiness}
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/marketplace/suppliers/${supplierSlug}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-pill border border-line text-[12.5px] font-semibold text-ink transition hover:bg-surface-tint"
          >
            View
          </Link>
          <button
            type="button"
            onClick={() => onAsk?.(product)}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-pill bg-brand-500 text-[12.5px] font-semibold text-white transition hover:bg-brand-600"
          >
            Ask
          </button>
        </div>
      </div>
    </article>
  );
}
