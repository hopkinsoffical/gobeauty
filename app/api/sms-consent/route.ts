import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CONSENT_VERSION = "2026-07-17-marketing";

const CONSENT_COPY =
  "I agree to receive recurring SMS messages from GoBeauty regarding salon industry news, product recommendations, supplier updates, and promotional offers. Message frequency varies. Message & data rates may apply. Reply STOP to unsubscribe. Reply HELP for help. Consent is not a condition of purchase.";

function normalizePhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("1") && digits.length === 11
    ? `+${digits}`
    : digits.length === 10
      ? `+1${digits}`
      : `+${digits}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phoneRaw = String(body.phone ?? "").trim();
  const phone = normalizePhone(phoneRaw);
  const smsConsent = body.smsConsent === true;
  const consentVersion = String(body.consentVersion ?? "").trim();

  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "Please enter a valid phone number" },
      { status: 400 },
    );
  }
  if (!smsConsent) {
    return NextResponse.json(
      { error: "SMS consent is required" },
      { status: 400 },
    );
  }
  if (consentVersion !== CONSENT_VERSION) {
    return NextResponse.json(
      { error: "Please review and accept the current SMS consent disclosure" },
      { status: 400 },
    );
  }

  const lead = {
    audience_type: "professional",
    name: "SMS Opt-in",
    business_name: null,
    contact: phone,
    interest: "SMS marketing opt-in",
    message: [
      "source=sms-consent-page",
      `consent_version=${CONSENT_VERSION}`,
      `consented_at=${new Date().toISOString()}`,
      `consent_copy=${CONSENT_COPY}`,
    ].join("\n"),
    source_page: "/sms-consent",
    status: "new",
  };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gobeauty_leads").insert(lead);
    if (error) throw error;
  } catch (err) {
    console.error("[sms-consent] persist failed:", err);
    return NextResponse.json(
      { error: "We could not save your consent. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
