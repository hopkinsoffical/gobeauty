import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "List Your Products on GoBeauty",
  description:
    "Reach salon owners, spa professionals, and beauty businesses. Request a supplier listing on the GoBeauty marketplace.",
  alternates: { canonical: "/brands/list-your-products" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
