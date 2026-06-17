import { LookSummary } from "@/lib/profile/queries";

export default function LooksGrid({ looks }: { looks: LookSummary[] }) {
  if (looks.length === 0) {
    return (
      <div className="py-12 text-center text-ink-muted text-sm">
        No looks yet.
      </div>
    );
  }

  return (
    <div className="masonry">
      {looks.map((l) => (
        <div
          key={l.id}
          className="rounded-2xl overflow-hidden card-shadow group cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={l.thumb_url || l.image_url}
            alt={l.title || "Look"}
            className="w-full block group-hover:scale-[1.02] transition"
          />
          {(l.title || l.tags.length > 0) && (
            <div className="px-2.5 py-2">
              {l.title && (
                <div className="text-xs font-bold truncate">{l.title}</div>
              )}
              <div className="text-[10px] text-ink-muted mt-0.5">
                ♡ {l.saves_count}
                {l.tags.length > 0 && (
                  <span className="ml-1.5">· {l.tags.slice(0, 2).join(" · ")}</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
