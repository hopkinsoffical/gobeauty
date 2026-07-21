import type { FaqItem } from "@/lib/types";

type Props = {
  items: FaqItem[];
  /** Open the first item by default (useful for above-the-fold groups). */
  openFirst?: boolean;
};

export default function FaqAccordion({ items, openFirst = false }: Props) {
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
