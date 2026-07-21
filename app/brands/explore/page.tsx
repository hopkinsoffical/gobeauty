import type { Metadata } from "next";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { listBrands } from "@/lib/gbApi";
import { buildBrandsHref } from "@/lib/products-url";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Explore brands — ingredient-checked beauty brands",
  description:
    "Browse every brand on goBeauty with live products. Open a brand page for bestsellers, top-rated picks, and the full catalog.",
  alternates: { canonical: "/brands/explore" },
};

const PAGE_SIZE = 24;

export default async function BrandsExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  let all = await listBrands(1000)
    .then((r) => r.brands)
    .catch(() => []);

  if (q) {
    all = all.filter(
      (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q),
    );
  }

  // Sort by product count (richest catalogs first)
  all = [...all].sort(
    (a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name),
  );

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;
  const pageItems = all.slice(offset, offset + PAGE_SIZE);
  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  return (
    <div className="bg-[var(--beauty-white)]">
      <section className="border-b border-line bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-purple-light)]">
        <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-14 lg:px-8">
          <nav className="text-[13px] text-ink-muted">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">Brands</span>
          </nav>
          <h1 className="mt-3 font-display text-[36px] leading-tight text-ink sm:text-5xl">
            Explore brands
          </h1>
          <p className="mt-2 max-w-xl text-[15.5px] text-ink-muted">
            {total.toLocaleString()} brand{total === 1 ? "" : "s"} with live products.
            Open any brand for introduction, bestsellers, and full product list.
          </p>

          <form action="/brands/explore" method="get" className="mt-6 flex max-w-md gap-2">
            <input
              type="search"
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search brands…"
              className="h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 text-[14px] text-ink outline-none focus:border-brand-300"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center rounded-full bg-brand-500 px-5 text-[14px] font-semibold text-white hover:bg-brand-600"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
            <Link
              href="/products?view=all"
              className="font-semibold text-brand-700 hover:underline"
            >
              All products →
            </Link>
            <span className="text-ink-faint">·</span>
            <Link href="/brands/kbeauty" className="font-semibold text-ink-soft hover:underline">
              K-beauty A–Z
            </Link>
            <span className="text-ink-faint">·</span>
            <Link href="/brands" className="font-semibold text-ink-soft hover:underline">
              For brand partners
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 lg:px-8">
        {pageItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-surface-soft px-6 py-14 text-center">
            <p className="font-display text-xl text-ink">No brands found</p>
            <Link
              href="/brands/explore"
              className="mt-4 inline-flex text-[14px] font-semibold text-brand-700 hover:underline"
            >
              Clear search
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[14px] text-ink-muted">
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of{" "}
              {total.toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {pageItems.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover"
                >
                  <div className="flex aspect-square items-center justify-center bg-[var(--beauty-blush)] p-4">
                    {b.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.image}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-display text-3xl text-brand-600">
                        {b.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-[13.5px] font-bold text-ink group-hover:text-brand-700">
                      {b.name}
                    </p>
                    <p className="text-[11.5px] text-ink-muted">
                      {b.productCount} product{b.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              page={safePage}
              hasPrev={hasPrev}
              hasNext={hasNext}
              hrefForPage={(p) => buildBrandsHref({ q: searchParams.q, page: p })}
              label="brands"
            />
          </>
        )}
      </div>
    </div>
  );
}
