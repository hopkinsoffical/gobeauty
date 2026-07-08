import type { Metadata } from "next";
import RankingHero from "@/components/RankingHero";
import SalonRankingCard from "@/components/SalonRankingCard";
import RankingMethodology from "@/components/RankingMethodology";
import OwnerCTA from "@/components/OwnerCTA";
import RankingFAQ from "@/components/RankingFAQ";
import { SALONS_EDISON_NJ } from "@/lib/data/salons";
import { METHOD_CRITERIA } from "@/lib/data/methods";
import { FAQ_EDISON_NJ } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Best Nail Salons in Edison, NJ — ranked by GoBeauty",
  description:
    "The top nail salons in Edison, NJ, ranked with evidence: reviews, visibility, service proof, and responsiveness. See the Top 10 and how we score them.",
  alternates: { canonical: "/local-rankings/best-nail-salons/edison-nj" },
};

// First service-city ranking page (PRD v2 §7.3). URL pattern:
// /local-rankings/best-[service]/[city-state]. Swap the mock salon list for
// the API without touching components — the Salon contract is stable.
export default function EdisonNailSalonsPage() {
  return (
    <>
      <RankingHero
        city="Edison"
        state="NJ"
        updatedLabel="July 2026"
        salonsAnalyzed={112}
        reviewsScanned={18400}
      />
      <section className="mx-auto max-w-7xl px-5 pb-4" id="rankings">
        <ol className="space-y-5">
          {SALONS_EDISON_NJ.map((salon) => (
            <li key={salon.slug}>
              <SalonRankingCard salon={salon} />
            </li>
          ))}
        </ol>
      </section>
      <RankingMethodology criteria={METHOD_CRITERIA} />
      <OwnerCTA city="Edison" state="NJ" />
      <RankingFAQ items={FAQ_EDISON_NJ} />
    </>
  );
}
