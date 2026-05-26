import type { MethodCriterion } from "@/lib/types";

const ACCENT_STYLES: Record<
  MethodCriterion["accent"],
  { bg: string; text: string }
> = {
  rose: { bg: "bg-rose-100", text: "text-rose-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  teal: { bg: "bg-teal-100", text: "text-teal-700" },
  sky: { bg: "bg-sky-100", text: "text-sky-700" },
  violet: { bg: "bg-violet-100", text: "text-violet-700" },
  lime: { bg: "bg-lime-100", text: "text-lime-700" },
};

export default function RankingMethodology({
  criteria,
}: {
  criteria: MethodCriterion[];
}) {
  return (
    <section
      id="how-we-rank"
      className="border-y border-line-soft bg-surface-soft py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-600">
            Methodology
          </p>
          <h2 className="font-display text-3xl text-ink md:text-[40px]">
            How we rank salons
          </h2>
          <p className="mt-3 text-[15.5px] text-ink-soft">
            Every salon gets a transparent score across six signals that
            actually move bookings — pulled from Google, public review data,
            and our AI Growth model.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c) => {
            const a = ACCENT_STYLES[c.accent];
            return (
              <div
                key={c.key}
                className="group rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${a.bg} ${a.text}`}
                  aria-hidden
                >
                  {c.glyph}
                </div>
                <h3 className="text-[16px] font-bold text-ink">{c.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                  {c.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
