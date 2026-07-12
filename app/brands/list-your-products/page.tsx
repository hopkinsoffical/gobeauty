"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSupplier } from "@/lib/data/marketplace";

const SUPPLIER_TYPES = [
  "Brand",
  "Distributor",
  "OEM / private label",
  "Multi-brand retailer",
  "Equipment supplier",
  "Other",
];

const TARGET_BUYERS = [
  "Salon owners",
  "Spa owners",
  "Estheticians",
  "Hairstylists",
  "Nail technicians",
  "Lash artists",
  "Med spas",
  "Beauty boutiques",
  "Consumers",
];

const PRIMARY_GOALS = [
  "Marketplace listing",
  "Product launch",
  "Sample request campaign",
  "Salon pricing inquiries",
  "Wholesale lead generation",
  "Product training registration",
  "Equipment demo booking",
  "Regional salon expansion",
  "Private-label leads",
  "Trend sponsorship",
  "Something else",
];

const YES_NO_PENDING = ["Yes", "No", "Not yet / TBD"];

const BENEFITS = [
  {
    title: "Build a professional supplier page",
    body: "Show your brand, product categories, professional use cases, and business support.",
  },
  {
    title: "Make products easier to discover",
    body: "Appear in relevant service, treatment, aftercare, trend, and product searches.",
  },
  {
    title: "Generate qualified inquiries",
    body: "Receive product, sample, salon-pricing, training, demo, or wholesale interest.",
  },
  {
    title: "Expand into salon sales channels",
    body: "Learn which beauty businesses, services, and regions show interest in your products.",
  },
  {
    title: "Run targeted campaigns",
    body: "Use GoBeauty’s supplier campaigns to reach matched salon and spa businesses.",
  },
];

