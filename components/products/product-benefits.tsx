import { BENEFITS } from "@/data/products-landing";
import { BenefitIcon } from "@/components/products/icons";

export default function ProductBenefits() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-8" aria-labelledby="why-heading">
      <div className="rounded-[28px] border border-[var(--beauty-border)] bg-gradient-to-br from-[var(--beauty-blush)] via-white to-[var(--beauty-pink-light)] px-5 py-8 sm:px-8 sm:py-10 md:px-10">
        <h2
          id="why-heading"
          className="text-center font-display text-2xl text-[var(--beauty-text)] md:text-[28px]"
        >
          Why choose goBeauty.ai?
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {BENEFITS.map((b) => (
            <li key={b.title} className="text-center sm:text-left">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--beauty-pink)] shadow-sm sm:mx-0">
                <BenefitIcon name={b.icon} className="h-5 w-5" />
              </span>
              <h3 className="text-[15.5px] font-bold text-[var(--beauty-text)]">{b.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--beauty-muted)]">
                {b.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
