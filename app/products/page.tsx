import type { Metadata } from "next";
import ProductsHero from "@/components/products/products-hero";
import PopularFilters from "@/components/products/popular-filters";
import CategoryGrid from "@/components/products/category-grid";
import TopBrands from "@/components/products/top-brands";
import ProductBenefits from "@/components/products/product-benefits";
import ProductResults from "@/components/products/product-results";
import { BADGE_LABELS, listProducts } from "@/lib/gbApi";
import { parseFilterKeys } from "@/lib/products-url";

export const metadata: Metadata = {
  title: "Beauty Products & Ingredient Analysis",
  description:
    "Search beauty products, decode ingredients, compare formulas, and discover skincare, makeup, hair care, and body care with AI-powered analysis.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Beauty Products & Ingredient Analysis | goBeauty.ai",
    description:
      "Search beauty products, decode ingredients, compare formulas, and discover skincare, makeup, hair care, and body care with AI-powered analysis.",
    url: "/products",
    images: ["/images/products/products-hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Products & Ingredient Analysis | goBeauty.ai",
    description:
      "Search beauty products, decode ingredients, and discover skincare with AI-powered analysis.",
    images: ["/images/products/products-hero.webp"],
  },
};

export const revalidate = 300;

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Beauty Products & Ingredient Analysis",
  description:
    "Search beauty products, decode ingredients, and discover skincare, makeup, hair care, and body care with AI-powered analysis.",
  url: "https://www.gobeauty.ai/products",
  isPartOf: {
    "@type": "WebSite",
    name: "goBeauty.ai",
    url: "https://www.gobeauty.ai/",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    badge?: string;
    filters?: string;
    category?: string;
    sort?: string;
    view?: string;
  };
}) {
  const q = (searchParams.q ?? "").trim();
  const category = (searchParams.category ?? "").trim();
  const sort = searchParams.sort ?? "relevance";
  const viewAll = searchParams.view === "all";

  // Accept both filters= (hyphenated public URL) and badge= (API-style).
  const fromFilters = parseFilterKeys(searchParams.filters);
  const fromBadge = parseFilterKeys(searchParams.badge);
  const merged = Array.from(new Set([...fromFilters, ...fromBadge]));
  const activeFilters = merged.filter(
    (k) => k in BADGE_LABELS || k === "sensitive_skin" || k === "pregnancy_friendly",
  );
  const apiBadges = activeFilters.filter((k) => k in BADGE_LABELS);

  const isDiscovery = !q && !category && activeFilters.length === 0 && !viewAll;

  // Always load products so category links (?category=skincare), view=all, search,
  // and the discovery landing all show a real product grid (not an empty state).
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  try {
    const res = await listProducts(q, {
      badge: apiBadges.join(","),
      category: category || undefined,
      // Discovery / unfiltered browse: bayesian top-rated. Explicit sort from UI wins.
      sort: sort !== "relevance" ? sort : isDiscovery || viewAll ? "top" : undefined,
      limit: 48,
    });
    products = res.products ?? [];
  } catch {
    products = [];
  }

  return (
    <div className="products-landing bg-[var(--beauty-white)] text-[var(--beauty-text)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <ProductsHero initialQuery={q} activeFilters={activeFilters} />

      <PopularFilters active={activeFilters} q={q} category={category} />

      {isDiscovery && (
        <>
          <CategoryGrid />
          <TopBrands />
        </>
      )}

      <ProductResults
        q={q}
        category={category}
        activeFilters={activeFilters}
        products={products}
        sort={sort}
        isDiscovery={isDiscovery}
      />

      {isDiscovery && <ProductBenefits />}
    </div>
  );
}
