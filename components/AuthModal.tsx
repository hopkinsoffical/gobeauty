"use client";

import { useEffect, useState } from "react";
import { useAuth, type AuthMode } from "@/components/AuthProvider";

export default function AuthModal() {
  const { authOpen, authMode, closeAuth, configured, signIn, signUp } =
    useAuth();

  const [mode, setMode] = useState<AuthMode>(authMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Sync the local mode whenever the modal is (re)opened.
  useEffect(() => {
    if (authOpen) {
      setMode(authMode);
      setError(null);
      setNotice(null);
    }
  }, [authOpen, authMode]);

  // Close on Escape.
  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (isSignup) {
        const { error, needsConfirmation } = await signUp(email, password);
        if (error) return setError(error);
        if (needsConfirmation) {
          return setNotice(
            "Check your inbox to confirm your email, then sign in.",
          );
        }
        closeAuth();
      } else {
        const { error } = await signIn(email, password);
        if (error) return setError(error);
        closeAuth();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isSignup ? "Create your account" : "Sign in"}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={closeAuth}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-cardHover">
        <div className="mb-5 flex items-center gap-1.5">
          <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
          <span className="text-base font-extrabold tracking-tight text-ink">
            Go
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              Beauty
            </span>
          </span>
        </div>

        <h2 className="font-display text-2xl text-ink">
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-1 text-[14px] text-ink-muted">
          {isSignup
            ? "Sign up to analyze your beauty photos with AI."
            : "Sign in to pick up where you left off."}
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
            Authentication isn&apos;t configured. Add your Supabase keys to
            <code className="mx-1">.env.local</code>.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-[12.5px] font-semibold text-ink-soft"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-[12.5px] font-semibold text-ink-soft"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[13px] text-brand-600" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-[13px] text-emerald-600" role="status">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full rounded-pill bg-ink py-2.5 text-[14px] font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ink-muted">
          {isSignup ? "Already have an account?" : "New to GoBeauty?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "signin" : "signup");
              setError(null);
              setNotice(null);
            }}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
