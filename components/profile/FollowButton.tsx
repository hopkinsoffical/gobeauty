"use client";
import { useState, useTransition } from "react";
import { followUser, unfollowUser } from "@/lib/profile/actions";

export default function FollowButton({
  profileId,
  initiallyFollowing,
}: {
  profileId: string;
  initiallyFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !following;
    setFollowing(next); // optimistic
    startTransition(async () => {
      const res = next
        ? await followUser(profileId)
        : await unfollowUser(profileId);
      if (!res.ok) {
        setFollowing(!next); // rollback
        if (res.error === "not_logged_in") {
          window.location.href = "/?auth=sign-in&next=/u/me";
        }
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={[
        "inline-block text-xs md:text-sm font-bold rounded-full px-4 py-1.5 transition",
        following
          ? "bg-white border border-ink text-ink hover:bg-surface-soft"
          : "bg-brand-500 text-white hover:bg-brand-600",
        pending ? "opacity-60" : "",
      ].join(" ")}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
