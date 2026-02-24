import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { SubmitForm } from "@/components/submit-form";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Submit Your Project",
  description:
    "Submit your Base ecosystem project to be featured in the Base India Circle directory. Get discovered by the community.",
  path: "/submit",
});

export default function SubmitPage(): ReactNode {
  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main id="main-content" className="flex-1 bg-background">
        <section className="px-6 pt-32 pb-12 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">
                Join the Directory
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Submit Your Project
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              On Twitter, the reality is hard — folks who are just starting won&apos;t
              get traction and need the most support. Here, you can achieve that. Submit
              your project, we verify it, and you become part of the ecosystem.
            </p>
          </div>
        </section>

        <section className="px-6 pb-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <SubmitForm />
          </div>
        </section>
      </main>
      <BaseFooter />
    </>
  );
}
