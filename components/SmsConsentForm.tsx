"use client";

import Link from "next/link";
import { useState } from "react";

export const SMS_MARKETING_CONSENT_VERSION = "2026-07-17-marketing";

const UPDATES = [
  "New beauty products",
  "Trusted suppliers",
  "Salon AI tools",
  "Industry trends",
  "Trade shows",
  "Exclusive offers",
] as const;

const CONSENT_TEXT =
  "I agree to receive recurring SMS messages from GoBeauty regarding salon industry news, product recommendations, supplier updates, and promotional offers. Message frequency varies. Message & data rates may apply. Reply STOP to unsubscribe. Reply HELP for help. Consent is not a condition of purchase.";

export default function SmsConsentForm() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!consent) {
      setError("Please check the box to agree to receive SMS messages");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/sms-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          smsConsent: true,
          consentVersion: SMS_MARKETING_CONSENT_VERSION,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center shadow-card md:px-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h2 className="mt-4 font-display text-[1.75rem] text-emerald-900">
          You&apos;re subscribed
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-emerald-800">
          Thanks for opting in. You&apos;ll receive SMS updates from GoBeauty.
          Reply STOP anytime to unsubscribe, or HELP for help.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-line bg-white px-6 py-8 shadow-card md:px-10 md:py-10"
    >
      <p className="text-[28px] leading-none" aria-hidden>
        📱
      </p>
      <h1 className="mt-4 font-display text-[2rem] leading-[1.1] text-ink md:text-[2.5rem]">
        Stay ahead of beauty trends
      </h1>

      <p className="mt-5 text-[15px] font-semibold text-ink">
        Receive SMS updates about:
      </p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {UPDATES.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 text-[14.5px] text-ink-soft"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-600">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <label className="mt-8 block">
        <span className="mb-1.5 block text-[13px] font-semibold text-ink">
          Phone Number
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          autoComplete="tel"
          required
          className="h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]"
        />
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-soft p-4 transition hover:border-brand-200">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[#e85a82]"
          required
        />
        <span className="text-[12px] leading-[1.7] text-ink-soft">
          {CONSENT_TEXT}
        </span>
      </label>

      {(state === "error" || error) && (
        <p className="mt-3 text-[13px] text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 h-12 w-full rounded-pill bg-brand-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600 disabled:opacity-60"
      >
        {state === "sending" ? "Submitting…" : "Subscribe to SMS updates"}
      </button>

      <p className="mt-5 text-center text-[13.5px] font-semibold">
        <Link
          href="/privacy"
          className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
        >
          Privacy Policy
        </Link>
        <span className="mx-2 text-ink-faint">|</span>
        <Link
          href="/terms"
          className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
        >
          Terms of Service
        </Link>
      </p>
    </form>
  );
}
