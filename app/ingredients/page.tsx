import type { Metadata } from "next";
import Link from "next/link";
import { listIngredients } from "@/lib/gbApi";
import { RatingPill } from "@/components/gb/ProductBits";

export const metadata: Metadata = {
  title: "Ingredient dictionary — what's really in your products",
  description:
    "Every cosmetic ingredient decoded: what it does, irritancy and comedogenicity ratings, and which products contain it.",
};

export const revalidate = 300;

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const { ingredients } = await listIngredients(q, 200);

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink">Ingredient dictionary</h1>
        <p className="mt-1 text-ink-soft">
          What each ingredient does, how likely it is to irritate or clog pores, and where it shows up.
        </p>
        <form className="mt-4" action="/ingredients">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by INCI or common name…"
            className="w-full max-w-md rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </form>
      </header>

      {ingredients.length === 0 ? (
        <p className="text-ink-muted">No ingredients found{q ? ` for “${q}”` : ""}.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-2.5">Ingredient</th>
                <th className="px-4 py-2.5">What it does</th>
                <th className="px-4 py-2.5">irr. / com.</th>
                <th className="px-4 py-2.5">Rating</th>
                <th className="px-4 py-2.5 text-right">Products</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((i) => (
                <tr key={i.slug} className="border-t border-line/70">
                  <td className="px-4 py-2">
                    <Link
                      href={`/ingredients/${i.slug}`}
                      className="font-medium text-ink hover:text-brand-700"
                    >
                      {i.displayName ?? i.inciName}
                    </Link>
                    {i.displayName && (
                      <span className="ml-1.5 text-xs text-ink-faint">{i.inciName}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">
                    {i.functions.slice(0, 3).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-2 tabular-nums text-ink-muted">
                    {i.irritancy ? `${i.irritancy[0]}-${i.irritancy[1]}` : "–"} /{" "}
                    {i.comedogenicity ? `${i.comedogenicity[0]}-${i.comedogenicity[1]}` : "–"}
                  </td>
                  <td className="px-4 py-2">
                    <RatingPill rating={i.rating} />
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-ink-muted">
                    {i.productCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
