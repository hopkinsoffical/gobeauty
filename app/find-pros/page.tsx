import type { Metadata } from "next";
import FindProsShell from "@/components/findpros/FindProsShell";
import { SALONS_EDISON_NJ } from "@/lib/data/salons";

export const metadata: Metadata = {
  title: "Find Pros — best-fit beauty professionals near you",
  description:
    "Search salons, spas, med spas, lash studios, and beauty pros by service, style, and location. GoBeauty shows your Top 3 best-fit matches with evidence and confidence labels.",
  alternates: { canonical: "/find-pros" },
};

export default function FindProsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#fdeef3] to-transparent"
        />
        <div className="mx-auto max-w-[1000px] px-5 pb-6 pt-10 md:pt-14">
          <h1 className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.75rem]">
            Find your best-fit beauty pro.
          </h1>
          <p className="mt-3 max-w-[560px] text-[15.5px] leading-relaxed text-ink-soft">
            Salons, spas, med spas, lash studios, estheticians, and independent
            pros — matched by service, style, evidence, price clarity, and
            availability.
          </p>
        </div>
      </section>
      <FindProsShell salons={SALONS_EDISON_NJ} />
    </>
  );
}
