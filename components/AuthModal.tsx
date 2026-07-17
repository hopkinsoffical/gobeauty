"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

const SMS_CONSENT_VERSION = "2026-07-17";

const COUNTRY_CODES = [
  { code: "+86", flag: "🇨🇳", label: "CN" },
  { code: "+1",  flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+81", flag: "🇯🇵", label: "JP" },
  { code: "+82", flag: "🇰🇷", label: "KR" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
];

type Step = "phone" | "otp";

function getClient() {
  try {
    const { getSupabaseBrowser } = require("@/lib/supabase/client");
    return getSupabaseBrowser();
  } catch {
    return null;
  }
}

export default function AuthModal() {
  const { authOpen, authMode, closeAuth, setProfile } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">(authMode);
  const [step, setStep] = useState<Step>("phone");

  // Fields
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Sync mode when modal opens
  useEffect(() => {
    setMode(authMode);
    setStep("phone");
    setPhone("");
    setUsername("");
    setSmsConsent(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  }, [authMode, authOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (!authOpen) return null;

  const fullPhone = countryCode + phone.replace(/\D/g, "");

  async function sendOtp() {
    setError("");
    if (!phone.trim()) { setError("Please enter your phone number"); return; }
    if (mode === "sign-up" && !username.trim()) { setError("Please enter a username"); return; }
    if (!smsConsent) {
      setError("Please agree to receive the verification text message");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          smsConsent,
          consentVersion: SMS_CONSENT_VERSION,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Dev fallback when server OTP is not configured yet
        if (res.status === 500 && !getClient()) {
          setStep("otp");
          setCountdown(60);
          setLoading(false);
          return;
        }
        setError(data.error || "Failed to send verification code");
        setLoading(false);
        return;
      }
      setStep("otp");
      setCountdown(60);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send verification code");
    }
    setLoading(false);
  }

  async function verifyOtp() {
    const token = otp.join("");
    if (token.length < 6) { setError("Please enter the full verification code"); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          code: token,
          mode,
          username: username.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 500 && !getClient()) {
          setProfile({ id: "dev-user", username: username || "demo_user", phone: fullPhone });
          closeAuth();
          setLoading(false);
          return;
        }
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      const supabase = getClient();
      if (supabase && data.session?.access_token && data.session?.refresh_token) {
        const { error: sessErr } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        if (sessErr) {
          setError(sessErr.message);
          setLoading(false);
          return;
        }
      } else if (!supabase) {
        setProfile({
          id: data.user?.id || "dev-user",
          username: username || "demo_user",
          phone: fullPhone,
        });
      }

      closeAuth();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    }
    setLoading(false);
  }

  function handleOtpInput(val: string, idx: number) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKey(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(""));
      otpRefs.current[5]?.focus();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={closeAuth}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label={mode === "sign-in" ? "Sign in" : "Sign up"}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100vh-2rem)] max-w-md -translate-y-1/2 overflow-y-auto rounded-3xl bg-white shadow-[0_24px_64px_rgba(15,20,25,0.18)] sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
      >
        {/* Close */}
        <button
          onClick={closeAuth}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition hover:bg-surface-tint hover:text-ink"
          aria-label="Close"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-7 pb-8 pt-7">
          {/* Logo mark */}
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-xl text-white shadow-sm">
            💄
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl bg-surface-soft p-1">
            {(["sign-in", "sign-up"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setStep("phone"); setError(""); }}
                className={`flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition ${
                  mode === m
                    ? "bg-white text-ink shadow-card"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {m === "sign-in" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-[20px] font-bold text-ink">
                  {mode === "sign-in" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  {mode === "sign-in"
                    ? "Enter your phone number and we'll send a code"
                    : "Sign up to upload photos and discover your perfect look"}
                </p>
              </div>

              {/* Username — sign-up only */}
              {mode === "sign-up" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. beauty_lover_88"
                    autoComplete="username"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-[14px] text-ink outline-none placeholder-ink-faint transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-[11.5px] text-ink-faint">
                    Shown publicly — others will only see a masked version
                  </p>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Phone number
                </label>
                <div className="flex overflow-hidden rounded-xl border border-line transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border-r border-line bg-surface-soft px-3 py-2.5 text-[13px] font-medium text-ink outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="Enter your phone number"
                    autoComplete="tel-national"
                    className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-ink outline-none placeholder-ink-faint"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-soft p-3.5 transition hover:border-brand-200">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand-500 accent-[#e85a82]"
                  required
                />
                <span className="text-[11.5px] leading-[1.65] text-ink-soft">
                  I agree to receive SMS messages from GoBeauty AI at the phone
                  number provided, including one-time verification codes and
                  account-related messages. Message frequency varies. Message
                  &amp; data rates may apply. Reply STOP to unsubscribe. Reply
                  HELP for help. Consent is not a condition of purchase. See{" "}
                  <a
                    href="/sms-consent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    SMS Consent
                  </a>
                  ,{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  , and{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Terms of Service
                  </a>
                  .
                </span>
              </label>

              {error && <p className="text-[13px] text-red-500">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 py-3 text-[14.5px] font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send verification code"}
              </button>

            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-[20px] font-bold text-ink">Enter verification code</h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  Sent to {countryCode} {phone}
                  <button
                    onClick={() => { setStep("phone"); setOtp(["","","","","",""]); }}
                    className="ml-2 text-brand-500 hover:underline"
                  >
                    Edit
                  </button>
                </p>
              </div>

              {/* OTP boxes */}
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKey(e, i)}
                    autoFocus={i === 0}
                    className="h-12 w-12 rounded-xl border border-line bg-surface-soft text-center text-[20px] font-bold text-ink outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                ))}
              </div>

              {error && <p className="text-center text-[13px] text-red-500">{error}</p>}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.join("").length < 6}
                className="w-full rounded-xl bg-brand-500 py-3 text-[14.5px] font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? "Verifying…" : mode === "sign-in" ? "Sign in" : "Complete sign up"}
              </button>

              {/* Resend */}
              <p className="text-center text-[13px] text-ink-muted">
                Didn't receive a code?{" "}
                {countdown > 0 ? (
                  <span className="text-ink-faint">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={sendOtp}
                    className="font-semibold text-brand-500 hover:underline"
                  >
                    Resend
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
