"use client";

// First-party "goBeauty Store" channel inside Where to buy: qty, add to
// cart, buy now. Price shown matches our lowest live retailer offer; the
// order API re-resolves it server-side.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_QTY, fmtUsd, useCart } from "@/lib/cart";

export default function BuyBox({
  slug,
  name,
  brand,
  imageUrl,
  priceCents,
}: {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  priceCents: number;
}) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const item = { slug, name, brand, imageUrl, priceCents };

  const addToCart = () => {
    add(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const buyNow = () => {
    add(item, qty);
    router.push("/checkout");
  };

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-brand-700">
            goBeauty Store
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10.5px] font-bold text-white">
              Direct
            </span>
          </p>
          <p className="mt-1 font-display text-2xl text-ink">{fmtUsd(priceCents)}</p>
          <p className="text-[12.5px] text-ink-muted">
            Free shipping over $35 · price-matched to the lowest retailer
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex h-11 items-center rounded-full border border-line bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-11 w-10 rounded-l-full text-lg text-ink-soft transition hover:bg-surface-soft"
            >
              −
            </button>
            <span className="w-8 text-center text-[15px] font-semibold tabular-nums text-ink">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              className="h-11 w-10 rounded-r-full text-lg text-ink-soft transition hover:bg-surface-soft"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={addToCart}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold transition ${
              added
                ? "bg-emerald-600 text-white"
                : "border border-brand-400 bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={buyNow}
            className="inline-flex h-11 items-center rounded-full bg-brand-600 px-6 text-[14.5px] font-semibold text-white transition hover:bg-brand-700"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
