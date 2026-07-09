import type { Metadata } from "next";
import Link from "next/link";
import NearbyTop3 from "@/components/localrankings/NearbyTop3";
import TopProductsByLabel from "@/components/localrankings/TopProductsByLabel";
import { listCategories, listProducts } from "@/lib/gbApi";
import type { CategoryNode, CategoryRef, ProductCard } from "@/lib/gbApi";

export const metadata: Metadata = {
  title: "Local Rankings — the best 3 salons near you",
  description:
    "Share your location and see the top 3 salons around you, ranked by real reviews and ratings — by service category — plus top-rated products by label.",
  alternates: { canonical: "/local-rankings" },
};

// Leaf categories that actually have products, biggest first — these become
// the filter chips in the products section.
function leafCategories(nodes: CategoryNode[], out: CategoryRef[] = []): CategoryRef[] {
  for (const n of nodes) {
    if (n.children.length > 0) leafCategories(n.children, out);
    else if (n.productCount > 0)
      out.push({ slug: n.slug, name: n.name, productCount: n.productCount });
  }
  return out;
}

async function getProductsData() {
  try {
    const [{ products }, { categories }] = await Promise.all([
      listProducts("", { sort: "top", limit: 8 }),
      listCategories(),
    ]);
    const cats = leafCategories(categories)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 10);
    return { products, cats };
  } catch {
    // shim unreachable (e.g. at build time) — section renders client-side
    return { products: [] as ProductCard[], cats: [] as CategoryRef[] };
  }
}

// PRD v2 §7.3 — local ranking index. Live pages link directly; upcoming
// service-city pages are listed as teasers to show coverage direction.
const LIVE_PAGES = [
  {
    service: "Nail Salons",
    location: "Edison, NJ",
    href: "/local-rankings/best-nail-salons/edison-nj",
    image: "/assets/salon_07_pink_chandelier.jpg",
    live: true,
  },
];

const UPCOMING_PAGES = [
  {
    service: "Korean Nail Salons",
    location: "New York City",
    image: "/assets/salon_04_white_gold.jpg",
  },
  {
    service: "Lash Lift",
    location: "Edison, NJ",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80&auto=format&fit=crop",
  },
  {
    service: "Hydrating Facial",
    location: "Jersey City, NJ",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop",
  },
  {
    service: "Keratin Treatment",
    location: "Brooklyn, NY",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
  },
  {
    service: "Hydrating Facial",
    location: "Hoboken, NJ",
    image:
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80&auto=format&fit=crop",
  },
];

export default async function LocalRankingsPage() {
  const { products, cats } = await getProductsData();
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#fdeef3] to-transparent"
        />
        <div className="mx-auto max-w-[1000px] px-5 pb-8 pt-10 md:pt-14">
          <h1 className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            The best salons near you, ranked with evidence.
          </h1>
          <p className="mt-3 max-w-[560px] text-[15.5px] leading-relaxed text-ink-soft">
            Share your location and we&apos;ll surface the top 3 salons around
            you — ranked by real reviews and ratings, for the exact service
            you&apos;re after.
          </p>
        </div>
      </section>

      <NearbyTop3 />

      <TopProductsByLabel initialProducts={products} categories={cats} />

      <div className="mx-auto max-w-[1000px] px-5 pb-14">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-600">
          Live rankings
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {LIVE_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={`Best ${p.service} in ${p.location}`}
                className="h-20 w-20 flex-none rounded-xl object-cover"
              />
              <span className="min-w-0">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-brand-600">
                  Best
                </span>
                <h3 className="text-[16px] font-bold text-ink">
                  {p.service}
                </h3>
                <p className="text-[13.5px] text-ink-muted">{p.location}</p>
                <span className="mt-1 inline-block text-[13.5px] font-bold text-ink transition group-hover:text-brand-600">
                  View Top 3 →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-[13px] font-bold uppercase tracking-[0.12em] text-ink-muted">
          Coming soon
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING_PAGES.map((p) => (
            <div
              key={`${p.service}-${p.location}`}
              className="flex items-center gap-3.5 rounded-2xl border border-dashed border-line bg-surface-soft p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={`Best ${p.service} in ${p.location}`}
                loading="lazy"
                className="h-16 w-16 flex-none rounded-xl object-cover opacity-80"
              />
              <span className="min-w-0">
                <h3 className="text-[14.5px] font-bold text-ink-soft">
                  Best {p.service}
                </h3>
                <p className="text-[13px] text-ink-muted">{p.location}</p>
              </span>
            </div>
          ))}
        </div>

        {/* Owner-side visibility pressure → RankMySalon path (PRD §6.5) */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#16181d] to-[#262a33] p-6 text-white md:p-8">
          <h2 className="font-display text-[1.4rem] leading-tight md:text-[1.7rem]">
            Not showing up for your service?
          </h2>
          <p className="mt-2 max-w-[540px] text-[14.5px] text-white/70">
            Clients compare providers on these pages every day. Claim your
            profile and run a free visibility checkup to see where you stand.
          </p>
          <Link
            href="/beauty-pros#visibility-checkup"
            className="mt-4 inline-flex h-11 items-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white transition hover:bg-brand-600"
          >
            Run a free visibility checkup
          </Link>
        </div>
      </div>
    </>
  );
}
