"use client";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

function maskUser(name: string) {
  if (name.length <= 3) return name[0] + "***";
  return name[0] + "***" + name.slice(-2);
}

const CARDS = [
  { emoji: "💅", title: "Clean girl nails", user: "je***a_p", tag: "🔥 Hot", bg: "from-rose-100 via-pink-50 to-white" },
  { emoji: "✨", title: "Glass skin glow", user: "sk***_99", tag: "Trending", bg: "from-amber-50 via-orange-50 to-white" },
  { emoji: "💇", title: "Curtain bangs", user: "ha***lo2", tag: "🔥 Hot", bg: "from-purple-100 via-pink-50 to-white" },
  { emoji: "🌿", title: "No-heat waves", user: "na***ral", tag: "Your search", bg: "from-emerald-50 via-teal-50 to-white" },
  { emoji: "🫧", title: "Dewy makeup", user: "gl***w88", tag: "Trending", bg: "from-sky-50 via-blue-50 to-white" },
  { emoji: "🎀", title: "Soft girl blush", user: "ro***_bk", tag: "🔥 Hot", bg: "from-pink-100 via-rose-50 to-white" },
  { emoji: "👁️", title: "Fox eye liner", user: "ev***_23", tag: "Trending", bg: "from-violet-100 via-purple-50 to-white" },
  { emoji: "🌸", title: "Cherry lip tint", user: "ch***y01", tag: "🔥 Hot", bg: "from-red-50 via-pink-50 to-white" },
  { emoji: "🌊", title: "Beach hair texture", user: "su***mer", tag: "Trending", bg: "from-cyan-50 via-sky-50 to-white" },
  { emoji: "🦋", title: "Butterfly lashes", user: "la***h_x", tag: "🔥 Hot", bg: "from-indigo-50 via-blue-50 to-white" },
  { emoji: "🍑", title: "Peach toned skin", user: "sk***n42", tag: "Trending", bg: "from-orange-50 via-amber-50 to-white" },
  { emoji: "💫", title: "Highlighted cheeks", user: "bl***sh9", tag: "Your search", bg: "from-yellow-50 via-amber-50 to-white" },
];

// Split into two rows
const ROW_A = CARDS.slice(0, 6);
const ROW_B = CARDS.slice(6, 12);

const EXAMPLES = [
  "Clean girl nails for work",
  "Glass skin routine",
  "Frizzy hair, smoother look",
  "TikTok nail trend",
  "Best facial near me",
];

function MarqueeRow({ items, reverse = false }: { items: typeof ROW_A; reverse?: boolean }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((card, i) => (
          <div
            key={i}
            className="w-[160px] flex-shrink-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:shadow-cardHover sm:w-[180px]"
          >
            {/* Image area */}
            <div className={`h-[130px] w-full bg-gradient-to-br ${card.bg} flex items-center justify-center sm:h-[150px]`}>
              <span className="text-5xl">{card.emoji}</span>
            </div>
            {/* Info */}
            <div className="px-3 py-2.5">
              <div className="mb-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold text-brand-600">
                {card.tag}
              </div>
              <p className="truncate text-[13px] font-semibold text-ink">{card.title}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-faint">@{card.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { user, openAuth } = useAuth();

  function handleUploadClick() {
    if (!user) { openAuth("sign-up"); return; }
    fileRef.current?.click();
  }

  return (
    <section id="hero" aria-labelledby="hero-h1" className="relative overflow-hidden">
      {/* Blush backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-brand-50 via-brand-50/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-brand-200/40 to-amber-100/20 blur-3xl"
      />

      {/* ── TOP: centered search ── */}
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center md:pt-20">
        <h1
          id="hero-h1"
          className="font-display text-[2.4rem] leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-[3.4rem]"
        >
          Get the beauty look<br />
          <span className="text-brand-500">you want.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink-soft md:text-[17px]">
          Upload a look, describe your goal, or search — we'll tell you whether to DIY, book a pro, or shop the right products.
        </p>

        {/* Search bar */}
        <div className="mt-8">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-card ring-1 ring-transparent transition focus-within:border-brand-300 focus-within:ring-brand-100">
            {/* Search icon */}
            <svg className="h-5 w-5 flex-shrink-0 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65z" />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe a look, style, or beauty goal..."
              className="flex-1 bg-transparent text-[15px] text-ink placeholder-ink-faint outline-none"
              aria-label="Search beauty looks"
            />

            {/* Image upload — requires login */}
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex-shrink-0 rounded-xl p-1.5 text-ink-muted transition hover:bg-surface-tint hover:text-ink"
              aria-label="Upload an image"
              title={user ? "Upload a photo" : "Sign up to upload"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-hidden />

            <button className="flex-shrink-0 rounded-xl bg-brand-500 px-4 py-1.5 text-[13.5px] font-semibold text-white transition hover:bg-brand-600">
              Search
            </button>
          </div>

          {/* Trending chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="rounded-pill border border-line bg-white px-3 py-1 text-[12px] text-ink-soft shadow-sm transition hover:border-brand-300 hover:text-ink"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: scrolling feed ── */}
      <div className="pb-16 pt-2">
        <p className="mb-4 px-5 text-center text-[12.5px] font-semibold uppercase tracking-widest text-ink-faint">
          Trending &amp; Recent Searches
        </p>
        <div className="flex flex-col gap-4">
          <MarqueeRow items={ROW_A} />
          <MarqueeRow items={ROW_B} reverse />
        </div>
      </div>
    </section>
  );
}
