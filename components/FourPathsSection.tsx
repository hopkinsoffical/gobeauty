const PATHS = [
  {
    emoji: "✨",
    title: "Get This Look",
    desc: "Upload a beauty look you like. We'll break it down into DIY steps, product picks, and nearby professionals.",
    cta: "Analyze a Look",
    href: "#get-this-look",
    accent: "from-brand-50 to-brand-100",
  },
  {
    emoji: "📍",
    title: "Find a Beauty Service",
    desc: "Search local salons, spas, med spas, and beauty professionals by service, style, and location.",
    cta: "Find & Book Pros",
    href: "#services",
    accent: "from-rose-50 to-pink-100",
  },
  {
    emoji: "🏠",
    title: "DIY at Home",
    desc: "Learn safe, realistic beauty routines with product checklists, difficulty ratings, and guidance on when to book a pro.",
    cta: "Explore DIY Guides",
    href: "#diy",
    accent: "from-amber-50 to-orange-100",
  },
  {
    emoji: "🛍️",
    title: "Shop Beauty Products",
    desc: "Shop curated products and kits for your beauty goals — K-beauty, skincare, haircare, nail tools, and aftercare essentials.",
    cta: "Shop Top Products",
    href: "#shop-products",
    accent: "from-purple-50 to-violet-100",
  },
];

export default function FourPathsSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[2rem] tracking-tight text-ink md:text-4xl">
            Not sure whether to DIY, book, or buy?
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">
            We&apos;ll help you choose the right path.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} text-2xl`}>
                {p.emoji}
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-ink">{p.title}</h3>
              <p className="flex-1 text-[14px] leading-relaxed text-ink-soft">{p.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-500 transition group-hover:gap-2">
                {p.cta}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
