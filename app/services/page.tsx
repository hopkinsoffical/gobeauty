import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Our Services — AI Beauty Growth for Brand Suppliers",
  description:
    "Product launch, sample request, wholesale lead generation, product listings, post-show follow-up, and sponsored trend campaigns for beauty brand suppliers.",
  alternates: { canonical: "/services" },
};

type Service = {
  n: number;
  title: string;
  description: string;
  price: string;
  priceNote?: string;
  features: string[];
};

const SERVICES: Service[] = [
  {
    n: 1,
    title: "Product Launch Campaign",
    description: "Introduce new products to the right salon and spa buyers.",
    price: "$999",
    features: [
      "Supplier brand page",
      "Product intelligence cards",
      "Target outreach",
      "SMS & phone follow-up",
      "Demo / training booking",
      "Weekly campaign report",
    ],
  },
  {
    n: 2,
    title: "Sample Request Campaign",
    description: "Generate qualified sample requests from real buyers.",
    price: "$1,500",
    features: [
      "Sample landing page",
      "Target buyer list",
      "SMS campaign",
      "Lead capture & qualification",
      "Follow up workflow",
      "Sample request report",
    ],
  },
  {
    n: 3,
    title: "Wholesale Lead Generation Campaign",
    description: "Generate wholesale inquiries and buyer conversations.",
    price: "$1,500",
    features: [
      "Buyer targeting",
      "Wholesale inquiry form",
      "AI SMS & phone follow-up",
      "Human-assisted qualification",
      "Demo booking",
      "Qualified lead report",
    ],
  },
  {
    n: 4,
    title: "GoBeauty.ai Product Listings",
    description:
      "Turn your products into professional buying pages on GoBeauty.ai.",
    price: "$399",
    features: [
      "Supplier brand page",
      "Product intelligence cards",
      "Treatment-to-product match",
      "Aftercare / retail use case",
      "Professional copywriting",
      "Sample / wholesale CTA",
    ],
  },
  {
    n: 5,
    title: "Post-Show Lead Follow-Up Campaign",
    description: "Follow up with show leads before they go cold.",
    price: "TBD",
    features: [
      "Lead list cleaning",
      "SMS follow-up sequence",
      "Phone follow-up",
      "FAQ & objection handling",
      "Demo scheduling",
      "Post-show report",
    ],
  },
  {
    n: 6,
    title: "Sponsored Trend / Product Education Campaign",
    description: "Build trend-based awareness and product demand.",
    price: "TBD",
    features: [
      "Trend / treatment pages",
      "Short-form content angles",
      "Instagram / TikTok content promotion",
      "GoBeauty.ai trend visibility",
      "Sample / wholesale CTA",
      "Lead performance report",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] text-white">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For Brand Suppliers
          </p>
          <h1 className="mt-3 max-w-[720px] font-display text-[2rem] leading-[1.12] md:text-[2.75rem]">
            AI Beauty Growth Infrastructure for Brand Suppliers
          </h1>
          <p className="mt-4 max-w-[640px] text-[15.5px] leading-relaxed text-white/70">
            GoBeauty.ai and RankMySalon.ai are part of the 360aiMedia beauty
            growth network — built to help beauty brands reach salon owners, spa
            professionals, beauty businesses, and product-conscious consumers.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition hover:bg-brand-600"
            >
              View Our Services
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 px-7 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
              What We Deliver
            </p>
            <h2 className="mt-2 font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
              Our Services
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-soft">
            Campaign packages for product launches, sample demand, wholesale
            leads, marketplace listings, and trend education.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.n}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:shadow-cardHover"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-500/10 text-[14px] font-bold text-brand-600">
                  {s.n}
                </span>
                <span
                  className={[
                    "rounded-pill px-3 py-1 text-[13.5px] font-bold",
                    s.price === "TBD"
                      ? "bg-surface-soft text-ink-muted"
                      : "bg-brand-50 text-brand-700",
                  ].join(" ")}
                >
                  {s.price}
                </span>
              </div>
              <h3 className="mt-3 text-[16px] font-bold leading-snug text-ink">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                {s.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2 border-t border-line-soft pt-4">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[13.5px] text-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-400"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-pill border border-line text-[13.5px] font-semibold text-ink transition hover:border-brand-300 hover:bg-surface-tint hover:text-brand-700"
              >
                {s.price === "TBD" ? "Request pricing" : "Get started"}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* CTA + form */}
      <section
        id="contact"
        className="border-t border-line-soft bg-surface-soft"
      >
        <div className="mx-auto max-w-[640px] px-5 py-12 md:py-16">
          <h2 className="text-center font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            Ready to grow with GoBeauty?
          </h2>
          <p className="mt-2 text-center text-[14.5px] text-ink-soft">
            Tell us which campaign fits your brand — we&apos;ll confirm scope,
            timeline, and next steps.
          </p>
          <div className="mt-6">
            <LeadForm
              audience="supplier"
              sourcePage="/services"
              businessLabel="Brand name"
              interests={[
                "Product Launch Campaign ($999)",
                "Sample Request Campaign ($1,500)",
                "Wholesale Lead Generation ($1,500)",
                "GoBeauty.ai Product Listings ($399)",
                "Post-Show Lead Follow-Up (TBD)",
                "Sponsored Trend / Product Education (TBD)",
                "Custom package / something else",
              ]}
              submitLabel="Request Service Quote"
            />
          </div>
          <p className="mt-6 text-center text-[13px] text-ink-muted">
            Prefer to list products first?{" "}
            <Link
              href="/brands/list-your-products"
              className="font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2"
            >
              List your products
            </Link>{" "}
            or{" "}
            <Link
              href="/brands"
              className="font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2"
            >
              learn more for brands
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
