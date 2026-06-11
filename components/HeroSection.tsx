export default function HeroSection() {
  const examples = [
    "Clean girl nails for work",
    "Frizzy hair, smoother but not too expensive",
    "Glass skin routine",
    "A TikTok nail look I want to copy",
    "Best facial for dull skin near me",
  ];

  return (
    <section
      id="hero"
      aria-labelledby="hero-h1"
      className="relative overflow-hidden"
    >
      {/* Blush gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-brand-50 via-brand-50/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] top-[-8%] -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-brand-200/40 to-amber-100/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] bottom-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-brand-100/30 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 md:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy + search */}
          <div>
            <h1
              id="hero-h1"
              className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink md:text-6xl lg:text-[3.8rem]"
            >
              Get the beauty<br />
              look you want
              <span className="text-brand-500">.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-soft md:text-[18px]">
              Upload a look, describe your beauty goal, or search for a service.
              We&apos;ll show you the best path: DIY at home, book a professional,
              shop the right products, or maintain your result after service.
            </p>

            {/* AI Search input */}
            <div className="mt-8">
              <p className="mb-2.5 text-[13.5px] font-semibold text-ink">
                What beauty look or result do you want?
              </p>
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-card ring-1 ring-transparent transition focus-within:border-brand-300 focus-within:ring-brand-100">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-ink-faint"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Type your goal or desired look..."
                  className="flex-1 bg-transparent text-[15px] text-ink placeholder-ink-faint outline-none"
                  aria-label="Beauty goal search"
                />
                <button className="flex-shrink-0 rounded-xl bg-brand-500 px-4 py-1.5 text-[13.5px] font-semibold text-white transition hover:bg-brand-600">
                  Search
                </button>
              </div>

              {/* Example chips */}
              <p className="mt-3 text-[12.5px] font-medium text-ink-muted">Try these examples:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    className="rounded-pill border border-line bg-white px-3 py-1 text-[12.5px] text-ink-soft shadow-sm transition hover:border-brand-300 hover:text-ink"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Three CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-pill border border-ink/20 bg-white px-5 py-2.5 text-[14px] font-semibold text-ink shadow-sm transition hover:border-brand-400 hover:text-brand-600">
                <span>📷</span> Upload a Look
              </button>
              <button className="inline-flex items-center gap-2 rounded-pill border border-ink/20 bg-white px-5 py-2.5 text-[14px] font-semibold text-ink shadow-sm transition hover:border-brand-400 hover:text-brand-600">
                <span>✏️</span> Describe My Goal
              </button>
              <button className="inline-flex items-center gap-2 rounded-pill border border-ink/20 bg-white px-5 py-2.5 text-[14px] font-semibold text-ink shadow-sm transition hover:border-brand-400 hover:text-brand-600">
                <span>📍</span> Find Services Near Me
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-7 flex flex-wrap items-center gap-5 text-[12.5px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secure &amp; Private
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.575 1.575a3.75 3.75 0 01-5.303 0l-1.293-1.293a3.75 3.75 0 00-5.303 0L5 17.25" />
                </svg>
                AI-Powered Recommendations
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Trusted by Experts
              </span>
            </div>
          </div>

          {/* Right: AI Result Card mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-3xl border border-line bg-white p-5 shadow-cardHover">
              {/* Card header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">Your AI Result</span>
                <button className="text-ink-faint" aria-label="More options">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>
              </div>

              {/* Nail photo placeholder */}
              <div className="mb-4 h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 to-amber-50">
                <div className="flex h-full items-center justify-center">
                  <span className="text-5xl">💅</span>
                </div>
              </div>

              {/* Result info */}
              <p className="text-[12.5px] text-ink-muted">This look appears to be:</p>
              <p className="mt-0.5 text-[17px] font-bold text-ink">Clean Girl Nails</p>

              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-pill bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700">
                  DIY Difficulty: Medium
                </span>
              </div>

              <p className="mt-3 text-[12.5px] text-ink-soft">
                Salon for long-lasting gel finish / DIY for weekend look
              </p>

              {/* Tab actions */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {["DIY", "Book", "Shop", "Care"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`rounded-xl py-2 text-[12.5px] font-semibold transition ${
                      i === 0
                        ? "bg-brand-500 text-white"
                        : "bg-surface-tint text-ink-soft hover:bg-brand-100 hover:text-ink"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-3">
                <div className="flex -space-x-2">
                  {["#f88070", "#fb7185", "#f06b5d"].map((c, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-ink-muted">
                  Loved by <strong className="text-ink">20,000+</strong> beauty enthusiasts
                </span>
              </div>
            </div>

            {/* Decorative floating badge */}
            <div className="absolute -right-2 top-8 hidden rounded-2xl bg-white px-3.5 py-2.5 shadow-cardHover ring-1 ring-line-soft lg:block">
              <p className="text-[11px] font-semibold text-ink-muted">MATCH SCORE</p>
              <p className="text-[22px] font-extrabold text-brand-500">98%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
