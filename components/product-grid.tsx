"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "motion/react";
import { projects, categories, batches, categorySubFilters, type Project } from "@/lib/data";
import { ChevronDown, ChevronUp, Github, ExternalLink, Trophy } from "lucide-react";

const AUTO_SCROLL_SPEED = -18;
const CAROUSEL_REPEAT_COUNT = 5;
const CARD_HEIGHTS = ["h-[360px]", "h-[400px]", "h-[380px]", "h-[420px]"];

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  const random = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

function getCategoryAccent(category: string): { border: string; tint: string; text: string } {
  const palette: Record<string, { border: string; tint: string; text: string }> = {
    AI: { border: "#FF8C00", tint: "rgba(255,140,0,0.45)", text: "text-orange-300" },
    Consumer: { border: "#FF8C00", tint: "rgba(255,140,0,0.45)", text: "text-orange-300" },
    DeFi: { border: "#0052FF", tint: "rgba(0,82,255,0.48)", text: "text-blue-300" },
    Gaming: { border: "#FF8C00", tint: "rgba(255,140,0,0.45)", text: "text-orange-300" },
    Infra: { border: "#0052FF", tint: "rgba(0,82,255,0.48)", text: "text-blue-300" },
    "Mini-apps": { border: "#C87BFF", tint: "rgba(200,123,255,0.45)", text: "text-purple-300" },
    NFT: { border: "#C87BFF", tint: "rgba(200,123,255,0.45)", text: "text-purple-300" },
    DAO: { border: "#C87BFF", tint: "rgba(200,123,255,0.45)", text: "text-purple-300" },
    Identity: { border: "#0052FF", tint: "rgba(0,82,255,0.48)", text: "text-blue-300" },
    Social: { border: "#00C851", tint: "rgba(0,200,81,0.45)", text: "text-green-300" },
    Payments: { border: "#00C851", tint: "rgba(0,200,81,0.45)", text: "text-green-300" },
  };

  return palette[category] || { border: "#0052FF", tint: "rgba(0,82,255,0.45)", text: "text-blue-300" };
}

