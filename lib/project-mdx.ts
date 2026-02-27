import matter from "gray-matter";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

/** Project MDX frontmatter. Keyed by project (slug or id), not user/founder id. */
export interface ProjectMdxFrontmatter {
  /** Unique ID for Telegram bot edits (project edits). */
  edit_id?: string | null;
  /** Project slug (e.g. not-your-type-80a6) – links this file to the project. */
  slug: string;
  /** Optional: project UUID from Devfolio (project id, distinct from founder user id). */
  project_id?: string | null;
  /** Override project name in MDX (optional). */
  name?: string | null;
  /** Override short description (optional). */
  description?: string | null;
  /** Override project logo/DP URL (optional). When set, used everywhere the project is shown. */
  logo?: string | null;
}

export interface ProjectMdx {
  slug: string;
  frontmatter: ProjectMdxFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

let _allFrontmatterCache: Map<string, ProjectMdxFrontmatter> | null = null;

/** Batch-read all project MDX frontmatter once. Cached for the process. Use for lists/grids. */
export function getAllProjectMdxFrontmatterMap(): Map<string, ProjectMdxFrontmatter> {
  if (_allFrontmatterCache) return _allFrontmatterCache;
  const map = new Map<string, ProjectMdxFrontmatter>();
  if (!existsSync(CONTENT_DIR)) {
    _allFrontmatterCache = map;
    return map;
  }
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    try {
      const raw = readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      map.set(slug, data as ProjectMdxFrontmatter);
    } catch {
      // skip invalid files
    }
  }
  _allFrontmatterCache = map;
  return map;
}

export function getProjectMdx(slugOrId: string): ProjectMdx | null {
  const filePath = path.join(CONTENT_DIR, `${slugOrId}.mdx`);
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: slugOrId,
    frontmatter: data as ProjectMdxFrontmatter,
    content,
  };
}

export function getAllProjectSlugsFromMdx(): string[] {
  return Array.from(getAllProjectMdxFrontmatterMap().keys());
}
