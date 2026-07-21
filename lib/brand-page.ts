import type { BrandDetail, ProductCard } from "@/lib/gbApi";

/** Bayesian average so low-review products don't dominate "top rated". */
export function popularityScore(p: ProductCard, globalMean = 3.5): number {
  const n = p.ratingCount ?? 0;
  const r = p.ratingAvg ?? globalMean;
  const C = 12; // prior weight
  return (n / (n + C)) * r + (C / (n + C)) * globalMean;
}

export function brandStats(products: ProductCard[]) {
  const withRating = products.filter((p) => p.ratingAvg != null && p.ratingCount > 0);
  const totalReviews = products.reduce((s, p) => s + (p.ratingCount || 0), 0);
  const avgRating =
    withRating.length > 0
      ? withRating.reduce((s, p) => s + (p.ratingAvg as number) * p.ratingCount, 0) /
        Math.max(1, withRating.reduce((s, p) => s + p.ratingCount, 0))
      : null;

  const byCategory = new Map<string, number>();
  for (const p of products) {
    const cat = p.category?.trim() || "Other";
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
  }
  const categories = [...byCategory.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    productCount: products.length,
    totalReviews,
    avgRating,
    categories,
  };
}

/** Most reviewed = community popularity / 销量 proxy (no first-party sales feed). */
export function bestSellers(products: ProductCard[], limit = 8): ProductCard[] {
  return [...products]
    .sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0) || (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0))
    .slice(0, limit);
}

export function topRated(products: ProductCard[], limit = 8): ProductCard[] {
  return [...products]
    .filter((p) => (p.ratingCount || 0) >= 3)
    .sort((a, b) => popularityScore(b) - popularityScore(a))
    .slice(0, limit);
}

/** Expand thin catalog descriptions into a readable brand intro. */
export function brandIntro(b: BrandDetail, stats: ReturnType<typeof brandStats>): string {
  const desc = b.description?.trim();
  const thin =
    !desc ||
    desc.length < 40 ||
    (/^k-beauty/i.test(desc) && desc.split(/\s+/).length <= 6);

  if (!thin && desc) return desc;

  const origin = b.country ? `${b.country}` : "beauty";
  const topCats = stats.categories
    .slice(0, 3)
    .map((c) => c.name.toLowerCase())
    .join(", ");
  const parts = [
    `${b.name} is a ${origin.toLowerCase().includes("korean") ? "K-beauty" : origin} brand on goBeauty with ${stats.productCount} ingredient-checked product${stats.productCount === 1 ? "" : "s"}.`,
  ];
  if (topCats) {
    parts.push(`Shop categories like ${topCats}.`);
  }
  if (stats.totalReviews > 0 && stats.avgRating != null) {
    parts.push(
      `Community signal: ${stats.avgRating.toFixed(1)}★ average across ${stats.totalReviews.toLocaleString()} reviews.`,
    );
  }
  parts.push("Every formula is decoded for ingredients, benefits, and free-from badges.");
  if (desc && thin) parts.unshift(desc);
  return parts.join(" ");
}

export type BrandSortKey = "popular" | "rating" | "name" | "newest";

export function sortProducts(products: ProductCard[], sort: BrandSortKey): ProductCard[] {
  const list = [...products];
  switch (sort) {
    case "rating":
      return list.sort((a, b) => popularityScore(b) - popularityScore(a));
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      // API doesn't return createdAt on cards; keep popularity as stable fallback
      return list.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
    case "popular":
    default:
      return list.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
  }
}
