export type SalonBadge =
  | "Top Rated"
  | "Fast Growing"
  | "Review Leader"
  | "Hidden Gem"
  | "Needs More Reviews";

export type GoogleVisibility = "High" | "Medium" | "Low";

/**
 * The shape components consume. When real data ships, point app/page.tsx
 * at the API and keep this contract stable so components don't move.
 */
export interface Salon {
  rank: number;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  aiGrowthScore: number;
  googleVisibility: GoogleVisibility;
  badge: SalonBadge;
  address: string;
  city: string;
  openNow: boolean;
  /** Cover photo URL. Use Unsplash for prototyping. */
  image: string;
  /** Short marketing blurb shown on cards. */
  tagline?: string;
  priceLevel?: 1 | 2 | 3;
}

export interface MethodCriterion {
  key: string;
  title: string;
  body: string;
  /** Emoji or short string used as a glyph. */
  glyph: string;
  accent: "rose" | "amber" | "teal" | "sky" | "violet" | "lime";
}

export interface FaqItem {
  q: string;
  a: string;
}
