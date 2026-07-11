"use client";

// Compact per-product buy entry for the compare sheet: price + add to cart
// + buy now. Same cart semantics as BuyBox; server re-prices at order time.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fmtUsd, useCart } from "@/lib/cart";

export default function CompareBuy({
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
  priceCents: number | null;
}) {
  const router = useRouter();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (priceCents == null) {
    return <p className="text-center text-sm text-ink-faint">—</p>;
  }

  const item = { slug, name, brand, imageUrl, priceCents };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-ink-muted">
        goBeauty Store{" "}
        <span className="font-display text-lg text-ink">{fmtUsd(priceCents)}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            add(item);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
          }}
          className={`inline-flex h-10 items-center rounded-full px-4 text-[13.5px] font-semibold transition ${
            added
              ? "bg-emerald-600 text-white"
              : "border border-brand-400 bg-white text-brand-700 hover:bg-brand-50"
          }`}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            add(item);
            router.push("/checkout");
          }}
          className="inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-[13.5px] font-semibold text-white transition hover:bg-brand-700"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
