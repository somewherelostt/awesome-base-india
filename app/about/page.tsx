import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { AboutSection } from "@/components/home-sections";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "About us",
  description:
    "Built by India-based builders, for the Base ecosystem. Meet the team behind Base India Circle and our community partner Inner Circle.",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <AboutSection />
      </main>
      <BaseFooter />
    </>
  );
}
