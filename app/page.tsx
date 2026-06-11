import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import FourPathsSection from "@/components/FourPathsSection";
import UseCasesSection from "@/components/UseCasesSection";
import FeaturedLooksSection from "@/components/FeaturedLooksSection";
import ShopProductsSection from "@/components/ShopProductsSection";
import LocalServicesSection from "@/components/LocalServicesSection";
import ForBusinessesSection from "@/components/ForBusinessesSection";

export const metadata: Metadata = {
  title: "goBeauty.ai — Get the Beauty Look You Want",
  description:
    "Upload a look, describe your beauty goal, or search for a service. GoBeauty.ai helps you decide whether to DIY, book a professional, or shop the right products.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FourPathsSection />
      <UseCasesSection />
      <FeaturedLooksSection />
      <ShopProductsSection />
      <LocalServicesSection />
      <ForBusinessesSection />
    </>
  );
}
