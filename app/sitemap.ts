import type { MetadataRoute } from "next";
import { listIngredients, listProducts } from "@/lib/gbApi";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.gobeauty.ai";
  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/get-this-look`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/find-pros`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/local-rankings`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/local-rankings/best-nail-salons/edison-nj`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${base}/shop-products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/looks-trends`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/for-beauty-pros`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/for-brands`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ingredients`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare`, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Best-effort: the gb API can be briefly down without breaking the sitemap.
  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [{ products }, { ingredients }] = await Promise.all([
      listProducts(),
      listIngredients("", 200),
    ]);
    const brands = [...new Set(products.map((p) => p.brandSlug))];
    dynamic = [
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...brands.map((slug) => ({
        url: `${base}/brands/${slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...ingredients.map((i) => ({
        url: `${base}/ingredients/${i.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // fall through with fixed URLs only
  }

  return [...fixed, ...dynamic];
}
