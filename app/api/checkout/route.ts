import { NextRequest, NextResponse } from "next/server";
import { createOrder, type OrderInput } from "@/lib/gbApi";

// Browser → here → EC2 shim → RDS. The shim re-resolves every price
// server-side, so this route only shapes and forwards the payload.
export async function POST(req: NextRequest) {
  let body: OrderInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return NextResponse.json({ error: "cart is empty" }, { status: 422 });
  }
  try {
    const order = await createOrder({
      customer_name: String(body.customer_name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: body.phone ? String(body.phone).trim() : undefined,
      address_line1: String(body.address_line1 ?? "").trim(),
      address_line2: body.address_line2 ? String(body.address_line2).trim() : undefined,
      city: String(body.city ?? "").trim(),
      state: String(body.state ?? "").trim(),
      zip: String(body.zip ?? "").trim(),
      notes: body.notes ? String(body.notes).slice(0, 500) : undefined,
      items: body.items.map((i) => ({
        slug: String(i.slug),
        qty: Math.max(1, Math.min(20, Number(i.qty) || 1)),
      })),
    });
    return NextResponse.json(order);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "order failed";
    const status = msg.includes("422") ? 422 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
