// Logs user search activity to gobeauty_search_log.
// Fire-and-forget — never blocks the UI.

function getClient() {
  try {
    const { getSupabaseBrowser } = require("@/lib/supabase/client");
    return getSupabaseBrowser();
  } catch {
    return null;
  }
}

export interface SearchLogEntry {
  authUserId?: string;
  userId?: string;
  sessionId?: string;
  query?: string;
  searchType: "text" | "image";
  imageUrl?: string;
  resultCount?: number;
}

export async function logSearch(entry: SearchLogEntry): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;

  await supabase.from("gobeauty_search_log").insert({
    auth_user_id: entry.authUserId ?? null,
    user_id: entry.userId ?? null,
    session_id: entry.sessionId ?? null,
    query: entry.query ?? null,
    search_type: entry.searchType,
    image_url: entry.imageUrl ?? null,
    result_count: entry.resultCount ?? null,
  });
}
