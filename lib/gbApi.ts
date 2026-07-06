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
}

export interface CompareResult {
  a: ProductDetail;
  b: ProductDetail;
  overlap: { shared: string[]; onlyA: string[]; onlyB: string[]; sharedCount: number };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`gb api ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export const listProducts = (q = "") =>
  get<{ products: ProductCard[] }>(`/api/gb/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);

export const getProduct = (slug: string) =>
  get<ProductDetail>(`/api/gb/products/${encodeURIComponent(slug)}`);

export const compareProducts = (a: string, b: string) =>
  get<CompareResult>(`/api/gb/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);

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
