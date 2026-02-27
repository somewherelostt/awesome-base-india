import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { FounderLocationMapClient } from "@/components/founder-location-map-client";
import { ThemeSwitch } from "@/components/theme-switch";
import { getAllFounderUsernames, getFounderByUsername } from "@/lib/founder";
import { projects } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";
import { Github, MapPin, Trophy, Briefcase, Award, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateStaticParams() {
  const fromMdx = getAllFounderUsernames();
  const fromProjects = new Set<string>();
  projects.forEach((p) => {
    if (p.founderTwitter) fromProjects.add(p.founderTwitter);
    (p.founders || []).forEach((f) => {
      if (f.twitter) fromProjects.add(f.twitter);
    });
  });
  const all = [...new Set([...fromMdx, ...fromProjects])];
  return all.map((username) => ({ username }));
}

type ProjectMatch = {
  project: (typeof projects)[0];
  founderName: string;
  founderGithub?: string;
  role: "primary" | "co-founder";
};

/** All projects this founder is part of (primary or co-founder). Supports multiple projects and future batches. */
function findAllProjectsForFounder(username: string): ProjectMatch[] {
  const lower = username.toLowerCase();
  const out: ProjectMatch[] = [];
  for (const p of projects) {
    if ((p.founderTwitter || "").toLowerCase() === lower) {
      out.push({
        project: p,
        founderName: p.founder,
        ...(p.founderGithub ? { founderGithub: p.founderGithub } : {}),
        role: "primary",
      });
      continue;
    }
    const coFounder = (p.founders || []).find((f) => (f.twitter || "").toLowerCase() === lower);
    if (coFounder) {
      out.push({
        project: p,
        founderName: coFounder.name,
        ...(coFounder.github ? { founderGithub: coFounder.github } : {}),
        role: "co-founder",
      });
    }
  }
  return out;
}

function findProjectForFounder(username: string): ProjectMatch | null {
  const all = findAllProjectsForFounder(username);
  return all[0] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const founder = getFounderByUsername(username);
  const match = findProjectForFounder(username);
  const name = founder?.frontmatter.name ?? match?.founderName ?? username;
  const description = founder?.frontmatter.short_bio ?? `Founder profile – ${name}`;
  return createMetadata({
    title: name,
    description,
    path: `/founders/${username}`,
  });
}

function getSimilarFounders(currentUsername: string, tags: string[] = [], limit = 5) {
  const others = projects
    .filter((p) => (p.founderTwitter || "").toLowerCase() !== currentUsername.toLowerCase())
    .map((p) => ({
      username: p.founderTwitter,
      name: p.founder,
      project: p.name,
      batch: p.batch,
      tags: p.tags || [],
    }))
    .filter((f) => f.username);
  const tagStrings = (tags || []).map((t) => String(t).toLowerCase());
  const scored = others.map((f) => {
    const otherTags = (f.tags || []).map((t) => String(t));
    const tagOverlap = otherTags.filter((t) =>
      tagStrings.some((tt) => tt.includes(t.toLowerCase()) || t.toLowerCase().includes(tt))
    ).length;
    return { ...f, score: tagOverlap };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

const FOUNDER_PLACEHOLDER = "Add your focus areas and current projects here.";

/** Tags to show: prefer project tags when founder has projects; else MDX tags deduped and filtered. */
function getDisplayTags(
  mdxTags: string[] | undefined,
  projectTags: string[]
): string[] {
  if (projectTags.length > 0) {
    const seen = new Set<string>();
    return projectTags.filter((t) => {
      const key = t.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 14);
  }
  const raw = (mdxTags ?? []).map((t) => t.trim()).filter(Boolean);
  const stopWords = new Set(["the", "and", "for", "with", "have", "are", "but", "not", "you", "all", "can", "had", "our", "out", "get", "has", "how", "its", "may", "now", "old", "see", "way", "who", "did", "got", "let", "put", "say", "she", "too", "use", "with"]);
  const seen = new Set<string>();
  const filtered = raw.filter((t) => {
    const key = t.toLowerCase();
    if (seen.has(key) || t.length < 2) return false;
    if (t.length <= 3 && stopWords.has(key)) return false;
    seen.add(key);
    return true;
  });
  return filtered.slice(0, 12);
}

export default async function FounderPage({ params }: PageProps) {
  const { username } = await params;
  const founder = getFounderByUsername(username);
  const allProjects = findAllProjectsForFounder(username);
  const match = allProjects[0] ?? null;
  if (!founder && !match) notFound();

  const projectMatch = match?.project;
  const baseF = founder?.frontmatter ?? {
    username,
    name: match!.founderName,
    city: null,
    country: "India",
    short_bio: null,
    profile_image: null,
    github: match!.founderGithub ?? null,
    twitter: username,
    hackathons_attended: 0,
    projects_built: 0,
    prizes_won: 0,
    prize_winnings_amount: 0,
    onchain_creds_claimed: 0,
    tags: projectMatch!.tags?.slice(0, 8) ?? [],
  };
  // Derive stats from actual project data (founder can have multiple projects / batches)
  const projectsBuilt = allProjects.length;
  const hackathonsFromData = new Set(allProjects.map((m) => m.project.batch)).size;
  const f: typeof baseF = {
    ...baseF,
    projects_built: projectsBuilt > 0 ? projectsBuilt : (baseF.projects_built ?? 0),
    hackathons_attended: hackathonsFromData > 0 ? hackathonsFromData : (baseF.hackathons_attended ?? 0),
  };
  const rawContent =
    founder?.content ??
    `## About\n\nBuilder from India.\n\n## Projects\n\n[${projectMatch!.name}](${projectMatch!.url})`;
  // Remove placeholder and empty "What I'm Building" section so the page stays clean
  const content = rawContent
    .replace(/\*?\s*Add your focus areas and current projects here\.\s*\*?/gi, "")
    .replace(/\n## What I'm Building\s*\n(?=\s*##|$)/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const similar = getSimilarFounders(username, f.tags || []);
  const projectTags = Array.from(
    new Set(allProjects.flatMap((m) => m.project.tags ?? []))
  );
  const displayTags = getDisplayTags(f.tags, projectTags);

  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Hero */}
          <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="shrink-0">
              {f.profile_image ? (
                <img
                  src={f.profile_image}
                  alt=""
                  className="h-28 w-28 rounded-2xl object-cover ring-2 ring-border shadow-sm sm:h-32 sm:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-accent/15 text-3xl font-bold text-accent shadow-sm sm:h-32 sm:w-32">
                  {f.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {f.name}
              </h1>
              {(f.city || f.country) && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {[f.city, f.country].filter(Boolean).join(", ")}
                </p>
              )}
              {f.short_bio && (
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {f.short_bio}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {f.twitter && (
                  <a
                    href={f.twitter.startsWith("http") ? f.twitter : `https://x.com/${f.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    @{f.twitter.replace(/^@/, "").split("/").pop()}
                  </a>
                )}
                {f.github && (
                  <a
                    href={f.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
              {/* Stats row */}
              <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="text-lg font-semibold text-foreground">{f.projects_built ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Hackathons</span>
                  <span className="text-lg font-semibold text-foreground">{f.hackathons_attended ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Prizes</span>
                  <span className="text-lg font-semibold text-foreground">{f.prizes_won ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Onchain creds</span>
                  <span className="text-lg font-semibold text-foreground">{f.onchain_creds_claimed ?? 0}</span>
                </div>
              </div>
            </div>
          </header>

          {/* About (MDX body) */}
          {content.replace(/#+\s*/g, "").trim().length > 0 && (
            <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">About</h2>
              <div
                className={[
                  "founder-prose mt-4 prose prose-base max-w-none dark:prose-invert",
                  "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4",
                  "prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3",
                  "prose-h2:text-base prose-h3:text-sm",
                  "prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-li:text-muted-foreground",
                  "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
                ].join(" ")}
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </section>
          )}

          {/* Projects */}
          <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Projects</h2>
            {allProjects.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {allProjects.map((m) => (
                  <li key={m.project.slug ?? m.project.id}>
                    <Link
                      href={`/projects/${m.project.slug ?? m.project.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4 transition-colors hover:border-border hover:bg-muted/40"
                    >
                      <div>
                        <p className="font-medium text-foreground">{m.project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.project.batch}
                          {m.role === "co-founder" ? " · Co-founder" : ""}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">View →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No projects in this directory yet. Building on Base from India.
              </p>
            )}
          </section>

          {/* Tags */}
          {displayTags.length > 0 && (
            <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">Interests & skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {displayTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted/80 px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Similar founders */}
          {similar.length > 0 && (
            <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">Similar builders</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {similar.map((s) => (
                  <li key={s.username}>
                    <Link
                      href={`/founders/${s.username}`}
                      className="block rounded-xl border border-border/60 p-4 transition-colors hover:border-border hover:bg-muted/40"
                    >
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.project} · {s.batch}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Map — compact at bottom */}
          {(f.city || f.country) && (
            <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Location
              </h2>
              <FounderLocationMapClient
                city={f.city ?? null}
                label={f.name}
                className="h-64 w-full rounded-xl border border-border sm:h-72"
              />
            </section>
          )}
        </div>
      </main>
      <BaseFooter />
    </>
  );
}
