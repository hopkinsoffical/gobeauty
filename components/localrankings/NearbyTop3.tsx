"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SalonCard, TopSalonsResult } from "@/lib/gbApi";

// Category chips map to the canonical buckets the salons API understands
// (salon_ai_leaderboard category values are messy; the API normalizes).
const CATEGORIES = [
  { key: "", label: "All services" },
  { key: "nail-salon", label: "Nail Salon" },
  { key: "hair-salon", label: "Hair Salon" },
  { key: "beauty-salon", label: "Beauty Salon" },
  { key: "spa", label: "Spa & Massage" },
  { key: "barber", label: "Barber" },
  { key: "skin-care", label: "Skin Care" },
];

const QUICK_CITIES = [
  { town: "New York", state: "NY" },
  { town: "Brooklyn", state: "NY" },
  { town: "Edison", state: "NJ" },
  { town: "Los Angeles", state: "CA" },
];

interface Loc {
  town: string;
  state: string;
  zip3: string;
  label: string;
}

const SCOPE_NOTE: Record<TopSalonsResult["scope"], string | null> = {
  town: null,
  area: "Not enough listings in your city yet — showing the best in your wider area.",
  state: "Not enough listings nearby yet — showing the best in your state.",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
      <span className="text-amber-500" aria-hidden>
        ★
      </span>
      {rating.toFixed(1)}
    </span>
  );
}

