/**
 * Server-only: resolve project logo (and other fields) from MDX.
 * Use from server components; do not import from client components.
 */
import type { Project } from "@/lib/data";
import { projects } from "@/lib/data";
import { getProjectMdx } from "@/lib/project-mdx";

/** Projects with logo (and name/description) overridden from MDX when present. */
export function getProjectsWithResolvedLogos(): Project[] {
  return projects.map((p) => {
    const slug = p.slug ?? p.id;
    const mdx = getProjectMdx(slug);
    const logo = mdx?.frontmatter.logo ?? p.logo;
    const name = mdx?.frontmatter.name ?? p.name;
    const description = mdx?.frontmatter.description ?? p.description;
    return { ...p, logo, name, description };
  });
}
