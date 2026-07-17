import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how GoBeauty AI collects, uses, protects, and shares information, including mobile and SMS consent data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy Policy"
      title="Your privacy, in plain language."
      summary="This policy explains what GoBeauty AI collects, why we collect it, and the choices you have—including how we protect mobile information and SMS consent."
      updated="July 17, 2026"
    >
      <h2>1. Overview</h2>
      <p>
        GoBeauty, Inc. (“GoBeauty AI,” “GoBeauty,” “we,” “us,” or “our”)
        provides beauty discovery, analysis, marketplace, and account services
        through gobeauty.ai. This Privacy Policy applies when you visit or use
        our website, create an account, submit an inquiry, make a purchase, or
        communicate with us.
      </p>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <h3 className="!mt-0 text-brand-800">Mobile information promise</h3>
        <p>
          No mobile information will be shared with third parties or affiliates
          for marketing or promotional purposes. Text messaging originator
          opt-in data and consent will not be shared with any third parties,
          except service providers that help us deliver the messaging program
          and are required to protect that information.
        </p>
      </div>

      <h2>2. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          Account information, such as your username, phone number, profile
          details, and verification records.
        </li>
        <li>
          Content you submit, including photos, beauty goals, reviews,
          inquiries, messages, and other form responses.
        </li>
        <li>
          Transaction and order information when you use shopping or
          marketplace features.
        </li>
        <li>
          Communications with us, including customer support requests and SMS
          opt-in or opt-out activity.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <p>
        We may collect device, browser, IP address, approximate location,
        referral, usage, and diagnostic information through standard logs,
        cookies, and similar technologies. We use this information to operate,
        secure, and improve the service.
      </p>

      <h2>3. How we use information</h2>
      <ul>
        <li>Provide, personalize, maintain, and secure GoBeauty AI.</li>
        <li>
          Verify accounts and send requested one-time security codes and
          account-related messages.
        </li>
        <li>
          Process inquiries, orders, marketplace requests, and customer
          support.
        </li>
        <li>
          Analyze service performance, prevent abuse, and develop new features.
        </li>
        <li>
          Meet legal obligations and enforce our Terms of Service.
        </li>
      </ul>

      <h2>4. SMS and mobile data</h2>
      <p>
        If you affirmatively opt in, GoBeauty AI may send you one-time
        verification codes and account-related text messages at the phone number
        you provide. If you separately opt in to recurring marketing messages,
        we may also send salon industry news, product recommendations, supplier
        updates, trade-show information, and promotional offers. Message
        frequency varies. Message and data rates may apply. Reply STOP to
        unsubscribe or HELP for help.
      </p>
      <p>
        We record evidence of your consent, such as your phone number, the date
        and time of consent, the source of the opt-in, and the version of the
        disclosure you accepted. Consent is not a condition of purchase. You can
        withdraw consent at any time by replying STOP.
      </p>

      <h2>5. How we share information</h2>
      <p>We may share information only as needed with:</p>
      <ul>
        <li>
          Service providers that host our systems, deliver messages, process
          payments, provide analytics, or support our operations.
        </li>
        <li>
          Beauty professionals, suppliers, or marketplace participants when you
          intentionally ask us to send them an inquiry or fulfill a transaction.
        </li>
        <li>
          Authorities or other parties when required by law, to protect rights
          and safety, or as part of a corporate transaction.
        </li>
      </ul>
      <p>
        We do not sell your personal information. We do not share mobile
        numbers or SMS consent data with third parties for their own marketing.
      </p>

      <h2>6. Data retention and security</h2>
      <p>
        We retain information for as long as reasonably necessary to provide
        the service, document consent, comply with law, resolve disputes, and
        enforce agreements. We use administrative, technical, and physical
        safeguards designed to protect information, but no system can guarantee
        absolute security.
      </p>

      <h2>7. Your choices and rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, or receive a copy of your personal information, or to object to
        certain processing. You may also adjust browser cookie settings and
        unsubscribe from SMS by replying STOP.
      </p>

      <h2>8. Children’s privacy</h2>
      <p>
        GoBeauty AI is not directed to children under 13, and we do not
        knowingly collect personal information from children under 13. If you
        believe a child has provided us information, please contact us.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy as our service or legal obligations change.
        We will post the revised policy here and update the “Last updated” date.
      </p>

      <h2>10. Contact us</h2>
      <p>
        For privacy questions or SMS assistance, call{" "}
        <a href="tel:+18776001886">+1 (877) 600-1886</a>. For text message
        support, reply HELP to the number that sent you the message.
      </p>
    </LegalPageShell>
  );
}
