import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import BrandCarousel from "@/components/gb/BrandCarousel";
import { KBEAUTY_STATS } from "@/data/kbeauty-brands";
import { listBrands } from "@/lib/gbApi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "For Beauty Brands — reach salon owners and serious beauty buyers",
  description:
    "Boutique beauty brands: reach salon, spa, and studio owners through product intelligence pages, sample campaigns, wholesale leads, and weekly reporting.",
  alternates: { canonical: "/brands" },
};

// PRD v2 §7.7 — supplier conversion page. Key message: trade shows happen a
// few days a year; GoBeauty keeps products discoverable every day.
const OFFERS = [
  {
    title: "Supplier brand page",
    body: "A credible home for your brand, hosted where professional buyers already browse.",
  },
  {
    title: "Product Intelligence Cards",
    body: "Owner-friendly product pages: treatment pairing, client fit, retail margin, sample availability.",
  },
  {
    title: "Sample request campaigns",
    body: "Low-friction landing pages that turn salon interest into qualified sample requests.",
  },
  {
    title: "Targeted salon campaigns",
    body: "Segmented outreach by category, location, and service fit — SMS plus phone follow-up.",
  },
  {
    title: "Wholesale lead generation",
    body: "Wholesale inquiries, demo bookings, and training registrations captured into CRM.",
  },
  {
    title: "Weekly reporting",
    body: "Leads, sample requests, objections, feedback, and next steps — every week.",
  },
];

const STEPS = [
  { n: "1", title: "We build your pages", body: "Brand page, product cards, and a sample landing page." },
  { n: "2", title: "We run the campaign", body: "Targeted salon list, SMS outreach, phone follow-up." },
  { n: "3", title: "You get qualified leads", body: "Sample requests, wholesale inquiries, booked demos — reported weekly." },
];

export default async function ForBrandsPage() {
  const partnerBrands = await listBrands(60).then((r) => r.brands).catch(() => []);
  return (
    <>
      {/* Hero — deep charcoal B2B treatment (PRD §10) */}
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] text-white">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For Beauty Brands &amp; Suppliers
          </p>
          <h1 className="mt-3 max-w-[640px] font-display text-[2rem] leading-[1.12] md:text-[2.75rem]">
            Reach beauty professionals and product-conscious consumers.
          </h1>
          <p className="mt-4 max-w-[580px] text-[15.5px] leading-relaxed text-white/70">
            Trade shows happen a few days a year. GoBeauty helps your products
            stay discoverable every day — to salon owners, spa professionals,
            and serious beauty buyers actively looking for products.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition hover:bg-brand-600"
            >
              Request Brand Demo
            </a>
            <Link
              href="/brands/list-your-products"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 px-7 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              List Your Products
            </Link>
          </div>
        </div>
      </section>

      {/* Who it's for + how it works */}
      <section className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
        <p className="text-center text-[13px] text-ink-muted">
          Boutique skincare · K-beauty · Professional product lines · Aftercare
          brands · Tools &amp; devices · Spa retail
        </p>
        <p className="mt-3 text-center text-[13.5px]">
          <Link
            href="/brands/kbeauty"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Browse {KBEAUTY_STATS.total} K-beauty brands A–Z →
          </Link>
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-[15px] font-bold text-brand-600">
                {s.n}
              </span>
              <h2 className="mt-3 text-[15.5px] font-bold text-ink">{s.title}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-line-soft bg-surface-soft">
        <div className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            Campaigns built for qualified demand — not vague impressions.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((o) => (
              <div key={o.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <h3 className="text-[15.5px] font-bold text-ink">{o.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{o.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[12.5px] text-ink-muted">
            All supplier placements are clearly labeled as sponsored and kept
            separate from GoBeauty Fit recommendations. Outreach is consent-based
            with opt-out.
          </p>
        </div>
      </section>

      {/* Demo lead form */}
      <section className="mx-auto max-w-[640px] px-5 py-12 md:py-16" id="demo">
        <h2 className="text-center font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
          Request a brand demo.
        </h2>
        <p className="mt-2 text-center text-[14.5px] text-ink-soft">
          Tell us about your products and target buyers — we'll walk you
          through the campaign options and pilot pricing.
        </p>
        <div className="mt-6">
          <LeadForm
            audience="supplier"
            sourcePage="/brands"
            businessLabel="Brand name"
            interests={[
              "Request a brand demo",
              "Sample request campaign",
              "Wholesale lead generation",
              "Marketplace listing",
              "Trend sponsorship",
              "Something else",
            ]}
            submitLabel="Request Brand Demo"
          />
        </div>
      </section>

      {/* Partner brands marquee — every brand with live products on goBeauty */}
      {partnerBrands.length > 0 && (
        <section className="border-t border-line-soft bg-surface-soft">
          <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-16">
            <h2 className="text-center font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
              Brands already on goBeauty.
            </h2>
            <p className="mt-2 text-center text-[14.5px] text-ink-soft">
              {partnerBrands.length}+ beauty brands with products decoded and
              discoverable — ingredient by ingredient.
            </p>
            <div className="mt-8">
              <BrandCarousel brands={partnerBrands} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
