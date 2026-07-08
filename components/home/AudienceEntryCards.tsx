import Link from "next/link";

// PRD v2 §6.6 — concise professional and supplier entries. Deep charcoal
// treatment for serious B2B sections (PRD §10), without turning the
// homepage into a B2B portal.
const ENTRIES = [
  {
    eyebrow: "For Beauty Professionals",
    copy: "Show your work, share services, and get discovered by clients looking for your exact service.",
    cta: "Claim Your Profile",
    href: "/for-beauty-pros",
  },
  {
    eyebrow: "For Salon & Spa Owners",
    copy: "See your salon ranking, improve visibility, get reviews, respond faster, and grow repeat clients.",
    cta: "See Your Ranking",
    href: "/for-beauty-pros#visibility-checkup",
  },
  {
    eyebrow: "For Beauty Brands & Suppliers",
    copy: "Reach salon owners, professionals, and serious beauty shoppers with product pages, samples, and campaigns.",
    cta: "Explore Supplier Promotion",
    href: "/brands",
  },
];

export default function AudienceEntryCards() {
  return (
    <section
      id="for-businesses"
      className="bg-gradient-to-br from-[#16181d] to-[#262a33] py-12 text-white md:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
          Grow with GoBeauty
        </p>
        <h2 className="mt-2 max-w-[560px] font-display text-[1.75rem] leading-tight md:text-[2.25rem]">
          Consumers discover looks and pros here. Make sure they find you.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {ENTRIES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-brand-400/40 hover:bg-white/[0.08]"
            >
              <h3 className="text-[15.5px] font-bold text-white">{e.eyebrow}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-white/70">
                {e.copy}
              </p>
              <span className="mt-4 inline-flex h-11 items-center justify-center rounded-pill bg-brand-500 px-5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.35)] transition group-hover:bg-brand-600">
                {e.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
