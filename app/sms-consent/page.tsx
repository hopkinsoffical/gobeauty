import type { Metadata } from "next";
import Link from "next/link";
import SmsConsentForm from "@/components/SmsConsentForm";

export const metadata: Metadata = {
  title: "SMS Consent — Stay Ahead of Beauty Trends",
  description:
    "Opt in to receive recurring SMS messages from GoBeauty about salon industry news, product recommendations, supplier updates, and promotional offers. Message frequency varies. Message & data rates may apply. Reply STOP to unsubscribe. Reply HELP for help.",
  alternates: { canonical: "/sms-consent" },
};

export default function SmsConsentPage() {
  return (
    <div className="bg-[#fffaf9]">
      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#fff5ed]">
        <div className="mx-auto max-w-[640px] px-5 py-10 md:py-14">
          <nav className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>／</span>
            <span className="text-ink">SMS Consent</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[640px] px-5 pb-14 pt-8 md:pb-20 md:pt-10">
        <SmsConsentForm />

        <p className="mt-6 text-center text-[12.5px] leading-relaxed text-ink-muted">
          No mobile information will be shared with third parties or affiliates
          for marketing or promotional purposes. Text messaging originator
          opt-in data and consent will not be shared with any third parties.
          For help, reply HELP or call{" "}
          <a
            href="tel:+18776001886"
            className="font-semibold text-brand-600 hover:underline"
          >
            +1 (877) 600-1886
          </a>
          .
        </p>
      </section>
    </div>
  );
}
