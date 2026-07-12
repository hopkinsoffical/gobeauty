import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import SupplierCard from "@/components/marketplace/SupplierCard";
import ProductDiscoveryGrid from "@/components/marketplace/ProductDiscoveryGrid";
import {
  LOOKING_FOR_CARDS,
  MARKETPLACE_PRODUCTS,
  MARKETPLACE_SERVICES,
  SUPPLIERS,
  searchMarketplaceProducts,
  searchSuppliers,
} from "@/lib/data/marketplace";

export const metadata: Metadata = {
  title: "Salon Products, Beauty Suppliers & Professional Brands",
  description:
    "Discover products for salon services, client aftercare, retail, equipment, and private label. Explore beauty suppliers and request product information through GoBeauty.",
  alternates: { canonical: "/marketplace" },
};

const LOOKING_ICONS: Record<string, ReactNode> = {
  treatments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="M12 3v18M8 7h8M7 12h10M9 17h6" strokeLinecap="round" />
    </svg>
  ),
  retail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  ),
  aftercare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="M12 21c4.4-2 7-5.4 7-9V6l-7-3-7 3v6c0 3.6 2.6 7 7 9z" strokeLinejoin="round" />
    </svg>
  ),
  samples: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10h8M8 14h5" strokeLinecap="round" />
    </svg>
  ),
  equipment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" strokeLinecap="round" />
    </svg>
  ),
  "private-label": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="M4 7h16v12H4z" strokeLinejoin="round" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" strokeLinecap="round" />
    </svg>
  ),
};

export default function MarketplacePage({
  searchParams,
}: {
  searchParams?: { q?: string; use?: string };
}) {
  const q = searchParams?.q?.trim() ?? "";
  const suppliers = (q ? searchSuppliers(q) : SUPPLIERS).slice(0, 8);
  const products = (q ? searchMarketplaceProducts(q) : MARKETPLACE_PRODUCTS).slice(0, 8);
  const suppliersById = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Beauty suppliers and brands on GoBeauty",
    itemListElement: SUPPLIERS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.gobeauty.ai/marketplace/suppliers/${s.slug}`,
      name: s.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#f5f0fb] via-[#fbf5f7] to-transparent"
        />
        <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-10 md:pb-14 md:pt-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
            For salons, spas &amp; beauty professionals
          </p>
          <h1 className="mt-2 max-w-[720px] font-display text-[2.1rem] leading-[1.1] text-ink md:text-[3rem]">
            Find products your business can use and sell
          </h1>
          <p className="mt-3 max-w-[620px] text-[15.5px] leading-relaxed text-ink-soft">
            Discover products for your services, client aftercare, and retail
            shelf. Explore brands, request product information, and connect with
            suppliers that fit your business.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#products"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600"
            >
              Find Products
            </a>
            <Link
              href="/marketplace/suppliers"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white px-7 text-[15px] font-semibold text-ink transition hover:bg-surface-tint"
            >
              Explore Suppliers
            </Link>
          </div>
          <p className="mt-3 text-[13.5px]">
            <Link
              href="/brands/list-your-products"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Are you a supplier? List your products →
            </Link>
          </p>

          <div className="mt-8 max-w-[720px]">
            <MarketplaceSearch initialQuery={q} />
          </div>
        </div>
      </section>

      {/* What are you looking for */}
      <section className="border-t border-line-soft bg-white py-12 md:py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            What are you looking for?
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOOKING_FOR_CARDS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {LOOKING_ICONS[c.icon]}
                </span>
                <span>
                  <h3 className="text-[15.5px] font-bold text-ink">{c.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{c.body}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by service */}
      <section className="border-t border-line-soft bg-surface-soft py-12 md:py-14">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            Find products for the services you offer
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {MARKETPLACE_SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/marketplace/services/${s.slug}`}
                className="rounded-2xl border border-line bg-white p-4 text-center shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
              >
                <span className="text-[14px] font-bold text-ink">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suppliers */}
      <section className="bg-white py-12 md:py-14" id="suppliers">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
                Suppliers and brands to explore
              </h2>
              <p className="mt-2 max-w-[560px] text-[14.5px] text-ink-soft">
                Discover distributors and beauty brands by product category,
                service fit, professional use, and retail opportunity.
              </p>
            </div>
            <Link
              href="/marketplace/suppliers"
              className="text-[14px] font-bold text-brand-600 hover:text-brand-700"
            >
              View all suppliers →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suppliers.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
          {q && suppliers.length === 0 && (
            <p className="mt-6 text-center text-[14.5px] text-ink-muted">
              No suppliers matched “{q}”. Try a broader search or{" "}
              <Link href="/marketplace/suppliers" className="font-semibold text-brand-600">
                browse all suppliers
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="border-t border-line-soft bg-surface-soft py-12 md:py-14" id="products">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
            Products for salon services and retail
          </h2>
          <p className="mt-2 text-[14px] text-ink-muted">
            Product details are for discovery. Confirm availability, pricing, and
            professional use with the supplier.
          </p>
          <div className="mt-6">
            <ProductDiscoveryGrid products={products} suppliersById={suppliersById} />
          </div>
        </div>
      </section>

      {/* Supplier acquisition */}
      <section className="bg-gradient-to-br from-[#16181d] to-[#262a33] py-12 text-white md:py-16">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For beauty brands &amp; suppliers
          </p>
          <h2 className="mt-2 max-w-[640px] font-display text-[1.75rem] leading-tight md:text-[2.25rem]">
            Reach salon and spa owners looking for new products
          </h2>
          <p className="mt-3 max-w-[580px] text-[15px] leading-relaxed text-white/70">
            Create a supplier profile, showcase your products by professional use
            case, and generate inquiries from beauty businesses interested in
            product trials, salon pricing, training, demos, or wholesale
            opportunities.
          </p>
          <ul className="mt-6 grid gap-2 text-[14px] text-white/75 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Supplier profile hosted on GoBeauty",
              "Product Intelligence Cards",
              "Treatment and aftercare placement",
              "Salon and spa buyer discovery",
              "Product inquiry forms",
              "Sample campaign support",
              "Salon pricing inquiries",
              "Training and demo requests",
              "CRM lead capture",
              "Campaign reporting",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1 text-brand-300" aria-hidden>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/brands/list-your-products"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition hover:bg-brand-600"
            >
              List Your Products
            </Link>
            <Link
              href="/brands#demo"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-white/25 bg-white/5 px-7 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              Request a Supplier Demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
