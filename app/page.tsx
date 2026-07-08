import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import TrendGrid from "@/components/home/TrendGrid";
import QuickChannels from "@/components/home/QuickChannels";
import PopularNearYou from "@/components/home/PopularNearYou";
import AudienceEntryCards from "@/components/home/AudienceEntryCards";

export const metadata: Metadata = {
  title: "goBeauty.ai — Upload a look. GoBeauty helps you get it.",
  description:
    "AI beauty discovery: upload a look or describe your goal. GoBeauty finds the right service, local pros, pro-recommended products, and aftercare.",
};

// Homepage section order per PRD v2 §6.1: hero → trending grid → quick
// channel cards → local rankings teaser → pro/brand entries → footer.
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrendGrid />
      <QuickChannels />
      <PopularNearYou />
      <AudienceEntryCards />
    </>
  );
}
