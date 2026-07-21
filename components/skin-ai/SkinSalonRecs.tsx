"use client";

import { useCallback, useEffect, useState } from "react";
import type { SalonCard, TopSalonsResult } from "@/lib/gbApi";

const QUICK = [
  { town: "New York", state: "NY" },
  { town: "Brooklyn", state: "NY" },
  { town: "Edison", state: "NJ" },
  { town: "Los Angeles", state: "CA" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[13px] font-semibold text-emerald-800">
      <span className="text-amber-500" aria-hidden>
        ★
      </span>
      {rating.toFixed(1)}
    </span>
  );
}

export default function SkinSalonRecs() {
  const [town, setTown] = useState("Edison");
  const [state, setState] = useState("NJ");
  const [salons, setSalons] = useState<SalonCard[]>([]);
  const [scope, setScope] = useState<TopSalonsResult["scope"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (t: string, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        town: t,
        state: s,
        category: "skin-care",
      });
      const res = await fetch(`/api/salons?${params}`);
      if (!res.ok) throw new Error("Could not load salons");
      const data = (await res.json()) as TopSalonsResult;
      setSalons(data.salons ?? []);
      setScope(data.scope);
    } catch {
      setError("Skincare pros are unavailable right now.");
      setSalons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(town, state);
  }, [town, state, load]);

  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink">Skincare pros near you</h2>
          <p className="mt-1 text-[14px] text-ink-muted">
            Top-rated skin care clinics &amp; medical spas from local rankings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((c) => {
            const active = c.town === town && c.state === state;
            return (
              <button
                key={`${c.town}-${c.state}`}
                type="button"
                onClick={() => {
                  setTown(c.town);
                  setState(c.state);
                }}
                className={`rounded-pill px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  active
                    ? "bg-brand-500 text-white"
                    : "border border-line bg-white text-ink hover:border-brand-300"
                }`}
              >
                {c.town}
              </button>
            );
          })}
        </div>
      </div>

      {scope && scope !== "town" && (
        <p className="mt-3 text-[12.5px] text-amber-800">
          {scope === "area"
            ? "Not enough listings in this city yet — showing the wider area."
            : "Showing the best in this state."}
        </p>
      )}

      {loading && (
        <p className="mt-6 text-[14px] text-ink-muted">Finding skin-care pros…</p>
      )}
      {error && <p className="mt-6 text-[14px] text-rose-700">{error}</p>}

      {!loading && !error && salons.length === 0 && (
        <p className="mt-6 text-[14px] text-ink-muted">
          No skin-care listings found for this area yet. Try another city.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {salons.map((salon, i) => (
          <li
            key={salon.slug || salon.name}
            className="flex gap-4 rounded-2xl border border-line bg-surface-soft/40 p-4"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-[15px] text-white">
              #{i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-bold text-ink">{salon.name}</h3>
                {salon.category && (
                  <span className="rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold capitalize text-brand-700">
                    {salon.category}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
                {salon.rating != null && <Stars rating={salon.rating} />}
                <span className="text-ink-muted">
                  ({salon.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              {salon.address && (
                <p className="mt-1 truncate text-[13px] text-ink-muted">{salon.address}</p>
              )}
              <a
                href={salon.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-[13px] font-semibold text-brand-700 hover:underline"
              >
                View report →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
