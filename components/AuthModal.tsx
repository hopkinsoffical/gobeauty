"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

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
  const [countryCode, setCountryCode] = useState("+86");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
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
    if (!phone.trim()) { setError("请输入手机号"); return; }
    if (mode === "sign-up" && !username.trim()) { setError("请输入用户名"); return; }

    setLoading(true);
    const supabase = getClient();
    if (!supabase) {
      // Dev mode: skip actual SMS
      setStep("otp");
      setCountdown(60);
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (err) { setError(err.message); setLoading(false); return; }
    setStep("otp");
    setCountdown(60);
    setLoading(false);
  }

  async function verifyOtp() {
    const token = otp.join("");
    if (token.length < 6) { setError("请输入完整的验证码"); return; }
    setError("");
    setLoading(true);

    const supabase = getClient();
    if (!supabase) {
      // Dev mode: auto-succeed with mock profile
      setProfile({ id: "dev-user", username: username || "demo_user", phone: fullPhone });
      closeAuth();
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token,
      type: "sms",
    });
    if (err) { setError(err.message); setLoading(false); return; }

    if (mode === "sign-up" && data.user) {
      await supabase.from("gobeauty_users").upsert({
        auth_user_id: data.user.id,
        username: username.trim(),
        phone: fullPhone,
      });
    }
    closeAuth();
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
        aria-label={mode === "sign-in" ? "登录" : "注册"}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-3xl bg-white shadow-[0_24px_64px_rgba(15,20,25,0.18)] sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
      >
        {/* Close */}
        <button
          onClick={closeAuth}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition hover:bg-surface-tint hover:text-ink"
          aria-label="关闭"
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
                {m === "sign-in" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-[20px] font-bold text-ink">
                  {mode === "sign-in" ? "欢迎回来" : "创建账号"}
                </h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  {mode === "sign-in"
                    ? "输入手机号，我们将发送验证码"
                    : "注册后即可上传图片，发现专属美妆方案"}
                </p>
              </div>

              {/* Username — sign-up only */}
              {mode === "sign-up" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="例如：beauty_lover_88"
                    autoComplete="username"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-[14px] text-ink outline-none placeholder-ink-faint transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-[11.5px] text-ink-faint">
                    用于展示，其他用户将看到加密后的用户名
                  </p>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  手机号
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
                    placeholder="请输入手机号"
                    autoComplete="tel-national"
                    className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-ink outline-none placeholder-ink-faint"
                  />
                </div>
              </div>

              {error && <p className="text-[13px] text-red-500">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 py-3 text-[14.5px] font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? "发送中…" : "发送验证码"}
              </button>

              <p className="text-center text-[12.5px] text-ink-faint">
                继续即表示同意{" "}
                <a href="/terms" className="text-brand-500 hover:underline">服务条款</a>
                {" "}和{" "}
                <a href="/privacy" className="text-brand-500 hover:underline">隐私政策</a>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-[20px] font-bold text-ink">输入验证码</h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  已发送至 {countryCode} {phone}
                  <button
                    onClick={() => { setStep("phone"); setOtp(["","","","","",""]); }}
                    className="ml-2 text-brand-500 hover:underline"
                  >
                    修改
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
                {loading ? "验证中…" : mode === "sign-in" ? "登录" : "完成注册"}
              </button>

              {/* Resend */}
              <p className="text-center text-[13px] text-ink-muted">
                没有收到验证码？{" "}
                {countdown > 0 ? (
                  <span className="text-ink-faint">{countdown}s 后重新发送</span>
                ) : (
                  <button
                    onClick={sendOtp}
                    className="font-semibold text-brand-500 hover:underline"
                  >
                    重新发送
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
