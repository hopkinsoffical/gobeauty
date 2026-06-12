// app/u/[username]/b/[board]/page.tsx
// Board detail — masonry of all looks in this board
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProfileByUsername,
  getBoardById,
  getLooksForBoard,
} from "@/lib/profile/queries";
import LooksGrid from "@/components/profile/LooksGrid";

interface PageProps {
  params: { username: string; board: string };
}

export default async function BoardPage({ params }: PageProps) {
  const [profile, board] = await Promise.all([
    getProfileByUsername(params.username),
    getBoardById(params.board),
  ]);
  if (!profile || !board || board.user_id !== profile.id) notFound();

  const looks = await getLooksForBoard(board.id, { limit: 100 });

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-screen-md px-4 h-12 flex items-center gap-3">
          <Link href={`/u/${profile.username}`} className="text-ink-muted hover:text-ink">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{board.title}</div>
            <div className="text-[11px] text-ink-muted">
              {board.pins_count} pin{board.pins_count !== 1 ? "s" : ""} · @{profile.username}
            </div>
          </div>
          <button className="text-ink-muted" aria-label="Share">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
              <path d="M16 6l-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 2v14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {board.description && (
        <div className="mx-auto max-w-screen-md px-4 pt-3 text-xs text-ink-soft">
          {board.description}
        </div>
      )}

      <div className="mx-auto max-w-screen-md px-2 pt-3">
        <LooksGrid looks={looks} />
      </div>
    </div>
  );
}
