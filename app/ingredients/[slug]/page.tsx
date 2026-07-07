import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIngredient } from "@/lib/gbApi";
import { EffectChips, ProductCardTile, RatingPill } from "@/components/gb/ProductBits";

export const revalidate = 300;

async function load(slug: string) {
  try {
    return await getIngredient(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const i = await load(params.slug);
  if (!i) return { title: "Ingredient not found" };
  const name = i.displayName ?? i.inciName;
  return {
    title: `${name} — what it does in skincare`,
    description:
      i.description?.slice(0, 155) ??
      `${name} (${i.inciName}): functions, irritancy and comedogenicity, and products that contain it.`,
  };
}

export default async function IngredientPage({ params }: { params: { slug: string } }) {
  const i = await load(params.slug);
  if (!i) notFound();

  const name = i.displayName ?? i.inciName;

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/ingredients" className="hover:text-brand-700">
          Ingredients
        </Link>{" "}
        / {name}
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl text-ink">{name}</h1>
          <RatingPill rating={i.rating} />
        </div>
        {i.displayName && <p className="mt-1 text-sm text-ink-faint">INCI: {i.inciName}</p>}
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
          <span>
            Irritancy:{" "}
            <strong className="tabular-nums text-ink-soft">
              {i.irritancy ? `${i.irritancy[0]}-${i.irritancy[1]}` : "unknown"}
            </strong>
          </span>
          <span>
            Comedogenicity:{" "}
            <strong className="tabular-nums text-ink-soft">
              {i.comedogenicity ? `${i.comedogenicity[0]}-${i.comedogenicity[1]}` : "unknown"}
            </strong>
          </span>
          {i.functions.length > 0 && <span>{i.functions.join(" · ")}</span>}
        </div>
        {(i.euAllergen || i.faTrigger) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {i.euAllergen && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                EU fragrance allergen
              </span>
            )}
            {i.faTrigger && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                Fungal-acne trigger
              </span>
            )}
          </div>
        )}
      </header>

      {i.quickFacts.length > 0 && (
        <section className="mb-8 rounded-2xl border border-line bg-surface-soft p-5">
          <h2 className="mb-2 font-display text-lg text-ink">At a glance</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {i.quickFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {i.description && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl text-ink">The details</h2>
          <p className="max-w-2xl whitespace-pre-line leading-relaxed text-ink-soft">
            {i.description}
          </p>
        </section>
      )}

      {(i.effects.benefits.length > 0 || i.effects.concerns.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl text-ink">Effects</h2>
          {i.effects.benefits.length > 0 && (
            <div className="mb-3">
              <EffectChips effects={i.effects.benefits} tone="benefit" />
            </div>
          )}
          {i.effects.concerns.length > 0 && (
            <EffectChips effects={i.effects.concerns} tone="concern" />
          )}
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl text-ink">
          Found in <span className="text-sm text-ink-muted">({i.products.length} products)</span>
        </h2>
        {i.products.length === 0 ? (
          <p className="text-sm text-ink-muted">Not in any product we&apos;ve decoded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {i.products.map((p) => (
              <ProductCardTile key={p.slug} p={p} />
            ))}
          </div>
        )}
      </section>

      {i.aliases.length > 0 && (
        <section>
          <h2 className="mb-2 font-display text-lg text-ink">Also listed as</h2>
          <p className="text-sm text-ink-muted">{i.aliases.join(", ")}</p>
        </section>
      )}
    </div>
  );
}
