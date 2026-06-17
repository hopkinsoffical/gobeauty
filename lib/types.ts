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

/**
 * Structured result Claude returns for an uploaded beauty photo. The field
 * order mirrors how it's presented to the user: what → why → how → how much →
 * recommendation → next steps.
 */
export interface BeautyAnalysis {
  /** Short, catchy name for the look (used as the feed/trending title). */
  title: string;
  /** Coarse bucket: Nails, Hair, Makeup, Skin, Brows, Lashes, Other. */
  category: string;
  /** What it is — the structure / description of the look. */
  what: string;
  /** Why it works — the appeal, occasion, what flatters it. */
  why: string;
  /** How it's achieved — technique, products, steps. */
  how: string;
  /** Rough price range a salon would charge. */
  howMuch: string;
  /** Concrete recommendation — what to ask for, products, who it suits. */
  recommendation: string;
  /** Suggested follow-up questions to keep the chat going. */
  nextSteps: string[];
  /** A few lowercase hashtag-style tags for discovery. */
  tags: string[];
}

/** A persisted analysis row, as surfaced to the public feed. */
export interface AnalysisRecord {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  analysis: BeautyAnalysis;
  createdAt: string;
}

/** A single turn in the analyze chat thread. */
export interface ChatMessage {
  role: "user" | "assistant";
  /** Plain text shown in the bubble. */
  text?: string;
  /** Present on the first assistant turn — the structured photo analysis. */
  analysis?: BeautyAnalysis;
  /** Object URL of the image the user uploaded (user turns only). */
  imagePreview?: string;
}
