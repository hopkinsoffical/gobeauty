import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/useAuth";
import AuthModal from "@/components/AuthModal";
import SiteHeader from "@/components/SiteHeader";
import { CartProvider } from "@/lib/cart";
import SiteFooter from "@/components/SiteFooter";
import MobileTabBar from "@/components/MobileTabBar";

const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION ||
  "";

export const metadata: Metadata = {
  // www is the host that actually resolves (the apex has no A record yet); canonical
  // URLs must point at a reachable origin or crawlers drop them.
  metadataBase: new URL("https://www.gobeauty.ai"),
  title: {
    default: "goBeauty.ai — Get the Beauty Look You Want",
    template: "%s | goBeauty.ai",
  },
  description:
    "AI-native beauty discovery: upload a look, describe your goal, or find a service. GoBeauty.ai shows you whether to DIY, book a pro, or shop the right products.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    siteName: "goBeauty.ai",
    title: "goBeauty.ai — Get the Beauty Look You Want",
    description:
      "AI-native beauty discovery: upload a look, describe your goal, or find a service.",
    images: ["/gobeauty-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/gobeauty-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console HTML-tag verification — set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  // (or GOOGLE_SITE_VERIFICATION) in the deploy env to the token Google provides.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "goBeauty.ai",
  url: "https://www.gobeauty.ai",
  logo: "https://www.gobeauty.ai/gobeauty-logo.png",
  sameAs: [] as string[],
};

const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "goBeauty.ai",
  url: "https://www.gobeauty.ai/",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.gobeauty.ai/get-this-look?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSONLD) }}
        />
        <AuthProvider>
          <CartProvider>
            <SiteHeader />
            <AuthModal />
            <main className="pb-20 md:pb-0">{children}</main>
            <SiteFooter />
            <MobileTabBar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
