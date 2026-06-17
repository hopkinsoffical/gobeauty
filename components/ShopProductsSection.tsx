const GOAL_PRODUCTS = [
  {
    goal: "Clean Girl Nails",
    icon: "💅",
    products: ["Starter Nail Kit", "Cuticle Oil", "Press-On Nails"],
  },
  {
    goal: "Glass Skin",
    icon: "✨",
    products: ["Gentle Cleanser", "Hydrating Serum", "Mineral Sunscreen"],
  },
  {
    goal: "Frizzy Hair",
    icon: "💆",
    products: ["Hydrating Hair Mask", "Leave-in Conditioner", "Anti-Frizz Serum"],
  },
  {
    goal: "Post-Facial Aftercare",
    icon: "🌿",
    products: ["Barrier Repair Cream", "Gentle Cleanser", "Mineral Sunscreen"],
  },
];

export default function ShopProductsSection() {
  return (
    <section id="shop-products" className="bg-surface-soft py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[2rem] tracking-tight text-ink md:text-4xl">
            Top Products by Beauty Goal
          </h2>
          <p className="mt-3 text-[15px] text-ink-soft">
            Not 20 options — just the top 3 for each goal.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GOAL_PRODUCTS.map((g) => (
            <div
              key={g.goal}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-2xl">{g.icon}</span>
                <h3 className="text-[15.5px] font-bold text-ink">{g.goal}</h3>
              </div>

              <p className="mb-3 text-[11.5px] font-bold uppercase tracking-wider text-brand-500">
                Top 3 Products
              </p>

              <ol className="flex-1 space-y-2">
                {g.products.map((p, i) => (
                  <li key={p} className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-500">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="rounded-xl bg-brand-500 py-2 text-[12.5px] font-semibold text-white transition hover:bg-brand-600">
                  Shop Top 3
                </button>
                <button className="rounded-xl border border-line py-2 text-[12.5px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-ink">
                  View Routine
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
