"use client";

import { useState } from "react";

type CardTag = { label: string; kind: "hot" | "trending" | "easy" | "medium" | "pro" };

type Card = {
  src: string;
  title: string;
  meta: string;
  tags: CardTag[];
};

const CARDS: Card[] = [
  {
    src: "/assets/nail_13_burgundy.jpg",
    title: "Burgundy French with gold swirls",
    meta: "@na***_x · 12k saves",
    tags: [
      { label: "🔥 Hot", kind: "hot" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/nail_05_3d_cherry.jpg",
    title: "3D cherry almond art",
    meta: "@la***_x · 8.2k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/salon_07_pink_chandelier.jpg",
    title: "NK Beauty Nails · Edison NJ",
    meta: "@lo***_salon · 5.1k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Top rated", kind: "trending" },
    ],
  },
  {
    src: "/assets/salon_03_modern.jpg",
    title: "The Nails Bar · Jersey City",
    meta: "@mo***_bar · 4.7k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Book online", kind: "easy" },
    ],
  },
  {
    src: "/assets/nail_06_nude_shimmer.jpg",
    title: "Nude shimmer coffin",
    meta: "@sk***n42 · 6.8k saves",
    tags: [
      { label: "🔥 Hot", kind: "hot" },
      { label: "DIY · Medium", kind: "medium" },
    ],
  },
  {
    src: "/assets/nail_03_teal_starfish.jpg",
    title: "Teal starfish beach press-ons",
    meta: "@su***mer · 3.9k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "Shop · $28", kind: "easy" },
    ],
  },
  {
    src: "/assets/salon_01_relaxed.jpg",
    title: "Cozy Friday manicure",
    meta: "@ha***p_clients · 2.3k saves",
    tags: [{ label: "Lifestyle", kind: "trending" }],
  },
  {
    src: "/assets/nail_01_black.jpg",
    title: "Black aesthetic coffin",
    meta: "@da***_a · 1.8k saves",
    tags: [
      { label: "🔥 Hot", kind: "hot" },
      { label: "DIY · Medium", kind: "medium" },
    ],
  },
  {
    src: "/assets/salon_02_luxe.jpg",
    title: "The Luxe Nail Salon · Manhattan",
    meta: "@lu***_salon · 4.0k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Top rated", kind: "trending" },
    ],
  },
  {
    src: "/assets/salon_05_boho.jpg",
    title: "Mani & Pedi Studio · Brooklyn",
    meta: "@bo***_ho · 5.4k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Vibe check", kind: "trending" },
    ],
  },
  {
    src: "/assets/nail_04_canada.jpg",
    title: "Maple leaf chrome",
    meta: "@ca***_n · 3.1k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/salon_04_white_gold.jpg",
    title: "NK Beauty Nails · Princeton",
    meta: "@nk***_nails · 2.6k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Book online", kind: "easy" },
    ],
  },
  {
    src: "/assets/nail_08_floral.jpg",
    title: "Cream polka dot + 3D flower",
    meta: "@pr***_p · 7.1k saves",
    tags: [
      { label: "🔥 Hot", kind: "hot" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/salon_06_serene.jpg",
    title: "Spa nail retreat · Montclair",
    meta: "@se***_rene · 4.5k saves",
    tags: [
      { label: "Salon", kind: "pro" },
      { label: "Relaxing", kind: "trending" },
    ],
  },
  {
    src: "/assets/nail_09_yellow_floral.jpg",
    title: "Nude ombre + yellow 3D flowers",
    meta: "@ko***_u · 6.3k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "DIY · Medium", kind: "medium" },
    ],
  },
  {
    src: "/assets/nail_11_soccer.jpg",
    title: "World Cup '26 soccer nails",
    meta: "@sp***_rt · 1.9k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/nail_12_grad.jpg",
    title: "Class of '26 grad nails",
    meta: "@gr***_ad · 3.0k saves",
    tags: [
      { label: "Trending", kind: "trending" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
  {
    src: "/assets/nail_07_usa_flag.jpg",
    title: "Patriotic stars & stripes",
    meta: "@pa***_us · 4.2k saves",
    tags: [
      { label: "🔥 Hot", kind: "hot" },
      { label: "Pro · Salon", kind: "pro" },
    ],
  },
];

const PILLS = ["For you", "New", "DIY", "Salon", "Shop"];

const TAG_COLORS: Record<CardTag["kind"], string> = {
  hot: "bg-[#fff0ec] text-[#d94545]",
  trending: "bg-[#f0f5ff] text-[#3559e0]",
  easy: "bg-[#e9f7ef] text-[#1f7a4c]",
  medium: "bg-[#fff4d6] text-[#8a5a00]",
  pro: "bg-[#f1ebff] text-[#5b3ec9]",
};

export default function TrendingFeed() {
  const [active, setActive] = useState("For you");

  return (
    <section className="py-12" id="feed">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[2rem] font-extrabold leading-tight tracking-tight md:text-[2.25rem]">
            Trending now
          </h2>
          <div className="flex flex-wrap gap-2">
            {PILLS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActive(p)}
                className={[
                  "rounded-pill border px-3.5 py-1.5 text-[13px] font-semibold transition",
                  active === p
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-soft hover:bg-surface-tint",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CSS columns masonry */}
        <div
          className="gap-4"
          style={{
            columnCount: 6,
            columnGap: "16px",
          }}
        >
          <style jsx>{`
            @media (max-width: 1400px) {
              .masonry-cols {
                column-count: 5 !important;
              }
            }
            @media (max-width: 1200px) {
              .masonry-cols {
                column-count: 4 !important;
              }
            }
            @media (max-width: 1000px) {
              .masonry-cols {
                column-count: 3 !important;
              }
            }
            @media (max-width: 700px) {
              .masonry-cols {
                column-count: 2 !important;
              }
            }
          `}</style>
          <div className="masonry-cols" style={{ columnCount: 6, columnGap: "16px" }}>
            {CARDS.map((c) => (
              <article
                key={c.title}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[18px] bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.src}
                  alt={c.title}
                  loading="lazy"
                  className="block w-full bg-surface-tint"
                />
                <button
                  type="button"
                  aria-label="Save"
                  className="absolute right-3 top-3 -translate-y-1 rounded-pill bg-brand-500 px-3.5 py-1.5 text-[12.5px] font-bold text-white opacity-0 shadow-[0_4px_10px_rgba(232,90,130,0.30)] transition group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Save
                </button>
                <div className="px-3.5 pb-4 pt-3">
                  <h4 className="mb-1 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">
                    {c.title}
                  </h4>
                  <p className="mb-2 text-[12px] text-ink-faint">{c.meta}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <span
                        key={t.label}
                        className={`inline-block rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${TAG_COLORS[t.kind]}`}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-pill border border-line bg-white px-4 py-2 text-[13.5px] font-semibold text-ink transition hover:bg-surface-tint"
          >
            Showing 18 of 1,240 · Show more
          </button>
        </div>
      </div>
    </section>
  );
}
