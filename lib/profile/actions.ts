// lib/profile/actions.ts
// Server Actions for gobeauty profile / boards / follows
// All actions require authentication and verify ownership via gobeauty_users
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentGobeautyUser } from "./queries";
import { getSupabaseForRequest } from "@/lib/supabase/session";

function sb() {
  return getSupabaseForRequest();
}

// ---------- Follow / Unfollow ----------

export async function followUser(followeeId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  if (me.id === followeeId) return { ok: false, error: "self_follow" };

  const { error } = await sb()
    .from("gobeauty_follows")
    .insert({ follower_id: me.id, followee_id: followeeId });
  if (error) {
    if (error.code === "23505") return { ok: true }; // already following
    return { ok: false, error: error.message };
  }
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

export async function unfollowUser(followeeId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };

  const { error } = await sb()
    .from("gobeauty_follows")
    .delete()
    .eq("follower_id", me.id)
    .eq("followee_id", followeeId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

// ---------- Profile updates ----------

export interface ProfileUpdate {
  bio?: string;
  cover_url?: string;
  pronouns?: string;
  website_url?: string;
  city?: string;
  region?: string;
  country?: string;
  display_name?: string;
  is_private?: boolean;
}

export async function updateProfile(update: ProfileUpdate) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };

  const profilePatch: Record<string, unknown> = {};
  if (update.bio !== undefined) profilePatch.bio = update.bio;
  if (update.cover_url !== undefined) profilePatch.cover_url = update.cover_url;
  if (update.pronouns !== undefined) profilePatch.pronouns = update.pronouns;
  if (update.website_url !== undefined) profilePatch.website_url = update.website_url;
  if (update.city !== undefined) profilePatch.city = update.city;
  if (update.region !== undefined) profilePatch.region = update.region;
  if (update.country !== undefined) profilePatch.country = update.country;
  if (update.is_private !== undefined) profilePatch.is_private = update.is_private;

  if (Object.keys(profilePatch).length > 0) {
    const { error: pErr } = await sb()
      .from("gobeauty_profiles")
      .update(profilePatch)
      .eq("user_id", me.id);
    if (pErr) return { ok: false, error: pErr.message };
  }

  // display_name lives on gobeauty_users
  if (update.display_name !== undefined) {
    const { error: uErr } = await sb()
      .from("gobeauty_users")
      .update({ display_name: update.display_name })
      .eq("id", me.id);
    if (uErr) return { ok: false, error: uErr.message };
  }

  revalidatePath(`/u/[username]`, "page");
  revalidatePath(`/u/me`, "page");
  return { ok: true };
}

export async function updateAvatar(avatarUrl: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  const { error } = await sb()
    .from("gobeauty_users")
    .update({ avatar_url: avatarUrl })
    .eq("id", me.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

// ---------- Board CRUD ----------

export interface BoardInput {
  title: string;
  description?: string;
  is_private?: boolean;
  layout?: "masonry" | "grid";
  cover_url?: string;
}

export async function createBoard(input: BoardInput) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  if (!input.title?.trim()) return { ok: false, error: "title_required" };

  // sort_order = max + 1
  const { data: max } = await sb()
    .from("gobeauty_boards")
    .select("sort_order")
    .eq("user_id", me.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (max?.sort_order ?? -1) + 1;

  const { data, error } = await sb()
    .from("gobeauty_boards")
    .insert({
      user_id: me.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      is_private: !!input.is_private,
      layout: input.layout ?? "masonry",
      cover_url: input.cover_url || null,
      sort_order: nextOrder,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true, id: data?.id };
}

export async function updateBoard(boardId: string, input: Partial<BoardInput>) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) patch.description = input.description.trim() || null;
  if (input.is_private !== undefined) patch.is_private = !!input.is_private;
  if (input.layout !== undefined) patch.layout = input.layout;
  if (input.cover_url !== undefined) patch.cover_url = input.cover_url || null;

  const { error } = await sb()
    .from("gobeauty_boards")
    .update(patch)
    .eq("id", boardId)
    .eq("user_id", me.id); // ownership enforced
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

export async function deleteBoard(boardId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  const { error } = await sb()
    .from("gobeauty_boards")
    .delete()
    .eq("id", boardId)
    .eq("user_id", me.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

// ---------- Looks CRUD ----------

export interface LookInput {
  image_url: string;
  thumb_url?: string;
  title?: string;
  description?: string;
  source_url?: string;
  tags?: string[];
  origin?: "upload" | "pinterest" | "instagram" | "manual";
}

export async function createLook(input: LookInput) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  if (!input.image_url) return { ok: false, error: "image_required" };

  const { data, error } = await sb()
    .from("gobeauty_looks")
    .insert({
      creator_id: me.id,
      image_url: input.image_url,
      thumb_url: input.thumb_url ?? null,
      title: input.title?.trim() || null,
      description: input.description?.trim() || null,
      source_url: input.source_url ?? null,
      tags: input.tags ?? [],
      origin: input.origin ?? "upload",
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true, id: data?.id };
}

export async function deleteLook(lookId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  const { error } = await sb()
    .from("gobeauty_looks")
    .delete()
    .eq("id", lookId)
    .eq("creator_id", me.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

// ---------- Board items (save / unsave a look to a board) ----------

export async function addLookToBoard(boardId: string, lookId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };

  // Verify board ownership
  const { data: board } = await sb()
    .from("gobeauty_boards")
    .select("user_id")
    .eq("id", boardId)
    .single();
  if (!board) return { ok: false, error: "board_not_found" };
  if (board.user_id !== me.id) return { ok: false, error: "not_your_board" };

  // next position
  const { data: max } = await sb()
    .from("gobeauty_board_items")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = (max?.position ?? -1) + 1;

  const { error } = await sb()
    .from("gobeauty_board_items")
    .insert({ board_id: boardId, look_id: lookId, added_by: me.id, position: nextPos });
  if (error) {
    if (error.code === "23505") return { ok: true }; // already in board
    return { ok: false, error: error.message };
  }
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}

export async function removeLookFromBoard(boardId: string, lookId: string) {
  const me = await getCurrentGobeautyUser();
  if (!me) return { ok: false, error: "not_logged_in" };
  const { error } = await sb()
    .from("gobeauty_board_items")
    .delete()
    .eq("board_id", boardId)
    .eq("look_id", lookId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/[username]`, "page");
  return { ok: true };
}
