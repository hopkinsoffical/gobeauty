import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import TrendGrid from "@/components/home/TrendGrid";
import QuickChannels from "@/components/home/QuickChannels";
import PopularNearYou from "@/components/home/PopularNearYou";
import HomeMarketplaceModule from "@/components/marketplace/HomeMarketplaceModule";
import AudienceEntryCards from "@/components/home/AudienceEntryCards";

export const metadata: Metadata = {
  title: "goBeauty.ai — Your AI Beauty Advisor",
  description:
    "Upload a photo, describe your goal, or search anything. Our AI recommends the right treatment, products, professionals, and aftercare—all personalized for you.",
};

// Homepage section order: hero → trending → channels → local teaser →
// marketplace module (marketplace doc §3) → Grow with GoBeauty → footer.
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrendGrid />
      <QuickChannels />
      <PopularNearYou />
      <HomeMarketplaceModule />
      <AudienceEntryCards />
    </>
  );
}
