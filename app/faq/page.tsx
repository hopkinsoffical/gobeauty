import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_FAQ_GROUPS, allSiteFaqItems } from "@/lib/data/site-faq";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";

const PAGE_URL = "https://www.gobeauty.ai/faq";

export const metadata: Metadata = {
  title: "FAQ — Beauty AI, Products, Salons & Account Help",
  description:
    "Frequently asked questions about goBeauty.ai: Get This Look AI analysis, Skin Analyzer, products and ingredients, Find Pros, local rankings, marketplace, privacy, and accounts.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "goBeauty.ai FAQ",
    description:
      "Answers about AI beauty discovery, products, local pros, salon marketplace, and accounts on goBeauty.ai.",
    url: PAGE_URL,
  },
};

export default function FaqPage() {
  const flat = allSiteFaqItems();
  const faqLd = faqPageJsonLd(flat, PAGE_URL);
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: "https://www.gobeauty.ai/" },
    { name: "FAQ", url: PAGE_URL },
  ]);

  return (
    <div className="bg-[#fffaf9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#fff5ed]">
        <div className="mx-auto max-w-[900px] px-5 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>／</span>
            <span className="text-ink">FAQ</span>
          </nav>
          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Help center
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-[1.08] text-ink md:text-[3.2rem]">
            Frequently asked questions about goBeauty.ai
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-soft md:text-[16px]">
            Straight answers about AI look analysis, skincare tools, products,
            local salons, and business features — written so you can act in one
            step.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SITE_FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-pill border border-brand-100 bg-white/90 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-soft shadow-card transition hover:border-brand-300 hover:text-brand-700"
              >
                {g.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[900px] space-y-14 px-5 py-12 md:py-16">
        {SITE_FAQ_GROUPS.map((group, gi) => (
          <section key={group.id} id={group.id} className="scroll-mt-24">
            <div className="mb-5">
              <h2 className="font-display text-[1.65rem] text-ink md:text-[1.85rem]">
                {group.title}
              </h2>
              <p className="mt-2 text-[14.5px] text-ink-soft">{group.description}</p>
            </div>
            <FaqAccordion items={group.items} openFirst={gi === 0} />
          </section>
        ))}

        <section className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-display text-2xl text-ink">Still need help?</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
            Browse the{" "}
            <Link href="/blog" className="font-semibold text-brand-600 hover:underline">
              goBeauty blog
            </Link>{" "}
            for deeper guides, review the{" "}
            <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">
              Privacy Policy
            </Link>
            , or explore{" "}
            <Link
              href="/get-this-look"
              className="font-semibold text-brand-600 hover:underline"
            >
              Get This Look
            </Link>{" "}
            to analyze a beauty photo now.
          </p>
        </section>
      </div>
    </div>
  );
}
