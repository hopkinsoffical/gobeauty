import Link from "next/link";

export default function OwnerCTA({ city, state }: { city: string; state: string }) {
  return (
    <section id="owner-cta" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="relative grid overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-[#1d2531] p-8 text-white md:grid-cols-[1.4fr_1fr] md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-brand-600/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/3 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-3xl"
          />

          <div className="relative">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-200">
              For salon owners
            </p>
            <h2 className="font-display text-[30px] leading-[1.15] tracking-tight md:text-[40px]">
              Own or manage a salon in {city}?
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75 md:text-[17px]">
              See how your salon compares with nearby competitors in {city},{" "}
              {state} — and what you can improve to get more calls, bookings,
              and Google visibility.
            </p>

            <ul className="mt-5 grid gap-2 text-[14px] text-white/80 sm:grid-cols-2">
              <Bullet>Side-by-side competitor scorecard</Bullet>
              <Bullet>Top 3 actions to climb the ranking</Bullet>
              <Bullet>Review velocity & sentiment analysis</Bullet>
              <Bullet>Delivered in under 2 minutes</Bullet>
            </ul>
          </div>

          <div className="relative mt-8 flex flex-col items-start gap-3 md:mt-0 md:items-end md:justify-center">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-pill bg-gradient-to-br from-brand-400 to-brand-600 px-7 py-3.5 text-[15.5px] font-bold text-white shadow-[0_8px_24px_rgba(225,29,72,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(225,29,72,0.45)]"
            >
              Get Free Growth Report
              <span aria-hidden>→</span>
            </Link>
            <p className="text-[12.5px] text-white/55">
              No credit card · Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand-500/20 text-brand-200"
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
          <path
            d="M2.5 6.5L5 9L9.5 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}
