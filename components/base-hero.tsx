"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const headlineText = "India to the World";

export function BaseHero(): ReactNode {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden px-6 pt-40 sm:pt-52">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-accent/6 blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/4 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto md:text-center">
        <h1 className="mb-8 text-5xl font-medium tracking-tighter md:text-8xl lg:text-8xl">
          {headlineText.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.4,
                delay: index * 0.03,
                ease: "easeOut",
              }}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="text-muted-foreground mx-auto mt-6 max-w-xl text-2xl leading-12 tracking-tight md:text-3xl"
        >
          <span className="text-foreground bg-foreground/5 inline-block rounded-md px-2 py-0.5 leading-10">
            Discover
          </span>{" "}
          projects{" "}
          <span className="text-foreground bg-foreground/5 inline-block rounded-full px-4 py-0.5 leading-10">
            building on Base
          </span>{" "}
          from{" "}
          <span className="text-foreground bg-foreground/5 inline-block rounded-md px-2 py-0.5 leading-10">
            Indian founders
          </span>{" "}
          shipping real products onchain.
        </motion.p>
      </div>

      <motion.div
        className="relative z-10 mt-12 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: easeOut }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#projects"
            className="bg-accent group inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pl-5 pr-3 font-medium text-white shadow-lg shadow-accent/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-accent/40 sm:w-auto"
          >
            <span>Explore Projects</span>
            <span className="bg-white text-accent flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="relative left-px h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/directory"
            className="text-foreground inline-flex w-full items-center justify-center rounded-md bg-foreground/5 px-6 py-3 font-medium tracking-tight transition-all duration-500 hover:rounded-[50px] hover:bg-foreground/10 sm:w-auto"
          >
            Founders Circle
          </Link>
          <Link
            href="/submit"
            className="group text-foreground relative inline-flex w-full items-center justify-center rounded-md border border-border px-6 py-3 font-medium tracking-tight transition-all duration-500 hover:rounded-[50px] hover:border-accent/30 sm:w-auto"
          >
            <span
              className="relative block h-[1.25em] overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
              }}
            >
              <span className="flex flex-col duration-0 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2/3 group-hover:transition-transform group-hover:duration-300">
                <span className="block leading-[1.25em]">Submit Project</span>
                <span className="block leading-[1.25em]">Submit Project</span>
                <span className="block leading-[1.25em]">Submit Project</span>
              </span>
            </span>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-20 flex items-center gap-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <div>
          <p className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">12+</p>
          <p className="text-sm text-muted-foreground">Projects</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">12+</p>
          <p className="text-sm text-muted-foreground">Founders</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">5+</p>
          <p className="text-sm text-muted-foreground">Batches</p>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-16 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <p className="text-sm font-medium text-muted-foreground tracking-tight">
          Scroll to explore
        </p>
        <motion.div
          className="mx-auto mt-2 h-6 w-px bg-muted-foreground/40"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
