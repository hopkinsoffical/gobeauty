import type { Metadata } from "next";
import ChipBar from "@/components/ChipBar";
import CompactHero from "@/components/CompactHero";
import PathCardGrid from "@/components/PathCardGrid";
import TrendingFeed from "@/components/TrendingFeed";
import ForBusinessesSection from "@/components/ForBusinessesSection";

export const metadata: Metadata = {
  title: "goBeauty.ai — Get the Beauty Look You Want",
  description:
    "Upload a look, describe your beauty goal, or search for a service. GoBeauty.ai helps you decide whether to DIY, book a professional, or shop the right products.",
};

export default function HomePage() {
  return (
    <>
      <ChipBar />
      <CompactHero />
      <PathCardGrid />
      <TrendingFeed />
      <ForBusinessesSection />
    </>
  );
}
