import type {
  BenefitItem,
  BrandCardData,
  CategoryCardData,
  FilterDef,
  MockProduct,
  PlatformStat,
  PopularSearch,
} from "@/types/product-landing";

export const POPULAR_SEARCHES: PopularSearch[] = [
  { label: "Retinol", query: "retinol" },
  { label: "Vitamin C", query: "vitamin c" },
  { label: "Sunscreen", query: "sunscreen" },
  { label: "Ceramide", query: "ceramide" },
  { label: "Korean Beauty", query: "korean" },
];

/** Primary + extended filters. Keys align with BADGE_LABELS in gbApi where possible. */
export const FILTERS: FilterDef[] = [
  { key: "paraben_free", label: "Paraben-free", primary: true, icon: "shield" },
  { key: "fragrance_free", label: "Fragrance-free", primary: true, icon: "flower" },
  { key: "silicone_free", label: "Silicone-free", primary: true, icon: "droplet" },
  { key: "alcohol_free", label: "Alcohol-free", primary: true, icon: "wine" },
  { key: "fungal_acne_safe", label: "Fungal-acne safe", primary: true, icon: "sparkles" },
  { key: "sulfate_free", label: "Sulfate-free", icon: "leaf" },
  { key: "essential_oil_free", label: "Essential-oil-free", icon: "flower" },
  { key: "oil_free", label: "Oil-free", icon: "droplet" },
  { key: "reef_safe", label: "Reef safe", icon: "waves" },
  { key: "eu_allergen_free", label: "EU-allergen-free", icon: "shield" },
  { key: "sensitive_skin", label: "Sensitive skin", icon: "heart" },
  { key: "pregnancy_friendly", label: "Pregnancy friendly", icon: "baby" },
];

export const PLATFORM_STATS: PlatformStat[] = [
  {
    value: "2300+",
    label: "Products",
    sub: "Ingredient-checked",
    icon: "package",
  },
  {
    value: "800+",
    label: "Brands",
    sub: "Trusted & verified",
    icon: "store",
  },
  {
    value: "AI-Powered",
    label: "Analysis",
    sub: "Benefits, concerns & more",
    icon: "brain",
  },
];

export const CATEGORIES: CategoryCardData[] = [
  {
    slug: "skincare",
    title: "Skincare",
    description: "Ingredient transparency for every skincare product.",
    countLabel: "1400+ products",
    popularLabel: "Popular",
    chips: [
      { label: "Moisturizer", href: "/products?q=moisturizer&category=skincare" },
      { label: "Serum", href: "/products?q=serum&category=skincare" },
      { label: "Cleanser", href: "/products?q=cleanser&category=skincare" },
      { label: "Sunscreen", href: "/products?q=sunscreen&category=skincare" },
    ],
    ctaLabel: "View all skincare",
    href: "/products?category=skincare",
    imageSrc: "/images/products/skincare-category.webp",
    imageAlt: "Skincare jars, serum bottles and botanical leaves",
    imageObjectPosition: "center 45%",
    tone: "blush",
  },
  {
    slug: "makeup",
    title: "Makeup",
    description: "Know what’s in your makeup from base to finish.",
    countLabel: "200+ products",
    popularLabel: "Popular",
    chips: [
      { label: "Foundation", href: "/products?q=foundation&category=makeup" },
      { label: "Lip", href: "/products?q=lipstick&category=makeup" },
      { label: "Blush", href: "/products?q=blush&category=makeup" },
      { label: "Concealer", href: "/products?q=concealer&category=makeup" },
    ],
    ctaLabel: "View all makeup",
    href: "/products?category=makeup",
    imageSrc: "/images/products/makeup-category.webp",
    imageAlt: "Makeup compact, lipstick and brush",
    imageObjectPosition: "62% 50%",
    tone: "lavender",
  },
  {
    slug: "haircare",
    title: "Hair Care",
    description: "Healthy hair starts with safer ingredients.",
    countLabel: "18+ products",
    popularLabel: "Popular",
    chips: [
      { label: "Shampoo", href: "/products?q=shampoo&category=haircare" },
      { label: "Conditioner", href: "/products?q=conditioner&category=haircare" },
      { label: "Hair Mask", href: "/products?q=hair+mask&category=haircare" },
      { label: "Serum", href: "/products?q=hair+serum&category=haircare" },
    ],
    ctaLabel: "View all hair care",
    href: "/products?category=haircare",
    imageSrc: "/images/products/haircare-category.webp",
    imageAlt: "Green shampoo bottles, comb and leaves",
    imageObjectPosition: "48% 40%",
    tone: "sage",
  },
  {
    slug: "bodycare",
    title: "Body Care",
    description: "Gentle, effective, and better for your body.",
    countLabel: "12+ products",
    popularLabel: "Popular",
    chips: [
      { label: "Body Wash", href: "/products?q=body+wash&category=bodycare" },
      { label: "Lotion", href: "/products?q=body+lotion&category=bodycare" },
      { label: "Scrub", href: "/products?q=body+scrub&category=bodycare" },
      { label: "Sunscreen", href: "/products?q=body+sunscreen&category=bodycare" },
    ],
    ctaLabel: "View all body care",
    href: "/products?category=bodycare",
    imageSrc: "/images/products/bodycare-category.webp",
    imageAlt: "Body lotion bottle, pump and folded towel",
    imageObjectPosition: "55% 42%",
    tone: "peach",
  },
];

