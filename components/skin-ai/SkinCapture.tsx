"use client";

import { useCallback, useRef, useState } from "react";
import { analyzeImageElement } from "@/lib/skin/cv";
import type { ClientMetrics } from "@/lib/skin/types";
import { METRIC_META } from "@/lib/skin/metrics";
import { METRIC_KEYS } from "@/lib/skin/types";

const MAX_DIM = 1024;

export type PreparedSelfie = {
  base64: string;
  mediaType: "image/jpeg";
  preview: string;
  clientMetrics: ClientMetrics;
};

async function fileToPrepared(file: File): Promise<PreparedSelfie> {
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
  const out = canvas.toDataURL("image/jpeg", 0.88);

  let clientMetrics: ClientMetrics = {};
  try {
    clientMetrics = analyzeImageElement(img);
  } catch {
    clientMetrics = {};
  }

  return {
    base64: out.split(",")[1] ?? "",
    mediaType: "image/jpeg",
    preview: out,
    clientMetrics,
  };
}

export default function SkinCapture({
  onReady,
  busy,
}: {
  onReady: (selfie: PreparedSelfie) => void;
  busy?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PreparedSelfie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const pickFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setPreparing(true);
    try {
      setPending(await fileToPrepared(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that image.");
      setPending(null);
    } finally {
      setPreparing(false);
    }
  }, []);

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pickFile(f);
          e.target.value = "";
        }}
      />

      {!pending ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
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
          className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging
              ? "border-brand-400 bg-brand-50"
              : "border-line bg-gradient-to-b from-[var(--beauty-blush)] to-white hover:border-brand-300"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-card text-2xl" aria-hidden>
            📷
          </div>
          <p className="mt-4 font-display text-xl text-ink">Upload a face selfie</p>
          <p className="mt-2 max-w-xs text-[14px] text-ink-muted">
            Natural light, face forward, no heavy filters. Tap to upload or take a photo.
          </p>
          <span className="mt-5 inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.28)]">
            {preparing ? "Preparing…" : "Choose photo"}
          </span>
        </div>
      ) : (
        <div>
          <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-surface-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pending.preview}
              alt="Your selfie preview"
              className="mx-auto max-h-[360px] w-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onReady(pending)}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-pill bg-brand-500 px-6 text-[15px] font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60 sm:flex-none"
            >
              {busy ? "Analyzing…" : "Analyze my skin"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setPending(null);
                setError(null);
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-pill border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-surface-tint disabled:opacity-60"
            >
              Change photo
            </button>
          </div>
          {Object.keys(pending.clientMetrics).length > 0 && (
            <p className="mt-3 text-[12px] text-ink-faint">
              Local texture scan ready ·{" "}
              {METRIC_KEYS.filter((k) => pending.clientMetrics[k] != null)
                .slice(0, 3)
                .map((k) => `${METRIC_META[k].short} ${pending.clientMetrics[k]}`)
                .join(" · ")}
              …
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[13.5px] text-rose-800" role="alert">
          {error}
        </p>
      )}

      <ul className="mt-5 grid gap-2 text-[12.5px] text-ink-muted sm:grid-cols-2">
        <li className="rounded-xl bg-surface-soft px-3 py-2">✓ Face fills most of the frame</li>
        <li className="rounded-xl bg-surface-soft px-3 py-2">✓ Soft daylight, no flash glare</li>
        <li className="rounded-xl bg-surface-soft px-3 py-2">✓ Remove sunglasses / heavy filter</li>
        <li className="rounded-xl bg-surface-soft px-3 py-2">✓ Neutral expression, hair off face</li>
      </ul>
    </div>
  );
}
