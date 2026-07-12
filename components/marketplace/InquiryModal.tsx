"use client";

import { useEffect, useId, useState } from "react";
import {
  BUSINESS_TYPES,
  INQUIRY_TYPE_LABEL,
  type InquiryType,
} from "@/lib/marketplace/types";

export interface InquiryContext {
  inquiryType: InquiryType;
  supplierName?: string;
  supplierSlug?: string;
  productName?: string;
  productId?: string;
  referringUrl?: string;
}

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  context: InquiryContext;
}

const PREFERRED_CONTACT = ["Email", "Phone", "SMS", "Either"];

export default function InquiryModal({ open, onClose, context }: InquiryModalProps) {
  const titleId = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    businessType: BUSINESS_TYPES[0],
    email: "",
    phone: "",
    city: "",
    state: "",
    services: "",
    interest: context.productName || context.supplierName || "",
    preferredContact: "Email",
    message: "",
    locations: "",
    monthlyClients: "",
    currentRetail: "",
    estimatedOrder: "",
    preferredTime: "",
  });

  useEffect(() => {
    if (!open) return;
    setState("idle");
    setConsent(false);
    setForm((f) => ({
      ...f,
      interest: context.productName || context.supplierName || f.interest,
    }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, context.productName, context.supplierName]);

  if (!open) return null;

  const title = INQUIRY_TYPE_LABEL[context.inquiryType] ?? "Ask the Supplier";
  const inputCls =
    "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]";

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "professional",
          name: form.name,
          businessName: form.businessName,
          contact: form.email || form.phone,
          interest: title,
          message: [
            form.message,
            form.services && `Services: ${form.services}`,
            form.city && `Location: ${form.city}${form.state ? `, ${form.state}` : ""}`,
            form.locations && `Locations: ${form.locations}`,
            form.monthlyClients && `Monthly clients: ${form.monthlyClients}`,
            form.currentRetail && `Current retail: ${form.currentRetail}`,
            form.estimatedOrder && `Estimated order: ${form.estimatedOrder}`,
            form.preferredTime && `Preferred follow-up: ${form.preferredTime}`,
            form.preferredContact && `Preferred contact: ${form.preferredContact}`,
            form.businessType && `Business type: ${form.businessType}`,
            form.interest && `Product/category: ${form.interest}`,
            context.supplierName && `Supplier: ${context.supplierName}`,
            context.productName && `Product: ${context.productName}`,
          ]
            .filter(Boolean)
            .join("\n"),
          sourcePage:
            context.referringUrl ||
            (typeof window !== "undefined" ? window.location.pathname : "/marketplace"),
          // Extended marketplace fields (stored in message + extras if API supports)
          inquiryType: context.inquiryType,
          supplierSlug: context.supplierSlug,
          productId: context.productId,
          email: form.email,
          phone: form.phone,
          consentEmail: true,
          consentSms: form.preferredContact === "SMS" || form.preferredContact === "Either",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(15,20,25,0.18)] sm:rounded-3xl sm:shadow-cardHover"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div>
            <h2 id={titleId} className="text-[17px] font-bold text-ink">
              {title}
            </h2>
            {(context.supplierName || context.productName) && (
              <p className="mt-0.5 text-[13px] text-ink-muted">
                {[context.supplierName, context.productName].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-tint hover:text-ink"
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {state === "sent" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="text-[16px] font-bold text-emerald-800">Inquiry received.</p>
              <p className="mt-1 text-[14px] text-emerald-700">
                Our team will review and follow up. The selected supplier may also be
                contacted about this request.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required value={form.name} onChange={set("name")} placeholder="Name *" className={inputCls} aria-label="Name" />
                <input required value={form.businessName} onChange={set("businessName")} placeholder="Business name *" className={inputCls} aria-label="Business name" />
              </div>
              <select required value={form.businessType} onChange={set("businessType")} className={inputCls} aria-label="Business type">
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required type="email" value={form.email} onChange={set("email")} placeholder="Email *" className={inputCls} aria-label="Email" />
                <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone *" className={inputCls} aria-label="Phone" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required value={form.city} onChange={set("city")} placeholder="City *" className={inputCls} aria-label="City" />
                <input required value={form.state} onChange={set("state")} placeholder="State *" className={inputCls} aria-label="State" />
              </div>
              <input value={form.services} onChange={set("services")} placeholder="Services offered" className={inputCls} aria-label="Services offered" />
              <input value={form.interest} onChange={set("interest")} placeholder="Product or category of interest" className={inputCls} aria-label="Product or category of interest" />
              <select value={form.preferredContact} onChange={set("preferredContact")} className={inputCls} aria-label="Preferred contact method">
                {PREFERRED_CONTACT.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder="Message"
                rows={3}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]"
                aria-label="Message"
              />

              <details className="rounded-xl border border-line-soft bg-surface-soft p-3">
                <summary className="cursor-pointer text-[13px] font-semibold text-ink-soft">
                  Optional qualification details
                </summary>
                <div className="mt-3 grid gap-2">
                  <input value={form.locations} onChange={set("locations")} placeholder="Number of locations" className={inputCls} />
                  <input value={form.monthlyClients} onChange={set("monthlyClients")} placeholder="Approximate monthly clients" className={inputCls} />
                  <input value={form.currentRetail} onChange={set("currentRetail")} placeholder="Current retail products" className={inputCls} />
                  <input value={form.estimatedOrder} onChange={set("estimatedOrder")} placeholder="Estimated opening order" className={inputCls} />
                  <input value={form.preferredTime} onChange={set("preferredTime")} placeholder="Preferred follow-up time" className={inputCls} />
                </div>
              </details>

              <label className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line text-brand-500"
                  required
                />
                <span>
                  By submitting, you agree that GoBeauty and the selected supplier may
                  contact you about this inquiry. Message and data rates may apply.
                  Reply STOP to opt out of SMS.
                </span>
              </label>

              <button
                type="submit"
                disabled={state === "sending" || !consent}
                className="h-12 rounded-pill bg-brand-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600 disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Submit inquiry"}
              </button>
              {state === "error" && (
                <p className="text-center text-[13.5px] text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
