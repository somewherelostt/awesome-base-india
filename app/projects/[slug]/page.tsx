import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { ThemeSwitch } from "@/components/theme-switch";
import { getProjectBySlugOrId, projects } from "@/lib/data";
import { getFounderByUsername } from "@/lib/founder";
import { createMetadata } from "@/lib/metadata";
import { getProjectMdx } from "@/lib/project-mdx";
import { Github, ExternalLink, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug || p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlugOrId(slug);
  if (!project) return {};
  const mdx = getProjectMdx(slug);
  const title = mdx?.frontmatter.name ?? project.name;
  const description = mdx?.frontmatter.description ?? project.description;
  return createMetadata({
    title,
    description,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlugOrId(slug);
  if (!project) notFound();

  const projectMdx = getProjectMdx(slug);
  const name = projectMdx?.frontmatter.name ?? project.name;
  const description = projectMdx?.frontmatter.description ?? project.description;
  const logo = projectMdx?.frontmatter.logo ?? project.logo;

  const foundersList =
    project.founders && project.founders.length > 0
      ? project.founders
      : [{ name: project.founder, twitter: project.founderTwitter, github: project.founderGithub }];

  const foundersWithProfiles = foundersList.map((f) => {
    const profile = getFounderByUsername(f.twitter);
    return {
      ...f,
      profile_image: profile?.frontmatter.profile_image ?? null,
      github: f.github ?? profile?.frontmatter.github ?? null,
    };
  });

  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main className="min-h-screen bg-background pt-24 pb-12 px-6 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
              {logo.startsWith("http") ? (
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                  {logo}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {name}
              </h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                  {project.category}
                </span>
                <span className="text-muted-foreground">{project.batch}</span>
                {(project.prizes?.length ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 font-medium text-amber-700 dark:text-amber-300">
                    <Trophy className="h-4 w-4" />
                    {project.prizes!.join(", ")}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  View on Devfolio
                  <ExternalLink className="h-4 w-4" />
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {project.farcaster && (
                  <a
                    href={project.farcaster}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Farcaster
                  </a>
                )}
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">
              About the founder{foundersList.length > 1 ? "s" : ""}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Building on Base from India
            </p>
            <ul className="mt-6 space-y-4">
              {foundersWithProfiles.map((f) => (
                <li key={f.twitter} className="flex flex-wrap items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full bg-accent/20 text-lg font-bold text-accent">
                    {f.profile_image && f.profile_image.startsWith("http") ? (
                      <img src={f.profile_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">{f.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{f.name}</p>
                    <p className="text-sm text-muted-foreground">@{f.twitter}</p>
                    <div className="mt-2 flex gap-3">
                      <a
                        href={`https://x.com/${f.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        X / Twitter
                      </a>
                      {f.github && (
                        <a
                          href={f.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      <Link
                        href={`/founders/${f.twitter}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Full profile →
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">About this project</h3>
            <div className="prose prose-sm mt-4 max-w-none text-foreground dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
              {description && <p className="text-muted-foreground">{description}</p>}
              {projectMdx?.content?.trim() &&
                !projectMdx.content.includes("Add a longer description, milestones, or team story here") && (
                  <ReactMarkdown>{projectMdx.content}</ReactMarkdown>
                )}
            </div>
          </section>

          {project.tags.length > 0 && (
            <section className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags
                  .map((tag) => (typeof tag === "string" ? tag : (tag as { name?: string })?.name ?? ""))
                  .filter(Boolean)
                  .map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                    >
                      {label}
                    </span>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <BaseFooter />
    </>
  );
}
