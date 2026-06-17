"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  phone: string;
  avatar_url?: string;
}

type AuthMode = "sign-in" | "sign-up";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setProfile: (p: Profile) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getClient() {
  try {
    // Dynamic import to avoid throwing at module load time when env vars missing
    const { getSupabaseBrowser } = require("@/lib/supabase/client");
    return getSupabaseBrowser();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");

  useEffect(() => {
    const supabase = getClient();
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }: any) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) fetchProfile(u.id);
        else { setProfile(null); setLoading(false); }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const supabase = getClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from("gobeauty_users")
      .select("id, username, phone, avatar_url")
      .eq("auth_user_id", userId)
      .single();
    setProfile(data ?? null);
    setLoading(false);
  }

  const openAuth = useCallback((mode: AuthMode = "sign-in") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const signOut = useCallback(async () => {
    const supabase = getClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, authOpen, authMode, openAuth, closeAuth, setProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
