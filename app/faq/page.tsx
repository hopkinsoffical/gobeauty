import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_FAQ_GROUPS, allSiteFaqItems } from "@/lib/data/site-faq";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";

const PAGE_URL = "https://www.gobeauty.ai/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Short answers about goBeauty: AI look analysis, Skin Analyzer, products, local pros, marketplace, and accounts.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | goBeauty.ai",
    description:
      "Compact answers on AI beauty tools, products, salons, and accounts.",
    url: PAGE_URL,
  },
};

export default function FaqPage() {
  const flat = allSiteFaqItems();
  const faqLd = faqPageJsonLd(flat, PAGE_URL);
  const crumbLd = breadcrumbJsonLd([
    { name: "Home", url: "https://www.gobeauty.ai/" },
    { name: "FAQ", url: PAGE_URL },
  ]);
  const total = flat.length;

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      {/* Compact header — Stripe/Notion-style density */}
      <header className="border-b border-line-soft">
        <div className="mx-auto max-w-[960px] px-5 py-6 md:py-8">
          <nav className="mb-3 flex items-center gap-1.5 text-[12px] font-medium text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden className="text-ink-faint">
              /
            </span>
            <span className="text-ink">FAQ</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-[1.85rem] leading-none text-ink md:text-[2.15rem]">
              FAQ
            </h1>
            <p className="text-[13px] text-ink-muted">{total} questions</p>
          </div>
        </div>
      </header>

      {/* Mobile category chips */}
      <div className="sticky top-16 z-20 border-b border-line-soft bg-white/95 backdrop-blur md:hidden">
        <div className="flex gap-1.5 overflow-x-auto px-5 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SITE_FAQ_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="shrink-0 rounded-full border border-line bg-surface-soft px-3 py-1 text-[12px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
            >
              {g.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sidebar + list — Intercom help center pattern */}
      <div className="mx-auto grid max-w-[960px] gap-0 px-5 py-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-10 md:py-8 lg:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          <nav
            aria-label="FAQ categories"
            className="sticky top-24 space-y-0.5"
          >
            <p className="mb-2 px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
              Topics
            </p>
            {SITE_FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-ink-soft transition hover:bg-surface-soft hover:text-ink"
              >
                <span>{g.title}</span>
                <span className="text-[11px] font-medium tabular-nums text-ink-faint">
                  {g.items.length}
                </span>
              </a>
            ))}
            <div className="mt-4 border-t border-line-soft px-2.5 pt-4 text-[12px] leading-relaxed text-ink-muted">
              <Link href="/blog" className="font-semibold text-brand-600 hover:underline">
                Blog
              </Link>
              {" · "}
              <Link href="/get-this-look" className="font-semibold text-brand-600 hover:underline">
                Get This Look
              </Link>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8 md:space-y-9">
          {SITE_FAQ_GROUPS.map((group, gi) => (
            <section key={group.id} id={group.id} className="scroll-mt-28 md:scroll-mt-24">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-muted">
                  {group.title}
                </h2>
                <span className="text-[11px] tabular-nums text-ink-faint">
                  {group.items.length}
                </span>
              </div>
              <FaqAccordion
                items={group.items}
                openFirst={gi === 0}
                variant="list"
              />
            </section>
          ))}

          <p className="border-t border-line-soft pt-5 text-[13px] text-ink-muted">
            Still stuck?{" "}
            <Link href="/blog" className="font-semibold text-brand-600 hover:underline">
              Read the blog
            </Link>
            {" · "}
            <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">
              Privacy
            </Link>
            {" · "}
            <Link
              href="/get-this-look"
              className="font-semibold text-brand-600 hover:underline"
            >
              Try Get This Look
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
