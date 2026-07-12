import { NextResponse } from "next/server";
import { sendPhoneOtp } from "@/lib/auth/phoneOtp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = String((body as { phone?: string }).phone || "").trim();
    if (!phone) {
      return NextResponse.json(
        { error: "Please enter your phone number" },
        { status: 400 },
      );
    }
    await sendPhoneOtp(phone);
    return NextResponse.json({ sent: true });
  } catch (err) {
    const e = err as Error & { status?: number };
    const status = typeof e.status === "number" ? e.status : 500;
    const message = e.message || "Failed to send verification code";
    console.error("[auth/send-otp]", message);
    return NextResponse.json({ error: message }, { status });
  }
}
