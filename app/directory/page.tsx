import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { DirectoryContent } from "@/components/directory-content";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Founders Directory",
  description:
    "Connect with Indian founders building on Base. Join the Base India Inner Circle.",
  path: "/directory",
});

export default function DirectoryPage(): ReactNode {
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <DirectoryContent />
      </main>
      <BaseFooter />
    </>
  );
}
