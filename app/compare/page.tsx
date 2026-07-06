import type { Metadata } from "next";
import Link from "next/link";
import { compareProducts, listProducts, type ProductDetail } from "@/lib/gbApi";
import { BadgeChips, EffectChips } from "@/components/gb/ProductBits";

export const metadata: Metadata = {
  title: "Compare products — ingredient by ingredient",
  description:
    "Put any two beauty products side by side: shared ingredients, unique actives, benefits and concerns.",
};

export const revalidate = 300;

function Column({ p }: { p: ProductDetail }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{p.brand}</p>
      <Link href={`/products/${p.slug}`} className="font-display text-xl text-ink hover:text-brand-700">
        {p.name}
      </Link>
      <p className="mb-3 text-xs text-ink-faint">{p.ingredients.length} ingredients</p>
      <BadgeChips badges={p.badges} />
      <h3 className="mb-2 mt-4 text-sm font-semibold text-ink-soft">Benefits</h3>
      <EffectChips effects={p.effects.benefits.slice(0, 6)} tone="benefit" />
      <h3 className="mb-2 mt-4 text-sm font-semibold text-ink-soft">Concerns</h3>
      <EffectChips effects={p.effects.concerns.slice(0, 6)} tone="concern" />
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { a?: string; b?: string };
}) {
  const { a, b } = searchParams;

  if (!a || !b) {
    const { products } = await listProducts();
    const other = a ? products.filter((p) => p.slug !== a) : products;
    return (
      <div className="mx-auto max-w-[800px] px-6 py-10">
        <h1 className="font-display text-3xl text-ink">Compare products</h1>
        <p className="mt-1 text-ink-soft">
          {a ? "Pick the second product." : "Pick two products to compare side by side."}
        </p>
        <ul className="mt-6 space-y-2">
          {other.map((p) => (
            <li key={p.slug}>
              <Link
                href={a ? `/compare?a=${a}&b=${p.slug}` : `/compare?a=${p.slug}`}
                className="block rounded-xl border border-line bg-white px-4 py-3 transition hover:border-brand-300"
              >
                <span className="text-xs font-semibold uppercase text-ink-muted">{p.brand}</span>{" "}
                <span className="font-medium text-ink">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  let data;
  try {
    data = await compareProducts(a, b);
  } catch {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-10">
        <p className="text-ink-soft">
          Couldn&apos;t load that comparison.{" "}
          <Link href="/compare" className="text-brand-700 underline">
            Start over
          </Link>
        </p>
      </div>
    );
  }

  const { overlap } = data;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">Compare</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        <Column p={data.a} />
        <Column p={data.b} />
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-xl text-ink">
          Ingredient overlap{" "}
          <span className="text-sm text-ink-muted">({overlap.sharedCount} shared)</span>
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-soft">
              Only in {data.a.name} ({overlap.onlyA.length})
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              {overlap.onlyA.join(", ") || "—"}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-emerald-700">
              Shared ({overlap.shared.length})
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              {overlap.shared.join(", ") || "—"}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-soft">
              Only in {data.b.name} ({overlap.onlyB.length})
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              {overlap.onlyB.join(", ") || "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
