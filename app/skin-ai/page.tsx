import type { Metadata } from "next";
import SkinAiExperience from "@/components/skin-ai/SkinAiExperience";

export const metadata: Metadata = {
  title: "Skin AI Analyzer — free skin scan",
  description:
    "Upload a selfie for cosmetic skin scores: oiliness, dryness, redness, pores, spots, and fine lines. Get product matches and nearby skincare salon recommendations.",
  alternates: { canonical: "/skin-ai" },
  openGraph: {
    title: "Skin AI Analyzer | goBeauty.ai",
    description:
      "Free skin scan with scores, ingredient-checked product picks, and local skincare pros.",
    url: "/skin-ai",
  },
};

export default function SkinAiPage() {
  return <SkinAiExperience />;
}
