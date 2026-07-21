import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/data/blog";
import { blogJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

const PAGE_URL = "https://www.gobeauty.ai/blog";

export const metadata: Metadata = {
  title: "Blog — Beauty AI Guides, Salons & Product Tips",
  description:
    "goBeauty.ai blog: practical guides on AI beauty discovery, Get This Look, local salon rankings, skincare ingredients, and the salon product marketplace.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "goBeauty.ai Blog",
    description:
      "Guides on AI beauty discovery, salon rankings, ingredients, and marketplace tips from goBeauty.",
    url: PAGE_URL,
  },
};

function formatDate(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const blogLd = blogJsonLd({
    url: PAGE_URL,
    name: "goBeauty.ai Blog",
    description:
      "Guides on AI beauty discovery, local salons, ingredients, and professional marketplace topics.",
  });
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: "https://www.gobeauty.ai/" },
    { name: "Blog", url: PAGE_URL },
  ]);

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <section className="border-b border-line-soft">
        <div className="mx-auto max-w-[960px] px-5 py-8 md:py-10">
          <nav className="mb-3 flex items-center gap-1.5 text-[12px] font-medium text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden className="text-ink-faint">
              /
            </span>
            <span className="text-ink">Blog</span>
          </nav>
          <h1 className="font-display text-[1.85rem] leading-none text-ink md:text-[2.15rem]">
            Blog
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
            Guides on AI beauty discovery, salons, ingredients, and professional
            products.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[960px] px-5 py-8 md:py-10">
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-brand-200 hover:shadow-card">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/9] overflow-hidden bg-surface-soft"
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    priority={false}
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-pill bg-brand-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-2.5 font-display text-[1.25rem] leading-snug text-ink">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition hover:text-brand-700"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-3 text-[12px] text-ink-muted">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-[13.5px] text-ink-soft">
          Looking for short answers? Visit the{" "}
          <Link href="/faq" className="font-semibold text-brand-600 hover:underline">
            FAQ
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
