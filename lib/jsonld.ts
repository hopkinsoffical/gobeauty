/** Helpers for GEO/SEO JSON-LD (schema.org). */

export function faqPageJsonLd(
  items: { q: string; a: string }[],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function blogPostingJsonLd(opts: {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  /** Absolute or site-relative image URL */
  image?: string;
}) {
  const imageUrl = opts.image
    ? opts.image.startsWith("http")
      ? opts.image
      : `https://www.gobeauty.ai${opts.image}`
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": "Organization",
      name: opts.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "goBeauty.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://www.gobeauty.ai/gobeauty-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
    url: opts.url,
  };
}

export function blogJsonLd(opts: { url: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: {
      "@type": "Organization",
      name: "goBeauty.ai",
      url: "https://www.gobeauty.ai",
    },
  };
}