function ListProductsForm() {
  const searchParams = useSearchParams();
  const claimSlug = searchParams.get("claim") ?? "";
  const claimSupplier = claimSlug ? getSupplier(claimSlug) : undefined;

  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    contactName: "",
    workEmail: "",
    phone: "",
    companyName: claimSupplier?.name ?? "",
    companyWebsite: claimSupplier?.websiteUrl ?? "",
    supplierType: claimSupplier ? "Brand" : SUPPLIER_TYPES[0],
    brandNames: claimSupplier?.name ?? "",
    productCategories: claimSupplier?.productCategories.join(", ") ?? "",
    targetBuyers: TARGET_BUYERS[0],
    salesChannels: "",
    sellToSalons: "Not yet / TBD",
    offerSamples: "Not yet / TBD",
    offerSalonPricing: "Not yet / TBD",
    offerTraining: "Not yet / TBD",
    offerDemos: "Not yet / TBD",
    offerPrivateLabel: "Not yet / TBD",
    shippingMarkets: "",
    productCount: "",
    primaryGoal: claimSlug ? "Marketplace listing" : PRIMARY_GOALS[0],
    notes: claimSlug
      ? `Claiming / updating profile: ${claimSlug}`
      : "",
  });

  const inputCls =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]";

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "supplier",
          name: form.contactName,
          businessName: form.companyName,
          contact: form.workEmail || form.phone,
          interest: form.primaryGoal,
          message: [
            form.notes,
            `Website: ${form.companyWebsite}`,
            `Phone: ${form.phone}`,
            `Supplier type: ${form.supplierType}`,
            `Brands: ${form.brandNames}`,
            `Categories: ${form.productCategories}`,
            `Target buyers: ${form.targetBuyers}`,
            `Sales channels: ${form.salesChannels}`,
            `Sell to salons/spas: ${form.sellToSalons}`,
            `Samples: ${form.offerSamples}`,
            `Salon/wholesale pricing: ${form.offerSalonPricing}`,
            `Training: ${form.offerTraining}`,
            `Demos: ${form.offerDemos}`,
            `Private label: ${form.offerPrivateLabel}`,
            `Shipping markets: ${form.shippingMarkets}`,
            `Product count: ${form.productCount}`,
            claimSlug && `Claim profile: ${claimSlug}`,
          ]
            .filter(Boolean)
            .join("\n"),
          sourcePage: claimSlug
            ? `/brands/list-your-products?claim=${claimSlug}`
            : "/brands/list-your-products",
          inquiryType: claimSlug ? "claim_profile" : "list_products",
          supplierSlug: claimSlug || undefined,
          email: form.workEmail,
          phone: form.phone,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-[18px] font-bold text-emerald-800">
          Thanks — we received your supplier information.
        </p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-emerald-700">
          Our team will review your products, listing needs, and target salon
          audience before following up. Listing is not automatic.
        </p>
        <Link
          href="/marketplace"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white"
        >
          Explore the marketplace
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      {claimSupplier && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-[13.5px] text-brand-800">
          You&apos;re claiming or updating <strong>{claimSupplier.name}</strong>.
          We&apos;ll review before any profile ownership changes go live.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={form.contactName} onChange={set("contactName")} placeholder="Contact name *" className={inputCls} aria-label="Contact name" />
        <input required type="email" value={form.workEmail} onChange={set("workEmail")} placeholder="Work email *" className={inputCls} aria-label="Work email" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={form.phone} onChange={set("phone")} placeholder="Phone" className={inputCls} aria-label="Phone" />
        <input required value={form.companyName} onChange={set("companyName")} placeholder="Company name *" className={inputCls} aria-label="Company name" />
      </div>
      <input value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="Company website" className={inputCls} aria-label="Company website" />
      <select value={form.supplierType} onChange={set("supplierType")} className={inputCls} aria-label="Supplier type">
        {SUPPLIER_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input value={form.brandNames} onChange={set("brandNames")} placeholder="Brand names represented" className={inputCls} aria-label="Brand names" />
      <input value={form.productCategories} onChange={set("productCategories")} placeholder="Product categories" className={inputCls} aria-label="Product categories" />
      <select value={form.targetBuyers} onChange={set("targetBuyers")} className={inputCls} aria-label="Target buyers">
        {TARGET_BUYERS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input value={form.salesChannels} onChange={set("salesChannels")} placeholder="Current sales channels" className={inputCls} aria-label="Current sales channels" />

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["sellToSalons", "Do you sell to salons or spas?"],
            ["offerSamples", "Do you offer samples?"],
            ["offerSalonPricing", "Do you offer salon or wholesale pricing?"],
            ["offerTraining", "Do you provide product training?"],
            ["offerDemos", "Do you offer equipment demos?"],
            ["offerPrivateLabel", "Do you support private label?"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1 text-[12px] font-semibold text-ink-muted">
            {label}
            <select value={form[key]} onChange={set(key)} className={inputCls}>
              {YES_NO_PENDING.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input value={form.shippingMarkets} onChange={set("shippingMarkets")} placeholder="Main shipping markets" className={inputCls} aria-label="Shipping markets" />
        <input value={form.productCount} onChange={set("productCount")} placeholder="Number of products" className={inputCls} aria-label="Number of products" />
      </div>

      <label className="flex flex-col gap-1 text-[12px] font-semibold text-ink-muted">
        Primary goal
        <select value={form.primaryGoal} onChange={set("primaryGoal")} className={inputCls}>
          {PRIMARY_GOALS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>

      <textarea
        value={form.notes}
        onChange={set("notes")}
        placeholder="Additional notes"
        rows={4}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]"
        aria-label="Additional notes"
      />

      <button
        type="submit"
        disabled={state === "sending"}
        className="h-12 rounded-pill bg-brand-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Request Supplier Listing"}
      </button>
      {state === "error" && (
        <p className="text-center text-[13.5px] text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-center text-[12.5px] text-ink-muted">
        We do not promise automatic approval or immediate publication.
      </p>
    </form>
  );
}

export default function ListYourProductsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] text-white">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For beauty brands &amp; suppliers
          </p>
          <h1 className="mt-3 max-w-[640px] font-display text-[2rem] leading-[1.12] md:text-[2.75rem]">
            List your products on GoBeauty
          </h1>
          <p className="mt-4 max-w-[580px] text-[15.5px] leading-relaxed text-white/70">
            Reach salon owners, spa professionals, independent beauty pros, and
            product-conscious buyers searching by service, client need, aftercare,
            and retail opportunity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-10 md:py-12">
        <h2 className="font-display text-[1.4rem] text-ink md:text-[1.6rem]">
          Why list on GoBeauty
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-line bg-white p-4 shadow-card"
            >
              <h3 className="text-[13.5px] font-bold leading-snug text-ink">{b.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line-soft bg-surface-soft py-12 md:py-16">
        <div className="mx-auto max-w-[640px] px-5">
          <h2 className="text-center font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Request a supplier listing
          </h2>
          <p className="mt-2 text-center text-[14px] text-ink-soft">
            Tell us about your products and target buyers. Our team reviews every
            submission before publishing.
          </p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white" />}>
              <ListProductsForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-[13.5px] text-ink-muted">
            Looking for a campaign demo first?{" "}
            <Link href="/brands#demo" className="font-semibold text-brand-600">
              Request a supplier demo
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
