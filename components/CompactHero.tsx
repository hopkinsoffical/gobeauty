"use client";

import { useAuth } from "@/lib/auth/useAuth";

const HERO_CARDS = [
  { src: "/assets/nail_13_burgundy.jpg", title: "Burgundy French", tag: { label: "🔥 Hot", kind: "hot" } },
  { src: "/assets/nail_05_3d_cherry.jpg", title: "3D Cherry", tag: { label: "Trending", kind: "trending" } },
  { src: "/assets/salon_07_pink_chandelier.jpg", title: "Find a pro", tag: { label: "Salon", kind: "pro" } },
];

export default function CompactHero() {
  const { openAuth } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff5f7] via-[#faf7fc] to-transparent">
      {/* decorative blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[100px] -top-[120px] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 168, 199, 0.30) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr]">
        {/* Copy */}
        <div>
          <span className="mb-4 inline-block rounded-pill bg-brand-500/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-brand-600">
            AI beauty decision engine
          </span>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-tight md:text-[3.4rem]">
            Get the <span className="text-brand-500">beauty look</span>
            <br /> you want.
          </h1>
          <p className="mt-4 max-w-[520px] text-[17px] text-ink-soft">
            Upload a look, describe a goal, or pick a service. We&apos;ll show
            you whether to DIY, book a pro, or shop the right products.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => openAuth("sign-in")}
              className="rounded-pill bg-brand-500 px-[18px] py-[9px] text-[13.5px] font-semibold text-white shadow-[0_4px_12px_rgba(232,90,130,0.25)] transition hover:bg-brand-600"
            >
              📷 Upload a look
            </button>
            <button
              type="button"
              className="rounded-pill border border-line bg-white px-[18px] py-[9px] text-[13.5px] font-semibold text-ink transition hover:bg-surface-tint"
            >
              ✨ Describe a goal
            </button>
            <button
              type="button"
              className="rounded-pill border border-line bg-white px-[18px] py-[9px] text-[13.5px] font-semibold text-ink transition hover:bg-surface-tint"
            >
              📍 Find pros near me
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-muted">
            <span>★★★★★ 4.9</span>
            <span>·</span>
            <span>120k looks decoded</span>
            <span>·</span>
            <span>23k pros matched</span>
          </div>
        </div>

        {/* 3-card horizontal collage */}
        <div className="flex justify-end">
          <div className="flex w-full max-w-[440px] gap-2.5">
            {HERO_CARDS.map((c, i) => (
              <a
                key={c.title}
                href="#feed"
                className="group flex-1 overflow-hidden rounded-[18px] bg-white shadow-[0_6px_18px_rgba(20,12,36,0.10),0_12px_32px_rgba(20,12,36,0.06)] transition hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.src}
                  alt={c.title}
                  className="aspect-[3/4] w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="px-2.5 pb-3 pt-2.5">
                  <strong className="mb-1 block text-[12.5px] text-ink">
                    {c.title}
                  </strong>
                  <Tag kind={c.tag.kind} label={c.tag.label} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ kind, label }: { kind: string; label: string }) {
  const cls =
    kind === "hot"
      ? "bg-[#fff0ec] text-[#d94545]"
      : kind === "trending"
      ? "bg-[#f0f5ff] text-[#3559e0]"
      : "bg-[#f1ebff] text-[#5b3ec9]";
  return (
    <span
      className={`inline-block rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${cls}`}
    >
      {label}
    </span>
  );
}
