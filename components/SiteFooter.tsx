import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-line-soft bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/gobeauty-logo.png"
                alt="goBeauty.ai"
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-muted">
              The AI-native beauty discovery platform. Get the look you want — DIY, book a pro, or shop the right products.
            </p>
            <div className="mt-4 flex gap-3">
              {["𝕏", "IG", "TT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-[12px] font-bold text-ink-muted transition hover:border-brand-300 hover:text-brand-500"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Platform"
            items={[
              { label: "Get This Look", href: "#get-this-look" },
              { label: "Find a Service", href: "#services" },
              { label: "DIY Guides", href: "#diy" },
              { label: "Shop Products", href: "#shop-products" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { label: "About", href: "#about" },
              { label: "How it Works", href: "#how-it-works" },
              { label: "Press", href: "/press" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <FooterCol
            title="For Businesses"
            items={[
              { label: "Claim Your Profile", href: "#for-businesses" },
              { label: "Free Visibility Checkup", href: "#for-businesses" },
              { label: "Pricing", href: "/pricing" },
              { label: "Business FAQ", href: "/business-faq" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-6 text-[13px] text-ink-muted md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} GoBeauty, Inc. All rights reserved.</div>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/cookies" className="hover:text-ink">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">{title}</h3>
      <ul className="mt-3 space-y-2.5 text-[14px] text-ink-soft">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href} className="transition hover:text-ink">{it.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
