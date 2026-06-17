import type { BeautyAnalysis } from "@/lib/types";

const SECTIONS: {
  key: keyof Pick<
    BeautyAnalysis,
    "what" | "why" | "how" | "howMuch" | "recommendation"
  >;
  label: string;
  glyph: string;
}[] = [
  { key: "what", label: "What it is", glyph: "✨" },
  { key: "why", label: "Why it works", glyph: "💡" },
  { key: "how", label: "How it's done", glyph: "🛠️" },
  { key: "howMuch", label: "How much", glyph: "💸" },
  { key: "recommendation", label: "Recommendation", glyph: "⭐" },
];

export default function AnalysisResult({
  analysis,
}: {
  analysis: BeautyAnalysis;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-pill bg-brand-50 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-brand-700">
          {analysis.category}
        </span>
        <h3 className="font-display text-[22px] leading-tight text-ink">
          {analysis.title}
        </h3>
      </div>

      <dl className="space-y-3.5">
        {SECTIONS.map((s) => (
          <div key={s.key} className="flex gap-3">
            <span aria-hidden className="mt-0.5 text-[16px] leading-none">
              {s.glyph}
            </span>
            <div>
              <dt className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-ink-muted">
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[14.5px] leading-relaxed text-ink-soft">
                {analysis[s.key]}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {analysis.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line-soft pt-4">
          {analysis.tags.map((t) => (
            <span
              key={t}
              className="rounded-pill bg-surface-soft px-2.5 py-1 text-[12px] font-medium text-ink-muted"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
