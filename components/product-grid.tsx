"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, categories, batches, type Project } from "@/lib/data";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const colorMap: Record<string, string> = {
    AI: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Consumer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    DeFi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Gaming: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Infra: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Mini-apps": "bg-violet-500/10 text-violet-400 border-violet-500/20",
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

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBatch, setActiveBatch] = useState("All Batches");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = projects.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesBatch = activeBatch === "All Batches" || p.batch === activeBatch;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.founder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBatch && matchesSearch;
  });

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

        <div className="mb-8 space-y-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
              placeholder="Search projects, founders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setActiveBatch(batch)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeBatch === batch
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {batch}
              </button>
            ))}
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
