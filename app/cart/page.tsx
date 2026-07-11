"use client";

import Link from "next/link";
import { MAX_QTY, fmtUsd, useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, count, subtotalCents, setQty, remove } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">
          Every product in the goBeauty Store is decoded ingredient by ingredient.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-brand-600 px-8 text-[15px] font-semibold text-white transition hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[860px] px-6 py-10">
      <h1 className="font-display text-3xl text-ink">
        Cart <span className="text-lg text-ink-muted">· {count} item{count === 1 ? "" : "s"}</span>
      </h1>

      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li
            key={i.slug}
            className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
          >
            <Link
              href={`/products/${i.slug}`}
              className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-xl bg-surface-soft"
            >
              {i.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.imageUrl} alt={i.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-2xl" aria-hidden>🧴</span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                {i.brand}
              </p>
              <Link
                href={`/products/${i.slug}`}
                className="block truncate font-medium text-ink hover:text-brand-700"
              >
                {i.name}
              </Link>
              <p className="mt-0.5 text-sm text-ink-soft">{fmtUsd(i.priceCents)}</p>
            </div>
            <div className="flex h-10 flex-none items-center rounded-full border border-line bg-white">
              <button
                type="button"
                aria-label={`Decrease ${i.name} quantity`}
                onClick={() => setQty(i.slug, i.qty - 1)}
                className="h-10 w-9 rounded-l-full text-ink-soft transition hover:bg-surface-soft"
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-semibold tabular-nums text-ink">
                {i.qty}
              </span>
              <button
                type="button"
                aria-label={`Increase ${i.name} quantity`}
                onClick={() => setQty(i.slug, Math.min(MAX_QTY, i.qty + 1))}
                className="h-10 w-9 rounded-r-full text-ink-soft transition hover:bg-surface-soft"
              >
                +
              </button>
            </div>
            <p className="w-20 flex-none text-right font-semibold tabular-nums text-ink">
              {fmtUsd(i.priceCents * i.qty)}
            </p>
            <button
              type="button"
              aria-label={`Remove ${i.name}`}
              onClick={() => remove(i.slug)}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-faint transition hover:bg-red-50 hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-3 rounded-2xl border border-line bg-white p-5">
        <p className="text-lg">
          <span className="text-ink-muted">Subtotal</span>{" "}
          <span className="font-display text-2xl text-ink">{fmtUsd(subtotalCents)}</span>
        </p>
        <p className="text-[12.5px] text-ink-muted">
          Shipping and tax calculated at checkout · free shipping over $35
        </p>
        <div className="flex gap-3">
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-[15px] font-semibold text-ink transition hover:border-brand-300"
          >
            Keep shopping
          </Link>
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center rounded-full bg-brand-600 px-8 text-[15px] font-semibold text-white transition hover:bg-brand-700"
          >
            Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
}
