"use client";

import Link from "next/link";
import { useState } from "react";
import type { Salon } from "@/lib/types";

// PRD v2 §7.2 — Top 3 matches first: Best Overall, Best Value, Best
// Style/Premium. Fit Score + confidence labels, no absolute claims.
const MATCH_LABELS = ["Best Overall", "Best Value", "Best Style"] as const;

const SERVICES = [
  "Gel manicure",
  "Nail art",
  "Hydrating facial",
  "Lash lift",
  "Lash extensions",
  "Keratin treatment",
  "Korean perm",
  "Waxing",
  "Scalp care",
];

export default function FindProsShell({ salons }: { salons: Salon[] }) {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [searched, setSearched] = useState(false);

  const top3 = salons.slice(0, 3);

  const inputCls =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300 focus:shadow-[0_0_0_4px_rgba(232,90,130,0.10)]";

  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-14">
      {/* Search — one action per section, thumb-friendly */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
        className="rounded-2xl border border-line bg-white p-3 shadow-card"
      >
        <div className="grid gap-2.5 md:grid-cols-[1.2fr_1fr_auto]">
          <input
            list="fp-services"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service or look — e.g. lash lift"
            aria-label="Service or look"
            className={inputCls}
          />
          <datalist id="fp-services">
            {SERVICES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or ZIP — e.g. Edison, NJ"
            aria-label="Location"
            className={inputCls}
          />
          <button
            type="submit"
            className="h-12 rounded-xl bg-brand-500 px-7 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.28)] transition hover:bg-brand-600"
          >
            Find my Top 3
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2 px-1 pb-1">
          {["Open now", "Online booking", "$$ budget", "Near me"].map((f) => (
            <span
              key={f}
              className="rounded-pill border border-line-soft bg-surface-soft px-3 py-1.5 text-[12.5px] font-semibold text-ink-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </form>

      {/* Top 3 result preview */}
      <div className="mt-8">
        <h2 className="font-display text-[1.6rem] leading-tight text-ink md:text-[2rem]">
          {searched && (service || location)
            ? `Top 3 matches${service ? ` for ${service}` : ""}${location ? ` near ${location}` : ""}`
            : "Top 3 matches near Edison, NJ"}
        </h2>
        <p className="mt-1.5 text-[14px] text-ink-soft">
          Matched on service evidence, reviews, style fit, and responsiveness —
          with a confidence label, never absolute claims.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {top3.map((salon, i) => (
            <article
              key={salon.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="aspect-[16/10] w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <span className="absolute left-3 top-3 rounded-pill bg-ink/85 px-3 py-1 text-[11.5px] font-bold text-white backdrop-blur-sm">
                  {MATCH_LABELS[i]}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[16px] font-bold text-ink">{salon.name}</h3>
                  <span className="flex-none rounded-lg bg-brand-500/10 px-2 py-1 text-[12px] font-bold text-brand-600">
                    Fit {salon.aiGrowthScore}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  ★ {salon.rating} ({salon.reviewCount}) · {salon.city}
                  {salon.openNow ? " · Open now" : ""}
                </p>
                {salon.tagline && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    {salon.tagline}
                  </p>
                )}
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-emerald-700">
                  High confidence match
                </p>
                <button
                  type="button"
                  className="mt-auto h-11 w-full rounded-pill bg-brand-500 pt-px text-[14px] font-semibold text-white transition hover:bg-brand-600"
                  style={{ marginTop: "14px" }}
                >
                  Check Price &amp; Availability
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-surface-soft p-4 text-center md:flex md:items-center md:justify-between md:p-5 md:text-left">
          <p className="text-[14.5px] font-semibold text-ink">
            Want us to reach out for you? Ask GoBeauty AI to contact these pros.
          </p>
          <Link
            href="/get-this-look"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-pill border border-ink px-6 text-[14px] font-semibold text-ink transition hover:bg-ink hover:text-white md:mt-0"
          >
            Ask GoBeauty AI
          </Link>
        </div>
      </div>

      {/* Owner claim CTA (PRD §7.2) */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#16181d] to-[#262a33] p-6 text-white md:p-8">
        <h2 className="font-display text-[1.4rem] leading-tight md:text-[1.7rem]">
          Is this your business?
        </h2>
        <p className="mt-2 max-w-[520px] text-[14.5px] text-white/70">
          Claim your profile to control your photos, services, and ranking
          signals — and see how clients find you on GoBeauty.
        </p>
        <Link
          href="/for-beauty-pros#claim"
          className="mt-4 inline-flex h-11 items-center rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white transition hover:bg-brand-600"
        >
          Claim / update your profile
        </Link>
      </div>
    </div>
  );
}
