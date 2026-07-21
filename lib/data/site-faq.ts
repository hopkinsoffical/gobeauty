import type { FaqItem } from "@/lib/types";

/** Grouped site-wide FAQ for /faq — optimized for AI citation (clear Q, 40–80 word answers). */
export type FaqGroup = {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
};

export const SITE_FAQ_GROUPS: FaqGroup[] = [
  {
    id: "about",
    title: "About goBeauty.ai",
    description: "What the platform is and who it is for.",
    items: [
      {
        q: "What is goBeauty.ai?",
        a: "goBeauty.ai is an AI-native beauty discovery engine. Upload a look photo, describe a beauty goal, or search a service — goBeauty recommends whether to DIY, book a professional, or shop pro-recommended products, with top options for each path.",
      },
      {
        q: "Who is goBeauty.ai for?",
        a: "Consumers who want a clear plan for a beauty look; people comparing salons and local pros; shoppers researching skincare and beauty products; and salon owners or brands who need product discovery, local rankings, or supplier leads.",
      },
      {
        q: "Is goBeauty.ai free to use?",
        a: "Core discovery tools — Get This Look, Skin Analyzer, product browsing, ingredients, and local rankings — are free for consumers. Some pro and supplier features (claiming a profile, listing products, growth reports) may require signup or a business plan.",
      },
      {
        q: "How is goBeauty.ai different from Instagram or Google?",
        a: "Instagram shows inspiration without a plan. Google shows many links without a decision. goBeauty turns a look or goal into an actionable path: DIY steps, bookable pros nearby, and products that match the look — with transparent ranking signals where applicable.",
      },
    ],
  },
  {
    id: "ai-tools",
    title: "AI tools & Get This Look",
    description: "Photo analysis, skin AI, and how recommendations work.",
    items: [
      {
        q: "How does Get This Look work?",
        a: "Upload a beauty photo (nails, hair, skin, makeup, lashes, brows, or similar). goBeauty’s AI analyzes the look and returns what it is, why it works, how to achieve it, estimated effort, and whether DIY, a pro, or shopping products is the best next step.",
      },
      {
        q: "What beauty categories does goBeauty analyze?",
        a: "goBeauty covers nails, hair, skin, makeup, lashes and brows, K-beauty looks, aftercare, and med-spa style goals. Support depth varies by category as models and catalogs expand.",
      },
      {
        q: "What is the Skin Analyzer?",
        a: "The Skin Analyzer uses AI to assess a selfie for common skin concerns, then suggests concern scores, product directions, and salon or pro options when a professional treatment is a better fit than at-home care.",
      },
      {
        q: "Does goBeauty store my photos?",
        a: "Photos are processed to generate analysis and recommendations. How long images are retained and how they are used is described in our Privacy Policy. Do not upload images of people who have not consented.",
      },
    ],
  },
  {
    id: "products",
    title: "Products, ingredients & shopping",
    description: "Catalog, compare, and pro-recommended shopping.",
    items: [
      {
        q: "Can I shop beauty products on goBeauty.ai?",
        a: "Yes. Browse the product library, shop pro-recommended products, filter by category and brand, compare products, and review ingredient pages. Availability and checkout depend on the product and fulfillment path shown on each product page.",
      },
      {
        q: "What is the product ingredients library?",
        a: "The ingredients library explains common cosmetic ingredients in plain language and links products that contain them. It helps you research actives, avoid ingredients you dislike, and compare formulas before buying.",
      },
      {
        q: "How do product comparisons work?",
        a: "Compare Products lets you place products side by side so you can review brand, category, key claims, and ingredients faster than opening many tabs. It is built for shoppers and pros evaluating retail or backbar options.",
      },
    ],
  },
  {
    id: "local",
    title: "Find pros & local rankings",
    description: "Salons, professionals, and ranking methodology.",
    items: [
      {
        q: "How does Find Pros work?",
        a: "Find Pros helps you discover beauty professionals and salons near you for a service or look. Results are intended to surface relevant local options so you can compare and book offline or through the salon’s own channels.",
      },
      {
        q: "How are local salon rankings calculated?",
        a: "Local rankings combine transparent signals such as Google visibility, review volume, average rating, review freshness, online booking readiness, and an AI Growth Opportunity score. Rankings refresh periodically; check the page date for the latest edition.",
      },
      {
        q: "Can salon owners claim their goBeauty profile?",
        a: "Yes. Owners can request a claim or growth report from ranking cards or the For Beauty Professionals section. Claiming helps correct business details and unlocks guidance on reviews, visibility, and product or service presentation.",
      },
    ],
  },
  {
    id: "business",
    title: "For salons, brands & suppliers",
    description: "Marketplace and business growth features.",
    items: [
      {
        q: "What is Products for Salons on goBeauty?",
        a: "Products for Salons is a professional marketplace where salon and spa buyers discover treatments, aftercare, retail, samples, equipment demos, and private-label opportunities from beauty suppliers — focused on leads and discovery rather than a multi-supplier cart.",
      },
      {
        q: "How can beauty brands list products on goBeauty?",
        a: "Brands and suppliers can use List Your Products to submit catalog information. Approved listings appear in consumer and/or salon-facing discovery surfaces so buyers can find brands, ingredients, and professional lines.",
      },
      {
        q: "Does goBeauty help salons get more clients?",
        a: "goBeauty surfaces local rankings, growth reports, and discovery pathways that connect consumers who already have a look in mind with nearby pros. Improving Google reviews, booking readiness, and profile completeness typically improves ranking signals over time.",
      },
    ],
  },
  {
    id: "account",
    title: "Account, privacy & contact",
    description: "Login, data, and support.",
    items: [
      {
        q: "How do I sign in to goBeauty.ai?",
        a: "goBeauty supports phone-based sign-in with a one-time code (OTP). Enter your mobile number, verify the code, then access saved looks, profile, and account features. Messaging consent is separate and described on the SMS Consent page.",
      },
      {
        q: "How does goBeauty use my data?",
        a: "We use account, usage, and analysis data to provide recommendations, improve the product, and operate services like checkout or SMS when you opt in. Mobile information is not shared with third parties for marketing. See the Privacy Policy for full details.",
      },
      {
        q: "How do I contact goBeauty support?",
        a: "For product or account questions, use the contact options on the site footer and legal pages. For SMS-related support, call +1 (877) 600-1886. Privacy and terms pages list additional rights and contact paths.",
      },
    ],
  },
];

/** Flat list for FAQPage schema (all groups). */
export function allSiteFaqItems(): FaqItem[] {
  return SITE_FAQ_GROUPS.flatMap((g) => g.items);
}
