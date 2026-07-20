/**
 * Seed marketplace data (goBeauty_marketplace.docx §§4–8).
 * Profiles use cautious wording; commercial fields default to "pending"
 * unless GoBeauty has confirmed availability.
 *
 * K-beauty brand profiles (top 30 US traffic tiers) are generated from
 * data/kbeauty-brands.ts so marketplace + product catalog stay in sync.
 */
import {
  kbeautyGbSlug,
  kbeautyMarketplacePriority,
  type KBeautyBrand,
  type MarketplaceTier,
} from "@/data/kbeauty-brands";
import type {
  MarketplaceProduct,
  MarketplaceService,
  Supplier,
} from "@/lib/marketplace/types";

const PENDING_DISCLAIMER =
  "Product availability, pricing, shipping, and business-order terms are provided by the supplier and may change. GoBeauty has not confirmed a commercial partnership unless stated.";

const BRAND_DISCLAIMER =
  "Brand Profile — supplier relationship not yet confirmed. Information is for discovery only and does not imply endorsement or wholesale availability.";

/** Stable pastel palette for brand logo tiles. */
const BRAND_COLORS = [
  "#111827",
  "#be185d",
  "#0d9488",
  "#b45309",
  "#1d4ed8",
  "#0369a1",
  "#7c3aed",
  "#b91c1c",
  "#047857",
  "#c2410c",
  "#4f46e5",
  "#0f766e",
  "#9d174d",
  "#1e3a8a",
  "#854d0e",
];

function colorForSlug(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return BRAND_COLORS[h % BRAND_COLORS.length];
}

/** Editorial short blurbs for priority brands (fallback is generic). */
const BRAND_SHORT: Record<string, string> = {
  "beauty-of-joseon":
    "K-beauty skincare brand with cleansers, serums, sunscreen, moisturizers, and eye care.",
  cosrx:
    "Skincare brand known for simplified routines across cleansers, essences, serums, and barrier-support products.",
  anua: "Skincare brand with toners, cleansers, serums, and soothing hydration-focused products.",
  "round-lab":
    "Skincare brand with cleansers, toners, moisturizers, sunscreen, and barrier-support products.",
  skin1004:
    "Centella-focused skincare brand with cleansers, toners, ampoules, moisturizers, and sunscreen.",
  medicube:
    "Device-adjacent K-beauty skincare with serums, pads, and barrier/glow-focused routines.",
  torriden:
    "Hydration-focused skincare with serums, toners, moisturizers, masks, and cleansers.",
  mixsoon:
    "Minimalist K-beauty brand focused on essences, serums, cleansers, and ingredient-led skincare.",
  "vt-cosmetics":
    "Centella and Reedle Shot–known K-beauty brand spanning serums, creams, and masks.",
  numbuzin:
    "Numbered serum lines for targeted concerns — brightening, barrier, and texture-focused routines.",
  abib: "Pad- and texture-led K-beauty skincare with toners, serums, and moisturizers.",
  biodance: "Overnight mask and hydrogel-focused K-beauty skincare.",
  haruharu: "Black rice and gentle-barrier K-beauty skincare line.",
  "dr-g": "Dermatologist-positioned K-beauty skincare for sensitive and barrier care.",
  purito: "Clean-leaning K-beauty skincare with sunscreen, serums, and moisturizers.",
  isntree: "Hydration and sunscreen-focused K-beauty skincare.",
  manyo: "Ferment-forward K-beauty skincare (ma:nyo) with cleansers, ampoules, and creams.",
  "mary-may": "Vegan, ingredient-led K-beauty skincare with serums and ampoules.",
  tirtir: "Cushion and makeup-forward K-beauty brand with skincare adjacents.",
  romand: "K-beauty color cosmetics — lips, cheeks, and everyday makeup.",
  mediheal: "Mask and sheet-mask–led K-beauty skincare brand.",
  laneige: "Hydration-focused K-beauty skincare and lip care.",
  clio: "K-beauty makeup brand — base, eyes, and lips.",
  peripera: "Playful K-beauty color cosmetics and lip tints.",
  hince: "Modern K-beauty makeup and beauty brand.",
  fwee: "K-beauty makeup brand known for blushes and lip products.",
  tocobo: "Sunscreen and everyday skincare from a rising K-beauty line.",
  needly: "Needle-pad and treatment-pad K-beauty skincare.",
  rejuran: "Healer / polynucleotide-associated K-beauty skincare line.",
  aestura: "Barrier-care K-beauty skincare often explored for sensitive routines.",
};

