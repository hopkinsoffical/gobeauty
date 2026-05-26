import type { Metadata } from "next";
import RankingHero from "@/components/RankingHero";
import SalonRankingCard from "@/components/SalonRankingCard";
import SalonMap from "@/components/SalonMap";
import RankingMethodology from "@/components/RankingMethodology";
import OwnerCTA from "@/components/OwnerCTA";
import RankingFAQ from "@/components/RankingFAQ";
import { SALONS_EDISON_NJ } from "@/lib/data/salons";
import { METHOD_CRITERIA } from "@/lib/data/methods";
import { FAQ_EDISON_NJ } from "@/lib/data/faq";

const CITY = "Edison";
const STATE = "NJ";
const UPDATED_LABEL = "May 2026";

export const metadata: Metadata = {
  title: `Best Nail Salons in ${CITY}, ${STATE} (${new Date().getFullYear()})`,
  description: `The top 10 nail salons in ${CITY}, ${STATE} — ranked by Google visibility, real reviews, rating quality, and AI Growth Score. Updated monthly by GoBeauty.`,
  alternates: {
    canonical: `/best-nail-salons/${CITY.toLowerCase()}-${STATE.toLowerCase()}`,
  },
  openGraph: {
    title: `Best Nail Salons in ${CITY}, ${STATE}`,
    description: `Top-rated nail salons in ${CITY}, ${STATE}, ranked by Google visibility, reviews, and AI Growth Score.`,
    type: "article",
  },
};

export default function BestNailSalonsEdisonPage() {
  const salons = SALONS_EDISON_NJ;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Nail Salons in ${CITY}, ${STATE}`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: salons.length,
    itemListElement: salons.map((s) => ({
      "@type": "ListItem",
      position: s.rank,
      item: {
        "@type": "BeautySalon",
        name: s.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: s.address,
          addressLocality: CITY,
          addressRegion: STATE,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: s.rating,
          reviewCount: s.reviewCount,
        },
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_EDISON_NJ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobeauty.ai/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best Nail Salons",
        item: "https://gobeauty.ai/best-nail-salons",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${CITY}, ${STATE}`,
      },
    ],
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <RankingHero
        city={CITY}
        state={STATE}
        updatedLabel={UPDATED_LABEL}
        salonsAnalyzed={62}
        reviewsScanned={14200}
      />

      <section
        id="top-salons"
        aria-label="Top nail salons"
        className="mx-auto max-w-7xl px-5 pb-6 md:pb-10"
      >
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-9">
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display text-[26px] tracking-tight text-ink md:text-3xl">
                Top {salons.length} nail salons
              </h2>
              <span className="text-[13.5px] text-ink-muted">
                {salons.length} salons · {CITY}, {STATE}
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              {salons.map((s) => (
                <SalonRankingCard key={s.slug} salon={s} />
              ))}
            </div>
          </div>
          <aside aria-label="Salon map">
            <SalonMap salons={salons} />
          </aside>
        </div>
      </section>

      <RankingMethodology criteria={METHOD_CRITERIA} />
      <OwnerCTA city={CITY} state={STATE} />
      <RankingFAQ items={FAQ_EDISON_NJ} />
    </>
  );
}
