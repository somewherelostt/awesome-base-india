"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";

function BaseLogo(): ReactNode {
  return (
    <svg width="22" height="22" viewBox="0 0 111 111" fill="none">
      <path
        d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BaseHeader(): ReactNode {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-4 sm:px-6 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Desktop Navigation */}
        <motion.div
          className="relative mx-auto hidden lg:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="mx-auto w-fit rounded-3xl bg-white/40 backdrop-blur-2xl border border-neutral-200/50 shadow-xl dark:bg-neutral-950/40 dark:border-neutral-800/50 overflow-hidden">
            <div className="flex items-center justify-between gap-2 pl-6 pr-3 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-900 dark:text-white mr-6"
              >
                <BaseLogo />
                <span className="text-base font-semibold tracking-tight">
                  Base India Circle
                </span>
              </Link>

              <div className="flex items-center gap-1">
                <Link
                  href="/about"
                  className="px-4 py-2 text-sm tracking-tight font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full no-underline"
                >
                  About
                </Link>
                <Link
                  href="/ecosystem"
                  className="px-4 py-2 text-sm tracking-tight font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full no-underline"
                >
                  Ecosystem
                </Link>
                <Link
                  href="/founders"
                  className="px-4 py-2 tracking-tight text-sm font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white no-underline"
                >
                  Founders
                </Link>
              </div>

              <div className="flex items-center gap-2 ml-6">
                <Link
                  href="/submit"
                  className="px-5 py-2 rounded-lg bg-[#0052FF] text-white text-sm font-medium tracking-tight hover:bg-[#0047e0] no-underline transition-colors"
                >
                  Submit Project
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Navigation */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="rounded-3xl bg-white/40 backdrop-blur-2xl border border-neutral-300/60 shadow-xl dark:bg-neutral-950/40 dark:border-neutral-800/50 overflow-hidden">
            <div className="flex items-center justify-between pl-4 pr-3 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-900 dark:text-white"
              >
                <BaseLogo />
                <span className="text-base font-semibold tracking-tight">
                  Base India Circle
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0052FF] text-white"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Link
                          href="/about"
                          className="block py-2 px-2 text-sm font-medium text-neutral-900 dark:text-white no-underline"
                        >
                          About
                        </Link>
                        <Link
                          href="/ecosystem"
                          className="block py-2 px-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 no-underline"
                        >
                          Ecosystem
                        </Link>
                        <Link
                          href="/founders"
                          className="block py-2 px-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 no-underline"
                        >
                          Founders
                        </Link>
                      </div>

                      <div>
                        <Link
                          href="/submit"
                          className="block w-full text-center px-6 py-2.5 rounded-full bg-[#0052FF] text-white text-sm font-medium no-underline"
                        >
                          Submit Project
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