const BRAND_CATEGORIES: Record<string, string[]> = {
  romand: ["Lip color", "Blush", "Makeup", "Cheeks"],
  clio: ["Base makeup", "Eyes", "Lips", "Makeup"],
  peripera: ["Lip tints", "Blush", "Makeup"],
  hince: ["Makeup", "Lips", "Base"],
  fwee: ["Blush", "Lips", "Makeup"],
  tirtir: ["Cushion foundation", "Makeup", "Base"],
  mediheal: ["Sheet masks", "Serums", "Skincare"],
  needly: ["Treatment pads", "Serums", "Skincare"],
};
export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    slug: "facial-skincare",
    name: "Facial & Skincare",
    shortDescription: "Products for facial services, skincare routines, and take-home retail.",
    searchHints: ["facial", "skincare", "serum", "moisturizer"],
    relatedCategories: ["Cleansers", "Toners", "Serums", "Moisturizers", "Masks", "Sunscreen"],
  },
  {
    slug: "hair-color",
    name: "Hair Color",
    shortDescription: "Color-safe care, bond builders, and retail support for color services.",
    searchHints: ["hair color", "color care", "bond"],
    relatedCategories: ["Haircare", "Hair treatments"],
  },
  {
    slug: "keratin-hair-repair",
    name: "Keratin & Hair Repair",
    shortDescription: "Repair, smoothing, and post-treatment maintenance products.",
    searchHints: ["keratin", "hair repair", "smoothing"],
    relatedCategories: ["Haircare", "Hair treatments"],
  },
  {
    slug: "lash-services",
    name: "Lash Services",
    shortDescription: "Cleansers, aftercare, and retail for lash extensions and lifts.",
    searchHints: ["lash", "lash cleanser", "extension"],
    relatedCategories: ["Cleansers", "Aftercare"],
  },
  {
    slug: "nail-services",
    name: "Nail Services",
    shortDescription: "Professional nail care, cuticle, and take-home maintenance.",
    searchHints: ["nail", "manicure", "cuticle"],
    relatedCategories: ["Nail care", "Body care"],
  },
  {
    slug: "waxing",
    name: "Waxing",
    shortDescription: "Pre- and post-wax care, soothing products, and retail.",
    searchHints: ["wax", "post-wax", "soothing"],
    relatedCategories: ["Body care", "Aftercare"],
  },
  {
    slug: "scalp-care",
    name: "Scalp Care",
    shortDescription: "Scalp treatments, serums, and home-care support.",
    searchHints: ["scalp", "hair scalp"],
    relatedCategories: ["Haircare", "Scalp"],
  },
  {
    slug: "med-spa-aftercare",
    name: "Med Spa Aftercare",
    shortDescription: "Gentle recovery and barrier support for post-procedure care.",
    searchHints: ["med spa", "aftercare", "barrier"],
    relatedCategories: ["Moisturizers", "Serums", "Sunscreen", "Aftercare"],
  },
  {
    slug: "makeup-services",
    name: "Makeup Services",
    shortDescription: "Pro makeup, prep, and retail for bridal and event looks.",
    searchHints: ["makeup", "bridal"],
    relatedCategories: ["Makeup", "Cleansers"],
  },
  {
    slug: "spa-retail",
    name: "Spa Retail",
    shortDescription: "Curated take-home products for spa and salon retail shelves.",
    searchHints: ["retail", "spa retail", "take-home"],
    relatedCategories: ["Moisturizers", "Serums", "Body care", "Haircare"],
  },
];

export const LOOKING_FOR_CARDS = [
  {
    title: "Products for Treatments",
    body: "Products to use during salon, spa, and beauty services.",
    href: "/marketplace?use=treatments",
    icon: "treatments",
  },
  {
    title: "Products to Retail",
    body: "Take-home products clients can buy after appointments.",
    href: "/marketplace?use=retail",
    icon: "retail",
  },
  {
    title: "Aftercare Products",
    body: "Products that help clients maintain their results.",
    href: "/marketplace?use=aftercare",
    icon: "aftercare",
  },
  {
    title: "Samples & Starter Kits",
    body: "Explore products that may offer samples, trial sizes, or opening kits.",
    href: "/marketplace?use=samples",
    icon: "samples",
  },
  {
    title: "Equipment & Devices",
    body: "Discover professional tools and request product information or a demo.",
    href: "/marketplace?use=equipment",
    icon: "equipment",
  },
  {
    title: "Private Label",
    body: "Find partners that may help create products under a salon or brand name.",
    href: "/marketplace?use=private-label",
    icon: "private-label",
  },
] as const;

export const SUGGESTED_SEARCHES = [
  "Keratin aftercare",
  "Products to retail after facials",
  "K-beauty skincare",
  "Lash cleanser",
  "Post-wax care",
  "Scalp products",
  "Private label skincare",
];

