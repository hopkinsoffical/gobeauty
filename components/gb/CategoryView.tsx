import Link from "next/link";
import type { CategoryDetail } from "@/lib/gbApi";
import {
  CategoryChip,
  NarrowDownChips,
  RankedProductRow,
  fmtUsd,
} from "@/components/gb/CategoryBits";

function faqEntries(c: CategoryDetail) {
  const one = c.name.replace(/s$/, "").toLowerCase();
  const f = c.faq;
  const entries: { q: string; a: React.ReactNode; text: string }[] = [];
  const link = (r: { slug: string; name: string; brand: string }) => (
    <Link href={`/products/${r.slug}`} className="font-medium text-brand-700 hover:underline">
      {r.brand} {r.name}
    </Link>
  );
  if (f.topRated)
    entries.push({
      q: `What is the top rated ${one}?`,
      a: <>The top rated {one} on goBeauty is the {link(f.topRated)}.</>,
      text: `The top rated ${one} on goBeauty is the ${f.topRated.brand} ${f.topRated.name}.`,
    });
  if (f.mostPopular)
    entries.push({
      q: `What is the most reviewed ${one}?`,
      a: <>The most reviewed {one} is the {link(f.mostPopular)}.</>,
      text: `The most reviewed ${one} is the ${f.mostPopular.brand} ${f.mostPopular.name}.`,
    });
  if (f.fewestIngredients)
    entries.push({
      q: `Which ${one} has the fewest ingredients?`,
      a: <>The {one} with the shortest ingredient list is the {link(f.fewestIngredients)}.</>,
      text: `The ${one} with the shortest ingredient list is the ${f.fewestIngredients.brand} ${f.fewestIngredients.name}.`,
    });
  if (f.mostAffordable)
    entries.push({
      q: `Which ${one} is the most affordable?`,
      a: (
        <>
          The most affordable {one} is the {link(f.mostAffordable)}
          {f.mostAffordablePriceCents != null && <> from {fmtUsd(f.mostAffordablePriceCents)}</>}.
        </>
      ),
      text: `The most affordable ${one} is the ${f.mostAffordable.brand} ${f.mostAffordable.name}.`,
    });
  return entries;
}

export default function CategoryView({ c }: { c: CategoryDetail }) {
  const year = new Date().getFullYear();
  const faq = faqEntries(c);
  const related = [...c.children, ...c.siblings];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: `Best ${c.name} in ${year}`,
        itemListElement: c.products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://www.gobeauty.ai/products/${p.slug}`,
          name: `${p.brand} ${p.name}`,
        })),
      },
      ...(faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((e) => ({
                "@type": "Question",
                name: e.q,
                acceptedAnswer: { "@type": "Answer", text: e.text },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        <Link href="/products" className="hover:text-brand-700">
          Products
        </Link>
        {c.breadcrumb.map((b) => (
          <span key={b.slug}>
            {" / "}
            <Link href={`/products/${b.slug}`} className="hover:text-brand-700">
              {b.name}
            </Link>
          </span>
        ))}
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Best {c.name} <span className="text-ink-faint">in {year}</span>
        </h1>
        {c.description && <p className="mt-2 max-w-2xl text-ink-soft">{c.description}</p>}
        <p className="mt-2 text-sm text-ink-muted">
          {c.productCount} ingredient-checked {c.productCount === 1 ? "product" : "products"},
          ranked by community rating and ingredient quality.
        </p>
      </header>

      {c.products.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface-soft p-8 text-center">
          <p className="text-ink-soft">
            No products decoded in this category yet — we&apos;re adding more every week.
          </p>
          <Link
            href="/products"
            className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
          >
            Browse all products →
          </Link>
        </div>
      ) : (
        <section aria-label={`Top ${c.name}`}>
          <h2 className="mb-4 font-display text-xl text-ink">Top products</h2>
          <div className="flex flex-col gap-3">
            {c.products.map((p, i) => (
              <RankedProductRow key={p.slug} p={p} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {c.products.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-ink">Narrow down your search</h2>
          <NarrowDownChips categorySlug={c.slug} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-ink">Explore related categories</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <CategoryChip key={r.slug} c={r} />
            ))}
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-ink">Frequently asked questions</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-white">
            {faq.map((e) => (
              <div key={e.q} className="p-5">
                <h3 className="font-medium text-ink">{e.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
