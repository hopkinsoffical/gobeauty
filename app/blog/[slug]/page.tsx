import type { Metadata } from "next";
import Image from "next/image";
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
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
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
    image: post.image,
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
    <article className="bg-white">
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

      <div className="mx-auto max-w-[760px] px-5 pt-6 md:pt-8">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-ink-muted">
          <Link href="/" className="hover:text-brand-600">
            Home
          </Link>
          <span aria-hidden className="text-ink-faint">
            /
          </span>
          <Link href="/blog" className="hover:text-brand-600">
            Blog
          </Link>
          <span aria-hidden className="text-ink-faint">
            /
          </span>
          <span className="line-clamp-1 text-ink">{post.title}</span>
        </nav>

        {/* Cover: image first, then title + intro */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-soft">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-cover"
          />
        </div>

        <header className="mt-5 md:mt-6">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-pill bg-brand-50 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-700"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 font-display text-[1.85rem] leading-[1.15] text-ink md:text-[2.35rem]">
            {post.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-muted">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt !== post.publishedAt ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.updatedAt}>
                  Updated {formatDate(post.updatedAt)}
                </time>
              </>
            ) : null}
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-[760px] px-5 py-8 md:py-10">
        <div className="space-y-8">
          {post.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-display text-[1.4rem] text-ink md:text-[1.55rem]">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="mt-2.5 text-[15px] leading-7 text-ink-soft"
                >
                  {p}
                </p>
              ))}
              {sec.bullets && sec.bullets.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14.5px] leading-7 text-ink-soft">
                  {sec.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {post.relatedFaq && post.relatedFaq.length > 0 ? (
          <section className="mt-12 border-t border-line-soft pt-8">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-muted">
              Related questions
            </h2>
            <div className="mt-2">
              <FaqAccordion items={post.relatedFaq} openFirst variant="list" />
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-line bg-surface-soft/60 p-5 md:p-6">
          <h2 className="text-[15px] font-bold text-ink">Try it on goBeauty</h2>
          <p className="mt-1 text-[13.5px] text-ink-soft">
            Analyze a look, shop products, or find pros nearby.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/get-this-look"
              className="rounded-pill bg-brand-600 px-3.5 py-1.5 text-[13px] font-bold text-white hover:bg-brand-700"
            >
              Get This Look
            </Link>
            <Link
              href="/products"
              className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink hover:border-brand-300"
            >
              Products
            </Link>
            <Link
              href="/faq"
              className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink hover:border-brand-300"
            >
              FAQ
            </Link>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-12 border-t border-line-soft pt-8">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-muted">
              More guides
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block overflow-hidden rounded-xl border border-line transition hover:border-brand-200"
                  >
                    <div className="relative aspect-[16/10] bg-surface-soft">
                      <Image
                        src={r.image}
                        alt={r.imageAlt}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                    <p className="p-3 text-[13px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                      {r.title}
                    </p>
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
