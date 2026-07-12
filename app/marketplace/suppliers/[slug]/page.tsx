import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSupplier,
  getSupplierProducts,
  SUPPLIERS,
} from "@/lib/data/marketplace";
import {
  COMMERCIAL_STATUS_LABEL,
  PROFILE_STATUS_LABEL,
} from "@/lib/marketplace/types";
import StatusPill from "@/components/marketplace/StatusPill";
import SupplierActions, { AskProductButton } from "@/components/marketplace/SupplierActions";
import { listProducts } from "@/lib/gbApi";

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
  const commercialRows: { label: string; status: typeof supplier.sampleStatus; detail?: string | null }[] = [
    { label: "Samples", status: supplier.sampleStatus },
    { label: "Salon or business pricing", status: supplier.businessPricingStatus },
    {
      label: "Opening order",
      status: supplier.minimumOrder ? "available" : "pending",
      detail: supplier.minimumOrder,
    },
    { label: "Product training", status: supplier.trainingStatus },
    {
      label: "Shipping",
      status: supplier.shippingMarkets.length ? "available" : "pending",
      detail: supplier.shippingDetails || supplier.shippingMarkets.join(", ") || null,
    },
    { label: "Private label", status: supplier.privateLabelStatus },
  ];

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

      {/* Hero */}
      <section className="border-b border-line-soft bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-10 md:py-14">
          <nav className="text-[13px] text-ink-muted" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-ink">Products for Salons</Link>
            <span className="mx-1.5">/</span>
            <Link href="/marketplace/suppliers" className="hover:text-ink">Suppliers</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{supplier.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <span
              className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl text-[22px] font-bold text-white shadow-card"
              style={{ background: supplier.logoColor }}
              aria-hidden
            >
              {supplier.logoInitials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[2rem] leading-tight text-ink md:text-[2.5rem]">
                  {supplier.name}
                </h1>
                <span className="rounded-full bg-surface-soft px-3 py-1 text-[12px] font-bold text-ink-soft ring-1 ring-line">
                  {statusLabel}
                </span>
                {supplier.featured && (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-bold text-brand-700 ring-1 ring-brand-200">
                    Featured Supplier
                  </span>
                )}
              </div>
              <p className="mt-1 text-[14px] text-ink-muted">{supplier.supplierType}</p>
              <p className="mt-3 max-w-[640px] text-[15.5px] leading-relaxed text-ink-soft">
                {supplier.shortDescription}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {supplier.productCategories.slice(0, 8).map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-surface-soft px-2.5 py-0.5 text-[12px] font-medium text-ink-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[13.5px] text-ink-muted">
                Best fit: {supplier.bestFitBusinessTypes.slice(0, 4).join(" · ")}
                {(supplier.country || supplier.shippingMarkets[0]) && (
                  <> · {supplier.shippingMarkets[0] || supplier.country}</>
                )}
              </p>
              <div className="mt-6">
                <SupplierActions supplier={supplier} />
              </div>
              {supplier.disclaimer && (
                <p className="mt-4 max-w-[640px] text-[12.5px] leading-relaxed text-ink-faint">
                  {supplier.disclaimer}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick fit */}
      <section className="bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Is this supplier a fit for your business?
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Best for", value: supplier.bestFitBusinessTypes.join(", ") },
              { label: "Main product categories", value: supplier.productCategories.slice(0, 6).join(", ") },
              { label: "Common professional use", value: supplier.commonProfessionalUse },
              { label: "Retail opportunity", value: supplier.retailOpportunity },
              { label: "Aftercare opportunity", value: supplier.aftercareOpportunity },
              {
                label: "Shipping market",
                value: supplier.shippingMarkets.join(", ") || "Information not yet provided",
              },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <p className="text-[12px] font-bold uppercase tracking-wide text-ink-faint">
                  {row.label}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Samples", status: supplier.sampleStatus },
              { label: "Salon pricing", status: supplier.businessPricingStatus },
              { label: "Training", status: supplier.trainingStatus },
              { label: "Private label", status: supplier.privateLabelStatus },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 shadow-card">
                <span className="text-[13.5px] font-semibold text-ink">{r.label}</span>
                <StatusPill status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            About the supplier
          </h2>
          <div className="mt-4 max-w-[720px] space-y-3 text-[15px] leading-relaxed text-ink-soft">
            <p>{supplier.fullDescription}</p>
            <ul className="grid gap-2 text-[14px] sm:grid-cols-2">
              <li><span className="font-semibold text-ink">Product focus: </span>{supplier.productFocus}</li>
              <li><span className="font-semibold text-ink">Business type: </span>{supplier.supplierType}</li>
              <li><span className="font-semibold text-ink">Main markets: </span>{supplier.country || "Information pending"}</li>
              <li>
                <span className="font-semibold text-ink">Profile ownership: </span>
                {supplier.claimed ? "Claimed" : "Unclaimed / relationship unconfirmed"}
              </li>
              {supplier.websiteUrl && (
                <li className="sm:col-span-2">
                  <span className="font-semibold text-ink">Official website: </span>
                  <a
                    href={supplier.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {supplier.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Product categories
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/marketplace/suppliers/${supplier.slug}`}
              className={[
                "rounded-pill border px-4 py-2 text-[13.5px] font-semibold transition",
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
                    "rounded-pill border px-4 py-2 text-[13.5px] font-semibold transition",
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

      {/* Products to explore */}
      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Products to explore
          </h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            GoBeauty editorial guidance — not supplier marketing claims.
          </p>

          {filteredSeed.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSeed.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-card"
                >
                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-surface-soft to-brand-50">
                    <span className="text-[13px] font-semibold text-ink-muted">{p.brandName}</span>
                  </div>
                  <p className="mt-3 text-[11.5px] font-bold uppercase tracking-wide text-brand-600">
                    {p.category}
                  </p>
                  <h3 className="mt-0.5 text-[15px] font-bold text-ink">{p.productName}</h3>
                  <p className="mt-2 text-[12.5px] leading-snug text-ink-soft">
                    <span className="font-semibold text-ink">May fit: </span>
                    {p.bestFitBusiness}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                    <span className="font-semibold text-ink">Often used for: </span>
                    {p.treatmentPairing}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                    <span className="font-semibold text-ink">Retail / aftercare: </span>
                    {p.retailFit}
                  </p>
                  <p className="mt-2 text-[11px] text-ink-faint">Source: GoBeauty editorial</p>
                  <div className="mt-3">
                    <AskProductButton
                      supplier={supplier}
                      productName={p.productName}
                      productId={p.id}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          {liveProducts.length > 0 && (
            <>
              <h3 className="mt-10 text-[15px] font-bold text-ink">
                Related products in the GoBeauty library
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {liveProducts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="rounded-2xl border border-line bg-white p-3 shadow-card transition hover:shadow-cardHover"
                  >
                    {p.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt=""
                        className="aspect-square w-full rounded-xl object-cover bg-surface-soft"
                      />
                    ) : (
                      <div className="aspect-square rounded-xl bg-surface-soft" />
                    )}
                    <p className="mt-2 line-clamp-2 text-[13px] font-semibold text-ink">{p.name}</p>
                    <p className="text-[12px] text-ink-muted">{p.brand}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {filteredSeed.length === 0 && liveProducts.length === 0 && (
            <p className="mt-6 text-[14.5px] text-ink-muted">
              Product records for this profile are still being curated. Use{" "}
              <strong>Ask About Products</strong> to inquire.
            </p>
          )}
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            How this product line may fit a beauty business
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            Editorial guidance from GoBeauty — separate from any supplier claims.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {supplier.useCases.map((u) => (
              <div key={u.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <h3 className="text-[15px] font-bold text-ink">{u.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Samples, pricing, support */}
      <section className="bg-white py-10 md:py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <h2 className="font-display text-[1.5rem] text-ink md:text-[1.75rem]">
            Samples, business pricing and support
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commercialRows.map((r) => (
              <div key={r.label} className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-bold text-ink">{r.label}</p>
                  <StatusPill status={r.status} />
                </div>
                {r.detail && (
                  <p className="mt-2 text-[13px] text-ink-soft">{r.detail}</p>
                )}
                {!r.detail && r.status === "pending" && (
                  <p className="mt-2 text-[13px] text-ink-muted">
                    {COMMERCIAL_STATUS_LABEL.pending}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <SupplierActions supplier={supplier} />
          </div>
        </div>
      </section>

      {/* Claim profile */}
      {!supplier.claimed && (
        <section className="border-t border-line-soft bg-surface-soft py-10 md:py-12">
          <div className="mx-auto max-w-[720px] px-5 text-center">
            <p className="text-[15px] font-semibold text-ink">
              Represent this brand? Claim or update this page.
            </p>
            <p className="mt-1 text-[13.5px] text-ink-soft">
              Profile status: {statusLabel}. Claiming does not auto-publish
              partnership or wholesale badges.
            </p>
            <div className="mt-4 flex justify-center">
              <Link
                href={`/brands/list-your-products?claim=${supplier.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white px-7 text-[14.5px] font-semibold text-ink transition hover:bg-white hover:shadow-card"
              >
                Claim This Profile
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
