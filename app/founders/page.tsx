import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { FoundersPalsView } from "@/components/founders-pals-view";
import { ThemeSwitch } from "@/components/theme-switch";
import { projects } from "@/lib/data";
import { getAllFoundersForPals } from "@/lib/founder";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Founders",
  description:
    "Map of founders building on Base in India. Browse by location and discover similar builders.",
  path: "/founders",
});

export default function FoundersPage(): ReactNode {
  const founders = getAllFoundersForPals(projects);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex flex-1 flex-col min-h-0">
        <FoundersPalsView founders={founders} />
      </main>
      <BaseFooter />
    </div>
  );
}
