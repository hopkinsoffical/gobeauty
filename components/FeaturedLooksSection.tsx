const LOOKS = [
  { title: "Clean Girl Nails", path: "Salon / DIY", difficulty: "Easy", icon: "💅", bg: "from-pink-50 to-rose-100" },
  { title: "Glass Skin", path: "DIY / Shop", difficulty: "Medium", icon: "✨", bg: "from-blue-50 to-indigo-100" },
  { title: "Frizzy Hair Fix", path: "DIY / Shop", difficulty: "Easy", icon: "💆", bg: "from-amber-50 to-orange-100" },
  { title: "Korean Sunscreen Routine", path: "Shop", difficulty: "Easy", icon: "🧴", bg: "from-yellow-50 to-amber-100" },
  { title: "Chrome Nails", path: "Salon", difficulty: "Pro", icon: "💎", bg: "from-violet-50 to-purple-100" },
  { title: "Post-Facial Aftercare", path: "Shop / DIY", difficulty: "Easy", icon: "🌿", bg: "from-green-50 to-emerald-100" },
  { title: "Beginner Gel Manicure", path: "DIY / Salon", difficulty: "Medium", icon: "🎨", bg: "from-brand-50 to-brand-100" },
  { title: "Keratin Treatment", path: "Salon", difficulty: "Pro", icon: "🌟", bg: "from-rose-50 to-pink-100" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Pro: "bg-purple-50 text-purple-700",
};

export default function FeaturedLooksSection() {
  return (
    <section id="get-this-look" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-[2rem] tracking-tight text-ink md:text-4xl">
              Popular Beauty Goals
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              Trending looks with AI-curated paths to achieve them.
            </p>
          </div>
          <button className="hidden text-[14px] font-semibold text-brand-500 transition hover:text-brand-600 sm:block">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {LOOKS.map((look) => (
            <button
              key={look.title}
              className="group flex flex-col rounded-2xl border border-line bg-white p-4 text-left shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${look.bg} text-2xl`}>
                {look.icon}
              </div>
              <h3 className="mb-1 text-[14.5px] font-bold leading-snug text-ink group-hover:text-brand-600">
                {look.title}
              </h3>
              <p className="mb-2 text-[12px] text-ink-muted">Best path: {look.path}</p>
              <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-semibold ${DIFFICULTY_COLORS[look.difficulty]}`}>
                {look.difficulty}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <button className="text-[14px] font-semibold text-brand-500 transition hover:text-brand-600">
            View all →
          </button>
        </div>
      </div>
    </section>
  );
}
