"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Search,
  Users,
  FileText,
  Sparkles,
  Globe,
  LifeBuoy,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
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

const menuItems = {
  Explore: [
    {
      icon: Search,
      title: "Directory",
      description: "Browse proof-first project listings",
      href: "/",
    },
    {
      icon: Users,
      title: "Founder Connect",
      description: "Meet builders shipping on Base from India",
      href: "/directory",
    },
    {
      icon: FileText,
      title: "Submit Project",
      description: "Get your project verified and listed",
      href: "/submit",
    },
    {
      icon: Sparkles,
      title: "Showcase",
      description: "Featured projects of the week",
      href: "#projects",
    },
  ],
  Community: [
    {
      icon: Globe,
      title: "Base",
      description: "The L2 built for everyone",
      href: "https://base.org",
    },
    {
      icon: LifeBuoy,
      title: "Base India",
      description: "Follow for ecosystem updates",
      href: "https://x.com/BaseIndiaCircle",
    },
    {
      icon: FileText,
      title: "Brand Kit",
      description: "Logos, colors, and guidelines",
      href: "https://base.org/brand",
    },
    {
      icon: MessageCircle,
      title: "Twitter / X",
      description: "Join the conversation",
      href: "https://x.com/BaseIndiaCircle",
    },
  ],
};

export function BaseHeader(): ReactNode {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
          onMouseLeave={() => setActiveMenu(null)}
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
                <button
                  onMouseEnter={() => setActiveMenu("Explore")}
                  className={`px-4 py-2 text-sm tracking-tight font-light rounded-full transition-colors ${
                    activeMenu === "Explore"
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Explore
                </button>
                <button
                  onMouseEnter={() => setActiveMenu("Community")}
                  className={`px-4 py-2 text-sm tracking-tight font-light rounded-full transition-colors ${
                    activeMenu === "Community"
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Community
                </button>
                <Link
                  href="#about"
                  className="px-4 py-2 text-sm tracking-tight font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full no-underline"
                  onMouseEnter={() => setActiveMenu(null)}
                >
                  About
                </Link>
              </div>

              <div className="flex items-center gap-2 ml-6">
                <Link
                  href="/directory"
                  className="px-4 py-2 tracking-tight text-sm font-light text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white no-underline"
                  onMouseEnter={() => setActiveMenu(null)}
                >
                  Founders
                </Link>
                <Link
                  href="/submit"
                  className="px-5 py-2 rounded-lg bg-[#0052FF] text-white text-sm font-medium tracking-tight hover:bg-[#0047e0] no-underline transition-colors"
                  onMouseEnter={() => setActiveMenu(null)}
                >
                  Submit Project
                </Link>
              </div>
            </div>

            <AnimatePresence>
              {activeMenu && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-3 w-[620px]">
                      {menuItems[activeMenu as keyof typeof menuItems].map(
                        (item, index) => {
                          const Icon = item.icon;
                          const isExternal = item.href.startsWith("http");
                          const Comp = isExternal ? "a" : Link;
                          const extraProps = isExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {};
                          return (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                                ease: "easeOut",
                              }}
                            >
                              <Comp
                                href={item.href}
                                className="group flex items-start gap-3 rounded-2xl bg-white/20 backdrop-blur-2xl dark:bg-neutral-950/20 border border-neutral-300/60 dark:border-neutral-800/50 p-4 hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-md transition-[border-color,box-shadow] duration-200 no-underline"
                                {...extraProps}
                              >
                                <div className="shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                                  <Icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-normal text-neutral-900 dark:text-white mb-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                              </Comp>
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                          href="#about"
                          className="block py-2 px-2 text-sm font-medium text-neutral-900 dark:text-white no-underline"
                        >
                          About
                        </Link>
                        <Link
                          href="/directory"
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

                      <div className="pt-2">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 px-2">
                          Explore
                        </h3>
                        <div className="space-y-2">
                          {menuItems.Explore.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-start gap-3 rounded-xl bg-white/20 backdrop-blur-2xl dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/50 p-3 no-underline"
                              >
                                <div className="shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                                  <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 px-2">
                          Community
                        </h3>
                        <div className="space-y-2">
                          {menuItems.Community.map((item) => {
                            const Icon = item.icon;
                            const isExternal = item.href.startsWith("http");
                            const Comp = isExternal ? "a" : Link;
                            const extraProps = isExternal
                              ? {
                                  target: "_blank" as const,
                                  rel: "noopener noreferrer",
                                }
                              : {};
                            return (
                              <Comp
                                key={item.title}
                                href={item.href}
                                className="flex items-start gap-3 rounded-xl bg-white/20 backdrop-blur-2xl dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/50 p-3 no-underline"
                                {...extraProps}
                              >
                                <div className="shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                                  <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    {item.description}
                                  </p>
                                </div>
                              </Comp>
                            );
                          })}
                        </div>
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
