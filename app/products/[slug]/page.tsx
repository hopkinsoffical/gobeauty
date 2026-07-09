import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct } from "@/lib/gbApi";
import { BadgeChips, EffectChips, RatingPill } from "@/components/gb/ProductBits";
import CategoryView from "@/components/gb/CategoryView";

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

function fmtPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const r = await load(params.slug);
  if (!r) notFound();
  if (r.kind === "category") return <CategoryView c={r.category} />;
  const p = r.product;

  const keyIngredients = p.ingredients.filter((i) => i.isKey);
  const rc = p.ratingCounts;

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/products" className="hover:text-brand-700">
          Products
        </Link>{" "}
        /{" "}
        <Link href={`/brands/${p.brandSlug}`} className="hover:text-brand-700">
          {p.brand}
        </Link>
      </nav>

      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{p.brand}</p>
          <h1 className="font-display text-3xl text-ink">{p.name}</h1>
          <p className="mt-1 text-sm text-ink-faint">
            {[p.category, p.sizeLabel].filter(Boolean).join(" · ")}
          </p>
          {p.description && <p className="mt-3 max-w-xl text-ink-soft">{p.description}</p>}
          <div className="mt-4">
            <BadgeChips badges={p.badges} />
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-line bg-surface-soft p-4 md:w-64">
          {p.variants.length > 0 ? (
            <>
              <p className="text-2xl font-semibold text-ink">
                {fmtPrice(p.variants[0].price_cents, p.variants[0].currency)}
              </p>
              <p className="text-xs text-ink-muted">{p.variants[0].label}</p>
              <button className="mt-3 w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
                Add to bag
              </button>
            </>
          ) : (
            <p className="text-sm text-ink-muted">Not yet available in our shop.</p>
          )}
          {p.offers.length > 0 && (
            <div className="mt-3 border-t border-line pt-3 text-sm">
              <p className="mb-1 font-medium text-ink-soft">Also at</p>
              {p.offers.map((o) => (
                <a
                  key={o.url}
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block truncate text-brand-700 hover:underline"
                >
                  {o.retailer}
                  {o.price_cents != null && ` — ${fmtPrice(o.price_cents, o.currency)}`}
                </a>
              ))}
            </div>
          )}
          <Link
            href={`/compare?a=${p.slug}`}
            className="mt-3 block text-center text-sm font-medium text-brand-700 hover:underline"
          >
            Compare with another product →
          </Link>
        </div>
      </header>

      {keyIngredients.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl text-ink">Key ingredients</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {keyIngredients.map((i) => (
              <div key={i.slug} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/ingredients/${i.slug}`}
                    className="font-medium text-ink hover:text-brand-700"
                  >
                    {i.displayName ?? i.inciName}
                  </Link>
                  <RatingPill rating={i.rating} />
                </div>
                {i.functions.length > 0 && (
                  <p className="mt-1 text-xs text-ink-muted">{i.functions.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl text-ink">Benefits</h2>
        <EffectChips effects={p.effects.benefits} tone="benefit" />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl text-ink">Concerns</h2>
        <EffectChips effects={p.effects.concerns} tone="concern" />
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">
            Ingredients <span className="text-sm text-ink-muted">({p.ingredients.length})</span>
          </h2>
          <p className="text-xs text-ink-muted">
            {rc.superstar + rc.goodie} goodies · {rc.neutral + rc.unknown} neutral · {rc.icky} to watch
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line">
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
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl text-ink">Similar products</h2>
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
