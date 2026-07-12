import type { Metadata } from "next";
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
import {
  LOOKING_FOR_IMAGES,
  MARKETPLACE_HERO,
  serviceImage,
} from "@/lib/marketplace/visuals";

export const metadata: Metadata = {
  title: "Salon Products, Beauty Suppliers & Professional Brands",
  description:
    "Discover products for salon services, client aftercare, retail, equipment, and private label. Explore beauty suppliers and request product information through GoBeauty.",
  alternates: { canonical: "/marketplace" },
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

      {/* Visual hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MARKETPLACE_HERO}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
        </div>

        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
            For salons, spas &amp; pros
          </p>
          <h1 className="mt-2 max-w-[560px] font-display text-[2.2rem] leading-[1.08] text-ink md:text-[3.1rem]">
            Products your business can use and sell
          </h1>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#products"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600"
            >
              Find Products
            </a>
            <Link
              href="/marketplace/suppliers"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white/90 px-7 text-[15px] font-semibold text-ink backdrop-blur transition hover:bg-white"
            >
              Explore Suppliers
            </Link>
          </div>
          <p className="mt-3 text-[13.5px]">
            <Link
              href="/brands/list-your-products"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Supplier? List your products →
            </Link>
          </p>

          <div className="mt-8 max-w-[640px]">
            <MarketplaceSearch initialQuery={q} />
          </div>
        </div>
      </section>

      {/* Looking for — photo cards */}
      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.85rem]">
            What are you looking for?
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {LOOKING_FOR_CARDS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group relative aspect-[5/4] overflow-hidden rounded-2xl shadow-card sm:aspect-[16/10]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOOKING_FOR_IMAGES[c.icon] ?? LOOKING_FOR_IMAGES.treatments}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <h3 className="text-[14px] font-bold text-white sm:text-[16px]">{c.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by service — image tiles */}
      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.85rem]">
            Shop by service
          </h2>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
            {MARKETPLACE_SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/marketplace/services/${s.slug}`}
                className="group relative w-[42vw] flex-none overflow-hidden rounded-2xl shadow-card sm:w-[28vw] md:w-auto md:aspect-[4/5]"
              >
                <div className="aspect-[4/5] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={serviceImage(s.slug)}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-[13px] font-bold leading-snug text-white">
                  {s.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suppliers */}
      <section className="bg-white py-10 md:py-14" id="suppliers">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.85rem]">
              Suppliers &amp; brands
            </h2>
            <Link
              href="/marketplace/suppliers"
              className="text-[14px] font-bold text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {suppliers.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
          {q && suppliers.length === 0 && (
            <p className="mt-6 text-center text-[14.5px] text-ink-muted">
              No match for “{q}”.{" "}
              <Link href="/marketplace/suppliers" className="font-semibold text-brand-600">
                Browse all
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-14" id="products">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.85rem]">
            Products to explore
          </h2>
          <div className="mt-5">
            <ProductDiscoveryGrid products={products} suppliersById={suppliersById} />
          </div>
        </div>
      </section>

      {/* Supplier CTA — split visual */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/salon_02_luxe.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/75" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-5 py-14 text-white md:py-20">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
            For brands &amp; suppliers
          </p>
          <h2 className="mt-2 max-w-[480px] font-display text-[1.75rem] leading-tight md:text-[2.25rem]">
            Reach salon owners looking for products
          </h2>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/brands/list-your-products"
              className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition hover:bg-brand-600"
            >
              List Your Products
            </Link>
            <Link
              href="/brands#demo"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-white/30 bg-white/10 px-7 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
