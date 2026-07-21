import Link from "next/link";
import { PLATFORM_STATS } from "@/data/products-landing";
import { StatIcon } from "@/components/products/icons";

/** Map stat labels to listing pages so the summary strip is clickable. */
function statHref(label: string): string | null {
  const key = label.toLowerCase();
  if (key.includes("product")) return "/products?view=all";
  if (key.includes("brand")) return "/brands/explore";
  return null;
}

export default function ProductStats() {
  return (
    <div className="rounded-3xl border border-[var(--beauty-border)] bg-white p-5 shadow-cardHover sm:p-6 md:p-7">
      <ul className="grid gap-5 sm:grid-cols-3 sm:gap-0">
        {PLATFORM_STATS.map((stat, i) => {
          const href = statHref(stat.label);
          const body = (
            <>
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--beauty-pink-light)] text-[var(--beauty-pink)]">
                <StatIcon name={stat.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]">
                  {stat.value}
                </p>
                <p className="text-[14px] font-semibold text-[var(--beauty-text)]">
                  {stat.label}
                  {href && (
                    <span className="ml-1 text-[12px] font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
                      →
                    </span>
                  )}
                </p>
                <p className="text-[13px] text-[var(--beauty-muted)]">{stat.sub}</p>
              </div>
            </>
          );
          return (
            <li
              key={stat.label}
              className={[
                "flex items-start gap-3 sm:px-6",
                i > 0 ? "sm:border-l sm:border-[var(--beauty-border)]" : "",
              ].join(" ")}
            >
              {href ? (
                <Link
                  href={href}
                  className="group flex w-full items-start gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-start gap-3">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
