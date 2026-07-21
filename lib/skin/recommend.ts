import "server-only";
import { listProducts, type ProductCard } from "@/lib/gbApi";
import type { MetricKey, ProductRecGroup, SkinConcern } from "@/lib/skin/types";
import { METRIC_META } from "@/lib/skin/metrics";

const CONCERN_QUERIES: Record<
  MetricKey,
  { q: string; badge?: string; label: string }
> = {
  oiliness: { q: "niacinamide", badge: "oil_free", label: "Oil control" },
  dryness: { q: "ceramide moisturizer", label: "Hydration & barrier" },
  redness: { q: "centella soothing", badge: "fragrance_free", label: "Calm & soothe" },
  pores: { q: "BHA pore", badge: "oil_free", label: "Pore care" },
  spots: { q: "vitamin c brightening", label: "Brighten & even tone" },
  wrinkles: { q: "retinol peptide", label: "Firm & smooth" },
};

const SEVERITY_RANK = { high: 0, moderate: 1, low: 2 } as const;

export function pickTopConcerns(concerns: SkinConcern[], limit = 2): SkinConcern[] {
  return [...concerns]
    .filter((c) => c.severity !== "low")
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
    .slice(0, limit);
}

export async function fetchProductsForConcerns(
  concerns: SkinConcern[],
): Promise<ProductRecGroup[]> {
  const top = pickTopConcerns(concerns, 2);
  const targets: MetricKey[] =
    top.length > 0 ? top.map((c) => c.key) : (["dryness"] as MetricKey[]);

  const seen = new Set<string>();
  const groups: ProductRecGroup[] = [];

  for (const key of targets) {
    const cfg = CONCERN_QUERIES[key];
    try {
      const { products } = await listProducts(cfg.q, {
        category: "skincare",
        badge: cfg.badge,
        sort: "top",
        limit: 6,
      });
      const items: ProductCard[] = [];
      for (const p of products) {
        if (seen.has(p.slug)) continue;
        seen.add(p.slug);
        items.push(p);
        if (items.length >= 4) break;
      }
      if (items.length < 2 && cfg.badge) {
        const retry = await listProducts(cfg.q, {
          category: "skincare",
          sort: "top",
          limit: 6,
        });
        for (const p of retry.products) {
          if (seen.has(p.slug)) continue;
          seen.add(p.slug);
          items.push(p);
          if (items.length >= 4) break;
        }
      }
      groups.push({
        concern: key,
        label: cfg.label || METRIC_META[key].label,
        items,
      });
    } catch {
      groups.push({ concern: key, label: cfg.label, items: [] });
    }
  }

  return groups;
}
