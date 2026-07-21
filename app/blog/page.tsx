import type { Metadata } from "next";
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
    <div className="bg-[#fffaf9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#fff5ed]">
        <div className="mx-auto max-w-[960px] px-5 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>／</span>
            <span className="text-ink">Blog</span>
          </nav>
          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Editorial
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-[1.08] text-ink md:text-[3.2rem]">
            Beauty guides from goBeauty.ai
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-soft md:text-[16px]">
            Clear, cite-worthy explainers on AI look analysis, local salons,
            ingredients, and professional product discovery — written for people
            first, structured for search and AI assistants.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[960px] px-5 py-12 md:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:border-brand-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 font-display text-[1.35rem] leading-snug text-ink">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:text-brand-700"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
                  {post.tldr}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-4 text-[12.5px] text-ink-muted">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Read guide →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-[14px] text-ink-soft">
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
