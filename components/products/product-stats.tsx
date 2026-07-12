import { PLATFORM_STATS } from "@/data/products-landing";
import { StatIcon } from "@/components/products/icons";

export default function ProductStats() {
  return (
    <div className="rounded-3xl border border-[var(--beauty-border)] bg-white p-5 shadow-cardHover sm:p-6 md:p-7">
      <ul className="grid gap-5 sm:grid-cols-3 sm:gap-0">
        {PLATFORM_STATS.map((stat, i) => (
          <li
            key={stat.label}
            className={[
              "flex items-start gap-3 sm:px-6",
              i > 0 ? "sm:border-l sm:border-[var(--beauty-border)]" : "",
            ].join(" ")}
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--beauty-pink-light)] text-[var(--beauty-pink)]">
              <StatIcon name={stat.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-[var(--beauty-text)] md:text-[28px]">
                {stat.value}
              </p>
              <p className="text-[14px] font-semibold text-[var(--beauty-text)]">{stat.label}</p>
              <p className="text-[13px] text-[var(--beauty-muted)]">{stat.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
