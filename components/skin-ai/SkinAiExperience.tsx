"use client";

import { useState } from "react";
import Link from "next/link";
import SkinCapture, { type PreparedSelfie } from "@/components/skin-ai/SkinCapture";
import SkinScoreGrid from "@/components/skin-ai/SkinScoreGrid";
import SkinConcernList from "@/components/skin-ai/SkinConcernList";
import SkinProductRecs from "@/components/skin-ai/SkinProductRecs";
import SkinSalonRecs from "@/components/skin-ai/SkinSalonRecs";
import type { SkinAnalyzeResponse } from "@/lib/skin/types";
import { METRIC_META } from "@/lib/skin/metrics";
import { METRIC_KEYS } from "@/lib/skin/types";

type Phase = "capture" | "loading" | "result";

export default function SkinAiExperience() {
  const [phase, setPhase] = useState<Phase>("capture");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Reading texture & color…");

  async function runAnalyze(selfie: PreparedSelfie) {
    setPhase("loading");
    setPreview(selfie.preview);
    setError(null);
    setResult(null);
    setStatus("Reading texture & color…");

    const timers = [
      window.setTimeout(() => setStatus("Calibrating skin scores…"), 1200),
      window.setTimeout(() => setStatus("Matching products & pros…"), 2800),
    ];

    try {
      const res = await fetch("/api/skin-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selfie.base64,
          mediaType: selfie.mediaType,
          clientMetrics: selfie.clientMetrics,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Analysis failed.");
      }
      setResult(data as SkinAnalyzeResponse);
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("capture");
    } finally {
      timers.forEach(clearTimeout);
    }
  }

  function reset() {
    setPhase("capture");
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="bg-[var(--beauty-white)] text-[var(--beauty-text)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-pink-light)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(235,79,120,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1100px] px-4 pb-10 pt-10 md:px-6 md:pb-14 md:pt-14 lg:px-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--beauty-pink)]">
            Skin Analyzer
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-[36px] leading-[1.12] tracking-tight text-ink sm:text-5xl">
            Scan your skin. Get scores.{" "}
            <span className="text-[var(--beauty-pink)]">Shop smarter.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
            Free cosmetic skin scan — oiliness, dryness, redness, pores, spots, and fine
            lines — plus product matches and nearby skincare pros. Not a medical diagnosis.
          </p>
          <p className="mt-3 text-[13.5px] text-ink-faint">
            Looking for a nail or makeup look instead?{" "}
            <Link href="/get-this-look" className="font-semibold text-brand-700 hover:underline">
              Get This Look
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6 md:py-12 lg:px-8">
        {phase === "capture" && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <SkinCapture onReady={runAnalyze} busy={false} />
              {error && (
                <p
                  className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-[14px] text-rose-800"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
            <aside className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
              <h2 className="font-display text-xl text-ink">What we measure</h2>
              <p className="mt-1 text-[13.5px] text-ink-muted">
                Hybrid computer vision + AI calibration (Haut.AI / Revieve-style scores).
              </p>
              <ul className="mt-4 space-y-3">
                {METRIC_KEYS.map((key) => {
                  const m = METRIC_META[key];
                  return (
                    <li key={key} className="rounded-2xl bg-surface-soft px-3.5 py-3">
                      <p className="text-[14px] font-bold text-ink">{m.label}</p>
                      <p className="mt-0.5 text-[12.5px] text-ink-muted">{m.description}</p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                        {m.method}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        )}

        {phase === "loading" && (
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="mx-auto mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-brand-50"
              />
            )}
            <div className="mx-auto flex h-10 w-10 items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
            </div>
            <p className="mt-4 font-display text-xl text-ink">{status}</p>
            <p className="mt-2 text-[13.5px] text-ink-muted">Usually under 15 seconds.</p>
          </div>
        )}

        {phase === "result" && result && (
          <div className="space-y-10">
            <header className="grid gap-6 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6 lg:grid-cols-[200px_1fr]">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Analyzed selfie"
                  className="mx-auto h-44 w-44 rounded-2xl object-cover ring-1 ring-line lg:h-full lg:w-full lg:max-h-56"
                />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-pill bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">
                    {result.report.overallType}
                  </span>
                  {!result.report.quality.ok && (
                    <span className="rounded-pill bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-800 ring-1 ring-amber-200">
                      Photo quality limited
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
                  Your skin report
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {result.report.summary}
                </p>
                {result.report.quality.issues.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-[13px] text-amber-800">
                    {result.report.quality.issues.map((iss) => (
                      <li key={iss}>{iss}</li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 inline-flex min-h-10 items-center rounded-pill border border-line bg-white px-4 text-[13.5px] font-semibold text-ink hover:border-brand-300"
                >
                  Scan another photo
                </button>
              </div>
            </header>

            <SkinScoreGrid report={result.report} />
            <SkinConcernList report={result.report} />
            <SkinProductRecs groups={result.products} />
            <SkinSalonRecs />

            <p className="rounded-2xl bg-surface-soft px-4 py-3 text-center text-[12.5px] leading-relaxed text-ink-muted">
              {result.report.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
