import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// PRD v2 FR-006 / FR-007 / §11 — professional and supplier inquiries route
// into CRM with trackable audience, source, and status. Phase 1 stores the
// lead in Supabase (gobeauty_leads, status "new"); the vForce CRM sync picks
// it up from there. Best-effort: a missing table/keys must never lose the UX.
const AUDIENCES = new Set(["professional", "supplier", "consumer"]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const audience = String(body.audience ?? "");
  const name = String(body.name ?? "").trim();
  const contact = String(body.contact ?? "").trim();

  if (!AUDIENCES.has(audience) || !name || !contact) {
    return NextResponse.json(
      { error: "audience, name, and contact are required" },
      { status: 400 },
    );
  }

  // Marketplace inquiries (supplier listing, product ask, claim) ride the same
  // table; extra fields are folded into message + logged for CRM enrichment.
  const inquiryType = String(body.inquiryType ?? "").trim() || null;
  const supplierSlug = String(body.supplierSlug ?? "").trim() || null;
  const productId = String(body.productId ?? "").trim() || null;
  const baseMessage = String(body.message ?? "").trim() || null;
  const extras = [
    inquiryType && `inquiry_type=${inquiryType}`,
    supplierSlug && `supplier_slug=${supplierSlug}`,
    productId && `product_id=${productId}`,
  ].filter(Boolean);
  const message =
    extras.length && baseMessage
      ? `${baseMessage}\n\n[${extras.join(" · ")}]`
      : baseMessage || (extras.length ? extras.join(" · ") : null);

  const lead = {
    audience_type: audience,
    name,
    business_name: String(body.businessName ?? "").trim() || null,
    contact,
    interest: String(body.interest ?? "").trim() || null,
    message,
    source_page: String(body.sourcePage ?? "").trim() || null,
    status: "new",
  };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gobeauty_leads").insert(lead);
    if (error) throw error;
  } catch (err) {
    // Keep the lead in the server logs even when persistence is down.
    console.error("[leads] persist failed, logging instead:", err, {
      ...lead,
      inquiryType,
      supplierSlug,
      productId,
    });
  }

  return NextResponse.json({ ok: true });
}
