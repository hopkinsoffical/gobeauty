// lib/supabase/session.ts
// Per-request Supabase client bound to the current user's session.
// Reads the access_token from the sb-*-auth-token cookie set by
// @supabase/supabase-js browser client.
import "server-only";
import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Read the JWT access token from the Supabase auth cookies.
 * @supabase/supabase-js v2 stores session chunks like `sb-<projectref>-auth-token`.
 */
function readAccessTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const all = cookieStore.getAll();
  for (const c of all) {
    if (!c.name.startsWith("sb-") || !c.name.endsWith("-auth-token")) continue;
    // Cookie value is URL-encoded JSON: {"access_token":"...","refresh_token":"..."}
    try {
      const decoded = decodeURIComponent(c.value);
      const json = JSON.parse(decoded);
      if (json?.access_token) return json.access_token as string;
    } catch {
      // Some versions store the raw token in a chunked form
      // (cookies named sb-...-auth-token.0, .1, etc.). Skip for now.
    }
  }
  return null;
}

let _cached: { token: string | null; client: SupabaseClient } | null = null;

/**
 * Per-request Supabase client scoped to the current user's JWT.
 * RLS will use auth.uid() inside policies.
 */
export function getSupabaseForRequest(): SupabaseClient {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error("Supabase env vars missing");
  }
  const token = readAccessTokenFromCookies();
  if (_cached && _cached.token === token) return _cached.client;

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(token
      ? {
          global: {
            headers: { Authorization: `Bearer ${token}` },
          },
        }
      : {}),
  });
  _cached = { token, client };
  return client;
}
