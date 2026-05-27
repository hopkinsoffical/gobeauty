import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;
let warnedServiceRoleKeyMismatch = false;

function readJwtRole(jwt: string): string {
  try {
    const parts = String(jwt || "").split(".");
    if (parts.length < 2) return "";
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );
    return String(payload && payload.role ? payload.role : "").trim();
  } catch {
    return "";
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing required environment variable: SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  const jwtRole = readJwtRole(serviceRoleKey);
  if (!warnedServiceRoleKeyMismatch && jwtRole && jwtRole !== "service_role") {
    warnedServiceRoleKeyMismatch = true;
    console.error(
      `[supabase] SUPABASE_SERVICE_ROLE_KEY JWT role is "${jwtRole}" (expected "service_role"). Copy the service_role key from Supabase → Project Settings → API.`,
    );
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
