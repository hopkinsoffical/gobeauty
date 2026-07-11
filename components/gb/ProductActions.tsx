"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isProductSaved, saveProduct, unsaveProduct } from "@/lib/profile/actions";
import type { Dupe } from "@/lib/gbApi";

const LOCAL_KEY = "gb:saved-products";

// Guest fallback: saves live in localStorage when there's no signed-in
// profile, so the button always works without navigating anywhere.
function localSaved(): Record<string, { name: string; brand: string }> {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "{}");
  } catch {
    return {};
  }
}
function setLocalSaved(map: Record<string, { name: string; brand: string }>) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
  } catch {
    /* storage full/blocked — ignore */
  }
}

export default function ProductActions({
  slug,
  name,
  brand,
  imageUrl,
  dupes,
}: {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  dupes: Dupe[];
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    if (localSaved()[slug]) setSaved(true);
    else void isProductSaved(slug).then((v) => v && setSaved(true));
  }, [slug]);

  const toggleSave = async () => {
    if (saving) return;
    setSaving(true);
    const next = !saved;
    setSaved(next); // optimistic — the button must respond without navigation
    let profileOk = false;
    try {
      const r = next
        ? await saveProduct({ product_slug: slug, product_name: name, brand, image_url: imageUrl })
        : await unsaveProduct(slug);
      profileOk = r.ok === true;
    } catch {
      /* signed-out or network error — fall through to the local copy */
    }
    const map = localSaved();
    if (next && !profileOk) map[slug] = { name, brand }; // guest save
    if (!next) delete map[slug]; // unsave clears any guest copy too
    setLocalSaved(map);
    setSaving(false);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`inline-flex h-11 items-center gap-2 rounded-full px-6 text-[14.5px] font-semibold transition ${
            saved
              ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setShowCompare((v) => !v)}
          aria-expanded={showCompare}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-6 text-[14.5px] font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 1.5v21" />
          </svg>
          Compare
        </button>
      </div>

      {showCompare && (
        <div className="mt-3 rounded-2xl border border-line bg-white p-2 shadow-card">
          {dupes.length === 0 ? (
            <p className="px-3 py-3 text-sm text-ink-muted">
              No similar products found yet.
            </p>
          ) : (
            <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Similar products
            </p>
          )}
          {dupes.length > 0 && (
            <ul>
              {dupes.map((d) => (
                <li
                  key={d.slug}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-surface-soft"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg bg-surface-soft">
                    {d.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.images[0].url}
                        alt={d.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span aria-hidden>🧴</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                      {d.brand}
                    </p>
                    <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                    <p className="text-xs text-ink-faint">
                      {Math.round(d.similarity * 100)}% match · {d.sharedIngredients} shared
                    </p>
                  </div>
                  <Link
                    href={`/compare?a=${slug}&b=${d.slug}`}
                    aria-label={`Compare ${name} with ${d.brand} ${d.name}`}
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line bg-white text-lg font-semibold text-ink-soft transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                  >
                    +
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/compare?a=${slug}`}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border-t border-line/70 px-3 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            Compare with any product →
          </Link>
        </div>
      )}
    </div>
  );
}
