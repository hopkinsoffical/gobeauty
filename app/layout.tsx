import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://gobeauty.ai"),
  title: {
    default: "GoBeauty — Find the best nail salons near you",
    template: "%s | GoBeauty",
  },
  description:
    "Discover top-rated nail salons in your city, ranked by real reviews, Google visibility, and AI Growth Score.",
  openGraph: {
    type: "website",
    siteName: "GoBeauty",
    title: "GoBeauty — Find the best nail salons near you",
    description:
      "Discover top-rated nail salons in your city, ranked by real reviews, Google visibility, and AI Growth Score.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
