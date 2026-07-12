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
import { serviceImage } from "@/lib/marketplace/visuals";

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
    const hay = [...s.bestFitServices, ...s.productCategories, s.shortDescription]
      .join(" ")
      .toLowerCase();
    return hints.some(
      (h) =>
        hay.includes(h) ||
        s.bestFitServices.some((svc) => svc.toLowerCase().includes(h)),
    );
  });

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
  const hero = serviceImage(service.slug);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
        </div>
        <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-10 md:pb-14 md:pt-14">
          <nav className="text-[13px] text-ink-muted" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-ink">
              Products for Salons
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{service.name}</span>
          </nav>
          <h1 className="mt-3 max-w-[520px] font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            {service.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.relatedCategories.slice(0, 5).map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-white/90 px-3 py-1 text-[12px] font-medium text-ink-soft backdrop-blur"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-[1.4rem] text-ink">Suppliers</h2>
          <Link
            href="/marketplace/suppliers"
            className="text-[13.5px] font-bold text-brand-600"
          >
            All →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {shownSuppliers.map((s) => (
            <SupplierCard key={s.id} supplier={s} />
          ))}
        </div>
      </section>

      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.4rem] text-ink">Products</h2>
          <div className="mt-5">
            <ProductDiscoveryGrid
              products={shownProducts}
              suppliersById={suppliersById}
            />
          </div>
        </div>
      </section>

      {/* Other services — horizontal image scroller */}
      <section className="mx-auto max-w-[1200px] px-5 py-10">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-faint">
          More services
        </h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {MARKETPLACE_SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/marketplace/services/${s.slug}`}
              className={[
                "group relative w-[140px] flex-none overflow-hidden rounded-2xl sm:w-[160px]",
                s.slug === service.slug ? "ring-2 ring-brand-400" : "",
              ].join(" ")}
            >
              <div className="aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={serviceImage(s.slug)}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 right-2.5 text-[12.5px] font-bold leading-snug text-white">
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
