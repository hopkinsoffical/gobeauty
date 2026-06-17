// app/u/[username]/page.tsx
// Public profile page — server component for SSR
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getProfileByUsername,
  getBoardsForUser,
  getLooksForUser,
  isFollowing,
  isMyProfile,
  getCurrentGobeautyUser,
} from "@/lib/profile/queries";
import { followUser, unfollowUser } from "@/lib/profile/actions";
import FollowButton from "@/components/profile/FollowButton";
import ProfileTabs from "@/components/profile/ProfileTabs";
import BoardsGrid from "@/components/profile/BoardsGrid";
import LooksGrid from "@/components/profile/LooksGrid";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await getProfileByUsername(params.username);
  if (!profile) return { title: "Profile not found" };
  return {
    title: `${profile.display_name || `@${profile.username}`} (@${profile.username})`,
    description: profile.bio || `${profile.boards_count} boards · ${profile.pins_count} pins on goBeauty`,
    openGraph: {
      title: `${profile.display_name || `@${profile.username}`} · goBeauty`,
      description: profile.bio || undefined,
      images: profile.cover_url ? [{ url: profile.cover_url }] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const profile = await getProfileByUsername(params.username);
  if (!profile) notFound();

  const me = await getCurrentGobeautyUser();
  const isMe = me?.id === profile.id;
  const isFollowingMe = isMe ? false : await isFollowing(profile.id);

  const [boards, looks] = await Promise.all([
    getBoardsForUser(profile.id, { includePrivate: isMe }),
    getLooksForUser(profile.id, { limit: 60 }),
  ]);

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-10">
      {/* Top app bar */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-screen-md px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-ink-muted hover:text-ink" aria-label="Back home">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="text-sm font-bold">@{profile.username}</div>
          {isMe ? (
            <Link href="/u/me/edit" className="text-xs font-bold border border-line rounded-full px-3 py-1 hover:bg-surface-soft">
              Edit
            </Link>
          ) : (
            <button className="text-ink-muted" aria-label="More">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Cover + avatar */}
      <div className="relative">
        <div
          className="w-full h-32 md:h-48 bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300"
          style={
            profile.cover_url
              ? { backgroundImage: `url(${profile.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        />
        <div className="mx-auto max-w-screen-md px-4">
          <div className="relative -mt-10 md:-mt-14 flex items-end justify-between">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-brand-100 shadow-card">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-500 text-2xl md:text-4xl font-extrabold">
                  {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="mb-1 md:mb-3">
              {isMe ? (
                <Link
                  href="/u/me/edit"
                  className="inline-block text-xs md:text-sm font-bold border border-line rounded-full px-4 py-1.5 hover:bg-surface-soft"
                >
                  Edit profile
                </Link>
              ) : (
                <FollowButton
                  profileId={profile.id}
                  initiallyFollowing={isFollowingMe}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name + bio + stats */}
      <div className="mx-auto max-w-screen-md px-4 mt-3">
        <div className="text-base md:text-xl font-extrabold leading-tight">
          {profile.display_name || `@${profile.username}`}
        </div>
        <div className="text-xs md:text-sm text-ink-muted">
          @{profile.username}
          {profile.pronouns ? <span className="ml-1.5">· {profile.pronouns}</span> : null}
        </div>
        {profile.bio ? (
          <p className="text-xs md:text-sm text-ink-soft mt-2 leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        ) : null}
        {(profile.city || profile.region) ? (
          <div className="text-xs text-ink-muted mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s-8-7-8-13a8 8 0 1 1 16 0c0 6-8 13-8 13z" />
              <circle cx="12" cy="9" r="3" />
            </svg>
            {[profile.city, profile.region].filter(Boolean).join(", ")}
          </div>
        ) : null}
        <div className="flex items-center gap-5 text-xs md:text-sm text-ink mt-3">
          <span><b className="font-extrabold">{profile.followers_count}</b> <span className="text-ink-muted">followers</span></span>
          <span><b className="font-extrabold">{profile.following_count}</b> <span className="text-ink-muted">following</span></span>
          <span><b className="font-extrabold">{profile.pins_count}</b> <span className="text-ink-muted">pins</span></span>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="mt-5">
        <ProfileTabs
          boardsCount={boards.length}
          looksCount={looks.length}
          boardsContent={<BoardsGrid boards={boards} username={profile.username} />}
          looksContent={<LooksGrid looks={looks} />}
        />
      </div>
    </div>
  );
}
