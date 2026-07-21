import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandPageView from "@/components/brands/BrandPageView";
import { brandStats } from "@/lib/brand-page";
import { decodeSlug, getBrand, listBrands } from "@/lib/gbApi";

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
  const b = await load(decodeSlug(params.slug));
  if (!b) return { title: "Brand not found" };
  const stats = brandStats(b.products);
  const desc =
    b.description?.slice(0, 155) ??
    `Shop ${b.name}: ${stats.productCount} ingredient-checked products, top-rated picks, and most-reviewed bestsellers.`;
  return {
    title: `${b.name} — products, bestsellers & ingredient analysis`,
    description: desc,
    alternates: { canonical: `/brands/${b.slug}` },
    openGraph: {
      title: `${b.name} | goBeauty.ai`,
      description: desc,
      url: `/brands/${b.slug}`,
    },
  };
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const slug = decodeSlug(params.slug);
  const b = await load(slug);
  if (!b) notFound();

  // Related brands: top catalog peers excluding current
  let related: Awaited<ReturnType<typeof listBrands>>["brands"] = [];
  try {
    const { brands } = await listBrands(24);
    related = brands.filter((x) => x.slug !== b.slug).slice(0, 6);
  } catch {
    related = [];
  }

  return <BrandPageView brand={b} related={related} />;
}
