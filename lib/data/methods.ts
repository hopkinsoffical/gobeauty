import type { MethodCriterion } from "@/lib/types";

export const METHOD_CRITERIA: MethodCriterion[] = [
  {
    key: "visibility",
    title: "Google Visibility",
    body: "Map-pack appearances, ranking for high-intent local queries, and Knowledge Panel completeness.",
    glyph: "📍",
    accent: "rose",
  },
  {
    key: "volume",
    title: "Review Volume",
    body: "Total review count, weighted against local market size and category competition.",
    glyph: "💬",
    accent: "sky",
  },
  {
    key: "rating",
    title: "Average Rating",
    body: "Stars over the last 24 months — normalized so brand-new salons aren't unfairly boosted.",
    glyph: "★",
    accent: "amber",
  },
  {
    key: "freshness",
    title: "Review Freshness",
    body: "How recent and consistent reviews are. Salons earning fresh reviews monthly rank higher.",
    glyph: "✨",
    accent: "violet",
  },
  {
    key: "booking",
    title: "Online Booking Readiness",
    body: "Bookable links, service menus, response time to messages, and mobile-friendly storefront.",
    glyph: "📅",
    accent: "teal",
  },
  {
    key: "growth",
    title: "AI Growth Opportunity",
    body: "Our model's forecast of how much each salon can grow with better reviews, SEO, and conversion.",
    glyph: "📈",
    accent: "lime",
  },
];
