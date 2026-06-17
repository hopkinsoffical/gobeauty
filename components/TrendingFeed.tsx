import type { AnalysisRecord } from "@/lib/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export default function TrendingFeed({ items }: { items: AnalysisRecord[] }) {
  return (
    <section
      aria-label="What others are asking"
      className="mx-auto max-w-5xl px-5 pb-20 pt-12"
    >
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[26px] tracking-tight text-ink md:text-3xl">
          What others are asking
        </h2>
        <span className="text-[13px] text-ink-muted">Trending looks</span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center text-[14px] text-ink-muted">
          No looks analyzed yet — be the first to upload a photo above.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.id}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-cardHover"
            >
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt={it.title}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-brand-50 to-surface-tint text-[34px]">
                  💅
                </div>
              )}
              <div className="p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-pill bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                    {it.category}
                  </span>
                  <span className="text-[12px] text-ink-faint">
                    {timeAgo(it.createdAt)}
                  </span>
                </div>
                <h3 className="text-[15.5px] font-semibold leading-snug text-ink">
                  {it.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-muted">
                  {it.analysis.what}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
