import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "For Beauty Professionals — get discovered by the right clients",
  description:
    "Salons, spas, med spas, lash studios, and independent pros: claim your profile, run a free visibility checkup, and grow with reviews, AI phone/SMS, and retail.",
  alternates: { canonical: "/beauty-pros" },
};

// PRD v2 §7.6 — professional conversion page. Hero promise: "Get discovered
// by clients looking for your exact service." Bridges into RankMySalon.
const OFFERS = [
  {
    title: "Claim your profile",
    body: "Control your photos, services, and the evidence clients see when they compare providers.",
  },
  {
    title: "Free visibility checkup",
    body: "See how you rank for the services you actually sell — and what's holding you back on Google.",
  },
  {
    title: "Review & ranking growth",
    body: "Grow reviews with the right keywords so clients can see why you're good.",
  },
  {
    title: "AI phone & SMS response",
    body: "Answer every inquiry, follow up on quotes, and fill no-show gaps automatically.",
  },
  {
    title: "Social & content ideas",
    body: "Trend pages tell you which looks to promote this season and what content brings clients in.",
  },
  {
    title: "Retail & aftercare revenue",
    body: "Find products to use in treatments and sell after service — samples first, wholesale when it fits.",
  },
];

const AUDIENCE =
  "Salons · Spas · Med spas · Lash & brow studios · Estheticians · Hair stylists · Nail techs · Independent pros";

export default function ForBeautyProsPage() {
  return (
    <>
      {/* Hero — professional trust, deep charcoal (PRD §10) */}
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] text-white">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For Beauty Professionals
          </p>
          <h1 className="mt-3 max-w-[640px] font-display text-[2rem] leading-[1.12] md:text-[2.75rem]">
            Get discovered by clients looking for your exact service.
          </h1>
          <p className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-white/70">
            Consumers use GoBeauty to search looks, compare local providers,
            and pick a pro. Claim your profile so they find you — then grow
            with reviews, response tools, and retail.
          </p>
          <p className="mt-4 text-[13px] text-white/50">{AUDIENCE}</p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#claim"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition hover:bg-brand-600"
            >
              Claim Your Profile
            </a>
            <a
              href="#visibility-checkup"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 px-7 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              Free Visibility Checkup
            </a>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="mx-auto max-w-[1100px] px-5 py-12 md:py-16">
        <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
          Everything that makes you more chosen.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((o) => (
            <div key={o.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="text-[15.5px] font-bold text-ink">{o.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{o.body}</p>
            </div>
          ))}
        </div>
        {/* RankMySalon bridge (PRD §7.6) */}
        <p className="mt-6 rounded-2xl bg-surface-tint px-5 py-4 text-center text-[14.5px] font-semibold text-ink">
          GoBeauty helps clients choose.{" "}
          <a
            href="https://rankmysalon.ai"
            className="text-brand-600 underline decoration-brand-300 underline-offset-2"
          >
            RankMySalon
          </a>{" "}
          helps beauty businesses get chosen.
        </p>
      </section>

      {/* Product discovery for pros */}
      <section className="border-y border-line-soft bg-surface-soft" id="samples">
        <div className="mx-auto grid max-w-[1100px] gap-6 px-5 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
              Find products your clients will buy after service.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Try samples. Learn what's trending. Sell more aftercare. Browse
              products by treatment, client concern, retail potential, and
              margin — and request samples before committing to wholesale.
            </p>
            <Link
              href="/shop-products"
              className="mt-5 inline-flex h-12 items-center rounded-pill bg-ink px-7 text-[15px] font-semibold text-white transition hover:bg-ink-soft"
            >
              Browse Pro-Recommended Products
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&q=80&auto=format&fit=crop"
            alt="Retail products on a salon shelf"
            loading="lazy"
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-cardHover"
          />
        </div>
      </section>

      {/* Claim / checkup lead form */}
      <section className="mx-auto max-w-[640px] px-5 py-12 md:py-16" id="claim">
        <div id="visibility-checkup">
          <h2 className="text-center font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            Claim your profile or get a free visibility checkup.
          </h2>
          <p className="mt-2 text-center text-[14.5px] text-ink-soft">
            Tell us who you are — we'll show you how clients see you on
            GoBeauty and Google.
          </p>
        </div>
        <div className="mt-6">
          <LeadForm
            audience="professional"
            sourcePage="/beauty-pros"
            businessLabel="Salon / studio name"
            interests={[
              "Claim my profile",
              "Free visibility checkup",
              "Review & ranking growth",
              "AI phone / SMS response",
              "Product samples & retail",
              "Something else",
            ]}
            submitLabel="Request my checkup"
          />
        </div>
      </section>
    </>
  );
}
