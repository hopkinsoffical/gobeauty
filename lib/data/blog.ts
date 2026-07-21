/**
 * Static blog posts for GEO/SEO — cite-worthy, question-led beauty content.
 * Expand by appending entries; routes are generated from `slug`.
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /**
   * Cover image path under /public (e.g. /images/blog/slug.jpg).
   * Shown on index cards and article hero; also used for Open Graph.
   */
  image: string;
  /** Short alt text for the cover image */
  imageAlt: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  /** ISO date YYYY-MM-DD when content was last reviewed */
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  /** 1–2 sentence summary for AI citation / meta */
  tldr: string;
  /** Markdown-ish sections rendered as HTML blocks */
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  relatedFaq?: { q: string; a: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-gobeauty-ai",
    title: "What is goBeauty.ai? AI beauty discovery explained",
    description:
      "goBeauty.ai turns a beauty look or goal into a clear plan: DIY, book a pro, or shop products — with AI photo analysis and local recommendations.",
    image: "/images/blog/what-is-gobeauty-ai.jpg",
    imageAlt: "Phone and beauty look photos on a soft pink salon table",
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-21",
    author: { name: "goBeauty Editorial", role: "Beauty product team" },
    tags: ["goBeauty", "AI beauty", "how it works"],
    tldr: "goBeauty.ai is an AI-native beauty discovery engine that analyzes a look or goal and recommends DIY steps, local professionals, or pro-recommended products.",
    sections: [
      {
        heading: "What problem does goBeauty solve?",
        paragraphs: [
          "Most people start beauty inspiration on social media, then stall: they do not know if the look is DIY, needs a salon, or depends on specific products. goBeauty.ai closes that gap with a decision engine — not just more images.",
          "Upload a photo or describe a goal. The platform returns what the look is, how hard it is, and the best path: do it yourself, book a professional, or shop products that match.",
        ],
      },
      {
        heading: "What can you do on goBeauty.ai today?",
        paragraphs: [
          "Core surfaces are built for both consumers and beauty businesses.",
        ],
        bullets: [
          "Get This Look — AI photo analysis and an actionable plan",
          "Skin Analyzer — concern-oriented skin insights and product directions",
          "Find Pros & Local Rankings — discover nearby salons with transparent signals",
          "Products & ingredients — browse, compare, and research formulas",
          "Products for Salons — supplier and pro-product discovery for businesses",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Consumers use goBeauty when they have a look in mind and need a plan. Professionals and salon owners use rankings, product discovery, and claim flows to improve visibility. Brands and suppliers list products to reach salon and consumer audiences.",
        ],
      },
    ],
    relatedFaq: [
      {
        q: "Is goBeauty only for nails?",
        a: "No. goBeauty covers nails, hair, skin, makeup, lashes and brows, K-beauty, and related aftercare or med-spa style goals, with depth expanding over time.",
      },
    ],
  },
  {
    slug: "how-to-get-a-nail-look-from-a-photo",
    title: "How to get a nail look from a photo (DIY vs salon)",
    description:
      "Step-by-step: use goBeauty Get This Look to turn a nail photo into DIY steps, product ideas, or a salon booking decision.",
    image: "/images/blog/how-to-get-a-nail-look-from-a-photo.jpg",
    imageAlt: "Manicured nails being photographed for a look analysis",
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-21",
    author: { name: "goBeauty Editorial", role: "Beauty product team" },
    tags: ["nails", "Get This Look", "DIY"],
    tldr: "Upload a nail photo to goBeauty Get This Look to learn the technique, difficulty, and whether DIY polish products or a salon appointment is the smarter path.",
    sections: [
      {
        heading: "Start with a clear photo",
        paragraphs: [
          "Use a well-lit photo of the finished nails, preferably from above with fingers flat. Avoid heavy filters. The clearer the shape, color, and art details, the more accurate the analysis.",
        ],
      },
      {
        heading: "Read the plan, not just the label",
        paragraphs: [
          "goBeauty describes the look (for example chrome, French, 3D charms), why it works, and how it is usually achieved. Difficulty and time estimates help you decide if home tools are enough.",
          "If the plan points to advanced techniques (builder gel extensions, intricate 3D art), booking a pro usually saves rework and product waste.",
        ],
      },
      {
        heading: "DIY vs book a pro — a simple rule",
        paragraphs: [
          "Choose DIY when the look is polish-only or simple art and you already own base, color, and top coat. Choose a salon when the look needs extensions, structured gel, or long appointment time.",
        ],
        bullets: [
          "DIY: solid color, classic French, simple stickers",
          "Salon: extensions, complex chrome layering, multi-hour art sets",
          "Shop: when the analysis names specific product types (base, chrome powder, top coat)",
        ],
      },
    ],
    relatedFaq: [
      {
        q: "Can goBeauty book my salon appointment?",
        a: "goBeauty helps you decide and discover pros; booking typically continues on the salon’s own site, phone, or booking tool linked from their profile.",
      },
    ],
  },
  {
    slug: "how-local-salon-rankings-work",
    title: "How goBeauty local salon rankings work",
    description:
      "Transparent ranking signals for local nail and beauty salons: Google visibility, reviews, freshness, booking readiness, and AI growth opportunity.",
    image: "/images/blog/how-local-salon-rankings-work.jpg",
    imageAlt: "Modern nail salon interior representing local salon rankings",
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-21",
    author: { name: "goBeauty Editorial", role: "Local rankings team" },
    tags: ["local rankings", "salons", "SEO"],
    tldr: "goBeauty local rankings score salons on Google visibility, review volume and quality, freshness, booking readiness, and growth opportunity — not paid placement.",
    sections: [
      {
        heading: "Why transparent local rankings matter",
        paragraphs: [
          "Consumers trust lists that explain why a salon ranks high. goBeauty publishes ranking criteria so both clients and owners understand the score instead of guessing.",
        ],
      },
      {
        heading: "Signals we use",
        paragraphs: [
          "Each salon receives a composite score from multiple public and operational signals.",
        ],
        bullets: [
          "Google visibility — how strongly the business appears in local search",
          "Review volume and average rating",
          "Review freshness — recent feedback weighs more than old spikes",
          "Online booking readiness — easy mobile booking reduces drop-off",
          "AI Growth Opportunity — room to improve with practical actions",
        ],
      },
      {
        heading: "How owners can improve",
        paragraphs: [
          "The fastest gains usually come from earning fresh reviews each month, responding to every review, completing the Google Business Profile, and making online booking obvious on mobile. Claim your profile on goBeauty to request a growth-oriented report.",
        ],
      },
    ],
  },
  {
    slug: "how-to-read-skincare-ingredients",
    title: "How to read skincare ingredients (without a chemistry degree)",
    description:
      "A practical guide to INCI lists, common actives, and how goBeauty’s ingredients library helps you compare products safely.",
    image: "/images/blog/how-to-read-skincare-ingredients.jpg",
    imageAlt: "Skincare serums and ingredients flat lay on marble",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-21",
    author: { name: "goBeauty Editorial", role: "Product science desk" },
    tags: ["skincare", "ingredients", "shopping"],
    tldr: "Read INCI lists from highest to lowest concentration, learn a few key actives, and use goBeauty ingredient pages to see which products contain what you want — or want to avoid.",
    sections: [
      {
        heading: "INCI order is your first clue",
        paragraphs: [
          "On most labels, ingredients appear in descending order of concentration until a low threshold. The first five to seven ingredients usually define the formula’s bulk (water, emollients, humectants).",
          "Actives may appear lower on the list yet still matter at effective percentages. Marketing claims should match the actual formula, not just the front label.",
        ],
      },
      {
        heading: "Learn a shortlist of high-impact actives",
        paragraphs: [
          "You do not need every chemical name. Start with retinoids, vitamin C derivatives, niacinamide, AHAs/BHAs, ceramides, and SPF filters. Match them to goals: texture, tone, barrier, oil control, or sun protection.",
        ],
      },
      {
        heading: "Use goBeauty to research faster",
        paragraphs: [
          "Browse the ingredients library for plain-language explainers, then open product pages that contain those ingredients. Compare Products is useful when two formulas make similar claims but differ in actives or brand positioning.",
        ],
      },
    ],
    relatedFaq: [
      {
        q: "Is a longer ingredient list better?",
        a: "Not necessarily. Longer lists can mean richer formulas or unnecessary fragrance and fillers. Focus on whether the actives and base match your skin goal and tolerance.",
      },
    ],
  },
  {
    slug: "salon-owners-guide-to-gobeauty-marketplace",
    title: "Salon owner’s guide to the goBeauty product marketplace",
    description:
      "How salon and spa buyers use Products for Salons to find treatments, aftercare, samples, and suppliers on goBeauty.ai.",
    image: "/images/blog/salon-owners-guide-to-gobeauty-marketplace.jpg",
    imageAlt: "Professional salon product backbar and treatment bottles",
    publishedAt: "2026-07-08",
    updatedAt: "2026-07-21",
    author: { name: "goBeauty Editorial", role: "Marketplace team" },
    tags: ["salons", "marketplace", "suppliers"],
    tldr: "Products for Salons helps beauty businesses discover professional products and suppliers for backbar, retail, samples, and equipment demos through inquiry-led discovery.",
    sections: [
      {
        heading: "Built for discovery, not endless carts",
        paragraphs: [
          "Salon purchasing often starts with education and samples, not a single multi-brand checkout. goBeauty’s marketplace surfaces suppliers and product lines so owners can inquire about treatments, aftercare, retail, kits, and demos.",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "Open Products for Salons, filter by use case (for example samples or equipment), browse supplier profiles, and submit an inquiry when a line fits your menu. Brands can list products through the supplier listing flow.",
        ],
        bullets: [
          "Treatments and backbar",
          "Aftercare and take-home retail",
          "Samples and starter kits",
          "Equipment demos and private label conversations",
        ],
      },
      {
        heading: "Pair marketplace with local growth",
        paragraphs: [
          "Strong menus need strong demand. Use local rankings insights and review hygiene alongside new product lines so clients discover your services while you upgrade what you use and sell.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
