import Link from "next/link";
import { BoardSummary } from "@/lib/profile/queries";

export default function BoardsGrid({
  boards,
  username,
}: {
  boards: BoardSummary[];
  username: string;
}) {
  if (boards.length === 0) {
    return (
      <div className="py-12 text-center text-ink-muted text-sm">
        No boards yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {boards.map((b) => (
        <Link
          key={b.id}
          href={`/u/${username}/b/${b.id}`}
          className="rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition group"
        >
          <div className="grid grid-cols-2 gap-0.5 aspect-square bg-surface-soft">
            {b.preview_urls.length > 0 ? (
              b.preview_urls.slice(0, 4).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ))
            ) : (
              <div className="col-span-2 row-span-2 flex items-center justify-center text-ink-faint text-3xl">
                📌
              </div>
            )}
            {b.preview_urls.length === 1 && (
              <div className="col-span-1 row-span-2 bg-surface-soft" />
            )}
            {b.preview_urls.length === 2 && (
              <>
                <div className="bg-surface-soft" />
                <div className="bg-surface-soft" />
              </>
            )}
            {b.preview_urls.length === 3 && (
              <div className="bg-surface-soft" />
            )}
          </div>
          <div className="px-3 py-2">
            <div className="text-sm font-bold truncate group-hover:text-brand-500">
              {b.title}
            </div>
            <div className="text-[11px] text-ink-muted">
              {b.pins_count} pin{b.pins_count !== 1 ? "s" : ""}
              {b.is_private ? " · 🔒" : ""}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
