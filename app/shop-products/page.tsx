import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listProducts, type ProductCard } from "@/lib/gbApi";

export const metadata: Metadata = {
  title: "Shop Pro-Recommended Products",
  description:
    "Shop pro-recommended beauty products by goal, aftercare, and trend — with ingredient transparency.",
  alternates: { canonical: "/shop-products" },
  openGraph: {
    title: "Shop Pro-Recommended Products | goBeauty.ai",
    description: "Visual product discovery for clients and pros.",
    url: "/shop-products",
    images: ["/images/products/products-hero.webp"],
  },
};

export const revalidate = 300;

/** Short labels only — no paragraph descriptions. */
const QUICK_CHIPS = [
  { label: "Glass skin", href: "/products?q=hydrating" },
  { label: "Barrier", href: "/products?q=barrier" },
  { label: "SPF", href: "/products?q=sunscreen" },
  { label: "Sensitive", href: "/products?q=sensitive" },
  { label: "Aftercare", href: "/products?q=aftercare" },
  { label: "K-beauty", href: "/products?q=korean" },
  { label: "Scalp", href: "/products?q=scalp" },
  { label: "Retail shelf", href: "/products" },
] as const;

type BrowseTile = {
  label: string;
  href: string;
  image: string;
  imageAlt: string;
  tone: string;
  objectPosition?: string;
};

const BROWSE_TILES: BrowseTile[] = [
  {
    label: "Skincare",
    href: "/products?category=skincare",
    image: "/images/products/skincare-category.webp",
    imageAlt: "Skincare products",
    tone: "from-[var(--beauty-blush)] to-[var(--beauty-pink-light)]",
    objectPosition: "center 45%",
  },
  {
    label: "Makeup",
    href: "/products?category=makeup",
    image: "/images/products/makeup-category.webp",
    imageAlt: "Makeup products",
    tone: "from-[var(--beauty-purple-light)] to-white",
    objectPosition: "62% 50%",
  },
  {
    label: "Hair",
    href: "/products?category=haircare",
    image: "/images/products/haircare-category.webp",
    imageAlt: "Hair care products",
    tone: "from-[var(--beauty-green-light)] to-white",
    objectPosition: "center",
  },
  {
    label: "Body",
    href: "/products?category=bodycare",
    image: "/images/products/bodycare-category.webp",
    imageAlt: "Body care products",
    tone: "from-[var(--beauty-peach-light)] to-white",
    objectPosition: "center",
  },
  {
    label: "Aftercare",
    href: "/products?q=aftercare",
    image: "/images/products/skincare-category.webp",
    imageAlt: "Aftercare products",
    tone: "from-[#fdeef3] to-white",
    objectPosition: "70% 40%",
  },
  {
    label: "Trends",
    href: "/looks-trends",
    image: "/images/products/makeup-category.webp",
    imageAlt: "Beauty trends",
    tone: "from-[#fff0f6] to-[var(--beauty-purple-light)]",
    objectPosition: "30% 50%",
  },
];

async function getFeaturedProducts(mode?: string): Promise<ProductCard[]> {
  try {
    const q =
      mode === "aftercare"
        ? "aftercare"
        : mode === "treatment"
          ? "treatment"
          : undefined;
    const { products } = await listProducts(q, { limit: 8 });
    return products.slice(0, 8);
  } catch {
    return [];
  }
}

function ShopProductCard({ p }: { p: ProductCard }) {
  const img = p.images[0]?.url;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--beauty-border)] bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none"
    >
      <div className="relative aspect-[4/5] bg-[var(--beauty-blush)]">
        {img ? (
          // External product CDN may not be in next.config remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={p.images[0]?.alt || p.name}
            className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-4xl opacity-40"
            aria-hidden
          >
            🧴
          </div>
        )}
      </div>
      <div className="space-y-0.5 px-3.5 pb-4 pt-3">
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--beauty-muted)]">
          {p.brand}
        </p>
        <h3 className="line-clamp-2 font-display text-[15.5px] leading-snug text-[var(--beauty-text)] group-hover:text-[var(--beauty-pink-dark)]">
          {p.name}
        </h3>
      </div>
    </Link>
  );
}

