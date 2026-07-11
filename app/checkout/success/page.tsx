import Link from "next/link";
import { getOrder } from "@/lib/gbApi";

export const metadata = { title: "Order confirmed — goBeauty Store" };
export const dynamic = "force-dynamic";

const fmtUsd = (c: number) =>
  (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const order = searchParams.order ? await getOrder(searchParams.order) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-ink">Order not found</h1>
        <Link href="/products" className="mt-4 inline-block text-brand-700 underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </span>
        <h1 className="mt-4 font-display text-3xl text-ink">Order placed!</h1>
        <p className="mt-2 text-ink-soft">
          Order <span className="font-semibold text-ink">{order.orderNo}</span> ·{" "}
          we&apos;ve emailed your confirmation. Our concierge will send a secure
          payment link shortly — nothing has been charged yet.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <ul className="space-y-3">
          {order.items.map((i) => (
            <li key={i.product_slug} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${i.product_slug}`}
                  className="block truncate font-medium text-ink hover:text-brand-700"
                >
                  {i.product_name}
                </Link>
                <p className="text-xs text-ink-muted">
                  {i.brand} · qty {i.qty}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-ink">
                {fmtUsd(i.unit_price_cents * i.qty)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-line pt-3 text-right">
          <p className="text-sm text-ink-muted">Subtotal</p>
          <p className="font-display text-2xl text-ink">{fmtUsd(order.subtotalCents)}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-flex h-12 items-center rounded-full bg-brand-600 px-8 text-[15px] font-semibold text-white transition hover:bg-brand-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
