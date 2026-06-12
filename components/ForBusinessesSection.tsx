export default function ForBusinessesSection() {
  return (
    <section
      id="for-businesses"
      className="mt-12 bg-gradient-to-br from-[#1a1430] to-[#2a1f4a] py-16 text-white"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="mb-2 inline-block rounded-pill bg-white/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white/85">
            For beauty businesses
          </span>
          <h2 className="mb-3 mt-2 text-[2rem] font-extrabold leading-tight tracking-tight md:text-[2.25rem]">
            Own a salon, spa, or med spa?
          </h2>
          <p className="mb-6 max-w-[480px] text-[15.5px] text-white/75">
            Get matched with clients actively searching for your services. Claim
            your free profile, fix your visibility, and let goBeauty AI handle
            bookings.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className="rounded-pill bg-brand-500 px-[18px] py-[9px] text-[13.5px] font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.30)] transition hover:bg-brand-600"
            >
              Claim your free profile
            </button>
            <button
              type="button"
              className="rounded-pill border border-white/20 bg-white/5 px-[18px] py-[9px] text-[13.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Run a free visibility checkup
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { stat: "+38%", sub: "avg. more profile views in 30 days" },
            { stat: "4.2x", sub: "more \"request booking\" clicks" },
            { stat: "23k+", sub: "pros already matched monthly" },
          ].map((b) => (
            <div
              key={b.stat}
              className="rounded-[18px] border border-white/10 bg-white/[0.06] px-5 py-[18px]"
            >
              <strong className="block text-[28px] text-[#f4a8c7]">
                {b.stat}
              </strong>
              <span className="text-[13.5px] text-white/65">{b.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
