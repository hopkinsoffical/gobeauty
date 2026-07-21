import type { MetricKey, MetricScore, SkinReport } from "@/lib/skin/types";
import { METRIC_KEYS } from "@/lib/skin/types";
import { bandColor, bandRingStroke, METRIC_META } from "@/lib/skin/metrics";

function ScoreRing({ score }: { score: MetricScore }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score.value)) / 100;
  const dash = c * pct;
  const stroke = bandRingStroke(score.band);

  return (
    <div className="relative mx-auto h-24 w-24">
      <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f3f7" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl leading-none text-ink tabular-nums">
          {score.value}
        </span>
      </div>
    </div>
  );
}

export default function SkinScoreGrid({ report }: { report: SkinReport }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
      {METRIC_KEYS.map((key: MetricKey) => {
        const score = report.scores[key];
        const meta = METRIC_META[key];
        return (
          <article
            key={key}
            className="rounded-2xl border border-line bg-white p-4 shadow-card"
          >
            <ScoreRing score={score} />
            <h3 className="mt-3 text-center text-[14.5px] font-bold text-ink">
              {meta.label}
            </h3>
            <p className="mt-1 text-center">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${bandColor(score.band)}`}
              >
                {score.band}
              </span>
            </p>
            <p className="mt-2 text-center text-[12.5px] leading-snug text-ink-muted">
              {score.explanation}
            </p>
          </article>
        );
      })}
    </div>
  );
}
