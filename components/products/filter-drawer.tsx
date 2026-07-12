"use client";

import { useEffect, useId, useRef } from "react";
import { FILTERS } from "@/data/products-landing";
import { FilterIcon, IconX } from "@/components/products/icons";
import { buildProductsHref, toggleFilter } from "@/lib/products-url";
import { useRouter } from "next/navigation";

export default function FilterDrawer({
  open,
  onClose,
  active,
  q,
  category,
}: {
  open: boolean;
  onClose: () => void;
  active: string[];
  q: string;
  category: string;
}) {
  const router = useRouter();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const apply = (key: string) => {
    router.push(
      buildProductsHref({
        q,
        category: category || undefined,
        filters: toggleFilter(active, key),
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-cardHover motion-safe:animate-in max-md:mt-auto max-md:h-[min(88vh,640px)] max-md:rounded-t-3xl md:h-full md:rounded-none"
      >
        <header className="flex items-center justify-between border-b border-[var(--beauty-border)] px-5 py-4">
          <h2 id={titleId} className="font-display text-xl text-[var(--beauty-text)]">
            More filters
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--beauty-muted)] transition hover:bg-[var(--beauty-pink-light)] hover:text-[var(--beauty-pink)]"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-sm text-[var(--beauty-muted)]">
            Select any combination. Filters apply to the product library instantly.
          </p>
          <ul className="flex flex-col gap-2">
            {FILTERS.map((f) => {
              const on = active.includes(f.key);
              return (
                <li key={f.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => apply(f.key)}
                    className={[
                      "flex w-full min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[14.5px] font-semibold transition",
                      on
                        ? "border-[var(--beauty-pink)] bg-[var(--beauty-pink-light)] text-[var(--beauty-pink-dark)]"
                        : "border-[var(--beauty-border)] bg-white text-[var(--beauty-text)] hover:border-brand-200",
                    ].join(" ")}
                  >
                    <FilterIcon name={f.icon} className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="flex-1">{f.label}</span>
                    <span
                      className={[
                        "h-4 w-4 rounded-full border-2",
                        on
                          ? "border-[var(--beauty-pink)] bg-[var(--beauty-pink)]"
                          : "border-[var(--beauty-border)]",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <footer className="border-t border-[var(--beauty-border)] p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--beauty-pink)] text-sm font-semibold text-white transition hover:bg-[var(--beauty-pink-dark)]"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
