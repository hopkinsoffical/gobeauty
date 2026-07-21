import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/FaqAccordion";
import { getAllBlogSlugs, getBlogPost, getAllBlogPosts } from "@/lib/data/blog";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/jsonld";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://www.gobeauty.ai/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

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

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const pageUrl = `https://www.gobeauty.ai/blog/${post.slug}`;
  const articleLd = blogPostingJsonLd({
    url: pageUrl,
    title: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorName: post.author.name,
  });
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: "https://www.gobeauty.ai/" },
    { name: "Blog", url: "https://www.gobeauty.ai/blog" },
    { name: post.title, url: pageUrl },
  ]);
  const faqLd =
    post.relatedFaq && post.relatedFaq.length
      ? faqPageJsonLd(post.relatedFaq, pageUrl)
      : null;

  const related = getAllBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="bg-[#fffaf9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}

      <header className="border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#fff5ed]">
        <div className="mx-auto max-w-[760px] px-5 py-12 md:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-ink-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>／</span>
            <Link href="/blog" className="transition hover:text-brand-600">
              Blog
            </Link>
            <span aria-hidden>／</span>
            <span className="line-clamp-1 text-ink">{post.title}</span>
          </nav>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-pill bg-white/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700 shadow-card"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-[2.2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{post.tldr}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-muted">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span>{post.author.role}</span>
            <time dateTime={post.publishedAt}>
              Published {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt !== post.publishedAt ? (
              <time dateTime={post.updatedAt}>
                Updated {formatDate(post.updatedAt)}
              </time>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[760px] px-5 py-10 md:py-14">
        <div className="space-y-10">
          {post.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-display text-[1.55rem] text-ink md:text-[1.7rem]">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="mt-3 text-[15.5px] leading-7 text-ink-soft"
                >
                  {p}
                </p>
              ))}
              {sec.bullets && sec.bullets.length > 0 ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-ink-soft">
                  {sec.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {post.relatedFaq && post.relatedFaq.length > 0 ? (
          <section className="mt-14 border-t border-line-soft pt-10">
            <h2 className="font-display text-[1.55rem] text-ink">
              Related questions
            </h2>
            <p className="mt-2 mb-5 text-[14.5px] text-ink-soft">
              Short answers you can cite or share.
            </p>
            <FaqAccordion items={post.relatedFaq} openFirst />
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-xl text-ink">Try it on goBeauty</h2>
          <p className="mt-2 text-[14.5px] text-ink-soft">
            Analyze a look, shop products, or find pros nearby.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/get-this-look"
              className="rounded-pill bg-brand-600 px-4 py-2 text-[13.5px] font-bold text-white transition hover:bg-brand-700"
            >
              Get This Look
            </Link>
            <Link
              href="/products"
              className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-bold text-ink transition hover:border-brand-300"
            >
              Browse products
            </Link>
            <Link
              href="/faq"
              className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-bold text-ink transition hover:border-brand-300"
            >
              FAQ
            </Link>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-[1.4rem] text-ink">More guides</h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
