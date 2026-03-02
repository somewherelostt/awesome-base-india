"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const footerCards = [
  {
    title: "Explore",
    links: [
      { text: "Project Directory", href: "/directory" },
      { text: "Founders", href: "/founders" },
      { text: "Submit Project", href: "/submit" },
      { text: "About Us", href: "/about" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { text: "Base", href: "https://base.org", external: true },
      { text: "Inner Circle", href: "https://x.com/innercircle_so", external: true },
      { text: "Brand Kit", href: "https://base.org/brand", external: true },
    ],
  },
  {
    title: "Connect",
    links: [
      { text: "X / Twitter", href: "https://x.com/BaseCircleClub", external: true },
      { text: "Telegram Bot", href: "https://t.me/awesome_base_India_bot", external: true },
      { text: "GitHub", href: "https://github.com", external: true },
      { text: "Community", href: "https://t.co/BC2WASe4OD", external: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function BaseFooter(): ReactNode {
  return (
    <footer className="relative w-full overflow-hidden bg-white dark:bg-neutral-950 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          {/* Top Section - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            {/* First Column - Branding */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-between space-y-6 mb-6 lg:mb-0 pr-6"
            >
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0052FF]">
                  <svg width="18" height="18" viewBox="0 0 111 111" fill="white">
                    <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Base Circle Club
                </span>
              </div>

              {/* Motto */}
              <div>
                <h3 className="text-lg font-medium tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                  India to the World.
                  <br />
                  Building on Base.
                </h3>
              </div>

              {/* Small Text */}
              <div className="mt-auto flex items-center gap-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Proof-first directory since 2024
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://x.com/BaseCircleClub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white"
                    aria-label="X / Twitter"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://base.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white"
                    aria-label="Base"
                  >
                    <svg width="14" height="14" viewBox="0 0 111 111" fill="currentColor">
                      <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Cards - Dynamically Rendered */}
            {footerCards.map((card, index) => {
              let marginClass = "";

              if (index > 0) {
                marginClass = "-mt-px";
              }

              if (index === 0) {
                marginClass += " md:mt-0";
              } else if (index === 1) {
                marginClass += " md:-mt-px md:ml-0";
              } else if (index === 2) {
                marginClass += " md:-mt-px md:-ml-px";
              }

              marginClass += " lg:mt-0";
              if (index > 0) {
                marginClass += " lg:-ml-px";
              }

              return (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className={`group relative min-h-[300px] overflow-hidden border border-neutral-200 p-6 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 sm:p-8 ${marginClass}`}
                >
                  <h4 className="mb-6 text-sm font-medium tracking-tight text-neutral-900 dark:text-white sm:text-base">
                    {card.title}
                  </h4>
                  <ul className="space-y-3">
                    {card.links.map((link) => {
                      const isExternal = "external" in link && link.external;
                      const content = (
                        <span className="inline-flex items-center gap-1 text-sm font-light text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white sm:text-base">
                          {link.text}
                          {isExternal && <ArrowUpRight className="h-3 w-3" />}
                        </span>
                      );

                      return (
                        <li key={link.text}>
                          {isExternal ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          ) : (
                            <Link href={link.href}>{content}</Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Section - Large Background Text */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16"
          >
            <div className="w-full select-none" aria-hidden="true">
              <h2 className="whitespace-nowrap text-center text-[clamp(2rem,8vw,8rem)] font-bold leading-none tracking-tighter text-neutral-200 dark:text-neutral-800">
                BASE CIRCLE CLUB
              </h2>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
