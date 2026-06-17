"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";

export type AuthMode = "signin" | "signup";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** False when Supabase env vars are absent — UI should degrade gracefully. */
  configured: boolean;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  authOpen: boolean;
  authMode: AuthMode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo<SupabaseClient | null>(() => {
    try {
      return getSupabaseBrowser();
    } catch {
      return null;
    }
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }
    let active = true;
    const apply = (session: Session | null) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setLoading(false);
    };
    client.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_e, session) =>
      apply(session),
    );
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      if (!client) return { error: "Authentication isn't configured yet." };
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      return error ? { error: error.message } : {};
    },
    [client],
  );

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async (email, password) => {
      if (!client) return { error: "Authentication isn't configured yet." };
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) return { error: error.message };
      // When email confirmation is on, there's a user but no active session.
      const needsConfirmation = !!data.user && !data.session;
      return { needsConfirmation };
    },
    [client],
  );

  const signOut = useCallback(async () => {
    if (client) await client.auth.signOut();
  }, [client]);

  const openAuth = useCallback((mode: AuthMode = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const value: AuthContextValue = {
    user,
    loading,
    configured: !!client,
    accessToken,
    signIn,
    signUp,
    signOut,
    openAuth,
    closeAuth,
    authOpen,
    authMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}
