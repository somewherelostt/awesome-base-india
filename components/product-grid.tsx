"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, categories, batches, categorySubFilters, type Project } from "@/lib/data";
import { ChevronDown, ChevronUp } from "lucide-react";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const colorMap: Record<string, string> = {
    AI: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Consumer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    DeFi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Gaming: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Infra: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Mini-apps": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    NFT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    DAO: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    Identity: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    Social: "bg-green-500/10 text-green-400 border-green-500/20",
    Payments: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const badgeClass = colorMap[project.category] || "bg-accent/10 text-accent border-accent/20";

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
          {project.logo}
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeClass}`}>
          {project.category}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
        {project.name}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
            {project.founder.split(" ").map((n) => n[0]).join("")}
          </div>
          <a
            href={`https://x.com/${project.founderTwitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            @{project.founderTwitter}
          </a>
        </div>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {project.batch}
        </span>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </motion.a>
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
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </AnimatePresence>
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
