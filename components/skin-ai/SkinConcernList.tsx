import type { SkinReport } from "@/lib/skin/types";
import { bandColor } from "@/lib/skin/metrics";

export default function SkinConcernList({ report }: { report: SkinReport }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-xl text-ink sm:text-2xl">Top concerns</h2>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Ranked from your scan — focus here first.
        </p>
        <ul className="mt-4 space-y-3">
          {report.concerns.map((c, i) => (
            <li
              key={`${c.key}-${i}`}
              className="flex gap-3 rounded-2xl border border-line-soft bg-surface-soft/60 p-3.5"
            >
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-[13px] font-bold text-brand-700">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-bold text-ink">{c.title}</h3>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ring-1 ${bandColor(c.severity)}`}
                  >
                    {c.severity}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-xl text-ink sm:text-2xl">Suggested routine</h2>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Simple steps matched to your scores — not a prescription.
        </p>
        <div className="mt-4 space-y-4">
          {report.routine.map((block) => (
            <div key={block.when}>
              <p className="text-[12px] font-bold uppercase tracking-wide text-brand-600">
                {block.when}
              </p>
              <ol className="mt-2 space-y-1.5">
                {block.steps.map((step, idx) => (
                  <li
                    key={`${block.when}-${idx}`}
                    className="flex gap-2 text-[14px] text-ink-soft"
                  >
                    <span className="font-semibold text-ink-muted tabular-nums">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
