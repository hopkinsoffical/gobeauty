import type { Metadata } from "next";
import Link from "next/link";
import { BADGE_LABELS, compareProducts, listProducts, type ProductDetail } from "@/lib/gbApi";
import { RatingPill } from "@/components/gb/ProductBits";
import { Stars, fmtUsd } from "@/components/gb/CategoryBits";

export const metadata: Metadata = {
  title: "Compare products — ingredient by ingredient",
  description:
    "Put any two beauty products side by side: shared ingredients, unique actives, benefits and concerns.",
};

export const revalidate = 300;

/* ✓ / ✗ / – markers that lead every compared row, skinsort-style. */
function Mark({ state }: { state: boolean | null }) {
  if (state === null)
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xs text-ink-faint" aria-label="unknown">
        –
      </span>
    );
  return state ? (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" aria-label="yes">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
      </svg>
    </span>
  ) : (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600" aria-label="no">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </span>
  );
}

function ProductImage({ p, size = "h-40 w-40" }: { p: ProductDetail; size?: string }) {
  return (
    <div className={`flex ${size} items-center justify-center rounded-2xl bg-surface-soft p-4`}>
      {p.images[0]?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.images[0].url} alt={p.images[0].alt ?? p.name} className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="text-4xl" aria-hidden>🧴</span>
      )}
    </div>
  );
}