/** Top-tier US K-beauty traffic brands (+ a few global staples). See data/kbeauty-brands.ts. */
export const TOP_BRANDS: BrandCardData[] = [
  { name: "Beauty of Joseon", href: "/brands/beauty-of-joseon" },
  { name: "COSRX", href: "/brands/cosrx" },
  { name: "Anua", href: "/brands/anua" },
  { name: "Round Lab", href: "/brands/round-lab" },
  { name: "SKIN1004", href: "/brands/skin1004" },
  { name: "Medicube", href: "/brands/medicube" },
  { name: "Torriden", href: "/brands/torriden" },
  { name: "Mixsoon", href: "/brands/mixsoon" },
  { name: "VT Cosmetics", href: "/brands/vt-cosmetics" },
  { name: "Numbuzin", href: "/brands/numbuzin" },
];

export const BENEFITS: BenefitItem[] = [
  {
    title: "Full Ingredient Analysis",
    description: "We decode every INCI list and explain what each ingredient does.",
    icon: "scan",
  },
  {
    title: "Safe & Smart Choices",
    description: "Identify potential concerns and find products that are right for you.",
    icon: "shield-check",
  },
  {
    title: "AI-Powered Insights",
    description: "Advanced AI analyzes ingredients for benefits, risks, and compatibility.",
    icon: "sparkles",
  },
  {
    title: "Community Trusted",
    description: "Join a community that values transparency and real experiences.",
    icon: "users",
  },
];

/** Fallback cards if the live API is empty during development. */
export const MOCK_PRODUCTS: MockProduct[] = [
  {
    slug: "sample-retinol-serum",
    brand: "goBeauty Labs",
    name: "Gentle Retinol Renewal Serum",
    rating: 4.8,
    reviewCount: 126,
    imageSrc: "/images/products/skincare-category.webp",
    badges: ["Fragrance-free", "Silicone-free"],
    analysisBadge: "Ingredient-checked",
  },
  {
    slug: "sample-vitamin-c",
    brand: "goBeauty Labs",
    name: "Bright Vitamin C Essence",
    rating: 4.6,
    reviewCount: 89,
    imageSrc: "/images/products/skincare-category.webp",
    badges: ["Paraben-free", "Alcohol-free"],
    analysisBadge: "AI analyzed",
  },
  {
    slug: "sample-sunscreen",
    brand: "goBeauty Labs",
    name: "Daily Mineral Sunscreen SPF 50",
    rating: 4.7,
    reviewCount: 204,
    imageSrc: "/images/products/bodycare-category.webp",
    badges: ["Reef safe", "Fragrance-free"],
    analysisBadge: "Ingredient-checked",
  },
  {
    slug: "sample-moisturizer",
    brand: "goBeauty Labs",
    name: "Ceramide Barrier Cream",
    rating: 4.9,
    reviewCount: 312,
    imageSrc: "/images/products/skincare-category.webp",
    badges: ["Fungal-acne safe", "Paraben-free"],
    analysisBadge: "AI analyzed",
  },
];
