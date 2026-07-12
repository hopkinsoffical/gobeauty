import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getService,
  MARKETPLACE_PRODUCTS,
  MARKETPLACE_SERVICES,
  SUPPLIERS,
} from "@/lib/data/marketplace";
import SupplierCard from "@/components/marketplace/SupplierCard";
import ProductDiscoveryGrid from "@/components/marketplace/ProductDiscoveryGrid";

export function generateStaticParams() {
  return MARKETPLACE_SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.name} Products for Salons`,
    description: service.shortDescription,
    alternates: { canonical: `/marketplace/services/${service.slug}` },
  };
}

export default function MarketplaceServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();

  const hints = [
    service.name.toLowerCase(),
    ...service.searchHints.map((h) => h.toLowerCase()),
    ...service.relatedCategories.map((c) => c.toLowerCase()),
  ];

  const suppliers = SUPPLIERS.filter((s) => {
    const hay = [
      ...s.bestFitServices,
      ...s.productCategories,
      s.shortDescription,
    ]
      .join(" ")
      .toLowerCase();
    return hints.some((h) => hay.includes(h) || s.bestFitServices.some((svc) => svc.toLowerCase().includes(h)));
  });

  // Prefer service-fit suppliers; fall back to featured + all for sparse matches
  const shownSuppliers =
    suppliers.length > 0
      ? suppliers
      : SUPPLIERS.filter((s) => s.featured || s.kind === "skincare_brand").slice(0, 6);

  const products = MARKETPLACE_PRODUCTS.filter((p) => {
    const hay = [
      p.category,
      p.treatmentPairing,
      p.professionalUse,
      p.aftercareFit,
      p.clientNeed,
    ]
      .join(" ")
      .toLowerCase();
    return hints.some((h) => hay.includes(h));
  });

  const shownProducts =
    products.length > 0 ? products : MARKETPLACE_PRODUCTS.slice(0, 4);

  const suppliersById = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#f5f0fb] to-transparent"
        />
        <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-10 md:pt-14">
          <nav className="text-[13px] text-ink-muted" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-ink">
              Products for Salons
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{service.name}</span>
          </nav>
          <h1 className="mt-3 font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            {service.name} products for your business
          </h1>
          <p className="mt-3 max-w-[600px] text-[15.5px] leading-relaxed text-ink-soft">
            {service.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.relatedCategories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-white px-3 py-1 text-[12.5px] font-medium text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-10">
        <h2 className="font-display text-[1.5rem] text-ink">
          Suppliers for {service.name}
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shownSuppliers.map((s) => (
            <SupplierCard key={s.id} supplier={s} />
          ))}
        </div>
      </section>

      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink">
            Products to explore
          </h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            May fit {service.name.toLowerCase()} — confirm use and availability with the supplier.
          </p>
          <div className="mt-6">
            <ProductDiscoveryGrid
              products={shownProducts}
              suppliersById={suppliersById}
            />
          </div>
          <div className="mt-8">
            <Link
              href={`/marketplace?q=${encodeURIComponent(service.name)}`}
              className="text-[14px] font-bold text-brand-600 hover:text-brand-700"
            >
              Search all marketplace results for {service.name} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-10">
        <h2 className="text-[15px] font-bold text-ink">All service categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {MARKETPLACE_SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/marketplace/services/${s.slug}`}
              className={[
                "rounded-pill border px-3.5 py-1.5 text-[13px] font-semibold transition",
                s.slug === service.slug
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-soft hover:border-brand-300",
              ].join(" ")}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
