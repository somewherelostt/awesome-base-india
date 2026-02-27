import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { FounderLocationMapClient } from "@/components/founder-location-map-client";
import { ThemeSwitch } from "@/components/theme-switch";
import { getAllFounderUsernames, getFounderByUsername } from "@/lib/founder";
import { projects } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";
import { Github } from "lucide-react";
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

function findProjectForFounder(username: string): { project: (typeof projects)[0]; founderName: string; founderGithub?: string } | null {
  const lower = username.toLowerCase();
  for (const p of projects) {
    if ((p.founderTwitter || "").toLowerCase() === lower) {
      return { project: p, founderName: p.founder, ...(p.founderGithub ? { founderGithub: p.founderGithub } : {}) };
    }
    const coFounder = (p.founders || []).find((f) => (f.twitter || "").toLowerCase() === lower);
    if (coFounder) {
      return { project: p, founderName: coFounder.name, ...(coFounder.github ? { founderGithub: coFounder.github } : {}) };
    }
  }
  return null;
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

export default async function FounderPage({ params }: PageProps) {
  const { username } = await params;
  const founder = getFounderByUsername(username);
  const match = findProjectForFounder(username);
  if (!founder && !match) notFound();

  const projectMatch = match?.project;
  const f = founder?.frontmatter ?? {
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
  const content = founder?.content ?? `## About\n\nBuilder from India.\n\n## Project\n\n[${projectMatch!.name}](${projectMatch!.url})`;
  const similar = getSimilarFounders(username, f.tags || []);

  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main className="min-h-screen bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-3 sm:px-8">
          {/* Left: NS-style profile card + intro + tags + similar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  {f.profile_image ? (
                    <img
                      src={f.profile_image}
                      alt=""
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
                      {f.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h1 className="text-xl font-bold text-foreground">{f.name}</h1>
                  {(f.city || f.country) && (
                    <p className="text-sm text-muted-foreground">
                      {[f.city, f.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {f.short_bio && (
                    <p className="mt-1 text-sm text-foreground">{f.short_bio}</p>
                  )}
                  <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                    {f.twitter && (
                      <a
                        href={f.twitter.startsWith("http") ? f.twitter : `https://x.com/${f.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        X
                      </a>
                    )}
                    {f.github && (
                      <a
                        href={f.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Devfolio stats</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-foreground">{f.hackathons_attended ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Hackathons</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{f.projects_built ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{f.prizes_won ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Prizes won</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{f.onchain_creds_claimed ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Onchain creds</p>
                </div>
              </div>
            </div>

            {/* Introduction (MDX body) */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>

            {/* Tags */}
            {(f.tags?.length ?? 0) > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.tags!.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar profiles */}
            {similar.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Similar profiles</h3>
                <ul className="mt-4 space-y-3">
                  {similar.map((s) => (
                    <li key={s.username}>
                      <Link
                        href={`/founders/${s.username}`}
                        className="block rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                      >
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.project} · {s.batch}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: India map */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Location · India
              </h3>
              <FounderLocationMapClient
                city={f.city ?? null}
                label={f.name}
                className="aspect-[4/3] w-full"
              />
            </div>
          </div>
        </div>
      </main>
      <BaseFooter />
    </>
  );
}
