import type { Metadata } from "next";
import Link from "next/link";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import SupplierCard from "@/components/marketplace/SupplierCard";
import { filterSuppliers } from "@/lib/data/marketplace";

export const metadata: Metadata = {
  title: "Beauty Suppliers and Brands",
  description:
    "Explore product sources and brands for salon services, professional use, client aftercare, and retail.",
  alternates: { canonical: "/marketplace/suppliers" },
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "recent", label: "Recently added" },
  { value: "products", label: "Most products" },
  { value: "az", label: "A–Z" },
];

export default function SuppliersDirectoryPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    type?: string;
    category?: string;
    business?: string;
    service?: string;
    status?: string;
    sort?: string;
  };
}) {
  const suppliers = filterSuppliers({
    q: searchParams?.q,
    type: searchParams?.type,
    category: searchParams?.category,
    business: searchParams?.business,
    service: searchParams?.service,
    status: searchParams?.status,
    sort: searchParams?.sort,
  });

  const currentSort = searchParams?.sort ?? "featured";

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
            <span className="text-ink">Suppliers</span>
          </nav>
          <h1 className="mt-3 font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            Beauty suppliers and brands
          </h1>
          <p className="mt-2 max-w-[520px] text-[14.5px] text-ink-soft">
            Multi-brand sources plus US-priority K-beauty brand profiles.{" "}
            <Link
              href="/brands/kbeauty"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Full K-beauty A–Z catalog →
            </Link>
          </p>
          <div className="mt-6 max-w-[640px]">
            <MarketplaceSearch
              initialQuery={searchParams?.q ?? ""}
              basePath="/marketplace/suppliers"
              placeholder="Search supplier, brand, category, or service"
              showSuggestions={false}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pb-16">
        {/* Filters — only surface non-verified commercial filters as "info pending" */}
        <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
          <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-[12px] font-semibold text-ink-muted">
            Supplier type
            <select
              name="type"
              defaultValue={searchParams?.type ?? ""}
              className="h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-medium text-ink"
            >
              <option value="">All types</option>
              <option value="multi-brand">Multi-brand source</option>
              <option value="skincare brand">Skincare brand</option>
            </select>
          </label>
          <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-[12px] font-semibold text-ink-muted">
            Product category
            <select
              name="category"
              defaultValue={searchParams?.category ?? ""}
              className="h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-medium text-ink"
            >
              <option value="">All categories</option>
              <option value="cleansers">Cleansers</option>
              <option value="serums">Serums</option>
              <option value="moisturizers">Moisturizers</option>
              <option value="sunscreen">Sunscreen</option>
              <option value="hair">Haircare</option>
              <option value="makeup">Makeup</option>
            </select>
          </label>
          <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-[12px] font-semibold text-ink-muted">
            Best-fit business
            <select
              name="business"
              defaultValue={searchParams?.business ?? ""}
              className="h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-medium text-ink"
            >
              <option value="">All businesses</option>
              <option value="facial spa">Facial spas</option>
              <option value="esthetician">Estheticians</option>
              <option value="boutique">Beauty boutiques</option>
              <option value="retail">K-beauty retail</option>
            </select>
          </label>
          <label className="flex min-w-[120px] flex-col gap-1 text-[12px] font-semibold text-ink-muted">
            Sort
            <select
              name="sort"
              defaultValue={currentSort}
              className="h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-medium text-ink"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          {searchParams?.q && <input type="hidden" name="q" value={searchParams.q} />}
          <button
            type="submit"
            className="h-11 rounded-xl bg-brand-500 px-5 text-[14px] font-semibold text-white transition hover:bg-brand-600"
          >
            Apply
          </button>
        </form>

        <p className="mt-5 text-[13.5px] font-semibold text-ink-muted">
          {suppliers.length} supplier{suppliers.length === 1 ? "" : "s"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {suppliers.map((s) => (
            <SupplierCard key={s.id} supplier={s} />
          ))}
        </div>

        {suppliers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-line bg-white p-8 text-center">
            <p className="text-[15px] font-semibold text-ink">No matching suppliers</p>
            <p className="mt-1 text-[14px] text-ink-soft">
              Try clearing filters or{" "}
              <Link href="/marketplace/suppliers" className="font-semibold text-brand-600">
                view all
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </>
  );
}
