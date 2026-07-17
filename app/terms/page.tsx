import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of GoBeauty AI, including the GoBeauty AI SMS program.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms of Service"
      title="The terms for using GoBeauty AI."
      summary="These terms cover your use of our website, AI beauty tools, marketplace features, accounts, and text messaging program."
      updated="July 17, 2026"
    >
      <h2>1. Acceptance of these terms</h2>
      <p>
        These Terms of Service (“Terms”) form an agreement between you and
        GoBeauty, Inc. (“GoBeauty AI,” “GoBeauty,” “we,” “us,” or “our”). By
        accessing or using gobeauty.ai or our related services, you agree to
        these Terms and our <a href="/privacy">Privacy Policy</a>. If you do not
        agree, do not use the service.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <p>
        You must be legally able to enter into this agreement. You are
        responsible for information submitted through your account, maintaining
        access to your phone number, and notifying us of unauthorized use. You
        agree to provide accurate information and not impersonate another
        person or business.
      </p>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
          GoBeauty AI SMS Program
        </p>
        <h3 className="!mt-1 text-brand-900">Text messaging terms</h3>
        <p>
          By providing your phone number and checking the SMS consent box on
          our SMS consent page, you agree to receive recurring text messages
          from GoBeauty regarding salon industry news, product recommendations,
          supplier updates, and promotional offers.
        </p>
        <ul>
          <li>Message frequency varies.</li>
          <li>Message and data rates may apply.</li>
          <li>Reply STOP at any time to unsubscribe.</li>
          <li>Reply HELP for help, or call +1 (877) 600-1886.</li>
          <li>Consent is not a condition of purchase.</li>
          <li>Carriers are not liable for delayed or undelivered messages.</li>
        </ul>
      </div>

      <h2>3. SMS consent and opt-out</h2>
      <p>
        Your SMS consent applies only to GoBeauty AI and the message types
        disclosed at the point of opt-in. We do not use your acceptance of these
        Terms as a substitute for SMS consent. You must take the separate,
        affirmative action shown in the opt-in flow.
      </p>
      <p>
        After you reply STOP, we may send one final message confirming your
        opt-out. You may need to opt in again before requesting another
        verification code. For help, reply HELP or call{" "}
        <a href="tel:+18776001886">+1 (877) 600-1886</a>. Supported carriers and
        message delivery may vary.
      </p>

      <h2>4. GoBeauty AI services</h2>
      <p>
        GoBeauty AI offers beauty discovery, image analysis, local professional
        information, product content, marketplace inquiries, and related tools.
        Features may change, be limited, or be discontinued. We do not guarantee
        that every recommendation, listing, price, availability, or result is
        complete or current.
      </p>

      <h2>5. AI and beauty information disclaimer</h2>
      <p>
        AI-generated analysis and other content are provided for general
        informational and discovery purposes. They are not medical advice,
        diagnosis, or treatment and should not replace advice from a qualified
        healthcare or beauty professional. Results may contain errors. Consider
        allergies, sensitivities, product instructions, and professional advice
        before acting on a recommendation.
      </p>

      <h2>6. Marketplace and third parties</h2>
      <p>
        Beauty professionals, brands, suppliers, merchants, and linked websites
        are independent third parties. GoBeauty does not control and is not
        responsible for their services, products, statements, availability, or
        conduct. Any transaction or appointment with a third party is between
        you and that third party unless we expressly state otherwise.
      </p>

      <h2>7. Your content</h2>
      <p>
        You retain ownership of content you submit. You grant GoBeauty a
        worldwide, non-exclusive license to host, process, reproduce, and
        display that content as needed to operate, improve, and secure the
        service. You represent that you have the necessary rights and
        permissions to submit the content.
      </p>

      <h2>8. Acceptable use</h2>
      <p>You may not:</p>
      <ul>
        <li>Use the service for unlawful, fraudulent, or harmful activity.</li>
        <li>
          Upload content that infringes rights, violates privacy, or contains
          malicious code.
        </li>
        <li>
          Scrape, reverse engineer, disrupt, overload, or bypass security or
          access controls.
        </li>
        <li>
          Misrepresent affiliation with GoBeauty or use our service to send
          unsolicited messages.
        </li>
      </ul>

      <h2>9. Intellectual property</h2>
      <p>
        The service, software, design, branding, and GoBeauty-provided content
        are owned by GoBeauty or its licensors and protected by applicable law.
        These Terms do not grant you rights to our trademarks or other
        intellectual property except for the limited right to use the service.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        To the extent permitted by law, the service is provided “as is” and “as
        available,” without warranties of any kind, express or implied. We do
        not warrant uninterrupted operation, error-free content, or specific
        outcomes from recommendations, products, professionals, or marketplace
        interactions.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the extent permitted by law, GoBeauty and its officers, employees,
        affiliates, and service providers will not be liable for indirect,
        incidental, special, consequential, exemplary, or punitive damages, or
        loss of data, profits, goodwill, or opportunities arising from your use
        of the service.
      </p>

      <h2>12. Suspension and termination</h2>
      <p>
        You may stop using the service at any time. We may suspend or terminate
        access when reasonably necessary to protect users, comply with law,
        prevent abuse, or enforce these Terms. Provisions that by their nature
        should survive termination will remain in effect.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these Terms as the service or legal requirements change.
        The revised version will be posted here with a new “Last updated” date.
        Continued use after an update means you accept the revised Terms.
      </p>

      <h2>14. Contact and customer care</h2>
      <p>
        For questions about these Terms or the GoBeauty AI SMS Program, call{" "}
        <a href="tel:+18776001886">+1 (877) 600-1886</a>. For SMS assistance,
        reply HELP to the number that sent you the message.
      </p>
    </LegalPageShell>
  );
}
