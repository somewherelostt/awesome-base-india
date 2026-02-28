import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { HeroSection, HowItWorksSection } from "@/components/home-sections";
import { ProductGrid } from "@/components/product-grid";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import { getProjectsWithResolvedLogos } from "@/lib/projects-resolved";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Base India → World — Directory of products built on Base",
  description:
    "Discover early products built on Base by India-based teams. Proof-first listings + Founder Connect. Submit your project to get verified.",
  path: "/",
});

export default async function HomePage(): Promise<ReactNode> {
  const projects = getProjectsWithResolvedLogos();
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <HeroSection />

        <ProductGrid
          projects={projects}
          randomizeShowcase={true}
          showcaseCount={18}
          showViewAllButton={true}
        />

        <HowItWorksSection />
      </main>
      <BaseFooter />
    </>
  );
}
