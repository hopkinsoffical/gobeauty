import Link from "next/link";

// PRD v2 §6.5 — local ranking teaser: shows consumer discovery and creates
// salon visibility pressure. Cards route into /local-rankings.
const LOCAL_CARDS = [
  {
    service: "Korean Nail Salons",
    location: "New York City",
    image: "/assets/salon_04_white_gold.jpg",
    href: "/local-rankings",
  },
  {
    service: "Lash Lift",
    location: "Edison, NJ",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80&auto=format&fit=crop",
    href: "/local-rankings",
  },
  {
    service: "Hydrating Facial",
    location: "Jersey City, NJ",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop",
    href: "/local-rankings",
  },
  {
    service: "Keratin Treatment",
    location: "Brooklyn, NY",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
    href: "/local-rankings",
  },
];

export default function PopularNearYou() {
  return (
    <section className="bg-white py-10 md:py-14" id="popular-near-you">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.75rem] leading-tight text-ink md:text-[2.25rem]">
              Popular near you
            </h2>
            <p className="mt-1.5 text-[14.5px] text-ink-soft">
              Top local matches for beauty services people are searching nearby.
            </p>
          </div>
          <Link
            href="/local-rankings"
            className="hidden flex-none text-[14px] font-semibold text-brand-600 transition hover:text-brand-700 md:block"
          >
            Explore local rankings →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOCAL_CARDS.map((c) => (
            <Link
              key={`${c.service}-${c.location}`}
              href={c.href}
              className="group flex items-center gap-3.5 overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover lg:flex-col lg:items-stretch lg:p-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={`${c.service} in ${c.location}`}
                loading="lazy"
                className="h-[72px] w-[72px] flex-none rounded-xl object-cover lg:aspect-[16/10] lg:h-auto lg:w-full lg:rounded-none"
              />
              <span className="min-w-0 flex-1 lg:p-4">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-brand-600">
                  Best
                </span>
                <h3 className="truncate text-[15px] font-bold text-ink lg:whitespace-normal">
                  {c.service}
                </h3>
                <p className="text-[13px] text-ink-muted">{c.location}</p>
                <span className="mt-1 inline-block text-[13px] font-bold text-ink transition group-hover:text-brand-600">
                  View Top 3 →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/local-rankings"
          className="mt-5 flex h-11 items-center justify-center rounded-pill border border-line text-[14.5px] font-semibold text-ink transition hover:bg-surface-tint md:hidden"
        >
          Explore local rankings
        </Link>
      </div>
    </section>
  );
}
