"use client";

import { useState } from "react";
import AnalyzeChat from "@/components/AnalyzeChat";
import TrendingFeed from "@/components/TrendingFeed";
import type { AnalysisRecord } from "@/lib/types";

/**
 * Client wrapper that owns the feed so a freshly-completed analysis can
 * prepend itself to "What others are asking" without a round-trip refetch.
 */
export default function AnalyzeExperience({
  initialFeed,
}: {
  initialFeed: AnalysisRecord[];
}) {
  const [feed, setFeed] = useState<AnalysisRecord[]>(initialFeed);

  return (
    <>
      <section className="mx-auto max-w-2xl px-5 pt-8 sm:pt-12">
        <div className="mb-6 text-center">
          <h1 className="font-display text-[34px] leading-tight tracking-tight text-ink sm:text-[44px]">
            Snap it. Understand it.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
            Upload a photo of any beauty look and our AI breaks down{" "}
            <span className="font-semibold text-ink-soft">what</span> it is,{" "}
            <span className="font-semibold text-ink-soft">why</span> it works,{" "}
            <span className="font-semibold text-ink-soft">how</span> it&apos;s
            done, and <span className="font-semibold text-ink-soft">how much</span>{" "}
            it costs — then chat through your next steps.
          </p>
        </div>

        <AnalyzeChat
          onAnalyzed={(record) =>
            setFeed((f) => [record, ...f].slice(0, 12))
          }
        />
      </section>

      <TrendingFeed items={feed} />
    </>
  );
}