/* One label-led row of the side-by-side sheet. */
function Row({ label, a, b }: { label?: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="border-t border-line/70 py-4 first:border-t-0">
      {label && (
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="min-w-0">{a}</div>
        <div className="min-w-0">{b}</div>
      </div>
    </div>
  );
}

function TitleCell({ p }: { p: ProductDetail }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{p.brand}</p>
      <Link href={`/products/${p.slug}`} className="font-display text-lg leading-snug text-ink hover:text-brand-700 sm:text-xl">
        {p.name}
      </Link>
    </div>
  );
}

function RatingCell({ p }: { p: ProductDetail }) {
  if (p.ratingAvg == null) return <p className="text-center text-sm text-ink-faint">No ratings yet</p>;
  return (
    <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm">
      <Stars value={p.ratingAvg} />
      <span className="font-semibold text-ink">{p.ratingAvg.toFixed(2)}</span>
      <span className="text-ink-muted">· {p.ratingCount} reviews</span>
    </p>
  );
}

function BuyCell({ p }: { p: ProductDetail }) {
  if (!p.offers.length) return <p className="text-center text-sm text-ink-faint">—</p>;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {p.offers.slice(0, 4).map((o) => (
        <a
          key={o.url}
          href={o.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-full bg-white px-3 py-1 text-sm font-medium text-ink-soft ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-300"
        >
          {o.retailer}
          {o.price_cents != null && <span className="ml-1 text-ink-muted">{fmtUsd(o.price_cents)}</span>}
        </a>
      ))}
    </div>
  );
}

function BadgeList({ p }: { p: ProductDetail }) {
  const rows: [string, boolean | null][] = [
    ...Object.entries(BADGE_LABELS).map(
      ([k, label]) => [label, p.badges[k] ?? null] as [string, boolean | null],
    ),
    ["Cruelty-free", p.isCrueltyFree],
    ["Vegan", p.isVegan],
  ];
  return (
    <ul className="mx-auto max-w-[220px] space-y-2">
      {rows.map(([label, state]) => (
        <li key={label} className="flex items-center gap-2.5 text-sm text-ink-soft">
          <Mark state={state} />
          {label}
        </li>
      ))}
    </ul>
  );
}

function KeyIngredientsCell({ p }: { p: ProductDetail }) {
  const keys = p.ingredients.filter((i) => i.isKey);
  if (!keys.length) return <p className="text-center text-sm text-ink-faint">—</p>;
  return (
    <ul className="space-y-2">
      {keys.slice(0, 8).map((i) => (
        <li key={i.slug} className="rounded-xl bg-surface-soft px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/ingredients/${i.slug}`} className="text-sm font-medium text-ink hover:text-brand-700">
              {i.displayName ?? i.inciName}
            </Link>
            <RatingPill rating={i.rating} />
          </div>
          {i.functions.length > 0 && (
            <p className="mt-0.5 text-xs text-ink-muted">{i.functions.slice(0, 3).join(" · ")}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function EffectsCell({ p, kind }: { p: ProductDetail; kind: "benefits" | "concerns" }) {
  const list = p.effects[kind];
  if (!list.length) return <p className="text-center text-sm text-ink-faint">None detected</p>;
  const cls =
    kind === "benefits"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-amber-50 text-amber-800 ring-amber-200";
  return (
    <div className="flex flex-col gap-2">
      {list.slice(0, 6).map((e) => (
        <div key={e.slug} className={`rounded-xl px-3 py-2 ring-1 ${cls}`}>
          <p className="flex items-center justify-between text-sm font-medium">
            {e.name}
            <span className="rounded-full bg-white/70 px-1.5 text-xs tabular-nums">{e.count}</span>
          </p>
          {e.description && <p className="mt-0.5 text-xs opacity-80">{e.description}</p>}
        </div>
      ))}
      {list.length > 6 && (
        <p className="text-center text-xs text-ink-muted">+ {list.length - 6} more</p>
      )}
    </div>
  );
}

function IngredientList({ p, sharedSlugs }: { p: ProductDetail; sharedSlugs: Set<string> }) {
  return (
    <ul className="space-y-1.5">
      {p.ingredients.map((i) => (
        <li key={i.slug} className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 odd:bg-surface-soft/60">
          <span className="mt-0.5">
            <Mark state={sharedSlugs.has(i.slug)} />
          </span>
          <span className="min-w-0">
            <Link href={`/ingredients/${i.slug}`} className="text-sm font-medium text-ink hover:text-brand-700">
              {i.inciName}
            </Link>
            <span className="block text-xs text-ink-muted">
              {i.functions.slice(0, 3).join(", ") || "—"}
              {i.comedogenicity && (
                <span className="ml-1.5 tabular-nums text-ink-faint">
                  com {i.comedogenicity[0]}
                  {i.comedogenicity[1] !== i.comedogenicity[0] && `-${i.comedogenicity[1]}`}
                </span>
              )}
            </span>
          </span>
        </li>
      ))}
    </ul>
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
  const pa = data.a;
  const pb = data.b;
  const sharedA = new Set(pa.ingredients.filter((i) => pb.ingredients.some((j) => j.slug === i.slug)).map((i) => i.slug));
  const matchPct = (p: ProductDetail) =>
    p.ingredients.length ? Math.round((overlap.sharedCount / p.ingredients.length) * 100) : 0;

  // "Similar comparisons": this pair's closest dupes, deduped, current pair excluded.
  const similar = [...pa.dupes.map((d) => ({ base: pa, d })), ...pb.dupes.map((d) => ({ base: pb, d }))]
    .filter(({ base, d }) => d.slug !== (base.slug === pa.slug ? pb.slug : pa.slug))
    .sort((x, y) => y.d.similarity - x.d.similarity)
    .filter(({ base, d }, idx, arr) =>
      arr.findIndex((o) => [o.base.slug, o.d.slug].sort().join() === [base.slug, d.slug].sort().join()) === idx)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/compare" className="hover:text-brand-700">Comparisons</Link>
        {" / "}
        <span className="text-ink-soft">
          {pa.brand} {pa.name} vs {pb.brand} {pb.name}
        </span>
      </nav>

      {/* Images first, then everything one row at a time */}
      <header className="grid grid-cols-2 items-end gap-4 sm:gap-8">
        <div className="flex justify-center">
          <ProductImage p={pa} />
        </div>
        <div className="flex justify-center">
          <ProductImage p={pb} />
        </div>
      </header>
      <p className="my-4 text-center font-display text-sm uppercase tracking-[0.2em] text-ink-faint">
        Versus
      </p>

      <div className="rounded-3xl border border-line bg-white px-4 py-2 sm:px-8">
        <Row a={<TitleCell p={pa} />} b={<TitleCell p={pb} />} />
        <Row
          a={<p className="text-center font-display text-2xl text-brand-700">{matchPct(pa)}% <span className="text-sm text-ink-muted">match</span></p>}
          b={<p className="text-center font-display text-2xl text-brand-700">{matchPct(pb)}% <span className="text-sm text-ink-muted">match</span></p>}
        />
        <Row
          a={<p className="text-center text-sm text-ink-soft">{pa.category ?? "—"}</p>}
          b={<p className="text-center text-sm text-ink-soft">{pb.category ?? "—"}</p>}
        />
        <Row
          a={<p className="text-center text-sm text-ink-soft">{pa.ingredients.length} ingredients</p>}
          b={<p className="text-center text-sm text-ink-soft">{pb.ingredients.length} ingredients</p>}
        />
        <Row a={<RatingCell p={pa} />} b={<RatingCell p={pb} />} />
        <Row
          a={<p className="text-center text-sm text-ink-soft">{pa.brandCountry ?? "—"}</p>}
          b={<p className="text-center text-sm text-ink-soft">{pb.brandCountry ?? "—"}</p>}
        />
        <Row label="Buy" a={<BuyCell p={pa} />} b={<BuyCell p={pb} />} />
        <Row label="At a glance" a={<BadgeList p={pa} />} b={<BadgeList p={pb} />} />
        <Row label="Key ingredients" a={<KeyIngredientsCell p={pa} />} b={<KeyIngredientsCell p={pb} />} />
        <Row label="Benefits" a={<EffectsCell p={pa} kind="benefits" />} b={<EffectsCell p={pb} kind="benefits" />} />
        <Row label="Concerns" a={<EffectsCell p={pa} kind="concerns" />} b={<EffectsCell p={pb} kind="concerns" />} />
        <Row
          label={`Ingredients side-by-side · ${overlap.sharedCount} shared`}
          a={<IngredientList p={pa} sharedSlugs={sharedA} />}
          b={<IngredientList p={pb} sharedSlugs={sharedA} />}
        />
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl text-ink">Similar comparisons</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {similar.map(({ base, d }) => (
              <Link
                key={`${base.slug}-${d.slug}`}
                href={`/compare?a=${base.slug}&b=${d.slug}`}
                className="group rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
              >
                <p className="text-sm text-ink-soft">
                  <span className="font-medium text-ink">{base.brand} {base.name}</span>
                  <span className="mx-1.5 text-ink-faint">vs</span>
                  <span className="font-medium text-ink">{d.brand} {d.name}</span>
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  {d.sharedIngredients} shared ingredients · {Math.round(d.similarity * 100)}% similar
                </p>
                <p className="mt-2 text-xs font-medium text-brand-700 group-hover:underline">
                  View the comparison →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