export default async function ShopProductsPage({
  searchParams,
}: {
  searchParams?: { mode?: string };
}) {
  const mode = (searchParams?.mode ?? "").trim().toLowerCase();
  const featured = await getFeaturedProducts(mode);
  const picksTitle =
    mode === "aftercare"
      ? "Aftercare picks"
      : mode === "treatment"
        ? "Treatment picks"
        : "Pro picks";

  return (
    <div className="bg-[var(--beauty-white)] text-[var(--beauty-text)]">
      {/* ── Hero: short title + image, no wall of copy ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-pink-light)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(235,79,120,0.12),transparent_50%)]"
        />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-6 px-4 pb-8 pt-10 md:grid-cols-[1fr_1.05fr] md:gap-10 md:px-6 md:pb-10 md:pt-12 lg:px-8">
          <div className="relative z-10 max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--beauty-pink)]">
              Shop
            </p>
            <h1 className="mt-2 font-display text-[2.25rem] leading-[1.08] tracking-tight md:text-[2.75rem] lg:text-[3.1rem]">
              Pro-recommended
              <span className="block text-[var(--beauty-pink)]">beauty.</span>
            </h1>

            {/* Quick chips — labels only */}
            <ul className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {QUICK_CHIPS.map((chip) => (
                <li key={chip.label} className="flex-none">
                  <Link
                    href={chip.href}
                    className="inline-flex min-h-10 items-center rounded-full border border-[var(--beauty-border)] bg-white/90 px-3.5 text-[13px] font-semibold text-[var(--beauty-text)] shadow-sm transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--beauty-pink)] px-5 text-[14px] font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
              >
                Browse all
              </Link>
              <Link
                href="/get-this-look"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--beauty-border)] bg-white px-5 text-[14px] font-semibold text-[var(--beauty-text)] transition hover:bg-[var(--beauty-blush)]"
              >
                Upload a look
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl md:max-w-none">
            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFF8F9] to-[#FFF0F4] shadow-card md:aspect-[16/11] lg:min-h-[380px]">
              <Image
                src="/images/products/products-hero.webp"
                alt="Pro-recommended skincare products"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-6 lg:px-8">
        {/* ── Visual browse tiles ── */}
        <section aria-label="Shop by category" className="pt-2 md:pt-4">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-[1.35rem] leading-tight md:text-[1.5rem]">
              Browse
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3.5">
            {BROWSE_TILES.map((tile) => (
              <Link
                key={tile.label}
                href={tile.href}
                className="group relative overflow-hidden rounded-[20px] border border-[var(--beauty-border)] bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover motion-reduce:transform-none"
              >
                <div
                  className={`relative aspect-[4/5] bg-gradient-to-b ${tile.tone}`}
                >
                  <Image
                    src={tile.image}
                    alt={tile.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover p-2 transition duration-300 group-hover:scale-[1.04] motion-reduce:transform-none"
                    style={{ objectPosition: tile.objectPosition ?? "center" }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent px-2.5 pb-3 pt-10">
                    <span className="block text-center text-[14px] font-bold tracking-tight text-[var(--beauty-text)]">
                      {tile.label}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Product picks (image-first, brand + name only) ── */}
        <section aria-label="Featured products" className="mt-12 md:mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-[1.35rem] leading-tight md:text-[1.5rem]">
              {picksTitle}
            </h2>
            <Link
              href={
                mode === "aftercare"
                  ? "/products?q=aftercare"
                  : mode === "treatment"
                    ? "/products?q=treatment"
                    : "/products"
              }
              className="flex-none text-[13.5px] font-semibold text-[var(--beauty-pink-dark)] transition hover:text-[var(--beauty-pink)]"
            >
              See all
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {featured.map((p) => (
                <ShopProductCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[var(--beauty-border)] bg-[var(--beauty-blush)] px-6 py-12 text-center">
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--beauty-pink)] px-5 text-[14px] font-semibold text-white"
              >
                Browse products
              </Link>
            </div>
          )}
        </section>

        {/* ── Pro strip: compact, minimal copy ── */}
        <section
          id="pro-buying"
          className="mt-12 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#16181d] to-[#2a2f3a] md:mt-14"
        >
          <div className="flex flex-col items-stretch gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7 md:px-9">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-300">
                For salons
              </p>
              <h2 className="mt-1 font-display text-[1.35rem] leading-tight text-white md:text-[1.5rem]">
                Samples & wholesale
              </h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-none">
              <Link
                href="/beauty-pros#samples"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--beauty-pink)] px-5 text-[13.5px] font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
              >
                Request sample
              </Link>
              <Link
                href="/brands"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 text-[13.5px] font-semibold text-white transition hover:bg-white/10"
              >
                Brands
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
