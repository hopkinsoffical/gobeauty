/** Landing-page types for /products discovery UI. */

export type FilterKey =
  | "paraben_free"
  | "fragrance_free"
  | "silicone_free"
  | "alcohol_free"
  | "fungal_acne_safe"
  | "sulfate_free"
  | "essential_oil_free"
  | "oil_free"
  | "reef_safe"
  | "eu_allergen_free"
  | "sensitive_skin"
  | "pregnancy_friendly";

export interface PopularSearch {
  label: string;
  query: string;
}

export interface FilterDef {
  key: FilterKey;
  label: string;
  /** Shown in the primary row when true. */
  primary?: boolean;
  icon: "shield" | "flower" | "droplet" | "wine" | "sparkles" | "leaf" | "sun" | "heart" | "baby" | "waves";
}

export interface CategoryChip {
  label: string;
  href: string;
}

export interface CategoryCardData {
  slug: string;
  title: string;
  description: string;
  countLabel: string;
  popularLabel?: string;
  chips: CategoryChip[];
  ctaLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  /** Tailwind-friendly background class token. */
  tone: "blush" | "lavender" | "sage" | "peach";
}

export interface BrandCardData {
  name: string;
  href: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: "scan" | "shield-check" | "sparkles" | "users";
}

export interface PlatformStat {
  value: string;
  label: string;
  sub: string;
  icon: "package" | "store" | "brain";
}

export interface MockProduct {
  slug: string;
  brand: string;
  name: string;
  rating: number;
  reviewCount: number;
  imageSrc: string;
  badges: string[];
  analysisBadge: string;
}