function ProjectCarousel({ items }: { items: Project[] }) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [oneSetWidth, setOneSetWidth] = useState(0);
  const baseX = useMotionValue(0);
  const scrollVelocity = useRef(AUTO_SCROLL_SPEED);

  const repeatedItems = Array.from({ length: CAROUSEL_REPEAT_COUNT }, (_, repeatIndex) =>
    items.map((project, index) => ({
      project,
      key: `${project.id}-${repeatIndex}`,
      index,
    }))
  ).flat();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      const cardWidth = isMobile ? 280 : 320;
      const gap = 20;
      const width = (cardWidth + gap) * items.length;
      setOneSetWidth(width);
      baseX.set(-width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [items.length, baseX]);

  useAnimationFrame((_, delta) => {
    if (!oneSetWidth || isDragging) return;

    scrollVelocity.current = scrollVelocity.current * 0.9 + AUTO_SCROLL_SPEED * 0.1;
    const moveBy = scrollVelocity.current * (delta / 1000);
    baseX.set(baseX.get() + moveBy);

    const currentX = baseX.get();
    if (currentX <= -oneSetWidth * 2) {
      baseX.set(currentX + oneSetWidth);
    } else if (currentX > 0) {
      baseX.set(currentX - oneSetWidth);
    }
  });

  return (
    <div className="relative -mx-4 overflow-hidden py-8 sm:-mx-6 lg:-mx-8">
      <motion.div
        className="flex items-end gap-5 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing"
        style={{ x: baseX }}
        drag="x"
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          scrollVelocity.current = info.velocity.x;
        }}
        dragElastic={0.05}
        dragMomentum={false}
      >
        {repeatedItems.map(({ project, key, index }) => {
          const accent = getCategoryAccent(project.category);
          const isHovered = hoveredCard === key;
          const heightClass = CARD_HEIGHTS[index % CARD_HEIGHTS.length];

          const projectHref = `/projects/${project.slug ?? project.id}`;
          return (
            <motion.div
              key={key}
              role="link"
              tabIndex={0}
              className={`group relative shrink-0 w-[280px] sm:w-[320px] ${heightClass} overflow-hidden rounded-2xl border text-white cursor-pointer`}
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => router.push(projectHref)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(projectHref);
                }
              }}
              animate={
                isHovered
                  ? { scale: 1.04, rotateX: -14, y: -18, zIndex: 50 }
                  : { scale: 1, rotateX: 0, y: 0, zIndex: 1 }
              }
              transition={{
                duration: 0.28,
                ease: "backOut",
                zIndex: { delay: isHovered ? 0 : 0.35 },
              }}
              style={{
                borderColor: `${accent.border}70`,
                transformPerspective: 1000,
                boxShadow: isHovered ? `0 25px 80px ${accent.tint}` : "none",
                background: `
                  linear-gradient(180deg, rgba(10,10,10,0.10) 0%, rgba(10,10,10,0.72) 58%, rgba(10,10,10,0.96) 100%),
                  radial-gradient(circle at 72% 10%, ${accent.tint} 0%, rgba(0,0,0,0) 52%),
                  #070707
                `,
              }}
            >
              <div className="relative flex h-full flex-col p-5">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/10 text-xl font-semibold">
                    {project.logo.startsWith("http") ? (
                      <img src={project.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      project.logo
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col items-end gap-1.5">
                    {(project.prizes?.length ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-200">
                        <Trophy className="h-3 w-3 shrink-0" />
                        <span className="truncate">{project.prizes![0]}</span>
                      </span>
                    )}
                    <span className={`rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium ${accent.text}`}>
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="mt-auto rounded-xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm">
                  <h3 className="truncate text-lg font-semibold text-white">{project.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/70">{project.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-white/60">
                    <span
                      role="link"
                      tabIndex={0}
                      className="cursor-pointer hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://x.com/${project.founderTwitterHandle || project.founderTwitter}`, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://x.com/${project.founderTwitterHandle || project.founderTwitter}`, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      @{project.founderTwitterHandle || project.founderTwitter}
                    </span>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="GitHub"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.farcaster && (
                      <a
                        href={project.farcaster}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Farcaster"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <span className="truncate pl-0">{project.batch}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function tagMatchesSubFilter(projectTags: unknown[], selectedSubFilters: Set<string>): boolean {
  if (selectedSubFilters.size === 0) return true;
  return projectTags.some((tag) => {
    const tagStr = tag != null && typeof tag === "string" ? tag : String(tag);
    return Array.from(selectedSubFilters).some(
      (s) => String(s).toLowerCase() === tagStr.toLowerCase()
    );
  });
}

const BATCH_DROPDOWN_ID = "__batch__";
const batchOptions = batches.filter((b) => b !== "All Batches");

interface ProductGridProps {
  projects?: Project[];
  randomizeShowcase?: boolean;
  showcaseCount?: number;
  showViewAllButton?: boolean;
}

export function ProductGrid(props?: ProductGridProps) {
  const projectsToUse = props?.projects ?? projects;
  const randomizeShowcase = props?.randomizeShowcase ?? false;
  const showcaseCount = props?.showcaseCount ?? 15;
  const showViewAllButton = props?.showViewAllButton ?? false;
  const [randomSeed, setRandomSeed] = useState<number | null>(null);
  useEffect(() => {
    setRandomSeed(Math.floor(Math.random() * 1_000_000_000));
  }, []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, Set<string>>>({});
  const [selectedBatches, setSelectedBatches] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchQuery), 180);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  const sourceProjects = useMemo(() => {
    if (!randomizeShowcase) return projectsToUse;
    const seed = randomSeed ?? 0;
    return shuffleWithSeed(projectsToUse, seed).slice(0, Math.min(showcaseCount, projectsToUse.length));
  }, [projectsToUse, randomSeed, randomizeShowcase, showcaseCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubFilter = (category: string, value: string) => {
    setSelectedSubFilters((prev) => {
      const set = new Set(prev[category] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [category]: set };
    });
  };

  const toggleBatch = (batch: string) => {
    setSelectedBatches((prev) => {
      const next = new Set(prev);
      if (next.has(batch)) next.delete(batch);
      else next.add(batch);
      return next;
    });
  };

  const filtered = sourceProjects
    .filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const subFilters = activeCategory !== "All" ? selectedSubFilters[activeCategory] : undefined;
      const matchesSubFilters = !subFilters || subFilters.size === 0 || tagMatchesSubFilter(Array.isArray(p.tags) ? p.tags : [], subFilters);
      const matchesBatch = selectedBatches.size === 0 || selectedBatches.has(p.batch);
      const q = typeof debouncedSearch === "string" ? debouncedSearch.trim().toLowerCase() : "";
      const matchesSearch =
        q === "" ||
        String(p.name ?? "").toLowerCase().includes(q) ||
        String(p.description ?? "").toLowerCase().includes(q) ||
        String(p.founder ?? "").toLowerCase().includes(q) ||
        (Array.isArray(p.tags) ? p.tags : []).some((t) =>
          String(t ?? "").toLowerCase().includes(q)
        );
      return matchesCategory && matchesSubFilters && matchesBatch && matchesSearch;
    })
    .sort((a, b) => {
      // When a batch is selected, show prize winners at the top
      if (selectedBatches.size > 0) {
        const aHasPrize = (a.prizes?.length ?? 0) > 0 ? 1 : 0;
        const bHasPrize = (b.prizes?.length ?? 0) > 0 ? 1 : 0;
        if (bHasPrize !== aHasPrize) return bHasPrize - aHasPrize;
      }
      return 0;
    });

  const categoriesWithoutAll = categories.filter((c) => c !== "All");

  return (
    <section id="projects" className="px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ecosystem Projects
              </h2>
              <p className="mt-2 text-muted-foreground">
                {randomizeShowcase
                  ? "Random projects on every visit. Discover someone new each time."
                  : "Products shipped by Indian founders building on Base"}
              </p>
            </div>
            {showViewAllButton && (
              <Link
                href="/directory"
                className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                View all projects
              </Link>
            )}
          </div>
        </div>

        {!randomizeShowcase && (
          <div className="mb-8">
          <div
            className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/30 px-3 py-2.5 dark:bg-muted/10"
            ref={dropdownRef}
          >
            <button
              onClick={() => {
                setActiveCategory("All");
                setOpenDropdown(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === "All"
                  ? "bg-background text-foreground shadow-sm dark:bg-neutral-800"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground dark:hover:bg-neutral-800/60"
              }`}
            >
              All
            </button>
            {categoriesWithoutAll.map((cat) => {
              const hasDropdown = (categorySubFilters[cat]?.length ?? 0) > 0;
              const isOpen = openDropdown === cat;
              const selected = selectedSubFilters[cat];
              const count = selected?.size ?? 0;
              const isActive = activeCategory === cat;

              return (
                <div key={cat} className="relative">
                  <button
                    onClick={() => {
                      if (hasDropdown) {
                        setOpenDropdown(isOpen ? null : cat);
                        setActiveCategory(cat);
                      } else {
                        setActiveCategory(cat);
                        setOpenDropdown(null);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-background text-foreground shadow-sm dark:bg-neutral-800"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground dark:hover:bg-neutral-800/60"
                    }`}
                  >
                    {cat}
                    {hasDropdown && (isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                    {count > 0 && (
                      <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs font-medium text-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                  {hasDropdown && isOpen && (
                    <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[200px] rounded-xl border border-border/60 bg-background py-1.5 shadow-lg dark:border-neutral-700">
                      {(categorySubFilters[cat] ?? []).map((option) => {
                        const checked = selectedSubFilters[cat]?.has(option) ?? false;
                        return (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSubFilter(cat, option)}
                              className="h-3.5 w-3.5 rounded border-neutral-300 text-accent focus:ring-accent dark:border-neutral-600"
                            />
                            <span className="capitalize">{option.replace(/-/g, " ")}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === BATCH_DROPDOWN_ID ? null : BATCH_DROPDOWN_ID)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBatches.size > 0
                    ? "bg-background text-foreground shadow-sm dark:bg-neutral-800"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground dark:hover:bg-neutral-800/60"
                }`}
              >
                Batch
                {openDropdown === BATCH_DROPDOWN_ID ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {selectedBatches.size > 0 && (
                  <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs font-medium text-foreground">
                    {selectedBatches.size}
                  </span>
                )}
              </button>
              {openDropdown === BATCH_DROPDOWN_ID && (
                <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[220px] rounded-xl border border-border/60 bg-background py-1.5 shadow-lg dark:border-neutral-700">
                  {batchOptions.map((batch) => {
                    const checked = selectedBatches.has(batch);
                    return (
                      <label
                        key={batch}
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBatch(batch)}
                          className="h-3.5 w-3.5 rounded border-neutral-300 text-accent focus:ring-accent dark:border-neutral-600"
                        />
                        <span>{batch}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="relative ml-auto w-full min-w-0 shrink-0 sm:w-48">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-0 bg-background/80 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 dark:bg-neutral-800/80 dark:focus:bg-neutral-800"
              />
            </div>
          </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProjectCarousel items={filtered} />
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg font-medium text-muted-foreground">
                No projects found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Try adjusting your filters
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          {randomizeShowcase ? (
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-muted/50 hover:text-accent dark:bg-muted/20 dark:hover:bg-muted/30"
            >
              View more
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""} shown
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
