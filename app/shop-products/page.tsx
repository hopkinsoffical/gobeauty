import type { Metadata } from "next";
import Link from "next/link";
import { listProducts, type ProductCard } from "@/lib/gbApi";
import { ProductCardTile } from "@/components/gb/ProductBits";

export const metadata: Metadata = {
  title: "Shop Pro-Recommended Products",
  description:
    "Discover products by beauty goal, service aftercare, ingredient fit, treatment use, and professional recommendation — with samples and wholesale options for pros.",
  alternates: { canonical: "/shop-products" },
};

export const revalidate = 300;

// PRD v2 §7.4 — browse modes: by beauty goal, service/treatment, client
// concern, aftercare, professional use case, and trend. Each mode routes
// into the product library with a matching query.
const BROWSE_MODES = [
  {
    title: "By beauty goal",
    examples: ["Glass skin", "Barrier repair", "Frizz control"],
    href: "/products?q=hydrating",
  },
  {
    title: "By service & treatment",
    examples: ["Hydrating facial", "Keratin", "Gel manicure"],
    href: "/products?q=treatment",
  },
  {
    title: "By client concern",
    examples: ["Dry skin", "Acne-prone", "Sensitive"],
    href: "/products?q=sensitive",
  },
  {
    title: "By aftercare",
    examples: ["Post-facial", "Post-wax", "Lash aftercare"],
    href: "/products?q=aftercare",
  },
  {
    title: "By professional use case",
    examples: ["Retail shelf", "In-service", "Starter kits"],
    href: "/products",
  },
  {
    title: "By trend",
    examples: ["K-beauty", "Scalp care", "Glazed skin"],
    href: "/looks-trends",
  },
];

async function getFeaturedProducts(): Promise<ProductCard[]> {
  // Best-effort: the gb API lives on the EC2 and can be briefly down —
  // the channel page must still render (PRD launch criteria).
  try {
    const { products } = await listProducts();
    return products.slice(0, 8);
  } catch {
    return [];
  }
}

export default async function ShopProductsPage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#fdeef3] to-transparent"
        />
        <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-10 md:pt-14">
          <h1 className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            Shop Pro-Recommended Products
          </h1>
          <p className="mt-3 max-w-[620px] text-[15.5px] leading-relaxed text-ink-soft">
            Discover products by beauty goal, service aftercare, ingredient
            fit, treatment use, and professional recommendation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pb-14">
        {/* Browse modes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BROWSE_MODES.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
            >
              <h2 className="text-[15.5px] font-bold text-ink">{m.title}</h2>
              <p className="mt-1 text-[13px] text-ink-muted">
                {m.examples.join(" · ")}
              </p>
              <span className="mt-2 inline-block text-[13px] font-bold text-brand-600 transition group-hover:translate-x-0.5">
                Browse →
              </span>
            </Link>
          ))}
        </div>

        {/* Featured products from the ingredient-checked library */}
        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
              Ingredient-checked picks
            </h2>
            <p className="mt-1.5 text-[14px] text-ink-soft">
              Full INCI transparency on every product — what each ingredient
              does and what to watch for.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden flex-none text-[14px] font-semibold text-brand-600 transition hover:text-brand-700 md:block"
          >
            Browse the full library →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {featured.map((p) => (
              <ProductCardTile key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-line bg-surface-soft p-8 text-center text-[14.5px] text-ink-muted">
            The product library is loading —{" "}
            <Link href="/products" className="font-semibold text-brand-600">
              browse it directly
            </Link>
            .
          </div>
        )}

        <Link
          href="/products"
          className="mt-5 flex h-11 items-center justify-center rounded-pill border border-line text-[14.5px] font-semibold text-ink transition hover:bg-surface-tint md:hidden"
        >
          Browse the full library
        </Link>

        {/* Pro intent: sample / wholesale / demo (PRD §7.4 CTAs, phase-1 lead gen) */}
        <div
          className="mt-12 grid gap-4 rounded-2xl bg-gradient-to-br from-[#16181d] to-[#262a33] p-6 text-white md:grid-cols-[1.3fr_1fr] md:items-center md:p-8"
          id="pro-buying"
        >
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
              For salons, spas &amp; studios
            </p>
            <h2 className="mt-2 font-display text-[1.4rem] leading-tight md:text-[1.7rem]">
              Try before you stock it.
            </h2>
            <p className="mt-2 max-w-[480px] text-[14.5px] leading-relaxed text-white/70">
              Request samples, ask wholesale pricing, or book a supplier demo —
              GoBeauty connects you directly with boutique brands that fit your
              services and retail shelf.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/for-beauty-pros#samples"
              className="flex h-12 items-center justify-center rounded-pill bg-brand-500 text-[14.5px] font-semibold text-white transition hover:bg-brand-600"
            >
              Request a Sample
            </Link>
            <Link
              href="/for-beauty-pros#samples"
              className="flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 text-[14.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Ask Wholesale Price
            </Link>
            <Link
              href="/brands"
              className="flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 text-[14.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Book a Supplier Demo
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-ink-muted">
          Sponsored placements are always labeled and kept separate from
          GoBeauty Fit recommendations.
        </p>
      </div>
    </>
  );
}
