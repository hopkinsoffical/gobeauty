"use client";

import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import AnalysisResult from "@/components/AnalysisResult";
import type {
  AnalysisRecord,
  BeautyAnalysis,
  ChatMessage,
} from "@/lib/types";

const MAX_DIM = 1200; // downscale longest edge before upload

/** Downscale + re-encode a chosen file to a compact JPEG for the API. */
async function fileToBase64(
  file: File,
): Promise<{ base64: string; mediaType: "image/jpeg"; preview: string }> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load the image."));
    el.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");
  ctx.drawImage(img, 0, 0, w, h);
  const out = canvas.toDataURL("image/jpeg", 0.85);

  return {
    base64: out.split(",")[1] ?? "",
    mediaType: "image/jpeg",
    preview: out,
  };
}

export default function AnalyzeChat({
  onAnalyzed,
}: {
  onAnalyzed?: (record: AnalysisRecord) => void;
}) {
  const { user, openAuth } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [pending, setPending] = useState<{
    base64: string;
    mediaType: "image/jpeg";
    preview: string;
  } | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<BeautyAnalysis | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // The shared auth provider doesn't expose the raw token, so read the current
  // Supabase session at request time and forward it as a bearer token.
  const authHeaders = useCallback(async (): Promise<HeadersInit> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    try {
      const { data } = await getSupabaseBrowser().auth.getSession();
      const token = data.session?.access_token;
      if (token) h.Authorization = `Bearer ${token}`;
    } catch {
      // Supabase env not configured — request proceeds and the API returns 401.
    }
    return h;
  }, []);

  const pickFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      setPending(await fileToBase64(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that image.");
    }
  }, []);

  async function runAnalysis() {
    if (!pending) return;
    const prompt = input.trim();
    setMessages((m) => [
      ...m,
      { role: "user", text: prompt, imagePreview: pending.preview },
    ]);
    const payload = { ...pending };
    setPending(null);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({
          imageBase64: payload.base64,
          mediaType: payload.mediaType,
          prompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed.");
      const analysis = data.analysis as BeautyAnalysis;
      setMessages((m) => [...m, { role: "assistant", analysis }]);
      setActiveAnalysis(analysis);
      if (data.record) onAnalyzed?.(data.record as AnalysisRecord);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  async function runFollowUp(question: string) {
    const q = question.trim();
    if (!q || !activeAnalysis) return;
    const nextHistory = [
      ...messages
        .filter((m) => m.text && m.text.trim().length > 0)
        .map((m) => ({ role: m.role, text: m.text as string })),
      { role: "user" as const, text: q },
    ];
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ analysis: activeAnalysis, history: nextHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not reply.");
      setMessages((m) => [...m, { role: "assistant", text: data.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reply.");
    } finally {
      setBusy(false);
    }
  }

  function handleSend() {
    if (busy) return;
    if (!user) {
      openAuth("sign-up");
      return;
    }
    if (pending) {
      void runAnalysis();
    } else if (activeAnalysis && input.trim()) {
      void runFollowUp(input);
    }
  }

  const hasThread = messages.length > 0;
  const lastAssistantAnalysis = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.analysis)?.analysis;

  return (
    <div className="rounded-3xl border border-line bg-surface-soft/60 p-3 shadow-card sm:p-4">
      {/* Conversation thread */}
      {hasThread && (
        <div className="mb-3 max-h-[60vh] space-y-4 overflow-y-auto px-1 py-2">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] space-y-2">
                  {m.imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.imagePreview}
                      alt="Your upload"
                      className="ml-auto max-h-56 rounded-2xl border border-line object-cover"
                    />
                  )}
                  {m.text && (
                    <p className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-ink px-4 py-2.5 text-[14.5px] text-white">
                      {m.text}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="max-w-[92%]">
                  {m.analysis ? (
                    <AnalysisResult analysis={m.analysis} />
                  ) : (
                    <p className="w-fit whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-2.5 text-[14.5px] leading-relaxed text-ink-soft shadow-card">
                      {m.text}
                    </p>
                  )}
                </div>
              </div>
            ),
          )}

          {busy && (
            <div className="flex items-center gap-2 px-1 text-[14px] text-ink-muted">
              <span className="flex gap-1">
                <Dot /> <Dot /> <Dot />
              </span>
              Analyzing…
            </div>
          )}

          {/* Suggested next steps under the latest analysis */}
          {!busy &&
            lastAssistantAnalysis &&
            lastAssistantAnalysis.nextSteps?.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1 pt-1">
                {lastAssistantAnalysis.nextSteps.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => user && runFollowUp(q)}
                    disabled={busy}
                    className="rounded-pill border border-brand-200 bg-white px-3 py-1.5 text-[13px] font-medium text-brand-700 transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Empty-state dropzone */}
      {!hasThread && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void pickFile(f);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
            dragging
              ? "border-brand-400 bg-brand-50"
              : "border-line bg-white hover:border-brand-300"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-[22px]">
            📸
          </span>
          <span className="text-[15px] font-semibold text-ink">
            Drop a photo or click to upload
          </span>
          <span className="text-[13px] text-ink-muted">
            Nails, hair, makeup, brows — any beauty look.
          </span>
        </button>
      )}

      {/* Pending image preview */}
      {pending && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pending.preview}
            alt="Selected"
            className="h-16 w-16 rounded-xl object-cover"
          />
          <span className="flex-1 text-[14px] text-ink-soft">
            Ready to analyze. Add a question below (optional) and send.
          </span>
          <button
            type="button"
            onClick={() => setPending(null)}
            className="rounded-pill px-2 py-1 text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="mb-2 px-1 text-[13px] text-brand-600" role="alert">
          {error}
        </p>
      )}

      {/* Composer */}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pickFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          aria-label="Attach a photo"
          onClick={() => fileRef.current?.click()}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line bg-white text-[18px] text-ink-soft transition hover:border-ink hover:text-ink"
        >
          📎
        </button>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            pending
              ? "Ask anything about this look (optional)…"
              : activeAnalysis
                ? "Ask a follow-up…"
                : "Attach a photo to get started…"
          }
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={busy || (!pending && !(activeAnalysis && input.trim()))}
          className="flex h-11 flex-none items-center rounded-xl bg-ink px-4 text-[14px] font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Analyze" : "Send"}
        </button>
      </div>

      {!user && (
        <p className="mt-2 px-1 text-[13px] text-ink-muted">
          You&apos;ll be asked to{" "}
          <button
            type="button"
            onClick={() => openAuth("sign-up")}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            create a free account
          </button>{" "}
          before your first analysis.
        </p>
      )}
    </div>
  );
}

function Dot() {
  return (
    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
  );
}
