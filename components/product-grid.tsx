"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "motion/react";
import { projects, categories, batches, categorySubFilters, type Project } from "@/lib/data";
import { ChevronDown, ChevronUp } from "lucide-react";

const AUTO_SCROLL_SPEED = -18;
const CAROUSEL_REPEAT_COUNT = 5;
const CARD_HEIGHTS = ["h-[360px]", "h-[400px]", "h-[380px]", "h-[420px]"];

function getCategoryAccent(category: string): { border: string; tint: string; text: string } {
  const palette: Record<string, { border: string; tint: string; text: string }> = {
    AI: { border: "#FF6B35", tint: "rgba(255,107,53,0.45)", text: "text-orange-300" },
    Consumer: { border: "#EC4899", tint: "rgba(236,72,153,0.45)", text: "text-pink-300" },
    DeFi: { border: "#0052FF", tint: "rgba(0,82,255,0.48)", text: "text-blue-300" },
    Gaming: { border: "#F59E0B", tint: "rgba(245,158,11,0.45)", text: "text-amber-300" },
    Infra: { border: "#06B6D4", tint: "rgba(6,182,212,0.45)", text: "text-cyan-300" },
    "Mini-apps": { border: "#8B5CF6", tint: "rgba(139,92,246,0.45)", text: "text-violet-300" },
    NFT: { border: "#A855F7", tint: "rgba(168,85,247,0.45)", text: "text-purple-300" },
    DAO: { border: "#D946EF", tint: "rgba(217,70,239,0.45)", text: "text-fuchsia-300" },
    Identity: { border: "#0EA5E9", tint: "rgba(14,165,233,0.45)", text: "text-sky-300" },
    Social: { border: "#10B981", tint: "rgba(16,185,129,0.45)", text: "text-green-300" },
    Payments: { border: "#14B8A6", tint: "rgba(20,184,166,0.45)", text: "text-emerald-300" },
  };

  return palette[category] || { border: "#0052FF", tint: "rgba(0,82,255,0.45)", text: "text-blue-300" };
}

function ProjectCarousel({ items }: { items: Project[] }) {
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

          return (
            <motion.a
              key={key}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative shrink-0 w-[280px] sm:w-[320px] ${heightClass} overflow-hidden rounded-2xl border text-white`}
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
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
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xl font-semibold">
                    {project.logo}
                  </div>
                  <span className={`rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium ${accent.text}`}>
                    {project.category}
                  </span>
                </div>

                <div className="mt-auto rounded-xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm">
                  <h3 className="truncate text-lg font-semibold text-white">{project.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/70">{project.description}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                    <span
                      role="link"
                      tabIndex={0}
                      className="cursor-pointer hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://x.com/${project.founderTwitter}`, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://x.com/${project.founderTwitter}`, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      @{project.founderTwitter}
                    </span>
                    <span className="truncate pl-3">{project.batch}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}

function tagMatchesSubFilter(projectTags: string[], selectedSubFilters: Set<string>): boolean {
  if (selectedSubFilters.size === 0) return true;
  return projectTags.some((tag) =>
    Array.from(selectedSubFilters).some((s) => s.toLowerCase() === tag.toLowerCase())
  );
}

const BATCH_DROPDOWN_ID = "__batch__";
const batchOptions = batches.filter((b) => b !== "All Batches");

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, Set<string>>>({});
  const [selectedBatches, setSelectedBatches] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const filtered = projects.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const subFilters = activeCategory !== "All" ? selectedSubFilters[activeCategory] : undefined;
    const matchesSubFilters = !subFilters || subFilters.size === 0 || tagMatchesSubFilter(p.tags, subFilters);
    const matchesBatch = selectedBatches.size === 0 || selectedBatches.has(p.batch);
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSubFilters && matchesBatch && matchesSearch;
  });

  const categoriesWithoutAll = categories.filter((c) => c !== "All");

  return (
    <section id="projects" className="px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ecosystem Projects
          </h2>
          <p className="mt-2 text-muted-foreground">
            Products shipped by Indian founders building on Base
          </p>
        </div>

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

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} shown
          </p>
        </div>
      </div>
    </section>
  );
}
