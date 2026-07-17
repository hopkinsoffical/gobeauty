import { NextResponse } from "next/server";
import { sendPhoneOtp } from "@/lib/auth/phoneOtp";

export const runtime = "nodejs";
const SMS_CONSENT_VERSION = "2026-07-17";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const input = body as {
      phone?: string;
      smsConsent?: boolean;
      consentVersion?: string;
    };
    const phone = String(input.phone || "").trim();
    if (!phone) {
      return NextResponse.json(
        { error: "Please enter your phone number" },
        { status: 400 },
      );
    }
    if (input.smsConsent !== true) {
      return NextResponse.json(
        { error: "SMS consent is required to send a verification code" },
        { status: 400 },
      );
    }
    if (input.consentVersion !== SMS_CONSENT_VERSION) {
      return NextResponse.json(
        { error: "Please review and accept the current SMS consent disclosure" },
        { status: 400 },
      );
    }

    await sendPhoneOtp(phone, {
      version: SMS_CONSENT_VERSION,
      source: "auth-modal",
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    const e = err as Error & { status?: number };
    const status = typeof e.status === "number" ? e.status : 500;
    const message = e.message || "Failed to send verification code";
    console.error("[auth/send-otp]", message);
    return NextResponse.json({ error: message }, { status });
  }
}
