import type { FaqItem } from "@/lib/types";

type Props = {
  items: FaqItem[];
  /** Open the first item by default (useful for above-the-fold groups). */
  openFirst?: boolean;
  /**
   * card — padded bordered cards (channel pages)
   * list — dense divider list, Intercom/Stripe-style (main /faq)
   */
  variant?: "card" | "list";
};

export default function FaqAccordion({
  items,
  openFirst = false,
  variant = "card",
}: Props) {
  if (variant === "list") {
    return (
      <div className="divide-y divide-line border-y border-line">
        {items.map((it, i) => (
          <details
            key={it.q}
            className="group"
            open={openFirst && i === 0}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 py-3.5 text-left text-[14.5px] font-semibold leading-snug text-ink transition hover:text-brand-700 [&::-webkit-details-marker]:hidden md:py-4 md:text-[15px]">
              <span className="min-w-0 flex-1 pr-1">{it.q}</span>
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center text-ink-muted transition group-open:rotate-45 group-open:text-brand-600"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </span>
            </summary>
            <div className="pb-3.5 pr-8 text-[13.5px] leading-relaxed text-ink-soft md:pb-4 md:text-[14px] md:leading-6">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <details
          key={it.q}
          className="group rounded-2xl border border-line bg-white shadow-card open:border-line-soft"
          open={openFirst && i === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[15.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span
              aria-hidden
              className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-surface-soft text-ink transition group-open:rotate-45 group-open:bg-brand-100 group-open:text-brand-700"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-ink-soft">
            {it.a}
          </div>
        </details>
      ))}
    </div>
  );
}
