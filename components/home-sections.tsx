"use client";

import {
  ArrowRight,
  ChevronRight,
  Code2,
  Eye,
  ExternalLink,
  FileCheck,
  GitBranch,
  Github,
  Globe,
  LineChart,
  Linkedin,
  Mail,
  Rocket,
  Search,
  Send,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Circles from "@/components/circles";
import ParticleText from "@/components/particle-text";
import PixelBlast from "@/components/pixel-blast";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, ease: easeOut },
};

// ─── Section 1: Hero ─────────────────────────────────────────────────────────

const LIGHT_PIXEL_COLORS = ["#0052FF", "#3B82F6", "#60A5FA"] as const;
const DARK_PIXEL_COLORS = ["#3B82F6", "#60A5FA", "#93C5FD"] as const;

export function HeroSection(): ReactNode {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const pixelColors = resolvedTheme === "dark" ? DARK_PIXEL_COLORS : LIGHT_PIXEL_COLORS;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      {isMounted && (
        <motion.div className="absolute inset-0" style={{ zIndex: 0, y: parallaxY }}>
          <PixelBlast
            variant="circle"
            pixelSize={5}
            colors={[...pixelColors]}
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.3}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.15}
            rippleIntensityScale={2}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.4}
            edgeFade={0.2}
            transparent
            cursorInteraction
            cursorRadius={0.18}
            cursorIntensity={0.5}
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,82,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center" style={{ zIndex: 10, isolation: "isolate" }}>
        <motion.p
          className="text-muted-foreground mb-6 text-xs font-semibold uppercase tracking-[0.3em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          From India. On Base. Shipping to the world.
        </motion.p>

        <motion.div
          className="w-full h-[140px] sm:h-[180px] md:h-[220px] lg:h-[260px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: easeOut }}
        >
          {isMounted && (
            <ParticleText
              text="Base India Circle"
              colors={["#0052FF", "#3B82F6", "#60A5FA", "#ffffff"]}
              particleSize={2}
              particleGap={2}
              mouseControls={{ enabled: true, radius: 180, strength: 6 }}
              backgroundColor="transparent"
              fontFamily="sans-serif"
              fontSize={300}
              fontWeight="900"
              friction={0.75}
              ease={0.05}
              autoFit={true}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="text-muted-foreground mx-auto mt-6 max-w-lg text-base leading-relaxed tracking-tight md:text-lg"
        >
          Proof-first directory of products built on Base by Indian builders.
        </motion.p>
      </div>

      <motion.div
        className="relative mt-10 flex flex-col items-center gap-5" style={{ zIndex: 10 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: easeOut }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/directory"
            className="bg-accent group inline-flex items-center gap-3 rounded-md py-3 pl-5 pr-3 font-medium text-white shadow-lg shadow-accent/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-accent/40"
          >
            <span>Browse directory</span>
            <span className="bg-white text-accent flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="relative left-px h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/submit"
            className="group text-foreground relative inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium tracking-tight transition-all duration-500 hover:rounded-[50px] hover:border-accent/30"
          >
            <span
              className="relative block h-[1.25em] overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
              }}
            >
              <span className="flex flex-col duration-0 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2/3 group-hover:transition-transform group-hover:duration-300">
                <span className="block leading-[1.25em]">Submit project</span>
                <span className="block leading-[1.25em]">Submit project</span>
                <span className="block leading-[1.25em]">Submit project</span>
              </span>
            </span>
          </Link>
        </div>
        <p className="text-muted-foreground/60 text-xs tracking-wide">
          Verified submissions &bull; No pay-to-win &bull; Built for builders
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center" style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <motion.div
          className="mx-auto h-8 w-px bg-muted-foreground/30"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

// ─── Section Divider ────────────────────────────────────────────────────────

export function SectionDivider(): ReactNode {
  return (
    <div className="flex items-center justify-center py-1">
      <motion.div
        className="h-px w-full max-w-6xl mx-6"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #0052FF 30%, #3B82F6 50%, #0052FF 70%, transparent 100%)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.4, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: easeOut }}
      />
    </div>
  );
}

// ─── Section 2: What Is This ─────────────────────────────────────────────────

export function WhatIsThisSection(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
        <motion.div
          className="lg:sticky lg:top-40 lg:w-1/2 lg:shrink-0"
          {...fadeInUp}
        >
          <h2 className="mb-6 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            A home page for Base builders in India.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Twitter is loud. Early products get buried. This directory makes
            discovery simple: shipped products, proof links, and direct founder access.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 lg:w-1/2">
          {[
            {
              icon: Rocket,
              title: "Shipped-only",
              desc: "listings (MVP counts)",
            },
            {
              icon: Shield,
              title: "Proof-first",
              desc: "contracts / repo / metrics / demo",
            },
            {
              icon: Users,
              title: "Founder Connect",
              desc: "one tap to reach builders on X",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-muted rounded-2xl p-6 md:p-8 flex items-start gap-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
            >
              <div className="text-foreground shrink-0">
                <item.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Bento Grid ───────────────────────────────────────────────────

const bentoCards = [
  {
    title: "Directory",
    body: "Browse products with minimal traction — perfect time to support.",
    highlights: "Filters • Categories • Proof links",
    cta: "Explore projects",
    href: "#projects",
    icon: Search,
    large: true,
  },
  {
    title: "Founder Connect",
    body: "A living map of Base India builders. Tap to connect on X.",
    highlights: "Circle animation / Inner Circle",
    cta: "Meet founders",
    href: "/founders",
    icon: Users,
    large: false,
  },
  {
    title: "Submit + Verify",
    body: "Submit your project. We verify Base usage + builder identity.",
    highlights: "Transparent criteria",
    cta: "Submit now",
    href: "/submit",
    icon: FileCheck,
    large: false,
  },
  {
    title: "Scout talent",
    body: "Find builders shipping fast. Partner, hire, mentor, invest.",
    highlights: '"Proof over vibes"',
    cta: "Start scouting",
    href: "#projects",
    icon: Eye,
    large: false,
  },
];

export function BentoSection(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bentoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className={`bg-muted group relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col transition-colors duration-300 hover:bg-muted/80 ${
                  card.large ? "lg:col-span-2 lg:row-span-2 min-h-80" : "min-h-50"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
              >
                <Icon className="text-foreground mb-6 h-10 w-10" strokeWidth={1} />
                <h3 className="mb-2 text-2xl font-medium tracking-tight md:text-3xl">
                  {card.title}
                </h3>
                <p className="text-muted-foreground mb-2 max-w-md text-sm leading-relaxed">
                  {card.body}
                </p>
                <span className="text-muted-foreground/60 mb-6 block text-xs">
                  {card.highlights}
                </span>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  {card.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: How It Works ─────────────────────────────────────────────────

const steps = [
  {
    icon: Send,
    title: "Ship first. Then submit.",
    body: "Share your product + proof links. MVP is enough.",
  },
  {
    icon: Shield,
    title: "We verify what matters.",
    body: "Base usage + India-based builder signals + working links.",
  },
  {
    icon: Sparkles,
    title: "Get discovered early.",
    body: "You land in the directory + Founder Connect for fast feedback.",
  },
];

export function HowItWorksSection(): ReactNode {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={headerRef}
          className="mb-8 flex items-end justify-between md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            How it works
          </h2>
          <Link
            href="/submit"
            className="hidden items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-accent sm:flex"
          >
            Submit a project
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <StepCard key={step.title} step={step} icon={Icon} index={index} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  icon: Icon,
  index,
}: {
  step: (typeof steps)[0];
  icon: typeof Send;
  index: number;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="bg-muted min-h-70 rounded-2xl p-6 md:p-8 flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: easeOut }}
    >
      <div className="text-foreground mb-6">
        <Icon className="h-12 w-12" strokeWidth={1} />
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight md:text-2xl mt-auto">
        {step.title}
      </h3>
      <p className="text-muted-foreground text-base leading-relaxed">
        {step.body}
      </p>
    </motion.div>
  );
}

// ─── Section 5: Proof First ──────────────────────────────────────────────────

const proofTiles = [
  { icon: Globe, label: "Contracts", desc: "Base explorer link" },
  { icon: GitBranch, label: "GitHub", desc: "repo / commits" },
  { icon: LineChart, label: "Metrics", desc: "Dune / dashboard" },
  { icon: Code2, label: "Demo", desc: "live app or walkthrough" },
];

export function ProofFirstSection(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div {...fadeInUp}>
          <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Proof-first listings. Clean signal.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Every listing includes at least one proof link — so builders and scouts can trust what they&apos;re seeing.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {proofTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.label}
                className="bg-muted rounded-2xl p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
              >
                <Icon className="text-foreground h-10 w-10 mb-4" strokeWidth={1} />
                <h4 className="font-medium text-foreground">{tile.label}</h4>
                <p className="text-muted-foreground text-sm mt-1">{tile.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="text-muted-foreground/60 mt-8 text-xs"
          {...fadeInUp}
        >
          Traction is self-reported but link-backed where possible.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Section 6: Featured Showcase (Draggable Carousel) ──────────────────────

const SHOWCASE_ITEMS = [
  {
    id: 1,
    image: "https://cdn.dribbble.com/userupload/46030284/file/8dfdc9a8b09fdbd99b010c1dcb279841.jpg?resize=1024x1693&vertical=center",
    height: "h-[400px]",
    bgColor: "bg-blue-200 dark:bg-blue-900/30",
  },
  {
    id: 2,
    image: "https://cdn.dribbble.com/userupload/46029941/file/f3b0e906d38980bf48e008f5542a58b5.jpg?resize=1024x1693&vertical=center",
    height: "h-[450px]",
    bgColor: "bg-indigo-200 dark:bg-indigo-900/30",
  },
  {
    id: 3,
    image: "https://cdn.dribbble.com/userupload/45777759/file/acf14657b38cd25e64bb16b4f201bef8.jpg?resize=1024x1529&vertical=center",
    height: "h-[420px]",
    bgColor: "bg-sky-200 dark:bg-sky-900/30",
  },
  {
    id: 4,
    image: "https://cdn.dribbble.com/userupload/46068721/file/3910087a60fe6f781ddae7c14daf1804.jpg?resize=1024x1589&vertical=center",
    height: "h-[380px]",
    bgColor: "bg-neutral-200 dark:bg-neutral-800",
  },
];

export function FeaturedSection(): ReactNode {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [oneSetWidth, setOneSetWidth] = useState(0);

  const baseVelocity = -20;
  const baseX = useMotionValue(0);
  const scrollVelocity = useRef(baseVelocity);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const items = [
    ...SHOWCASE_ITEMS,
    ...SHOWCASE_ITEMS,
    ...SHOWCASE_ITEMS,
    ...SHOWCASE_ITEMS,
    ...SHOWCASE_ITEMS,
    ...SHOWCASE_ITEMS,
  ];

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      const itemWidth = isMobile ? 280 : 320;
      const gap = 24;
      const width = (itemWidth + gap) * SHOWCASE_ITEMS.length;
      setOneSetWidth(width);
      baseX.set(-width);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseX]);

  useAnimationFrame((_t, delta) => {
    if (!oneSetWidth) return;
    if (!isDragging) {
      scrollVelocity.current =
        scrollVelocity.current * 0.9 + baseVelocity * 0.1;
      const moveBy = scrollVelocity.current * (delta / 1000);
      baseX.set(baseX.get() + moveBy);
      const x = baseX.get();
      if (x <= -oneSetWidth * 2) baseX.set(x + oneSetWidth);
      else if (x > 0) baseX.set(x - oneSetWidth);
    }
  });

  return (
    <section id="projects" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-xl">
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Featured This Week
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.15] mb-8 sm:mb-10">
              Projects shipping onchain from India.
            </h2>
            <Link
              href="/"
              className="px-8 py-3.5 rounded-full bg-foreground text-background font-medium text-sm sm:text-base hover:bg-foreground/90 transition-colors duration-200 no-underline inline-block"
            >
              View All Projects
            </Link>
          </div>
        </motion.div>

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-20">
          <motion.div
            ref={scrollerRef}
            className="flex items-end gap-6 cursor-grab active:cursor-grabbing"
            style={{ x: baseX }}
            drag="x"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_e, info) => {
              setIsDragging(false);
              scrollVelocity.current = info.velocity.x;
            }}
            dragElastic={0.05}
            dragMomentum={false}
          >
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className={`group/card shrink-0 w-[280px] sm:w-[320px] ${item.height} rounded-2xl overflow-hidden select-none relative pointer-events-auto`}
                initial={{ rotateX: 0, opacity: 1 }}
                animate={
                  hoveredId === index
                    ? { scale: 1.05, rotateX: -15, y: -25, zIndex: 50 }
                    : { scale: 1, rotateX: 0, y: 0, zIndex: 1 }
                }
                transition={{
                  duration: 0.3,
                  ease: "backOut",
                  zIndex: { delay: hoveredId === index ? 0 : 0.4 },
                }}
                onMouseEnter={() => setHoveredId(index)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ transformPerspective: 1000 }}
              >
                <div className={`w-full h-full ${item.bgColor}`}>
                  <img
                    src={item.image}
                    alt="Showcase item"
                    className="w-full h-full object-cover object-top pointer-events-none"
                    draggable="false"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    animation: hoveredId === index ? "card-shine 0.8s ease-out forwards" : "none",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: Founder Connect Preview ──────────────────────────────────────

const founderAvatars = [
  [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop",
  ],
];

const scrollLabels = [
  "Looking for feedback",
  "Open to collabs",
  "Hiring",
  "Shipping weekly",
];

export function FounderConnectPreview(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div {...fadeInUp}>
          <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Base India Inner Circle
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Tap a builder, open their X, and say hi. Collaboration beats clout.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: easeOut }}
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        >
          <Circles
            rows={founderAvatars}
            circleSize={56}
            baseRadius={70}
            orbitGap={72}
            rotationDuration={30}
            rowDelay={3}
            direction="clockwise"
            alternateDirection={true}
            fadeMode="in"
            fadeBlur={true}
            showPaths={true}
            animate={true}
            animationDuration={0.8}
            animationStagger={0.15}
          />
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          {...fadeInUp}
        >
          {scrollLabels.map((label) => (
            <span
              key={label}
              className="bg-foreground/5 text-muted-foreground rounded-full px-4 py-1.5 text-sm"
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          {...fadeInUp}
        >
          <Link
            href="/founders"
            className="bg-accent group inline-flex items-center gap-3 rounded-md py-3 pl-5 pr-3 font-medium text-white shadow-lg shadow-accent/25 transition-all duration-500 hover:rounded-[50px]"
          >
            <span>Meet founders</span>
            <span className="bg-white text-accent flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="relative left-px h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/submit"
            className="text-foreground rounded-md bg-foreground/5 px-6 py-3 font-medium transition-all duration-500 hover:rounded-[50px] hover:bg-foreground/10"
          >
            Add my profile
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 8: Stats Band (Stats5 style) ───────────────────────────────────

function CountUp({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || counted.current || !ref.current) return;
    counted.current = true;
    const el = ref.current;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

const statsData = [
  { value: 12, suffix: "+", description: "Projects listed & verified" },
  { value: 12, suffix: "+", description: "Founders in the inner circle" },
  { value: 30, suffix: "+", description: "Proof links verified" },
];

export function StatsSection(): ReactNode {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-4xl overflow-hidden bg-[#0052FF] px-6 sm:px-8 py-16"
        >
          <motion.img
            initial={{ filter: "blur(20px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/svg/world-map.svg"
            alt=""
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full object-cover"
          />

          <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-medium tracking-tight text-white text-center leading-tight max-w-4xl"
            >
              Base India Circle is growing
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full max-w-4xl">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center text-center gap-3 sm:gap-4"
                >
                  <span className="text-4xl sm:text-5xl font-semibold text-white">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </span>
                  <p className="text-sm sm:text-base text-white/80 max-w-xs">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/submit"
                className="px-8 sm:px-10 py-3 rounded-md bg-neutral-900 text-white font-semibold text-base sm:text-lg hover:bg-neutral-800 transition-colors duration-200 no-underline"
              >
                Get Listed
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 9: For Who ──────────────────────────────────────────────────────

export function ForWhoSection(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="mb-12 text-center text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl"
          {...fadeInUp}
        >
          Built for builders. Useful for everyone.
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            className="bg-muted rounded-2xl p-8 md:p-10 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Zap className="text-foreground h-10 w-10 mb-6" strokeWidth={1} />
            <h3 className="mb-4 text-2xl font-medium tracking-tight">Builders</h3>
            <ul className="text-muted-foreground space-y-2 text-base flex-1">
              <li>Get discovered early</li>
              <li>Collect feedback fast</li>
              <li>Find collaborators</li>
            </ul>
            <Link
              href="/submit"
              className="bg-foreground group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-background transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
            >
              <span>Submit a project</span>
              <span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="relative left-px h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            className="bg-muted rounded-2xl p-8 md:p-10 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            <Eye className="text-foreground h-10 w-10 mb-6" strokeWidth={1} />
            <h3 className="mb-4 text-2xl font-medium tracking-tight">Scouts</h3>
            <p className="text-muted-foreground/60 text-sm mb-4">
              founders, investors, devrels, hiring
            </p>
            <ul className="text-muted-foreground space-y-2 text-base flex-1">
              <li>Find real builders</li>
              <li>Verify quickly via proof links</li>
              <li>Reach founders directly</li>
            </ul>
            <Link
              href="#projects"
              className="bg-foreground group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-background transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
            >
              <span>Browse projects</span>
              <span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="relative left-px h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 10: Guidelines (Comparison style) ─────────────────────────────

const comparisonFeatures = [
  { name: "Shipped MVP or demo", ours: true, others: false },
  { name: "Onchain proof links", ours: true, others: false },
  { name: "India-based builder verified", ours: true, others: false },
  { name: "No pay-to-win listings", ours: true, others: true },
  { name: "Direct founder contact", ours: true, others: false },
];

export function GuidelinesSection(): ReactNode {
  return (
    <section id="guidelines" className="relative w-full bg-background px-8 py-12 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="mb-6 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              The bar is simple.
            </h2>
            <p className="mb-8 text-md max-w-md leading-relaxed text-muted-foreground">
              Base India Circle vs. typical directories — we verify onchain
              usage, require proof links, and connect you directly with founders.
              No follower-count gating. No pay-to-win.
            </p>
            <div>
              <Link
                href="/submit"
                className="w-full rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition-colors hover:bg-foreground/90 no-underline inline-block text-center md:w-auto"
              >
                Submit Your Project
              </Link>
            </div>
          </motion.div>

          <div className="w-full">
            <div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center"
              >
                <span className="text-2xl font-bold text-foreground md:text-3xl">
                  Base India
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center"
              >
                <span className="text-2xl font-bold tracking-wider text-muted-foreground md:text-3xl">
                  Others
                </span>
              </motion.div>
            </div>

            <div className="space-y-3">
              {comparisonFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="grid grid-cols-2 gap-4 md:gap-6"
                >
                  <div className="flex items-center gap-3 py-4">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        feature.ours
                          ? "bg-[#0052FF]"
                          : "border-2 border-border"
                      }`}
                    >
                      {feature.ours && (
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground md:text-base">
                      {feature.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 py-4">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        feature.others
                          ? "bg-foreground"
                          : "border-2 border-border"
                      }`}
                    >
                      {feature.others && (
                        <svg
                          className="h-4 w-4 text-background"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium md:text-base ${
                        feature.others
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: About (team + community) ────────────────────────────────────────

const TEAM = [
  {
    name: "Maaz",
    links: [
      { label: "X", href: "https://x.com/Maaztwts", icon: ExternalLink },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/maaz--/", icon: Linkedin },
      { label: "GitHub", href: "https://github.com/somewherelostt", icon: Github },
      { label: "Email", href: "mailto:abumaaz2004@gmail.com", icon: Mail },
    ],
    note: null,
  },
  {
    name: "Rupam",
    links: [{ label: "X", href: "https://x.com/0xrupamp26", icon: ExternalLink }],
    note: "More links coming soon",
  },
  {
    name: "Satyam",
    links: [{ label: "X", href: "https://x.com/satyam10124", icon: ExternalLink }],
    note: "More links coming soon",
  },
] as const;

export function AboutSection(): ReactNode {
  return (
    <section id="about" className="relative w-full scroll-mt-20 bg-background px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            About us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built by India-based builders, for the Base ecosystem.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TEAM.map((person, i) => (
            <motion.div
              key={person.name}
              className="group relative rounded-2xl border border-border bg-muted/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-muted/30"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
            >
              <p className="mb-4 font-semibold text-foreground">{person.name}</p>
              <div className="flex flex-wrap gap-2">
                {person.links.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    aria-label={`${person.name} on ${label}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              {person.note && (
                <p className="mt-3 text-xs text-muted-foreground">{person.note}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 rounded-2xl border border-border bg-muted/20 p-6 text-center backdrop-blur-sm md:mt-12 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
        >
          <p className="text-sm font-medium text-muted-foreground">
            A community project with the help of{" "}
            <Link
              href="https://innercircle.so/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent"
            >
              Inner Circle
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="https://innercircle.so/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <Globe className="h-4 w-4" />
              innercircle.so
            </Link>
            <Link
              href="https://x.com/innercircle_so"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" />
              @innercircle_so
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 11: Final CTA ───────────────────────────────────────────────────

export function FinalCTASection(): ReactNode {
  return (
    <section className="px-6 py-24 md:py-36">
      <motion.div
        className="bg-accent relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 text-center text-white md:rounded-4xl md:px-12 md:py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div className="relative z-10">
          <motion.h2
            className="mx-auto mb-6 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            Shipping on Base from India? Get listed.
          </motion.h2>

          <motion.p
            className="mx-auto mb-10 max-w-md text-lg text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
          >
            It takes 2 minutes. Proof links help you get verified faster.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
          >
            <Link
              href="/submit"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-white py-3 pl-5 pr-3 font-medium text-accent transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto"
            >
              <span>Submit a project</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="h-4 w-4 relative left-px" />
              </span>
            </Link>
            <Link
              href="/directory"
              className="rounded-md bg-white/10 px-6 py-3 font-medium text-white transition-all duration-500 hover:rounded-[50px] hover:bg-white/20"
            >
              Browse directory
            </Link>
          </motion.div>

          <motion.p
            className="mt-8 text-sm text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            No pay-to-win. No spam. Just builders.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
