import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { ProductGrid } from "@/components/product-grid";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import { getProjectsWithResolvedLogos } from "@/lib/projects-resolved";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Project Directory",
  description:
    "Browse all projects built on Base by Indian builders. Full curated directory with filtering and search.",
  path: "/directory",
});

export default async function DirectoryPage(): Promise<ReactNode> {
  const projects = getProjectsWithResolvedLogos();
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <ProductGrid projects={projects} />
      </main>
      <BaseFooter />
    </>
  );
}
