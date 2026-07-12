import { NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/lib/auth/phoneOtp";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      phone?: string;
      code?: string;
      token?: string;
      mode?: string;
      username?: string;
    };
    const phone = String(body.phone || "").trim();
    const code = String(body.code || body.token || "").trim();
    const mode = String(body.mode || "sign-in");
    const username = String(body.username || "").trim();

    if (!phone) {
      return NextResponse.json(
        { error: "Please enter your phone number" },
        { status: 400 },
      );
    }
    if (!code) {
      return NextResponse.json(
        { error: "Please enter the full verification code" },
        { status: 400 },
      );
    }
    if (mode === "sign-up" && !username) {
      return NextResponse.json(
        { error: "Please enter a username" },
        { status: 400 },
      );
    }

    const result = await verifyPhoneOtp(phone, code);

    if (mode === "sign-up" && username && result.user?.id) {
      try {
        const admin = getSupabaseAdmin();
        await admin.from("gobeauty_users").upsert(
          {
            auth_user_id: result.user.id,
            username,
            phone: result.user.phone || phone,
          },
          { onConflict: "auth_user_id" },
        );
      } catch (profileErr) {
        console.error("[auth/verify-otp] profile upsert", profileErr);
        // Session is still valid; profile can be completed later
      }
    }

    return NextResponse.json({
      session: result.session,
      user: result.user,
    });
  } catch (err) {
    const e = err as Error & { status?: number };
    const status = typeof e.status === "number" ? e.status : 500;
    const message = e.message || "Verification failed";
    console.error("[auth/verify-otp]", message);
    return NextResponse.json({ error: message }, { status });
  }
}
