"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { founders } from "@/lib/data";

interface FounderCardData {
  name: string;
  project: string;
  role: string;
  twitter: string;
  avatar: string;
  github?: string;
}

function FounderGlassCard({ founder }: { founder: FounderCardData }) {
  return (
    <div className="mb-4 block rounded-2xl bg-white/60 p-1.5 shadow-sm backdrop-blur-md dark:bg-neutral-800/40">
      <div className="rounded-[10px] border border-neutral-300/60 bg-white p-6 shadow-sm dark:border-neutral-800/50 dark:bg-neutral-900">
        <p className="mb-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Building <strong className="text-foreground">{founder.project}</strong> on Base
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0052FF] text-sm font-bold text-white">
            {founder.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {founder.name}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-600 dark:text-neutral-400">
              <a
                href={`https://x.com/${founder.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @{founder.twitter}
              </a>
              {founder.github && (
                <>
                  <span aria-hidden>·</span>
                  <a href={founder.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DirectoryContent(): ReactNode {
  const col1 = founders.slice(0, 4);
  const col2 = founders.slice(4, 8);
  const col3 = founders.slice(8, 12);

  const marquee1Ref = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const marquee3Ref = useRef<HTMLDivElement>(null);
  const marqueeMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m1 = marquee1Ref.current;
    const m2 = marquee2Ref.current;
    const m3 = marquee3Ref.current;
    const mm = marqueeMobileRef.current;

    let o1 = 0, o2 = 0, o3 = 0, om = 0;

    const animate = () => {
      if (mm) {
        om += 0.5;
        const h = mm.scrollHeight / 2;
        if (om >= h) om = 0;
        mm.style.transform = `translateY(-${om}px)`;
      }
      if (m1) {
        o1 += 0.5;
        const h = m1.scrollHeight / 2;
        if (o1 >= h) o1 = 0;
        m1.style.transform = `translateY(-${o1}px)`;
      }
      if (m2) {
        o2 += 0.6;
        const h = m2.scrollHeight / 2;
        if (o2 >= h) o2 = 0;
        m2.style.transform = `translateY(-${o2}px)`;
      }
      if (m3) {
        o3 += 0.4;
        const h = m3.scrollHeight / 2;
        if (o3 >= h) o3 = 0;
        m3.style.transform = `translateY(-${o3}px)`;
      }
      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <section className="px-6 pt-40 pb-8 sm:px-8 sm:pt-52">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-medium tracking-tighter md:text-8xl">
            {"The Inner Circle".split("").map((char, index) => (
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed tracking-tight md:text-xl"
          >
            Indian founders shipping real products on Base. Click any card to
            connect on X.
          </motion.p>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-background py-8 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-medium leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Builders shipping <br /> on Base from India
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Link
                href="/submit"
                className="group whitespace-nowrap inline-flex items-center gap-2 rounded-full bg-[#0052FF] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0047e0] no-underline"
              >
                Join the Circle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile single marquee */}
          <div className="relative sm:hidden">
            <div className="relative h-[600px] overflow-hidden">
              <div ref={marqueeMobileRef}>
                {[...founders, ...founders].map((f, i) => (
                  <FounderGlassCard key={`m-${i}`} founder={f} />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/90 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent" />
            </div>
          </div>

          {/* Desktop 3-column marquee */}
          <div className="relative hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative h-[600px] overflow-hidden">
              <div ref={marquee1Ref}>
                {[...col1, ...col1].map((f, i) => (
                  <FounderGlassCard key={`c1-${i}`} founder={f} />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="relative h-[600px] overflow-hidden">
              <div ref={marquee2Ref}>
                {[...col2, ...col2].map((f, i) => (
                  <FounderGlassCard key={`c2-${i}`} founder={f} />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="relative h-[600px] overflow-hidden">
              <div ref={marquee3Ref}>
                {[...col3, ...col3].map((f, i) => (
                  <FounderGlassCard key={`c3-${i}`} founder={f} />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
