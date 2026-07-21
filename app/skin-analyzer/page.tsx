import type { Metadata } from "next";
import SkinAiExperience from "@/components/skin-ai/SkinAiExperience";

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
  return <SkinAiExperience />;
}
