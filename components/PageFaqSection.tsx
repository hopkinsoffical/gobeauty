import Link from "next/link";
import type { FaqItem } from "@/lib/types";
import FaqAccordion from "@/components/FaqAccordion";
import { faqPageJsonLd } from "@/lib/jsonld";

type Props = {
  items: FaqItem[];
  /** Absolute page URL used in FAQPage @id */
  pageUrl: string;
  title?: string;
  subtitle?: string;
  /** Show link to full /faq hub */
  showAllLink?: boolean;
};

/**
 * Reusable bottom-of-page FAQ block with FAQPage JSON-LD for GEO.
 * Server component — safe to drop into any channel page.
 */
export default function PageFaqSection({
  items,
  pageUrl,
  title = "What people ask",
  subtitle = "Short answers about this page — written for people and easy for AI assistants to cite.",
  showAllLink = true,
}: Props) {
  if (!items.length) return null;
  const ld = faqPageJsonLd(items, pageUrl);

  return (
    <section
      id="faq"
      className="border-t border-line-soft bg-surface-soft py-16 md:py-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-600">
            FAQ
          </p>
          <h2 className="font-display text-3xl text-ink md:text-[40px]">{title}</h2>
          <p className="mt-3 text-[15.5px] text-ink-soft">{subtitle}</p>
        </div>

        <FaqAccordion items={items} openFirst />

        {showAllLink ? (
          <p className="mt-8 text-center text-[14px] text-ink-soft">
            More answers in the{" "}
            <Link href="/faq" className="font-semibold text-brand-600 hover:underline">
              full goBeauty FAQ
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
