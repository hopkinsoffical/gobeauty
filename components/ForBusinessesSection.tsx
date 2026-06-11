const PERKS = [
  { icon: "🎯", text: "Get matched with local clients actively searching for your services" },
  { icon: "📈", text: "Improve your visibility for the looks and services people are searching for" },
  { icon: "✅", text: "Claim your free profile and complete a visibility checkup" },
  { icon: "🤖", text: "Let GoBeauty AI schedule appointments and send booking confirmations" },
];

export default function ForBusinessesSection() {
  return (
    <section id="for-businesses" className="bg-ink py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left copy */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-white/70">
              For Beauty Businesses
            </span>
            <h2 className="font-display text-[2rem] leading-tight tracking-tight text-white md:text-4xl">
              Own a salon or beauty business?
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
              Claim your GoBeauty profile, get matched with local clients, and improve your visibility
              for the services and looks people are searching for.
            </p>

            <ul className="mt-8 space-y-4">
              {PERKS.map((p) => (
                <li key={p.text} className="flex items-start gap-3 text-[14.5px] text-white/80">
                  <span className="mt-0.5 text-xl leading-none">{p.icon}</span>
                  {p.text}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <button className="rounded-pill bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-brand-400">
                Claim Your Profile
              </button>
              <button className="rounded-pill border border-white/20 px-6 py-3 text-[15px] font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
                Get a Free Visibility Checkup
              </button>
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "20K+", label: "Monthly active users" },
              { value: "8K+", label: "Beauty professionals" },
              { value: "50+", label: "Cities covered" },
              { value: "98%", label: "Avg. match score" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/8 p-6 backdrop-blur-sm border border-white/10">
                <p className="font-display text-[2.5rem] font-bold leading-none text-brand-400">{s.value}</p>
                <p className="mt-1.5 text-[13.5px] text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
