import Link from "next/link";

export default function Pagination({
  page,
  hasPrev,
  hasNext,
  hrefForPage,
  label = "results",
}: {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  hrefForPage: (p: number) => string;
  label?: string;
}) {
  if (!hasPrev && !hasNext) return null;

  const window: number[] = [];
  const start = Math.max(1, page - 2);
  const end = page + (hasNext ? 2 : 0);
  for (let i = start; i <= Math.max(end, page); i++) window.push(i);

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-[13px] text-ink-muted">
        Page <span className="font-semibold text-ink">{page}</span> of {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {hasPrev ? (
          <Link
            href={hrefForPage(page - 1)}
            className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink transition hover:border-brand-300"
            rel="prev"
          >
            ← Previous
          </Link>
        ) : (
          <span className="inline-flex h-10 items-center rounded-full border border-line/60 bg-surface-soft px-4 text-[13px] font-semibold text-ink-faint">
            ← Previous
          </span>
        )}

        {window.map((p) =>
          p === page ? (
            <span
              key={p}
              aria-current="page"
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-brand-500 px-3 text-[13px] font-bold text-white"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={hrefForPage(p)}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-ink transition hover:border-brand-300"
            >
              {p}
            </Link>
          ),
        )}

        {hasNext ? (
          <Link
            href={hrefForPage(page + 1)}
            className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink transition hover:border-brand-300"
            rel="next"
          >
            Next →
          </Link>
        ) : (
          <span className="inline-flex h-10 items-center rounded-full border border-line/60 bg-surface-soft px-4 text-[13px] font-semibold text-ink-faint">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
