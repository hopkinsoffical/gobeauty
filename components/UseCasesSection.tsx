const CASES = [
  {
    query: "\"I want clean girl nails.\"",
    result: "DIY starter kit + nail salons near you + aftercare routine",
    icon: "💅",
    tags: ["DIY Kit", "Book Salon", "Aftercare"],
  },
  {
    query: "\"My hair is dry and frizzy.\"",
    result: "Product routine + salon treatment options + K-beauty picks",
    icon: "💆",
    tags: ["Product Routine", "Salon Treatment"],
  },
  {
    query: "\"My skin looks dull.\"",
    result: "Skincare routine + facial options + med spa guidance",
    icon: "✨",
    tags: ["Skincare Routine", "Facial Booking"],
  },
  {
    query: "\"I saw this TikTok look.\"",
    result: "Upload it → we decode it → you get the path: DIY, book, or shop",
    icon: "📱",
    tags: ["Upload & Decode", "Get the Look"],
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-surface-soft py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[2rem] tracking-tight text-ink md:text-4xl">
            What can GoBeauty help with?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c) => (
            <div
              key={c.query}
              className="rounded-2xl border border-line bg-white p-6 shadow-card"
            >
              <div className="mb-3 text-3xl">{c.icon}</div>
              <p className="mb-2 text-[14.5px] font-semibold italic text-ink">{c.query}</p>
              <p className="mb-4 text-[13.5px] leading-relaxed text-ink-soft">{c.result}</p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-pill bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
