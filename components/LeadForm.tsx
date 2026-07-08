"use client";

import { useState } from "react";

interface LeadFormProps {
  audience: "professional" | "supplier";
  /** Options for the "I'm interested in…" select. */
  interests: string[];
  submitLabel: string;
  /** Recorded as source_page on the lead (PRD §11 UTM/source tracking). */
  sourcePage: string;
  businessLabel?: string;
}

export default function LeadForm({
  audience,
  interests,
  submitLabel,
  sourcePage,
  businessLabel = "Business name",
}: LeadFormProps) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    contact: "",
    interest: interests[0] ?? "",
    message: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, audience, sourcePage }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-[16px] font-bold text-emerald-800">Request received.</p>
        <p className="mt-1 text-[14px] text-emerald-700">
          Our team will follow up within one business day.
        </p>
      </div>
    );
  }

  const inputCls =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]";

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your name"
          aria-label="Your name"
          className={inputCls}
        />
        <input
          value={form.businessName}
          onChange={set("businessName")}
          placeholder={businessLabel}
          aria-label={businessLabel}
          className={inputCls}
        />
      </div>
      <input
        required
        value={form.contact}
        onChange={set("contact")}
        placeholder="Phone or email"
        aria-label="Phone or email"
        className={inputCls}
      />
      <select
        value={form.interest}
        onChange={set("interest")}
        aria-label="I'm interested in"
        className={inputCls}
      >
        {interests.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <textarea
        value={form.message}
        onChange={set("message")}
        placeholder="Anything else we should know? (optional)"
        aria-label="Message"
        rows={3}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-12 rounded-pill bg-brand-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
      {state === "error" && (
        <p className="text-center text-[13.5px] text-red-600">
          Something went wrong — please try again or email us directly.
        </p>
      )}
      <p className="text-center text-[12px] text-ink-muted">
        We only use your contact info to follow up on this request. Opt out anytime.
      </p>
    </form>
  );
}
