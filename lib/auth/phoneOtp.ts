import "server-only";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_WINDOW_MS = 45 * 1000;
const MAX_ATTEMPTS = 5;

/** SMS body template for sign-in / sign-up codes. */
export function formatOtpSms(code: string): string {
  return `Your GoBeauty Code is:${code}`;
}

function otpHmacSecret(): string {
  const secret =
    process.env.OTP_HMAC_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";
  if (!secret) {
    throw new Error("OTP_HMAC_SECRET or SUPABASE_SERVICE_ROLE_KEY is required");
  }
  return secret;
}

export function normalizePhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits}`;
}

export function hashOtp(phone: string, code: string): string {
  return crypto
    .createHmac("sha256", otpHmacSecret())
    .update(`${phone}:${code}`)
    .digest("hex");
}

function sixDigit(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function requireTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";
  const from =
    process.env.TWILIO_SMS_FROM || process.env.TWILIO_PHONE_NUMBER || "";
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || "";
  if (!accountSid || !authToken || (!from && !messagingServiceSid)) {
    throw new Error(
      "Twilio is not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_SMS_FROM or TWILIO_MESSAGING_SERVICE_SID)",
    );
  }
  return { accountSid, authToken, from, messagingServiceSid };
}

async function sendSms(to: string, body: string): Promise<void> {
  const { accountSid, authToken, from, messagingServiceSid } = requireTwilio();
  const params: Record<string, string> = { To: to, Body: body };
  if (messagingServiceSid) params.MessagingServiceSid = messagingServiceSid;
  else params.From = from;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: new URLSearchParams(params).toString(),
    },
  );
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new Error(data.message || "Failed to send verification SMS");
  }
}

type OtpRow = {
  id: string;
  phone: string;
  code_hash: string;
  attempts: number;
  consumed_at: string | null;
  expires_at: string;
  created_at: string;
};

export async function sendPhoneOtp(phoneRaw: string): Promise<{ sent: true }> {
  const phone = normalizePhone(phoneRaw);
  if (phone.replace(/\D/g, "").length < 10) {
    throw Object.assign(new Error("Enter a valid phone number"), { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const sinceIso = new Date(Date.now() - RESEND_WINDOW_MS).toISOString();
  const { data: recent, error: recentErr } = await admin
    .from("gobeauty_phone_otps")
    .select("id")
    .eq("phone", phone)
    .gte("created_at", sinceIso)
    .limit(1);
  if (recentErr) throw recentErr;
  if (recent && recent.length > 0) {
    throw Object.assign(
      new Error("Please wait a moment before requesting another code"),
      { status: 429 },
    );
  }

  const code = sixDigit();
  const codeHash = hashOtp(phone, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  const { error: insertErr } = await admin.from("gobeauty_phone_otps").insert({
    phone,
    code_hash: codeHash,
    expires_at: expiresAt,
  });
  if (insertErr) throw insertErr;

  await sendSms(phone, formatOtpSms(code));
  return { sent: true };
}

async function findAuthUserIdByPhone(phone: string): Promise<string | null> {
  const digits = phone.replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(digits)) return null;

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (supabaseUrl && serviceKey) {
    try {
      // digits-only interpolation is safe after /^\d+$/ check above
      const res = await fetch(`${supabaseUrl}/pg/query`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `select id::text as id from auth.users where phone in ('${digits}', '+${digits}') limit 1`,
        }),
      });
      if (res.ok) {
        const rows = (await res.json()) as Array<{ id: string }>;
        if (rows?.[0]?.id) return rows[0].id;
      }
    } catch {
      // fall through to listUsers
    }
  }

  const admin = getSupabaseAdmin();
  let page = 1;
  for (;;) {
    const { data: pageData, error: listErr } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (listErr) throw listErr;
    const users = pageData?.users || [];
    const hit = users.find((u) => (u.phone || "").replace(/\D/g, "") === digits);
    if (hit) return hit.id;
    if (users.length < 200) break;
    page += 1;
    if (page > 20) break;
  }
  return null;
}

async function mintSessionForPhone(phone: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: { id: string; phone?: string };
}> {
  const admin = getSupabaseAdmin();
  const password = crypto.randomBytes(32).toString("base64url");
  const digits = phone.replace(/\D/g, "");
  const e164 = phone.startsWith("+") ? phone : `+${digits}`;

  let userId = await findAuthUserIdByPhone(e164);
  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      phone: e164,
      password,
      phone_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      phone_confirm: true,
    });
    if (error) throw error;
  }

  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";
  if (!url || !key) {
    throw new Error("Missing Supabase URL/key for session mint");
  }

  const authClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: signIn, error: signErr } = await authClient.auth.signInWithPassword({
    phone: e164,
    password,
  });
  if (signErr || !signIn.session) {
    throw signErr || new Error("Could not create session after OTP verify");
  }

  // Rotate password so the one-shot secret cannot be reused.
  await admin.auth.admin.updateUserById(userId, {
    password: crypto.randomBytes(32).toString("base64url") + "x",
  });

  return {
    access_token: signIn.session.access_token,
    refresh_token: signIn.session.refresh_token,
    expires_in: signIn.session.expires_in ?? 3600,
    token_type: signIn.session.token_type ?? "bearer",
    user: { id: userId, phone: e164 },
  };
}

export async function verifyPhoneOtp(
  phoneRaw: string,
  codeRaw: string,
): Promise<{
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  user: { id: string; phone?: string };
}> {
  const phone = normalizePhone(phoneRaw);
  const code = String(codeRaw || "").replace(/\D/g, "");
  if (code.length < 4) {
    throw Object.assign(new Error("Please enter the full verification code"), {
      status: 400,
    });
  }

  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from("gobeauty_phone_otps")
    .select(
      "id, phone, code_hash, attempts, consumed_at, expires_at, created_at",
    )
    .eq("phone", phone)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  const otp = (rows?.[0] || null) as OtpRow | null;
  if (!otp) {
    throw Object.assign(
      new Error("That code has expired. Please request a new one."),
      { status: 401 },
    );
  }
  if (otp.attempts >= MAX_ATTEMPTS) {
    throw Object.assign(new Error("Too many attempts. Request a new code."), {
      status: 429,
    });
  }

  const expected = hashOtp(phone, code);
  const a = Buffer.from(otp.code_hash);
  const b = Buffer.from(expected);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!match) {
    await admin
      .from("gobeauty_phone_otps")
      .update({ attempts: otp.attempts + 1 })
      .eq("id", otp.id);
    throw Object.assign(
      new Error("That code didn't match. Please try again."),
      { status: 401 },
    );
  }

  await admin
    .from("gobeauty_phone_otps")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", otp.id);

  const session = await mintSessionForPhone(phone);
  return {
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
      token_type: session.token_type,
    },
    user: session.user,
  };
}
