import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSupplier,
  getSupplierProducts,
  SUPPLIERS,
} from "@/lib/data/marketplace";
import { PROFILE_STATUS_LABEL } from "@/lib/marketplace/types";
import StatusPill from "@/components/marketplace/StatusPill";
import SupplierActions, { AskProductButton } from "@/components/marketplace/SupplierActions";
import { listProducts } from "@/lib/gbApi";
import {
  productImage,
  supplierCover,
  USE_CASE_IMAGES,
} from "@/lib/marketplace/visuals";

export const revalidate = 3600;

export function generateStaticParams() {
  return SUPPLIERS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const supplier = getSupplier(params.slug);
  if (!supplier) return { title: "Supplier not found" };
  return {
    title: `${supplier.name} Products for Salons & Beauty Professionals`,
    description: `Explore ${supplier.name} products, categories, professional use cases, business information, and product inquiry options on GoBeauty.`,
    alternates: { canonical: `/marketplace/suppliers/${supplier.slug}` },
  };
}

export default async function SupplierDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { category?: string };
}) {
  const supplier = getSupplier(params.slug);
  if (!supplier) notFound();

  const seedProducts = getSupplierProducts(supplier.id);
  let liveProducts: {
    slug: string;
    name: string;
    brand: string;
    category: string | null;
    images: { url: string }[];
  }[] = [];
  if (supplier.gbBrandSlug) {
    try {
      const { products } = await listProducts("", {
        brand: supplier.gbBrandSlug,
        limit: 8,
      });
      liveProducts = products;
    } catch {
      liveProducts = [];
    }
  }

  const categoryFilter = searchParams?.category?.toLowerCase();
  const categories = supplier.productCategories;
  const filteredSeed = categoryFilter
    ? seedProducts.filter((p) => p.category.toLowerCase().includes(categoryFilter))
    : seedProducts;

  const statusLabel = PROFILE_STATUS_LABEL[supplier.profileStatus];
  const cover = supplierCover(supplier.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: supplier.name,
    description: supplier.shortDescription,
    url: `https://www.gobeauty.ai/marketplace/suppliers/${supplier.slug}`,
    ...(supplier.websiteUrl ? { sameAs: [supplier.websiteUrl] } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Marketplace", item: "https://www.gobeauty.ai/marketplace" },
      { "@type": "ListItem", position: 2, name: "Suppliers", item: "https://www.gobeauty.ai/marketplace/suppliers" },
      {
        "@type": "ListItem",
        position: 3,
        name: supplier.name,
        item: `https://www.gobeauty.ai/marketplace/suppliers/${supplier.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Full-bleed cover hero */}
      <section className="relative">
        <div className="relative h-[220px] overflow-hidden sm:h-[280px] md:h-[340px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <div className="mx-auto flex max-w-[1200px] items-end gap-4">
              <span
                className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl text-[18px] font-bold text-white shadow-lg ring-2 ring-white/90 sm:h-20 sm:w-20 sm:text-[22px]"
                style={{ background: supplier.logoColor }}
                aria-hidden
              >
                {supplier.logoInitials}
              </span>
              <div className="min-w-0 pb-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-[1.75rem] leading-tight text-white sm:text-[2.25rem]">
                    {supplier.name}
                  </h1>
                  {supplier.featured && (
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[12.5px] text-white/85">
                  {statusLabel}
                  <span className="mx-1.5 opacity-50">·</span>
                  {supplier.productCategories.slice(0, 3).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-5 py-5">
          <nav className="mb-3 text-[12.5px] text-ink-muted" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-ink">Products for Salons</Link>
            <span className="mx-1.5">/</span>
            <Link href="/marketplace/suppliers" className="hover:text-ink">Suppliers</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{supplier.name}</span>
          </nav>
          <SupplierActions supplier={supplier} />
          {supplier.disclaimer && (
            <p className="mt-3 max-w-[640px] text-[12px] leading-relaxed text-ink-faint">
              {supplier.disclaimer}
            </p>
          )}
        </div>
      </section>

      {/* Quick status strip — visual chips, no essay */}
      <section className="border-y border-line-soft bg-surface-soft py-6">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Samples", status: supplier.sampleStatus },
              { label: "Salon pricing", status: supplier.businessPricingStatus },
              { label: "Training", status: supplier.trainingStatus },
              { label: "Private label", status: supplier.privateLabelStatus },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3.5 py-3 shadow-card"
              >
                <span className="text-[13px] font-semibold text-ink">{r.label}</span>
                <StatusPill status={r.status} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {supplier.bestFitBusinessTypes.slice(0, 5).map((b) => (
              <span
                key={b}
                className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-line"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories as visual pills */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-faint">
            Categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/marketplace/suppliers/${supplier.slug}`}
              className={[
                "rounded-pill border px-4 py-2 text-[13px] font-semibold transition",
                !categoryFilter
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-line bg-white text-ink-soft hover:border-brand-300",
              ].join(" ")}
            >
              All
            </Link>
            {categories.map((c) => {
              const active = categoryFilter && c.toLowerCase().includes(categoryFilter);
              return (
                <Link
                  key={c}
                  href={`/marketplace/suppliers/${supplier.slug}?category=${encodeURIComponent(c)}`}
                  className={[
                    "rounded-pill border px-4 py-2 text-[13px] font-semibold transition",
                    active
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-line bg-white text-ink-soft hover:border-brand-300",
                  ].join(" ")}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products — image grid */}
      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Products to explore
          </h2>

          {filteredSeed.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {filteredSeed.map((p) => (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage(p.id)}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-bold text-ink">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-[14px] font-bold text-ink">{p.productName}</h3>
                    <p className="mt-1 line-clamp-1 text-[12px] text-ink-muted">{p.bestFitBusiness}</p>
                    <div className="mt-2.5">
                      <AskProductButton
                        supplier={supplier}
                        productName={p.productName}
                        productId={p.id}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {liveProducts.length > 0 && (
            <>
              <h3 className="mt-10 text-[14px] font-bold text-ink">In the product library</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {liveProducts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-cardHover"
                  >
                    {p.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt=""
                        className="aspect-square w-full object-cover bg-surface-soft transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-square bg-surface-soft" />
                    )}
                    <div className="p-2.5">
                      <p className="line-clamp-2 text-[13px] font-semibold text-ink">{p.name}</p>
                      <p className="text-[12px] text-ink-muted">{p.brand}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {filteredSeed.length === 0 && liveProducts.length === 0 && (
            <p className="mt-6 text-[14px] text-ink-muted">
              Products still being curated — use Ask About Products.
            </p>
          )}
        </div>
      </section>

      {/* Use cases — photo tiles with short titles only */}
      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            How it may fit your business
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {supplier.useCases.map((u, i) => (
              <div
                key={u.title}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={USE_CASE_IMAGES[i % USE_CASE_IMAGES.length]}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <h3 className="text-[14px] font-bold text-white">{u.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About — collapsed one-liner + link */}
      <section className="border-t border-line-soft bg-surface-soft py-8">
        <div className="mx-auto max-w-[720px] px-5 text-center">
          <p className="text-[14.5px] leading-relaxed text-ink-soft">
            {supplier.shortDescription}
          </p>
          {supplier.websiteUrl && (
            <a
              href={supplier.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13.5px] font-bold text-brand-600 hover:text-brand-700"
            >
              Official website →
            </a>
          )}
        </div>
      </section>

      {/* Claim */}
      {!supplier.claimed && (
        <section className="border-t border-line-soft bg-white py-10">
          <div className="mx-auto max-w-[520px] px-5 text-center">
            <p className="text-[15px] font-semibold text-ink">
              Represent this brand?
            </p>
            <Link
              href={`/brands/list-your-products?claim=${supplier.slug}`}
              className="mt-4 inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-7 text-[14.5px] font-semibold text-white transition hover:bg-brand-600"
            >
              Claim This Profile
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
