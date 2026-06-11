import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://gobeauty.ai"),
  title: {
    default: "goBeauty.ai — Get the Beauty Look You Want",
    template: "%s | goBeauty.ai",
  },
  description:
    "AI-native beauty discovery: upload a look, describe your goal, or find a service. GoBeauty.ai shows you whether to DIY, book a pro, or shop the right products.",
  openGraph: {
    type: "website",
    siteName: "goBeauty.ai",
    title: "goBeauty.ai — Get the Beauty Look You Want",
    description:
      "AI-native beauty discovery: upload a look, describe your goal, or find a service.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
