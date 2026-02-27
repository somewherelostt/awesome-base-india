import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { FounderConnectPreview, HeroSection, HowItWorksSection } from "@/components/home-sections";
import { ProductGrid } from "@/components/product-grid";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Base India → World — Directory of products built on Base",
  description:
    "Discover early products built on Base by India-based teams. Proof-first listings + Founder Connect. Submit your project to get verified.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <HeroSection />

        <ProductGrid />

        <HowItWorksSection />

        <FounderConnectPreview />
      </main>
      <BaseFooter />
    </>
  );
}
