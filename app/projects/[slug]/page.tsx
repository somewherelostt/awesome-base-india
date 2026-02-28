import { BaseFooter } from "@/components/base-footer";
import { BaseHeader } from "@/components/base-header";
import { ThemeSwitch } from "@/components/theme-switch";
import { getProjectBySlugOrId, projects } from "@/lib/data";
import { getFounderByUsername } from "@/lib/founder";
import { createMetadata } from "@/lib/metadata";
import { getProjectMdx } from "@/lib/project-mdx";
import { Github, ExternalLink, Trophy, Link2, Youtube, Globe } from "lucide-react";
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
    description: description || `${title} — Built on Base from India`,
    path: `/projects/${slug}`,
  });
}

const DEFAULT_PLACEHOLDER = "Add a longer description, milestones, or team story here.";

function labelForUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("vercel.app") || lower.includes("netlify.app") || lower.includes("replit.app")) return "Try the app";
  if (lower.includes(".so") || lower.includes(".app") || lower.includes(".fun") || lower.includes(".xyz")) return "Website";
  return "Link";
}

function ProjectLinks({
  project,
}: {
  project: { github?: string; farcaster?: string; youtube?: string; links?: string[]; url: string };
}) {
  const links: { href: string; label: string; icon: React.ReactNode; primary?: boolean }[] = [];
  const hasPrimary = !!project.farcaster || (project.links && project.links.length > 0);

  if (project.farcaster) {
    links.push({
      href: project.farcaster,
      label: "Try the app",
      icon: <ExternalLink className="h-4 w-4" />,
      primary: true,
    });
  }
  if (project.youtube) {
    links.push({
      href: project.youtube,
      label: "Video",
      icon: <Youtube className="h-4 w-4" />,
      primary: !project.farcaster && hasPrimary === false,
    });
  }
  if (project.github) {
    links.push({
      href: project.github,
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
      primary: !hasPrimary && !project.youtube,
    });
  }
  (project.links ?? []).forEach((href, i) => {
    links.push({
      href,
      label: labelForUrl(href),
      icon: <Globe className="h-4 w-4" />,
      primary: !project.farcaster && i === 0 && !project.youtube && !project.github,
    });
  });
  links.push({
    href: project.url,
    label: "View on Devfolio",
    icon: <Link2 className="h-4 w-4" />,
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(({ href, label, icon, primary }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            primary
              ? "flex items-center gap-3 rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 font-medium text-accent transition-colors hover:bg-accent/20 hover:border-accent/80"
              : "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          }
        >
          {icon}
          <span>{label}</span>
          <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
        </a>
      ))}
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlugOrId(slug);
  if (!project) notFound();

  const projectMdx = getProjectMdx(slug);
  const name = projectMdx?.frontmatter.name ?? project.name;
  const oneLiner = projectMdx?.frontmatter.description ?? project.description;
  const logo = projectMdx?.frontmatter.logo ?? project.logo;
  const hasDetailedContent =
    projectMdx?.content?.trim() &&
    !projectMdx.content.includes(DEFAULT_PLACEHOLDER);

  const foundersList =
    project.founders && project.founders.length > 0
      ? project.founders
      : [
          {
            name: project.founder,
            twitter: project.founderTwitter,
            twitterHandle: project.founderTwitterHandle || project.founderTwitter,
            github: project.founderGithub,
          },
        ];

  const foundersWithProfiles = foundersList.map((f) => {
    const profile = getFounderByUsername(f.twitter);
    const displayHandle = (f as { twitterHandle?: string }).twitterHandle ?? profile?.frontmatter?.twitter ?? f.twitter;
    const fromMdx = profile?.frontmatter.profile_image?.trim();
    const profile_image =
      fromMdx && (fromMdx.startsWith("http://") || fromMdx.startsWith("https://"))
        ? fromMdx
        : `https://unavatar.io/twitter/${encodeURIComponent(displayHandle)}`;
    return {
      ...f,
      twitterHandle: displayHandle,
      profile_image,
      github: f.github ?? profile?.frontmatter.github ?? null,
    };
  });

  return (
    <>
      <BaseHeader />
      <ThemeSwitch />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Hero */}
          <header className="mb-10 sm:mb-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:h-28 sm:w-28">
                {logo.startsWith("http") ? (
                  <img
                    src={logo}
                    alt=""
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground sm:text-3xl">
                    {logo}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {name}
                </h1>
                {oneLiner && (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    {oneLiner}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                    {project.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {project.batch}
                  </span>
                  {(project.prizes?.length ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                      <Trophy className="h-3.5 w-3.5" />
                      {project.prizes!.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Links — conversion-focused */}
          <section className="mb-10 sm:mb-12" aria-labelledby="project-links-heading">
            <h2 id="project-links-heading" className="sr-only">
              Project links
            </h2>
            <ProjectLinks project={project} />
          </section>

          {/* Detailed description */}
          <section
            className="mb-10 sm:mb-12 rounded-2xl border border-border bg-card p-6 sm:p-8"
            aria-labelledby="about-project-heading"
          >
            <h2
              id="about-project-heading"
              className="text-xl font-semibold text-foreground sm:text-2xl"
            >
              About this project
            </h2>
            <div className="mt-4 space-y-4">
              {oneLiner && (
                <p className="text-base leading-relaxed text-muted-foreground">
                  {oneLiner}
                </p>
              )}
              {(hasDetailedContent || project.descriptionFull) && (
                <div
                  className={[
                    "project-description prose prose-base max-w-none dark:prose-invert",
                    "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4",
                    "prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight",
                    "prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border first:prose-h2:mt-6",
                    "prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-semibold",
                    "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1.5",
                    "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1.5",
                    "prose-li:leading-relaxed prose-li:text-muted-foreground",
                    "prose-strong:text-foreground prose-strong:font-semibold",
                    "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
                  ].join(" ")}
                >
                  <ReactMarkdown>
                    {hasDetailedContent
                      ? projectMdx!.content
                      : project.descriptionFull}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </section>

          {/* Founders */}
          <section
            className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8"
            aria-labelledby="founders-heading"
          >
            <h2
              id="founders-heading"
              className="text-xl font-semibold text-foreground sm:text-2xl"
            >
              About the founder{foundersList.length > 1 ? "s" : ""}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Building on Base from India
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2" role="list">
              {foundersWithProfiles.map((f) => (
                <li
                  key={f.twitter}
                  className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4"
                >
                  <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-accent/20 text-sm font-bold text-accent sm:h-14 sm:w-14">
                    {f.profile_image?.startsWith("http") ? (
                      <img
                        src={f.profile_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        {f.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{f.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{f.twitterHandle ?? f.twitter}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <a
                        href={`https://x.com/${f.twitterHandle ?? f.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        X
                      </a>
                      {f.github && (
                        <a
                          href={f.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-accent hover:underline"
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

          {/* Tags */}
          {project.tags.length > 0 && (
            <section
              className="mb-8"
              aria-labelledby="tags-heading"
            >
              <h2 id="tags-heading" className="sr-only">
                Technologies and tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags
                  .map((tag) =>
                    typeof tag === "string"
                      ? tag
                      : (tag as { name?: string })?.name ?? ""
                  )
                  .filter(Boolean)
                  .map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-muted/80 px-3 py-1.5 text-sm text-foreground"
                    >
                      {label}
                    </span>
                  ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <BaseFooter />
    </>
  );
}
