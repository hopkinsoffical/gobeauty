/** Editorial photography for marketplace & homepage visual redesign.
 * Prefer local assets; Unsplash for skincare/product lifestyle (allowed in next.config).
 */

export const MARKETPLACE_HERO =
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80&auto=format&fit=crop";

export const HOME_MARKETPLACE_TILES = [
  {
    label: "Treatment",
    image: "/assets/salon_06_serene.jpg",
  },
  {
    label: "Aftercare",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80&auto=format&fit=crop",
  },
  {
    label: "Retail",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop",
  },
  {
    label: "Samples",
    image:
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&q=80&auto=format&fit=crop",
  },
] as const;

export const LOOKING_FOR_IMAGES: Record<string, string> = {
  treatments: "/assets/salon_02_luxe.jpg",
  retail:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80&auto=format&fit=crop",
  aftercare:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop",
  samples:
    "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=900&q=80&auto=format&fit=crop",
  equipment:
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80&auto=format&fit=crop",
  "private-label":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80&auto=format&fit=crop",
};

export const SERVICE_IMAGES: Record<string, string> = {
  "facial-skincare":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
  "hair-color":
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
  "keratin-hair-repair":
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80&auto=format&fit=crop",
  "lash-services":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80&auto=format&fit=crop",
  "nail-services": "/assets/nail_13_burgundy.jpg",
  waxing:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop",
  "scalp-care":
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80&auto=format&fit=crop",
  "med-spa-aftercare":
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80&auto=format&fit=crop",
  "makeup-services":
    "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80&auto=format&fit=crop",
  "spa-retail": "/assets/salon_04_white_gold.jpg",
};

/** Cover lifestyle image per supplier slug */
export const SUPPLIER_COVERS: Record<string, string> = {
  "kbeauty-outlet-usa":
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80&auto=format&fit=crop",
  cosrx:
    "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=1200&q=80&auto=format&fit=crop",
  skin1004:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
  "beauty-of-joseon":
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80&auto=format&fit=crop",
  anua:
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80&auto=format&fit=crop",
  mixsoon:
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=80&auto=format&fit=crop",
  "round-lab":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80&auto=format&fit=crop",
  torriden:
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&q=80&auto=format&fit=crop",
};

export const PRODUCT_IMAGES: Record<string, string> = {
  "mp-barrier-support-cream":
    "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&q=80&auto=format&fit=crop",
  "mp-centella-ampoule":
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&auto=format&fit=crop",
  "mp-relief-sun":
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80&auto=format&fit=crop",
  "mp-heartleaf-toner":
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80&auto=format&fit=crop",
  "mp-bean-essence":
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80&auto=format&fit=crop",
  "mp-dokdo-toner":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80&auto=format&fit=crop",
  "mp-dive-in-serum":
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80&auto=format&fit=crop",
  "mp-kbeauty-starter-set":
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80&auto=format&fit=crop",
};

export const USE_CASE_IMAGES = [
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
  "/assets/salon_04_white_gold.jpg",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80&auto=format&fit=crop",
];

export const CHANNEL_IMAGES = [
  {
    title: "Find Pros",
    body: "Local pros for your look",
    href: "/find-pros",
    image: "/assets/salon_03_modern.jpg",
  },
  {
    title: "Shop Products",
    body: "Pro-recommended picks",
    href: "/shop-products",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Looks & Trends",
    body: "What's in right now",
    href: "/looks-trends",
    image: "/assets/nail_08_floral.jpg",
  },
  {
    title: "DIY & Aftercare",
    body: "Routines that stick",
    href: "/looks-trends?type=aftercare",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop",
  },
] as const;

export const AUDIENCE_IMAGES = [
  {
    eyebrow: "Beauty Pros",
    copy: "Get discovered for your services",
    cta: "Claim Profile",
    href: "/beauty-pros",
    image: "/assets/salon_07_pink_chandelier.jpg",
  },
  {
    eyebrow: "Salon Owners",
    copy: "Rank higher. Win more clients",
    cta: "See Ranking",
    href: "/beauty-pros#visibility-checkup",
    image: "/assets/salon_02_luxe.jpg",
  },
  {
    eyebrow: "Brands",
    copy: "List products for salons",
    cta: "List Products",
    href: "/brands/list-your-products",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80&auto=format&fit=crop",
  },
] as const;

export function supplierCover(slug: string): string {
  return (
    SUPPLIER_COVERS[slug] ??
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop"
  );
}

export function productImage(id: string): string {
  return (
    PRODUCT_IMAGES[id] ??
    "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&q=80&auto=format&fit=crop"
  );
}

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? "/assets/salon_01_relaxed.jpg";
}
