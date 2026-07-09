import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct } from "@/lib/gbApi";
import { BadgeChips, RatingPill } from "@/components/gb/ProductBits";
import { Stars, fmtUsd } from "@/components/gb/CategoryBits";
import CategoryView from "@/components/gb/CategoryView";
import ProductActions from "@/components/gb/ProductActions";

export const revalidate = 300;

// skinsort-style URLs: /products/night-moisturizers is a category page,
// /products/cerave-skin-renewing-night-cream... a product page. Category slugs
// are curated (db/rds/002) and product slugs brand-prefixed, so they never collide.
async function load(slug: string) {
  try {
    return { kind: "category" as const, category: await getCategory(slug) };
  } catch {
    /* not a category — fall through to product */
  }
  try {
    return { kind: "product" as const, product: await getProduct(slug) };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const r = await load(params.slug);
  if (!r) return { title: "Not found" };
  if (r.kind === "category") {
    const c = r.category;
    return {
      title: `${c.productCount} Best ${c.name} in ${new Date().getFullYear()} — ingredient-checked`,
      description:
        c.description ??
        `The best ${c.name.toLowerCase()} ranked by community rating, with complete ingredient breakdowns and safety analysis.`,
    };
  }
  const p = r.product;
  return {
    title: `${p.brand} ${p.name} — ingredients & analysis`,
    description: `${p.brand} ${p.name}: full ingredient list explained, benefits, concerns, and where to buy.`,
  };
}

/* Minimal single-color section icons, heroicons-outline style. */
function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
const ICON_BAG =
  "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z";
const ICON_SPARKLES =
  "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z";
const ICON_LIST =
  "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z";

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-ink-soft">
        <Icon d={icon} />
      </span>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const r = await load(params.slug);
  if (!r) notFound();
  if (r.kind === "category") return <CategoryView c={r.category} />;
  const p = r.product;

  const keyIngredients = p.ingredients.filter((i) => i.isKey);
  const benefits = p.effects.benefits;
  const rc = p.ratingCounts;

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/products" className="hover:text-brand-700">
          Products
        </Link>{" "}
        /{" "}
        <Link href={`/brands/${p.brandSlug}`} className="hover:text-brand-700">
          {p.brand}
        </Link>
      </nav>

      {/* Hero: image left, title / rating / summary right */}
      <header className="mb-4 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div className="flex aspect-square items-center justify-center rounded-3xl bg-surface-soft p-8">
          {p.images[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.images[0].url}
              alt={p.images[0].alt ?? p.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-6xl" aria-hidden>
              🧴
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            <Link href={`/brands/${p.brandSlug}`} className="hover:text-brand-700">
              {p.brand}
            </Link>
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {p.name}
          </h1>

          {p.ratingAvg != null && (
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Stars value={p.ratingAvg} />
              <span className="font-semibold text-ink">{p.ratingAvg.toFixed(1)}</span>
              <span className="text-ink-muted">
                {p.ratingCount} {p.ratingCount === 1 ? "review" : "reviews"}
              </span>
            </p>
          )}

          <p className="mt-1.5 text-sm text-ink-faint">
            {[p.category, p.sizeLabel].filter(Boolean).join(" · ")}
          </p>

          {p.description && (
            <p className="mt-4 leading-relaxed text-ink-soft">{p.description}</p>
          )}

          <ProductActions
            slug={p.slug}
            name={p.name}
            brand={p.brand}
            imageUrl={p.images[0]?.url ?? null}
            dupes={p.dupes}
          />
        </div>
      </header>

      {/* Where to buy */}
      {p.offers.length > 0 && (
        <section className="border-t border-line py-10">
          <SectionHeader icon={ICON_BAG} title="Where to buy" />
          <div className="mt-5 flex flex-wrap gap-3">
            {p.offers.map((o) => (
              <a
                key={o.url}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 transition hover:border-brand-300 hover:shadow-card"
              >
                <span className="font-medium text-ink group-hover:text-brand-700">
                  {o.retailer}
                </span>
                {o.price_cents != null && (
                  <span className="text-ink-muted">{fmtUsd(o.price_cents)}</span>
                )}
                <span className="text-ink-faint transition group-hover:translate-x-0.5">→</span>
              </a>
            ))}
          </div>
          <Link
            href={`/compare?a=${p.slug}`}
            className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
          >
            Compare with another product →
          </Link>
        </section>
      )}

      {/* What's inside */}
      <section className="border-t border-line py-10">
        <SectionHeader icon={ICON_SPARKLES} title="What's inside" />

        {keyIngredients.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Key ingredients
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {keyIngredients.map((i) => (
                <Link
                  key={i.slug}
                  href={`/ingredients/${i.slug}`}
                  className="group rounded-2xl bg-surface-soft p-4 transition hover:bg-surface-tint"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink group-hover:text-brand-700">
                      {i.displayName ?? i.inciName}
                    </span>
                    <RatingPill rating={i.rating} />
                  </div>
                  {i.functions.length > 0 && (
                    <p className="mt-1 text-xs text-ink-muted">{i.functions.join(" · ")}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {benefits.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Benefits
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {benefits.map((e) => (
                <span
                  key={e.slug}
                  title={e.description ?? undefined}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200"
                >
                  {e.name}
                  <span className="rounded-full bg-white/70 px-1.5 text-xs tabular-nums">
                    {e.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Free from
          </h3>
          <div className="mt-3">
            <BadgeChips badges={p.badges} />
          </div>
        </div>
      </section>

      {/* Ingredients List */}
      <section className="border-t border-line py-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionHeader icon={ICON_LIST} title="Ingredients List" />
          <p className="text-xs text-ink-muted">
            {p.ingredients.length} ingredients · {rc.superstar + rc.goodie} goodies ·{" "}
            {rc.neutral + rc.unknown} neutral · {rc.icky} to watch
          </p>
        </div>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Ingredient</th>
                <th className="px-4 py-2.5">What it does</th>
                <th className="px-4 py-2.5">irr. / com.</th>
                <th className="px-4 py-2.5">Rating</th>
              </tr>
            </thead>
            <tbody>
              {p.ingredients.map((i) => (
                <tr key={i.slug} className="border-t border-line/70">
                  <td className="px-4 py-2 tabular-nums text-ink-faint">{i.position}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/ingredients/${i.slug}`}
                      className="font-medium text-ink hover:text-brand-700"
                    >
                      {i.inciName}
                    </Link>
                    {i.isKey && <span className="ml-1.5 text-xs text-brand-600">★ key</span>}
                    {i.euAllergen && (
                      <span className="ml-1.5 text-xs text-amber-700">EU allergen</span>
                    )}
                    {i.faTrigger && (
                      <span className="ml-1.5 text-xs text-amber-700">FA trigger</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{i.functions.join(", ") || "—"}</td>
                  <td className="px-4 py-2 tabular-nums text-ink-muted">
                    {i.irritancy ? `${i.irritancy[0]}-${i.irritancy[1]}` : "–"} /{" "}
                    {i.comedogenicity ? `${i.comedogenicity[0]}-${i.comedogenicity[1]}` : "–"}
                  </td>
                  <td className="px-4 py-2">
                    <RatingPill rating={i.rating} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {p.dupes.length > 0 && (
        <section className="border-t border-line py-10">
          <h2 className="mb-4 font-display text-2xl text-ink">Similar products</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.dupes.map((d) => (
              <Link
                key={d.slug}
                href={`/compare?a=${p.slug}&b=${d.slug}`}
                className="group rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {d.brand}
                </p>
                <h3 className="font-display leading-snug text-ink group-hover:text-brand-700">
                  {d.name}
                </h3>
                <p className="mt-1 text-xs text-ink-faint">
                  {d.sharedIngredients} shared ingredients ·{" "}
                  {Math.round(d.similarity * 100)}% match
                </p>
                <p className="mt-2 text-xs font-medium text-brand-700">Compare →</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
