"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fmtUsd, useCart } from "@/lib/cart";

const FIELD =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-400";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, subtotalCents, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-ink">Nothing to check out</h1>
        <p className="mt-2 text-ink-soft">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-brand-600 px-8 text-[15px] font-semibold text-white transition hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone") || undefined,
          address_line1: f.get("address1"),
          address_line2: f.get("address2") || undefined,
          city: f.get("city"),
          state: f.get("state"),
          zip: f.get("zip"),
          notes: f.get("notes") || undefined,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderNo)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[960px] px-6 py-10">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Contact
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" required minLength={2} placeholder="Full name" className={FIELD} />
            <input name="email" required type="email" placeholder="Email" className={FIELD} />
          </div>
          <input name="phone" type="tel" placeholder="Phone (optional)" className={FIELD} />

          <h2 className="pt-2 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Shipping address
          </h2>
          <input name="address1" required minLength={3} placeholder="Street address" className={FIELD} />
          <input name="address2" placeholder="Apt, suite (optional)" className={FIELD} />
          <div className="grid gap-3 sm:grid-cols-[1fr_120px_120px]">
            <input name="city" required minLength={2} placeholder="City" className={FIELD} />
            <input name="state" required minLength={2} placeholder="State" className={FIELD} />
            <input name="zip" required minLength={3} placeholder="ZIP" className={FIELD} />
          </div>
          <textarea
            name="notes"
            rows={2}
            maxLength={500}
            placeholder="Order notes (optional)"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-400"
          />

          <h2 className="pt-2 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Payment
          </h2>
          <div className="rounded-xl border border-line bg-surface-soft px-4 py-3.5 text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Pay after confirmation.</span>{" "}
            Place the order now — our concierge confirms availability and sends a
            secure payment link to your email. Nothing is charged today.
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-13 w-full items-center justify-center rounded-full bg-brand-600 px-8 py-3.5 text-[15.5px] font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order · ${fmtUsd(subtotalCents)}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-line bg-white p-5">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-lg bg-surface-soft">
                  {i.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.imageUrl} alt={i.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span aria-hidden>🧴</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{i.name}</p>
                  <p className="text-xs text-ink-muted">
                    {i.brand} · qty {i.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-ink">
                  {fmtUsd(i.priceCents * i.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-line pt-3 text-right">
            <p className="text-sm text-ink-muted">Subtotal</p>
            <p className="font-display text-2xl text-ink">{fmtUsd(subtotalCents)}</p>
            <p className="mt-1 text-[12px] text-ink-muted">
              Shipping &amp; tax confirmed with payment link
            </p>
          </div>
          <Link href="/cart" className="mt-3 block text-center text-sm text-brand-700 hover:underline">
            Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