const DEFAULT_CATEGORIES = [
  "Cleansers",
  "Toners",
  "Serums",
  "Moisturizers",
  "Sunscreen",
  "Masks",
  "K-beauty skincare",
];

const DEFAULT_BEST_FIT = [
  "Facial spas",
  "Estheticians",
  "K-beauty retail",
  "Take-home skincare",
];

function brandFromCatalog(brand: KBeautyBrand): Supplier {
  const short =
    BRAND_SHORT[brand.slug] ??
    `${brand.name} is a Korean beauty brand. Explore product categories for professional education, aftercare, and retail research.`;
  const categories = BRAND_CATEGORIES[brand.slug] ?? DEFAULT_CATEGORIES;
  const isMakeup = categories.some((c) => /makeup|lip|blush|cushion|base makeup/i.test(c));
  const tier = brand.marketplaceTier as MarketplaceTier;
  return {
    id: brand.slug,
    slug: brand.slug,
    name: brand.name,
    supplierType: isMakeup ? "Makeup brand profile" : "Skincare brand profile",
    kind: "skincare_brand",
    shortDescription: short,
    fullDescription: `${short} This page is a discovery profile only. Product information is editorial and may be incomplete.`,
    logoInitials: brand.name
      .replace(/[^A-Za-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    logoColor: colorForSlug(brand.slug),
    websiteUrl: brand.website,
    contactUrl: brand.website,
    country: "South Korea",
    shippingMarkets: [],
    productCategories: categories,
    bestFitBusinessTypes: isMakeup
      ? ["Beauty boutiques", "Makeup services", "K-beauty retail", "Salons"]
      : DEFAULT_BEST_FIT,
    bestFitServices: isMakeup
      ? ["Makeup Services", "Spa Retail", "Facial & Skincare"]
      : ["Facial & Skincare", "Spa Retail", "Med Spa Aftercare"],
    sampleStatus: "pending",
    businessPricingStatus: "pending",
    wholesaleStatus: "pending",
    trainingStatus: "pending",
    demoStatus: "pending",
    privateLabelStatus: "pending",
    minimumOrder: null,
    shippingDetails: null,
    profileStatus: "brand_profile",
    claimed: false,
    sponsored: false,
    authorizedContent: false,
    disclaimer: BRAND_DISCLAIMER,
    // Top tier (1) = featured on marketplace home; 2/3 still listed & sorted after
    featured: tier === 1,
    productFocus: categories.slice(0, 4).join(", "),
    commonProfessionalUse:
      "Explore for facial services, client education, and take-home retail research.",
    retailOpportunity: "May fit retail shelves focused on K-beauty and skincare routines.",
    aftercareOpportunity:
      "Often explored for post-facial and daily home-care recommendations.",
    useCases: [
      {
        title: "Use during services",
        body: "Explore category fit for treatment-room prep, finish, or education — confirm use with the brand or distributor before service application.",
      },
      {
        title: "Recommend after appointments",
        body: "Use product categories as conversation starters for home routines that support in-salon results.",
      },
      {
        title: "Add to a retail shelf",
        body: "Research demand and brand recognition with clients before committing to inventory.",
      },
      {
        title: "Build an aftercare routine",
        body: "Pair cleanser, toner/serum, moisturizer, and sunscreen categories into simple take-home paths.",
      },
    ],
    gbBrandSlug: kbeautyGbSlug(brand),
  };
}

const KBEAUTY_OUTLET: Supplier = {
  id: "kbeauty-outlet-usa",
  slug: "kbeauty-outlet-usa",
  name: "KBeauty Outlet USA",
  supplierType: "Multi-brand K-beauty retailer / product source",
  kind: "multi_brand_source",
  shortDescription:
    "Explore a broad selection of Korean skincare, makeup, body care, and haircare products from multiple K-beauty brands.",
  fullDescription:
    "KBeauty Outlet USA is presented as a multi-brand product source for professionals researching Korean beauty products. This profile uses public, high-level information only. Business-order terms, samples, and salon accounts are not confirmed by GoBeauty.",
  logoInitials: "KO",
  logoColor: "#7c3aed",
  websiteUrl: "https://www.kbeautyoutlet.com",
  contactUrl: "https://www.kbeautyoutlet.com",
  country: "United States",
  shippingMarkets: ["United States"],
  productCategories: [
    "Korean skincare",
    "Makeup",
    "Body care",
    "Hair care",
    "Cleansers",
    "Toners",
    "Serums and ampoules",
    "Moisturizers",
    "Sunscreen",
    "Facial masks",
    "Hair treatments",
  ],
  bestFitBusinessTypes: [
    "Facial spas",
    "Estheticians",
    "K-beauty retailers",
    "Beauty boutiques",
    "Salons exploring take-home skincare",
    "Professionals researching Korean beauty products",
  ],
  bestFitServices: [
    "Facial & Skincare",
    "Spa Retail",
    "Makeup Services",
    "Med Spa Aftercare",
  ],
  sampleStatus: "pending",
  businessPricingStatus: "pending",
  wholesaleStatus: "pending",
  trainingStatus: "pending",
  demoStatus: "pending",
  privateLabelStatus: "pending",
  minimumOrder: null,
  shippingDetails: "Shipping markets and timeframes not independently verified by GoBeauty.",
  profileStatus: "featured_supplier",
  claimed: false,
  sponsored: false,
  authorizedContent: false,
  disclaimer: PENDING_DISCLAIMER,
  featured: true,
  productFocus: "Multi-brand K-beauty skincare, makeup, body, and hair",
  commonProfessionalUse:
    "Research K-beauty lines for retail, education, and client recommendations.",
  retailOpportunity: "Strong candidate for boutiques and spas exploring K-beauty retail.",
  aftercareOpportunity:
    "Useful when building take-home skincare options after facial services.",
  useCases: [
    {
      title: "Use during services",
      body: "Identify candidate product categories for facial and makeup services — always confirm professional-use suitability with the supplier.",
    },
    {
      title: "Recommend after appointments",
      body: "Explore multi-brand options when clients want K-beauty home care after treatments.",
    },
    {
      title: "Add to a retail shelf",
      body: "Browse a wide catalog when testing which K-beauty brands resonate with your clients.",
    },
    {
      title: "Support a trending beauty goal",
      body: "Pair glass-skin, barrier, and hydration trends with relevant product categories.",
    },
  ],
};

/** Multi-brand source + US top-30 K-beauty brand profiles (tiers 1–3). */
export const SUPPLIERS: Supplier[] = [
  KBEAUTY_OUTLET,
  ...kbeautyMarketplacePriority().map(brandFromCatalog),
];

/** Editorial seed products — cautious, non-clinical language only. */
export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "mp-barrier-support-cream",
    supplierId: "cosrx",
    brandName: "COSRX",
    productName: "Barrier Support Cream",
    slug: "barrier-support-cream",
    category: "Moisturizers",
    professionalUse: "Explore for treatment-room finish and take-home education",
    bestFitBusiness: "Facial spas and estheticians",
    treatmentPairing: "Hydrating facial and post-treatment care",
    clientNeed: "Dry or compromised barrier feel",
    aftercareFit: "May fit daily post-facial home care",
    retailFit: "Treatment room and take-home retail",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-centella-ampoule",
    supplierId: "skin1004",
    brandName: "SKIN1004",
    productName: "Centella Ampoule",
    slug: "centella-ampoule",
    category: "Ampoules",
    professionalUse: "Explore for soothing and hydration-focused routines",
    bestFitBusiness: "Facial spas, sensitive-skin focused pros",
    treatmentPairing: "Calming facial and aftercare education",
    clientNeed: "Soothing hydration",
    aftercareFit: "Often used for daily serum step research",
    retailFit: "K-beauty retail and spa shelves",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-relief-sun",
    supplierId: "beauty-of-joseon",
    brandName: "Beauty of Joseon",
    productName: "Relief Sun Fluid",
    slug: "relief-sun-fluid",
    category: "Sunscreen",
    professionalUse: "Explore for post-service SPF education",
    bestFitBusiness: "Facial spas and beauty boutiques",
    treatmentPairing: "Daytime aftercare and outdoor protection education",
    clientNeed: "Daily SPF",
    aftercareFit: "Recommend after appointments that leave skin more sun-sensitive",
    retailFit: "High-interest take-home category",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-heartleaf-toner",
    supplierId: "anua",
    brandName: "Anua",
    productName: "Heartleaf Toner",
    slug: "heartleaf-toner",
    category: "Toners",
    professionalUse: "Explore for soothing prep and home-care steps",
    bestFitBusiness: "Estheticians and facial spas",
    treatmentPairing: "Soothing facial routines",
    clientNeed: "Gentle hydration",
    aftercareFit: "May fit calm-down home routines",
    retailFit: "Retail skincare shelves",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-bean-essence",
    supplierId: "mixsoon",
    brandName: "Mixsoon",
    productName: "Bean Essence",
    slug: "bean-essence",
    category: "Essences",
    professionalUse: "Explore for ingredient-focused routine building",
    bestFitBusiness: "Ingredient-focused retail and facial spas",
    treatmentPairing: "Hydration layering education",
    clientNeed: "Lightweight hydration",
    aftercareFit: "Routine-building conversations",
    retailFit: "Minimalist K-beauty retail",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-dokdo-toner",
    supplierId: "round-lab",
    brandName: "Round Lab",
    productName: "Dokdo Toner",
    slug: "dokdo-toner",
    category: "Toners",
    professionalUse: "Explore for hydration and barrier-support education",
    bestFitBusiness: "Facial spas and estheticians",
    treatmentPairing: "Hydrating facial aftercare",
    clientNeed: "Hydration",
    aftercareFit: "May fit daily toner recommendations",
    retailFit: "Take-home skincare",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-dive-in-serum",
    supplierId: "torriden",
    brandName: "Torriden",
    productName: "Dive-In Serum",
    slug: "dive-in-serum",
    category: "Hydrating serums",
    professionalUse: "Explore for hydrating facial aftercare",
    bestFitBusiness: "Facial spas and K-beauty retail",
    treatmentPairing: "Hydrating facial finish education",
    clientNeed: "Deep hydration feel",
    aftercareFit: "Hydrating facial aftercare conversations",
    retailFit: "Serum retail shelves",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
  {
    id: "mp-kbeauty-starter-set",
    supplierId: "kbeauty-outlet-usa",
    brandName: "KBeauty Outlet USA",
    productName: "K-Beauty Discovery Set",
    slug: "k-beauty-discovery-set",
    category: "Korean skincare",
    professionalUse: "Explore multi-brand product sets for retail testing",
    bestFitBusiness: "Beauty boutiques and salons testing K-beauty retail",
    treatmentPairing: "Client education and retail sampling research",
    clientNeed: "Trying K-beauty routines",
    aftercareFit: "Useful when recommending starter home routines",
    retailFit: "Retail discovery and gift sets",
    sampleStatus: "pending",
    salonPricingStatus: "pending",
    productUrl: null,
    sourceType: "editorial",
  },
];

export function getSupplier(slug: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.slug === slug);
}

