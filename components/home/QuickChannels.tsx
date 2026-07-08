import Link from "next/link";

// PRD v2 §6.4 — compact channel cards, one action per card.
const CHANNELS = [
  {
    title: "Find Pros",
    body: "Find local beauty professionals for your look, service, or treatment.",
    href: "/find-pros",
    accent: "#e85a82",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-6-5.1-6-10a6 6 0 0 1 12 0c0 4.9-6 10-6 10z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2.4" />
      </svg>
    ),
  },
  {
    title: "Shop Pro-Recommended Products",
    body: "Discover products by beauty goal, service aftercare, ingredient fit, and professional recommendation.",
    href: "/shop-products",
    accent: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Looks & Trends",
    body: "See current beauty looks, trends, product ideas, and aftercare inspiration.",
    href: "/looks-trends",
    accent: "#0ea5a4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l2.2 5.4L20 10l-5.8 1.6L12 17l-2.2-5.4L4 10l5.8-1.6L12 3z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "DIY & Aftercare",
    body: "Get realistic routines and know when a pro is safer.",
    href: "/looks-trends?type=aftercare",
    accent: "#d97706",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21c4.4-2 7-5.4 7-9V6l-7-3-7 3v6c0 3.6 2.6 7 7 9z" strokeLinejoin="round" />
        <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function QuickChannels() {
  return (
    <section className="border-y border-line-soft bg-surface-soft py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="font-display text-[1.75rem] leading-tight text-ink md:text-[2.25rem]">
          Start where you are
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover sm:flex-col sm:gap-0 sm:p-5"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-xl sm:mb-3"
                style={{
                  color: c.accent,
                  background: `color-mix(in srgb, ${c.accent} 12%, white)`,
                }}
              >
                <span className="block h-6 w-6">{c.icon}</span>
              </span>
              <span className="min-w-0">
                <h3 className="text-[15.5px] font-bold leading-snug text-ink">
                  {c.title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                  {c.body}
                </p>
                <span
                  className="mt-2 inline-block text-[13px] font-bold transition group-hover:translate-x-0.5"
                  style={{ color: c.accent }}
                >
                  Explore →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
