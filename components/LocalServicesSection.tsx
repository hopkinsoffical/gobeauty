const CATEGORIES = [
  { label: "Nail Salons", emoji: "💅", count: "1,200+" },
  { label: "Hair Salons", emoji: "✂️", count: "3,400+" },
  { label: "Lash & Brow", emoji: "👁️", count: "820+" },
  { label: "Facials", emoji: "🧖", count: "950+" },
  { label: "Med Spas", emoji: "🏥", count: "440+" },
  { label: "Massage", emoji: "💆", count: "1,100+" },
  { label: "Waxing", emoji: "🌸", count: "680+" },
  { label: "K-Beauty", emoji: "🇰🇷", count: "290+" },
];

export default function LocalServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[2rem] tracking-tight text-ink md:text-4xl">
              Find professionals who can get you the look.
            </h2>
            <p className="mt-3 text-[15px] text-ink-soft max-w-lg">
              Search by service, style, and location. Our AI matches you with the right pro.
            </p>
          </div>

          {/* Location search */}
          <div className="flex w-full max-w-xs items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-card">
            <svg className="h-4 w-4 flex-shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-4.477-8-10a8 8 0 1 1 16 0c0 5.523-3.582 10-8 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            <input
              type="text"
              placeholder="Enter your city or zip..."
              className="flex-1 bg-transparent text-[13.5px] text-ink placeholder-ink-faint outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-white py-5 px-3 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-cardHover"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-[12.5px] font-semibold text-ink group-hover:text-brand-600">
                {cat.label}
              </span>
              <span className="text-[11px] text-ink-faint">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 rounded-pill bg-brand-500 px-7 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-brand-600 hover:-translate-y-0.5">
            Find Beauty Services Near Me
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