export function getSupplierProducts(supplierId: string): MarketplaceProduct[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.supplierId === supplierId);
}

export function getService(slug: string): MarketplaceService | undefined {
  return MARKETPLACE_SERVICES.find((s) => s.slug === slug);
}

export function searchSuppliers(q: string): Supplier[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return SUPPLIERS;
  return SUPPLIERS.filter((s) => {
    const hay = [
      s.name,
      s.supplierType,
      s.shortDescription,
      ...s.productCategories,
      ...s.bestFitBusinessTypes,
      ...s.bestFitServices,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function searchMarketplaceProducts(q: string): MarketplaceProduct[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return MARKETPLACE_PRODUCTS;
  return MARKETPLACE_PRODUCTS.filter((p) => {
    const hay = [
      p.productName,
      p.brandName,
      p.category,
      p.bestFitBusiness,
      p.professionalUse,
      p.treatmentPairing,
      p.clientNeed,
      p.aftercareFit,
      p.retailFit,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function filterSuppliers(opts: {
  q?: string;
  type?: string;
  category?: string;
  business?: string;
  service?: string;
  status?: string;
  sort?: string;
}): Supplier[] {
  let list = opts.q ? searchSuppliers(opts.q) : [...SUPPLIERS];
  if (opts.type) {
    const t = opts.type.toLowerCase();
    list = list.filter(
      (s) =>
        s.supplierType.toLowerCase().includes(t) ||
        s.kind.toLowerCase().includes(t.replace(/\s+/g, "_")),
    );
  }
  if (opts.category) {
    const c = opts.category.toLowerCase();
    list = list.filter((s) =>
      s.productCategories.some((x) => x.toLowerCase().includes(c)),
    );
  }
  if (opts.business) {
    const b = opts.business.toLowerCase();
    list = list.filter((s) =>
      s.bestFitBusinessTypes.some((x) => x.toLowerCase().includes(b)),
    );
  }
  if (opts.service) {
    const svc = opts.service.toLowerCase();
    list = list.filter((s) =>
      s.bestFitServices.some((x) => x.toLowerCase().includes(svc)),
    );
  }
  if (opts.status) {
    list = list.filter((s) => s.profileStatus === opts.status);
  }

  const sort = opts.sort ?? "featured";
  if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "recent") list = [...list].reverse();
  else if (sort === "products") {
    list.sort(
      (a, b) =>
        getSupplierProducts(b.id).length - getSupplierProducts(a.id).length ||
        a.name.localeCompare(b.name),
    );
  } else {
    // featured first
    list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }
  return list;
}
