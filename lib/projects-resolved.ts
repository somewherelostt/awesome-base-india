/**
 * Server-only: resolve project logo (and other fields) from MDX.
 * Use from server components; do not import from client components.
 */
import type { Project } from "@/lib/data";
import { projects } from "@/lib/data";
import { getAllProjectMdxFrontmatterMap } from "@/lib/project-mdx";

/** Projects with logo (and name/description) overridden from MDX when present. Uses a single batch read of all project MDX. */
export function getProjectsWithResolvedLogos(): Project[] {
  const frontmatterBySlug = getAllProjectMdxFrontmatterMap();
  return projects.map((p) => {
    const slug = p.slug ?? p.id;
    const fm = frontmatterBySlug.get(slug);
    const logo = fm?.logo ?? p.logo;
    const name = fm?.name ?? p.name;
    const description = fm?.description ?? p.description;
    return { ...p, logo, name, description };
  });
}
