import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="GoBeauty home"
            className="flex items-center gap-1.5"
          >
            <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm" />
            <span className="text-lg font-extrabold tracking-tight text-ink">
              glow
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                go
              </span>
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-[14.5px] font-medium text-ink-soft md:flex"
          >
            <Link href="#top-salons" className="hover:text-ink">
              Top salons
            </Link>
            <Link href="#how-we-rank" className="hover:text-ink">
              How we rank
            </Link>
            <Link href="#faq" className="hover:text-ink">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="#owner-cta"
            className="hidden rounded-pill border border-line px-3.5 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink sm:inline-block"
          >
            For salon owners
          </Link>
          <Link
            href="#owner-cta"
            className="rounded-pill bg-ink px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ink-soft"
          >
            Get Free Growth Report
          </Link>
        </div>
      </div>
    </header>
  );
}
