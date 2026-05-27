import Link from "next/link";

const CITIES = [
  "Edison, NJ",
  "Princeton, NJ",
  "Jersey City, NJ",
  "Hoboken, NJ",
  "Brooklyn, NY",
  "Queens, NY",
  "Cambridge, MA",
  "Bethesda, MD",
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line-soft bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm" />
              <span className="text-lg font-extrabold tracking-tight text-ink">
                Go
                <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  Beauty
                </span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[14px] text-ink-muted">
              The honest local ranking for nail salons. Built on Google data,
              real reviews, and an AI Growth Score.
            </p>
          </div>
          <FooterCol
            title="Cities"
            items={CITIES.map((c) => ({
              label: c,
              href: `/best-nail-salons/${c
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/-+$/, "")}`,
            }))}
          />
          <FooterCol
            title="Company"
            items={[
              { label: "About", href: "/about" },
              { label: "How we rank", href: "#how-we-rank" },
              { label: "Press", href: "/press" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <FooterCol
            title="For salons"
            items={[
              { label: "Get Free Growth Report", href: "#owner-cta" },
              { label: "Claim your salon", href: "#owner-cta" },
              { label: "Pricing", href: "/pricing" },
              { label: "Owner FAQ", href: "/owner-faq" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-6 text-[13px] text-ink-muted md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} GoBeauty, Inc.</div>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-[14px] text-ink-soft">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href} className="hover:text-ink">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