function SalonCardRow({ salon, rank }: { salon: SalonCard; rank: number }) {
  const isTop = rank === 1;
  return (
    <article
      className={`group relative flex gap-4 rounded-2xl border bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover sm:p-5 ${
        isTop ? "border-amber-200" : "border-line"
      }`}
    >
      <div
        className={`flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-[16px] leading-none shadow-sm ${
          isTop
            ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white"
            : "bg-surface-soft text-ink"
        }`}
        aria-label={`Ranked #${rank}`}
      >
        #{rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-[16.5px] font-bold leading-tight text-ink sm:text-[18px]">
            {salon.name}
          </h3>
          {salon.category && (
            <span className="inline-flex items-center rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11.5px] font-bold capitalize tracking-wide text-brand-700">
              {salon.category}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-ink-soft">
          {salon.rating !== null && <Stars rating={salon.rating} />}
          <span className="text-ink-muted">
            ({salon.reviewCount.toLocaleString()} reviews)
          </span>
          {salon.aiScore !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 px-2.5 py-0.5 text-[12px] font-semibold text-amber-900">
              <span className="font-medium text-amber-700">AI Score</span>
              {salon.aiScore.toFixed(1)}
            </span>
          )}
        </div>
        {salon.address && (
          <p className="mt-1.5 truncate text-[13px] text-ink-muted">
            {salon.address}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-2">
          <a
            href={salon.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-ink-soft"
          >
            View visibility report
          </a>
          {salon.website && (
            <a
              href={salon.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="rounded-pill border border-line bg-white px-4 py-1.5 text-[12.5px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function NearbyTop3() {
  const [loc, setLoc] = useState<Loc | null>(null);
  const [category, setCategory] = useState("");
  const [manual, setManual] = useState("");
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TopSalonsResult | null>(null);
  const reqSeq = useRef(0);

  const fetchTop = useCallback(async (l: Loc, cat: string) => {
    const seq = ++reqSeq.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (l.town) params.set("town", l.town);
      if (l.state) params.set("state", l.state);
      if (l.zip3) params.set("zip3", l.zip3);
      if (cat) params.set("category", cat);
      const res = await fetch(`/api/salons?${params.toString()}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as TopSalonsResult;
      if (seq === reqSeq.current) setResult(data);
    } catch {
      if (seq === reqSeq.current)
        setError("Couldn't load rankings — please try again.");
    } finally {
      if (seq === reqSeq.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loc) void fetchTop(loc, category);
  }, [loc, category, fetchTop]);

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location — enter your city below.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Free client-side reverse geocode (no key). We only need
          // city + state + ZIP; coordinates never leave the browser
          // except for this lookup.
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`,
          );
          const geo = await res.json();
          const town: string = geo.city || geo.locality || "";
          const state: string = (geo.principalSubdivisionCode || "")
            .split("-")
            .pop() || "";
          const zip3: string = (geo.postcode || "").slice(0, 3);
          if (!town && !zip3 && !state) {
            setError("Couldn't resolve your city — enter it below instead.");
          } else {
            setLoc({
              town,
              state,
              zip3,
              label: town ? `${town}${state ? `, ${state}` : ""}` : state,
            });
          }
        } catch {
          setError("Couldn't resolve your location — enter your city below.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError(
          "Location was blocked — no problem, enter your city or ZIP below.",
        );
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = manual.trim();
    if (!raw) return;
    setError(null);
    if (/^\d{5}(-\d{4})?$/.test(raw)) {
      setLoc({ town: "", state: "", zip3: raw.slice(0, 3), label: `ZIP ${raw.slice(0, 5)}` });
      return;
    }
    const [town, state = ""] = raw.split(",").map((s) => s.trim());
    setLoc({
      town,
      state: state.toUpperCase().slice(0, 2),
      zip3: "",
      label: state ? `${town}, ${state.toUpperCase().slice(0, 2)}` : town,
    });
  };

  return (
    <section className="mx-auto max-w-[1000px] px-5 pb-4" id="near-you">
      <div className="rounded-3xl border border-line bg-white p-5 shadow-card md:p-7">
        <h2 className="font-display text-[1.5rem] leading-tight text-ink md:text-[1.9rem]">
          The best 3 salons near you
        </h2>
        <p className="mt-1.5 max-w-[560px] text-[14.5px] text-ink-soft">
          Share your location and we&apos;ll rank the top salons around you by
          real reviews and ratings — pick a service to narrow it down.
        </p>

        {/* Location controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={shareLocation}
            disabled={locating}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-brand-500 px-5 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.28)] transition hover:bg-brand-600 disabled:opacity-60"
          >
            <svg
              className="h-[17px] w-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11z"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {locating
              ? "Locating…"
              : loc
                ? `Near ${loc.label}`
                : "Share my location"}
          </button>
          <span className="text-[13px] text-ink-muted">or</span>
          <form onSubmit={submitManual} className="flex min-w-0 flex-1 gap-2">
            <input
              type="text"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="City, ST or ZIP — e.g. Edison, NJ"
              className="h-11 min-w-0 flex-1 rounded-pill border border-line bg-white px-4 text-[14px] text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-300"
            />
            <button
              type="submit"
              className="h-11 rounded-pill border border-line bg-white px-4 text-[13.5px] font-semibold text-ink transition hover:bg-surface-tint"
            >
              Go
            </button>
          </form>
        </div>

        {/* Quick cities (shown until a location is picked) */}
        {!loc && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] text-ink-muted">Popular:</span>
            {QUICK_CITIES.map((c) => (
              <button
                key={`${c.town}-${c.state}`}
                type="button"
                onClick={() =>
                  setLoc({
                    town: c.town,
                    state: c.state,
                    zip3: "",
                    label: `${c.town}, ${c.state}`,
                  })
                }
                className="rounded-pill border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
              >
                {c.town}, {c.state}
              </button>
            ))}
          </div>
        )}

        {/* Category chips */}
        {loc && (
          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Service category">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={category === c.key}
                onClick={() => setCategory(c.key)}
                className={`rounded-pill px-3.5 py-2 text-[13px] font-semibold transition ${
                  category === c.key
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-[13.5px] font-medium text-rose-700">
            {error}
          </p>
        )}

        {/* Results */}
        {loc && (
          <div className="mt-5" aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-[120px] animate-pulse rounded-2xl bg-surface-soft"
                  />
                ))}
              </div>
            ) : result && result.salons.length > 0 ? (
              <>
                {SCOPE_NOTE[result.scope] && (
                  <p className="mb-3 text-[13px] font-medium text-ink-muted">
                    {SCOPE_NOTE[result.scope]}
                  </p>
                )}
                <ol className="space-y-3">
                  {result.salons.map((s, i) => (
                    <li key={s.slug}>
                      <SalonCardRow salon={s} rank={i + 1} />
                    </li>
                  ))}
                </ol>
              </>
            ) : result ? (
              <p className="rounded-xl bg-surface-soft px-4 py-4 text-[14px] text-ink-soft">
                No ranked salons found for {loc.label} yet — try a nearby city
                or a different service.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
