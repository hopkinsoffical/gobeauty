import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import TrendGrid from "@/components/home/TrendGrid";
import QuickChannels from "@/components/home/QuickChannels";
import PopularNearYou from "@/components/home/PopularNearYou";
import AudienceEntryCards from "@/components/home/AudienceEntryCards";

export const metadata: Metadata = {
  title: "goBeauty.ai — Your AI Beauty Advisor",
  description:
    "Upload a photo, describe your goal, or search anything. Our AI recommends the right treatment, products, professionals, and aftercare—all personalized for you.",
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
