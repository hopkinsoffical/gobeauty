import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.gobeauty.ai";
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/analyze`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
