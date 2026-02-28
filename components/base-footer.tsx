"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.8, ease: easeOut },
};

const exploreLinks = [
  { label: "Projects", href: "/" },
  { label: "Founders Circle", href: "/directory" },
  { label: "Submit Project", href: "/submit" },
];

const ecosystemLinks = [
  { label: "Base", href: "https://base.org" },
  { label: "Base India", href: "https://x.com/BaseIndiaCircle" },
  { label: "Brand Kit", href: "https://base.org/brand" },
];

export function BaseFooter(): ReactNode {
  return (
    <footer className="bg-accent px-6 py-16 text-white md:px-12 lg:px-20 rounded-tr-4xl rounded-tl-4xl">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div className="max-w-md" {...fadeInUp}>
            <p className="text-lg leading-relaxed text-white/80">
              The ultimate directory of products and projects building on Base
              from India. Scouting the best onchain talent from the subcontinent.
            </p>
            <Link
              href="/submit"
              className="group mt-8 inline-flex items-center gap-3 rounded-md bg-white py-3 pl-4 pr-3 font-medium text-accent shadow-lg shadow-black/10 transition-all duration-500 ease-out hover:rounded-[50px] hover:bg-white/90 hover:shadow-xl hover:shadow-black/20"
            >
              <span>Submit Your Project</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="h-4 w-4 relative left-px" />
              </span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 lg:justify-items-end">
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                Explore
              </h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-white/80 transition-all duration-300 hover:translate-x-1 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                Ecosystem
              </h4>
              <ul className="space-y-3">
                {ecosystemLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-white/80 transition-all duration-300 hover:translate-x-1 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="my-16 h-px bg-white/10" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div {...fadeInUp}>
            <h2 className="text-6xl font-medium leading-none tracking-tight md:text-7xl lg:text-8xl">
              Base India
              <br />
              Circle
            </h2>
            <p className="mt-8 text-sm text-white/50">
              Built with love for the Base ecosystem
            </p>
          </motion.div>

          <div className="flex flex-col justify-between gap-8 lg:items-end lg:text-right">
            <motion.div className="space-y-6" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
              <div>
                <h4 className="mb-1 font-semibold">India to the World</h4>
                <p className="text-white/70">
                  From Base Batches, Fellowship,
                  <br />
                  Hyperthon & every activation
                </p>
              </div>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                @BaseIndiaCircle
              </a>
            </motion.div>

            <motion.div className="flex items-center gap-4 lg:justify-end" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <a
                href="https://x.com/BaseIndiaCircle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-accent"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-accent"
                aria-label="Base"
              >
                <svg width="16" height="16" viewBox="0 0 111 111" fill="currentColor">
                  <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
