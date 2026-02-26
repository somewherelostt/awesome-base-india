import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
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
        <section className="px-6 pt-28 pb-6 sm:px-8 sm:pt-32">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Builder Directory
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A curated list of Indian teams building on Base.
            </p>
          </div>
        </section>

        <ProductGrid />
      </main>
      <BaseFooter />
    </>
  );
}
