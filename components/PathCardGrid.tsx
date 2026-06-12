"use client";

const MODULES = [
  {
    emoji: "✨",
    title: "Get this look",
    body: "Upload a photo. We'll tell you what it is, what products, and which pro near you can nail it.",
    cta: "Analyze a look →",
    accent: "#f4a8c7",
  },
  {
    emoji: "📍",
    title: "Find pros",
    body: "Search salons, spas, med spas & lash studios. Matched by look fit, distance, price & reviews.",
    cta: "Find pros near me →",
    accent: "#d98be0",
  },
  {
    emoji: "🏆",
    title: "Local rankings",
    body: "The best of every city — nail salons, facials, K-beauty, lash lifts. Updated weekly.",
    cta: "Browse rankings →",
    accent: "#7b6ef6",
  },
  {
    emoji: "🏠",
    title: "DIY at home",
    body: "Step-by-step routines with product checklists, difficulty, and a clear “book a pro instead” warning.",
    cta: "Explore DIY →",
    accent: "#f4a8c7",
  },
  {
    emoji: "🛍️",
    title: "Shop top 3",
    body: "Curated product sets matched to your goal — no 10,000-item scroll, just the best 3.",
    cta: "Shop top picks →",
    accent: "#d98be0",
  },
];

export default function PathCardGrid() {
  return (
    <section className="bg-white py-16" id="modules">
      <div className="mx-auto max-w-[1280px] px-7">
        <h2 className="text-[2rem] font-extrabold leading-tight tracking-tight md:text-[2.25rem]">
          Pick a path
        </h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          Five ways to get the look — start anywhere, switch anytime.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((m) => (
            <a
              key={m.title}
              href="#"
              className="group relative block overflow-hidden rounded-[18px] border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-cardHover"
              style={
                { ["--accent" as string]: m.accent } as React.CSSProperties
              }
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 rounded-t-[18px]"
                style={{ background: m.accent }}
              />
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-[22px]"
                style={{
                  background: `color-mix(in srgb, ${m.accent} 18%, white)`,
                }}
              >
                {m.emoji}
              </div>
              <h3 className="mb-1.5 text-[16px] font-bold text-ink">
                {m.title}
              </h3>
              <p className="mb-3.5 text-[13.5px] leading-[1.5] text-ink-soft">
                {m.body}
              </p>
              <span
                className="text-[13px] font-bold"
                style={{ color: m.accent }}
              >
                {m.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
