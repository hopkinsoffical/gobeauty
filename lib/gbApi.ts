// Server-side client for the goBeauty products API.
// The gb_* data lives on the VPC-private RDS; Vercel reaches it through the
// read-only API on the EC2 (see documents/gb_products_api.py on the ops box).
const BASE = process.env.GB_API_URL ?? "https://52-207-187-219.nip.io:8443";

export type Badges = Record<string, boolean>;

export interface ProductCard {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string | null;
  badges: Badges;
  ratingAvg: number | null;
  ratingCount: number;
  images: { url: string; alt?: string }[];
}

export interface Ingredient {
  position: number;
  slug: string;
  inciName: string;
  displayName: string | null;
  rating: "superstar" | "goodie" | "neutral" | "icky" | null;
  irritancy: [number, number] | null;
  comedogenicity: [number, number] | null;
  isKey: boolean;
  functions: string[];
  euAllergen: boolean;
  faTrigger: boolean;
}

export interface Effect {
  slug: string;
  name: string;
  description: string | null;
  count: number;
  score: number;
}

export interface ProductDetail extends ProductCard {
  brandCountry: string | null;
  description: string | null;
  sizeLabel: string | null;
  isCrueltyFree: boolean | null;
  isVegan: boolean | null;
  ratingCounts: Record<string, number>;
  ingredients: Ingredient[];
  effects: { benefits: Effect[]; concerns: Effect[] };
  variants: {
    label: string;
    price_cents: number;
    currency: string;
    compare_at_cents: number | null;
    stock_qty: number | null;
    is_default: boolean;
  }[];
  offers: {
    retailer: string;
    url: string;
    price_cents: number | null;
    currency: string;
    in_stock: boolean | null;
  }[];
  dupes: Dupe[];
}

export interface Dupe {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  badges: Badges;
  images: { url: string; alt?: string }[];
  sharedIngredients: number;
  similarity: number;
}

export interface CompareResult {
  a: ProductDetail;
  b: ProductDetail;
  overlap: { shared: string[]; onlyA: string[]; onlyB: string[]; sharedCount: number };
}

export interface IngredientSummary {
  slug: string;
  inciName: string;
  displayName: string | null;
  rating: Ingredient["rating"];
  irritancy: [number, number] | null;
  comedogenicity: [number, number] | null;
  functions: string[];
  productCount: number;
}

export interface IngredientDetail extends Omit<IngredientSummary, "productCount"> {
  description: string | null;
  quickFacts: string[];
  euAllergen: boolean;
  faTrigger: boolean;
  aliases: string[];
  effects: { benefits: Effect[]; concerns: Effect[] };
  products: (ProductCard & { position: number; isKey: boolean })[];
}

export interface BrandDetail {
  slug: string;
  name: string;
  website: string | null;
  country: string | null;
  description: string | null;
  logoUrl: string | null;
  products: ProductCard[];
}

export interface CategoryNode {
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
  children: CategoryNode[];
}

export interface CategoryRef {
  slug: string;
  name: string;
  productCount: number;
}

export interface CategoryProduct extends ProductCard {
  description: string | null;
  brandCountry: string | null;
  ingredientCount: number;
  priceCents: number | null;
  isCrueltyFree: boolean | null;
  isVegan: boolean | null;
}

export interface ProductRef {
  slug: string;
  name: string;
  brand: string;
}

export interface CategoryDetail {
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
  breadcrumb: { slug: string; name: string }[];
  children: CategoryRef[];
  siblings: CategoryRef[];
  products: CategoryProduct[];
  faq: {
    topRated: ProductRef | null;
    mostPopular: ProductRef | null;
    fewestIngredients: ProductRef | null;
    mostAffordable: ProductRef | null;
    mostAffordablePriceCents: number | null;
  };
}

// skinsort blocks hotlinking (CORP: same-origin + Cloudflare rule), so every
// scraped image URL must go through our same-origin /img proxy to render.
const PROXIED_HOSTS = /^https:\/\/(storage\.)?skinsort\.com\//;

function proxyImageUrls(v: unknown): unknown {
  if (typeof v === "string")
    return PROXIED_HOSTS.test(v) ? `/img?u=${encodeURIComponent(v)}` : v;
  if (Array.isArray(v)) return v.map(proxyImageUrls);
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, proxyImageUrls(x)]),
    );
  return v;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`gb api ${res.status} for ${path}`);
  return proxyImageUrls(await res.json()) as T;
}

export const listProducts = (
  q = "",
  opts: { badge?: string; category?: string; brand?: string; sort?: string; limit?: number } = {},
) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (opts.badge) params.set("badge", opts.badge);
  if (opts.category) params.set("category", opts.category);
  if (opts.brand) params.set("brand", opts.brand);
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return get<{ products: ProductCard[] }>(`/api/gb/products${qs ? `?${qs}` : ""}`);
};

export const getProduct = (slug: string) =>
  get<ProductDetail>(`/api/gb/products/${encodeURIComponent(slug)}`);

export const listCategories = () =>
  get<{ categories: CategoryNode[] }>(`/api/gb/categories`);

export const getCategory = (slug: string) =>
  get<CategoryDetail>(`/api/gb/categories/${encodeURIComponent(slug)}`);

export const listIngredients = (q = "", limit = 60) =>
  get<{ ingredients: IngredientSummary[] }>(
    `/api/gb/ingredients?limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ""}`,
  );

export const getIngredient = (slug: string) =>
  get<IngredientDetail>(`/api/gb/ingredients/${encodeURIComponent(slug)}`);

export const getBrand = (slug: string) =>
  get<BrandDetail>(`/api/gb/brands/${encodeURIComponent(slug)}`);

export const compareProducts = (a: string, b: string) =>
  get<CompareResult>(`/api/gb/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);

// --- Local salon rankings (salon_ai_leaderboard via the same shim) --------

export interface SalonCard {
  slug: string;
  name: string;
  address: string | null;
  town: string | null;
  state: string | null;
  zipcode: string | null;
  category: string | null;
  rating: number | null;
  reviewCount: number;
  aiScore: number | null;
  website: string | null;
  phone: string | null;
  reportUrl: string;
}

export interface TopSalonsResult {
  scope: "town" | "area" | "state";
  salons: SalonCard[];
}

export const topSalons = (opts: {
  town?: string;
  state?: string;
  zip3?: string;
  category?: string;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (opts.town) params.set("town", opts.town);
  if (opts.state) params.set("state", opts.state);
  if (opts.zip3) params.set("zip3", opts.zip3);
  if (opts.category) params.set("category", opts.category);
  if (opts.limit) params.set("limit", String(opts.limit));
  return get<TopSalonsResult>(`/api/gb/salons/top?${params.toString()}`);
};

export const BADGE_LABELS: Record<string, string> = {
  paraben_free: "Paraben-free",
  sulfate_free: "Sulfate-free",
  silicone_free: "Silicone-free",
  alcohol_free: "Alcohol-free",
  fragrance_free: "Fragrance-free",
  essential_oil_free: "Essential-oil-free",
  oil_free: "Oil-free",
  fungal_acne_safe: "Fungal-acne safe",
  reef_safe: "Reef safe",
  eu_allergen_free: "EU-allergen-free",
};
