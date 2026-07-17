import Link from "next/link";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updated: string;
  children: React.ReactNode;
};

export default function LegalPageShell({
  eyebrow,
  title,
  summary,
  updated,
  children,
}: LegalPageShellProps) {
  return (
    <div className="bg-[#fffaf9]">
      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#fff5ed]">
        <div className="mx-auto max-w-[980px] px-5 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>／</span>
            <span className="text-ink">{eyebrow}</span>
          </nav>
          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-600">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-[1.08] text-ink md:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-soft md:text-[16px]">
            {summary}
          </p>
          <div className="mt-6 inline-flex rounded-pill border border-brand-100 bg-white/80 px-4 py-2 text-[12px] font-semibold text-ink-muted shadow-card">
            Last updated: {updated}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[980px] gap-8 px-5 py-10 md:grid-cols-[220px_minmax(0,1fr)] md:py-14">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
              Legal
            </p>
            <div className="mt-3 grid gap-1 text-[13.5px] font-semibold">
              <Link
                href="/sms-consent"
                className="rounded-lg px-3 py-2 text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
              >
                SMS Consent
              </Link>
              <Link
                href="/privacy"
                className="rounded-lg px-3 py-2 text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="rounded-lg px-3 py-2 text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
              >
                Terms of Service
              </Link>
            </div>
            <div className="mt-4 border-t border-line-soft pt-4 text-[12px] leading-relaxed text-ink-muted">
              SMS support
              <a
                href="tel:+18776001886"
                className="mt-1 block font-bold text-brand-600 hover:underline"
              >
                +1 (877) 600-1886
              </a>
            </div>
          </div>
        </aside>

        <article className="min-w-0 rounded-3xl border border-line bg-white px-6 py-7 shadow-card md:px-10 md:py-10">
          <div className="legal-copy">{children}</div>
        </article>
      </section>
    </div>
  );
}
