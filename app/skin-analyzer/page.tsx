import type { Metadata } from "next";
import SkinAiExperience from "@/components/skin-ai/SkinAiExperience";
import PageFaqSection from "@/components/PageFaqSection";
import { FAQ_SKIN_ANALYZER } from "@/lib/data/page-faqs";

export const metadata: Metadata = {
  title: "Skin Analyzer — free skin scan",
  description:
    "Upload a selfie for cosmetic skin scores: oiliness, dryness, redness, pores, spots, and fine lines. Get product matches and nearby skincare salon recommendations.",
  alternates: { canonical: "/skin-analyzer" },
  openGraph: {
    title: "Skin Analyzer | goBeauty.ai",
    description:
      "Free skin scan with scores, ingredient-checked product picks, and local skincare pros.",
    url: "/skin-analyzer",
  },
};

export default function SkinAnalyzerPage() {
  return (
    <>
      <SkinAiExperience />
      <PageFaqSection
        items={FAQ_SKIN_ANALYZER}
        pageUrl="https://www.gobeauty.ai/skin-analyzer"
        title="Skin Analyzer FAQ"
        subtitle="What the free cosmetic skin scan covers, how to take a selfie, and when to see a professional."
      />
    </>
  );
}
