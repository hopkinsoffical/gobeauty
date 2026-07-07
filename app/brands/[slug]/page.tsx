import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/gbApi";
import { ProductCardTile } from "@/components/gb/ProductBits";

export const revalidate = 300;

async function load(slug: string) {
  try {
    return await getBrand(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const b = await load(params.slug);
  if (!b) return { title: "Brand not found" };
  return {
    title: `${b.name} — products & ingredient analysis`,
    description:
      b.description?.slice(0, 155) ??
      `Every ${b.name} product decoded: full ingredient lists, benefits, and concerns.`,
  };
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const b = await load(params.slug);
  if (!b) notFound();

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/products" className="hover:text-brand-700">
          Products
        </Link>{" "}
        / {b.name}
      </nav>

      <header className="mb-8 flex items-start gap-4">
        {b.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.logoUrl}
            alt={`${b.name} logo`}
            className="h-16 w-16 rounded-xl border border-line object-contain"
          />
        )}
        <div>
          <h1 className="font-display text-3xl text-ink">{b.name}</h1>
          {b.country && <p className="mt-1 text-sm text-ink-faint">{b.country}</p>}
          {b.description && <p className="mt-2 max-w-xl text-ink-soft">{b.description}</p>}
          {b.website && (
            <a
              href={b.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-block text-sm text-brand-700 hover:underline"
            >
              {b.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </header>

      <h2 className="mb-3 font-display text-xl text-ink">
        Products <span className="text-sm text-ink-muted">({b.products.length})</span>
      </h2>
      {b.products.length === 0 ? (
        <p className="text-ink-muted">No products decoded yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {b.products.map((p) => (
            <ProductCardTile key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
