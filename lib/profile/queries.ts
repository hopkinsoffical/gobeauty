// lib/profile/queries.ts
// Server-side data access for gobeauty profile / boards / follows
// All public reads use anon client; owner writes go through authenticated session
import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getSupabaseForRequest } from "@/lib/supabase/session";
import { type SupabaseClient } from "@supabase/supabase-js";

// ---------- Types ----------

export interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  cover_url: string | null;
  pronouns: string | null;
  website_url: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  pins_count: number;
  boards_count: number;
  followers_count: number;
  following_count: number;
  is_private: boolean;
  created_at: string;
}

export interface BoardSummary {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_private: boolean;
  layout: string;
  pins_count: number;
  created_at: string;
  updated_at: string;
  // First 4 look image URLs (for the board tile collage)
  preview_urls: string[];
}

export interface LookSummary {
  id: string;
  creator_id: string;
  creator_username: string;
  creator_avatar_url: string | null;
  image_url: string;
  thumb_url: string | null;
  title: string | null;
  description: string | null;
  tags: string[];
  saves_count: number;
  created_at: string;
}

// ---------- Supabase clients ----------

/** Authed client bound to the current request cookies. */
function getAuthedClient(): SupabaseClient {
  return getSupabaseForRequest();
}

/** Helper: get the current gobeauty_users row for the auth'd session. */
export async function getCurrentGobeautyUser(): Promise<{
  id: string;
  username: string;
  avatar_url: string | null;
  display_name: string | null;
} | null> {
  const sb = getAuthedClient();
  const { data: { session } } = await sb.auth.getSession();
  if (!session?.user) return null;
  const { data } = await sb
    .from("gobeauty_users")
    .select("id, username, avatar_url, display_name")
    .eq("auth_user_id", session.user.id)
    .single();
  return data ?? null;
}

// ---------- Public reads (anon-friendly) ----------

export async function getProfileByUsername(
  username: string,
): Promise<PublicProfile | null> {
  const sb = getSupabaseAdmin();
  // Strip leading @ if user passed it
  const handle = username.replace(/^@/, "").trim().toLowerCase();
  const { data, error } = await sb
    .from("v_gobeauty_public_profile")
    .select("*")
    .eq("username", handle)
    .single();
  if (error) {
    console.error("[getProfileByUsername]", error.message);
    return null;
  }
  return data as PublicProfile;
}

export async function getProfileById(id: string): Promise<PublicProfile | null> {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("v_gobeauty_public_profile")
    .select("*")
    .eq("id", id)
    .single();
  return (data as PublicProfile) ?? null;
}

export async function getBoardsForUser(
  userId: string,
  opts: { includePrivate?: boolean } = {},
): Promise<BoardSummary[]> {
  const sb = getSupabaseAdmin();
  let q = sb
    .from("gobeauty_boards")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (!opts.includePrivate) q = q.eq("is_private", false);
  const { data: boards, error } = await q;
  if (error) {
    console.error("[getBoardsForUser]", error.message);
    return [];
  }
  if (!boards || boards.length === 0) return [];

  // For each board, fetch the first 4 items to build the preview collage
  const boardIds = boards.map((b) => b.id);
  const { data: items } = await sb
    .from("gobeauty_board_items")
    .select("board_id, look_id, position, gobeauty_looks!inner(image_url)")
    .in("board_id", boardIds)
    .order("position", { ascending: true });
  const byBoard = new Map<string, string[]>();
  for (const it of items || []) {
    const arr = byBoard.get(it.board_id) ?? [];
    const url = (it as any).gobeauty_looks?.image_url;
    if (url && arr.length < 4) arr.push(url);
    byBoard.set(it.board_id, arr);
  }
  return boards.map((b) => ({
    ...b,
    preview_urls: byBoard.get(b.id) ?? [],
  }));
}

export async function getBoardById(boardId: string): Promise<BoardSummary | null> {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("gobeauty_boards")
    .select("*")
    .eq("id", boardId)
    .single();
  if (!data) return null;
  const { data: items } = await sb
    .from("gobeauty_board_items")
    .select("look_id, position, gobeauty_looks!inner(image_url)")
    .eq("board_id", boardId)
    .order("position", { ascending: true })
    .limit(4);
  return {
    ...data,
    preview_urls: (items || []).map((it: any) => it.gobeauty_looks?.image_url).filter(Boolean) as string[],
  };
}

export async function getLooksForUser(
  userId: string,
  opts: { limit?: number; offset?: number } = {},
): Promise<LookSummary[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("gobeauty_looks")
    .select(`
      id, creator_id, image_url, thumb_url, title, description, tags, saves_count, created_at,
      gobeauty_users!inner(username, avatar_url)
    `)
    .eq("creator_id", userId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 30) - 1);
  if (error) {
    console.error("[getLooksForUser]", error.message);
    return [];
  }
  return (data || []).map((l: any) => ({
    id: l.id,
    creator_id: l.creator_id,
    creator_username: l.gobeauty_users.username,
    creator_avatar_url: l.gobeauty_users.avatar_url,
    image_url: l.image_url,
    thumb_url: l.thumb_url,
    title: l.title,
    description: l.description,
    tags: l.tags,
    saves_count: l.saves_count,
    created_at: l.created_at,
  }));
}

export async function getLooksForBoard(
  boardId: string,
  opts: { limit?: number; offset?: number } = {},
): Promise<LookSummary[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("gobeauty_board_items")
    .select(`
      position, created_at,
      gobeauty_looks!inner(
        id, creator_id, image_url, thumb_url, title, description, tags, saves_count, created_at,
        gobeauty_users!inner(username, avatar_url)
      )
    `)
    .eq("board_id", boardId)
    .order("position", { ascending: true })
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 60) - 1);
  if (error) {
    console.error("[getLooksForBoard]", error.message);
    return [];
  }
  return (data || []).map((row: any) => {
    const l = row.gobeauty_looks;
    return {
      id: l.id,
      creator_id: l.creator_id,
      creator_username: l.gobeauty_users.username,
      creator_avatar_url: l.gobeauty_users.avatar_url,
      image_url: l.image_url,
      thumb_url: l.thumb_url,
      title: l.title,
      description: l.description,
      tags: l.tags,
      saves_count: l.saves_count,
      created_at: l.created_at,
    } satisfies LookSummary;
  });
}

// ---------- Authenticated reads (current viewer) ----------

export async function isFollowing(followeeId: string): Promise<boolean> {
  const me = await getCurrentGobeautyUser();
  if (!me) return false;
  const sb = getAuthedClient();
  const { data } = await sb
    .from("gobeauty_follows")
    .select("follower_id")
    .eq("follower_id", me.id)
    .eq("followee_id", followeeId)
    .maybeSingle();
  return !!data;
}

export async function isMyProfile(userId: string): Promise<boolean> {
  const me = await getCurrentGobeautyUser();
  return me?.id === userId;
}
