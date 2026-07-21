import type { Metadata } from "next";
import AnalyzeExperience from "@/components/AnalyzeExperience";
import PageFaqSection from "@/components/PageFaqSection";
import { getFeed } from "@/lib/analyses";
import { FAQ_GET_THIS_LOOK } from "@/lib/data/page-faqs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get This Look — upload a look, get your Beauty Path",
  description:
    "Upload a photo or describe your beauty goal. GoBeauty's AI decodes the look and builds your Beauty Path — the right service, local pros, pro-recommended products, and aftercare.",
  alternates: { canonical: "/get-this-look" },
};

// PRD v2 §7.1 — Get This Look channel. The AI analyze experience (upload,
// structured breakdown, follow-up chat) IS the Beauty Path flow.
export default async function GetThisLookPage() {
  const initialFeed = await getFeed(12);
  return (
    <>
      <AnalyzeExperience initialFeed={initialFeed} />
      <PageFaqSection
        items={FAQ_GET_THIS_LOOK}
        pageUrl="https://www.gobeauty.ai/get-this-look"
        title="Get This Look FAQ"
        subtitle="How photo analysis works, what you can upload, and how DIY vs pro recommendations are decided."
      />
    </>
  );
}
