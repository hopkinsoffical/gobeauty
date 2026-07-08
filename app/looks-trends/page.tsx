import type { Metadata } from "next";
import Link from "next/link";
import LooksTrendsGrid from "@/components/looks/LooksTrendsGrid";

export const metadata: Metadata = {
  title: "Looks & Trends — current beauty looks, products, and aftercare",
  description:
    "See current beauty looks and trends with professional context: which services deliver them, which products support them, and how to maintain the result.",
  alternates: { canonical: "/looks-trends" },
};

// PRD v2 §7.5 — repeat-use trend intelligence for consumers, pros, creators,
// and suppliers, with commercial routing into every channel.
export default function LooksTrendsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#fdeef3] to-transparent"
        />
        <div className="mx-auto max-w-[1200px] px-5 pb-6 pt-10 md:pt-14">
          <h1 className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            Looks &amp; Trends
          </h1>
          <p className="mt-3 max-w-[600px] text-[15.5px] leading-relaxed text-ink-soft">
            Current looks with professional context — the service that delivers
            each one, the products that support it, and the aftercare that
            keeps it.
          </p>
        </div>
      </section>

      <LooksTrendsGrid initialType={searchParams.type} />

      {/* Commercial routing (PRD §7.5) */}
      <div className="mx-auto max-w-[1200px] px-5 pb-14">
        <div className="grid gap-3 rounded-2xl border border-line bg-surface-soft p-5 sm:grid-cols-3 md:p-6">
          {[
            {
              title: "Get this look done",
              body: "Find local pros who deliver it.",
              cta: "Find Pros",
              href: "/find-pros",
            },
            {
              title: "Shop what supports it",
              body: "Pro-recommended products and aftercare.",
              cta: "Shop Products",
              href: "/shop-products",
            },
            {
              title: "Promote this trend",
              body: "Salons and brands: put your work here.",
              cta: "Partner with us",
              href: "/for-brands",
            },
          ].map((c) => (
            <div key={c.href} className="flex flex-col rounded-xl bg-white p-4 shadow-card">
              <h2 className="text-[15px] font-bold text-ink">{c.title}</h2>
              <p className="mt-1 flex-1 text-[13.5px] text-ink-soft">{c.body}</p>
              <Link
                href={c.href}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-pill border border-ink px-4 text-[13.5px] font-semibold text-ink transition hover:bg-ink hover:text-white"
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
