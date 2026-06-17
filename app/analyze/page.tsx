import type { Metadata } from "next";
import AnalyzeExperience from "@/components/AnalyzeExperience";
import { getFeed } from "@/lib/analyses";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analyze a beauty photo with AI",
  description:
    "Upload a photo of any nail, hair, or makeup look. GoBeauty's AI breaks down what it is, why it works, how it's done, and how much it costs — then chats through your next steps.",
  alternates: { canonical: "/analyze" },
};

export default async function AnalyzePage() {
  const initialFeed = await getFeed(12);
  return <AnalyzeExperience initialFeed={initialFeed} />;
}
