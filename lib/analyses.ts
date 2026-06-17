import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { AnalysisRecord, BeautyAnalysis } from "@/lib/types";
import type { SupportedMediaType } from "@/lib/anthropic";

const BUCKET = "analysis-images";

/** Verify a Supabase access token and return the user id, or null. */
export async function getUserIdFromToken(
  token: string | null,
): Promise<string | null> {
  if (!token) return null;
  try {
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

const EXT_BY_TYPE: Record<SupportedMediaType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Upload the photo to the public bucket and return its URL. Storage is
 * best-effort — if it fails we still return the analysis, just without a
 * persisted image, so the feature degrades instead of breaking.
 */
export async function uploadAnalysisImage(opts: {
  userId: string;
  base64: string;
  mediaType: SupportedMediaType;
}): Promise<string | null> {
  try {
    const buffer = Buffer.from(opts.base64, "base64");
    const ext = EXT_BY_TYPE[opts.mediaType] ?? "jpg";
    const path = `${opts.userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const admin = getSupabaseAdmin();
    const { error } = await admin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: opts.mediaType, upsert: false });
    if (error) {
      console.error("[analyses] image upload failed:", error.message);
      return null;
    }
    return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.error("[analyses] image upload threw:", err);
    return null;
  }
}

/** Persist an analysis. Best-effort: returns null on failure (e.g. no DB). */
export async function saveAnalysis(opts: {
  userId: string;
  imageUrl: string | null;
  prompt: string | null;
  analysis: BeautyAnalysis;
}): Promise<AnalysisRecord | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("analyses")
      .insert({
        user_id: opts.userId,
        image_url: opts.imageUrl,
        title: opts.analysis.title,
        category: opts.analysis.category,
        prompt: opts.prompt,
        analysis: opts.analysis,
      })
      .select("id, title, category, image_url, analysis, created_at")
      .single();
    if (error || !data) {
      console.error("[analyses] save failed:", error?.message);
      return null;
    }
    return rowToRecord(data);
  } catch (err) {
    console.error("[analyses] save threw:", err);
    return null;
  }
}

/** Read the most recent public analyses for the "What others are asking" feed. */
export async function getFeed(limit = 12): Promise<AnalysisRecord[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("analyses")
      .select("id, title, category, image_url, analysis, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map(rowToRecord);
  } catch {
    return [];
  }
}

function rowToRecord(row: {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  analysis: BeautyAnalysis;
  created_at: string;
}): AnalysisRecord {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    analysis: row.analysis,
    createdAt: row.created_at,
  };
}
