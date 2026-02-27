import matter from "gray-matter";
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";

export interface FounderProfileFrontmatter {
  /** Unique ID for Telegram bot: user sends /edit <edit_id> to request profile edits. */
  edit_id?: string | null;
  username: string;
  name: string;
  city?: string | null;
  country?: string | null;
  short_bio?: string | null;
  profile_image?: string | null;
  github?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  hackathons_attended?: number;
  projects_built?: number;
  prizes_won?: number;
  prize_winnings_amount?: number;
  onchain_creds_claimed?: number;
  tags?: string[];
}

export interface FounderProfile {
  username: string;
  frontmatter: FounderProfileFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "founders");

let _allFounderFrontmatterCache: Map<string, FounderProfileFrontmatter> | null = null;

/** Batch-read all founder MDX frontmatter once. Cached for the process. Use for lists (e.g. /founders). */
export function getAllFounderFrontmatterMap(): Map<string, FounderProfileFrontmatter> {
  if (_allFounderFrontmatterCache) return _allFounderFrontmatterCache;
  const map = new Map<string, FounderProfileFrontmatter>();
  if (!existsSync(CONTENT_DIR)) {
    _allFounderFrontmatterCache = map;
    return map;
  }
  const files = readdirSync(CONTENT_DIR).filter((f: string) => f.endsWith(".mdx"));
  for (const file of files) {
    const username = file.replace(/\.mdx$/, "");
    try {
      const raw = readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      map.set(username, data as FounderProfileFrontmatter);
    } catch {
      // skip invalid files
    }
  }
  _allFounderFrontmatterCache = map;
  return map;
}

export function getFounderByUsername(username: string): FounderProfile | null {
  const filePath = path.join(CONTENT_DIR, `${username}.mdx`);
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    username,
    frontmatter: data as FounderProfileFrontmatter,
    content,
  };
}

export function getAllFounderUsernames(): string[] {
  return Array.from(getAllFounderFrontmatterMap().keys());
}

/** Flat founder record for the /founders pals view (merged from MDX + projects). */
export interface FounderForPals {
  username: string;
  name: string;
  city: string | null;
  short_bio: string | null;
  profile_image: string | null;
  project: string;
  tags: string[];
}

/** Get all founders for the pals listing + map. Merges MDX profiles with project data. Uses a single batch read of founder MDX. */
export function getAllFoundersForPals(projects: {
  founderTwitter?: string;
  founder?: string;
  name?: string;
  tags?: string[];
  founders?: { name: string; twitter: string }[];
}[]): FounderForPals[] {
  const usernames = new Set<string>();
  projects.forEach((p) => {
    const primary = (p.founderTwitter || "").trim();
    if (primary && primary !== "devfolio") usernames.add(primary);
    (p.founders || []).forEach((f) => {
      const t = (f.twitter || "").trim();
      if (t && t !== "devfolio") usernames.add(t);
    });
  });
  getAllFounderUsernames().forEach((u) => usernames.add(u));
  const frontmatterByUsername = getAllFounderFrontmatterMap();
  const out: FounderForPals[] = [];
  for (const username of usernames) {
    const f = frontmatterByUsername.get(username);
    const proj = projects.find(
      (p) =>
        (p.founderTwitter || "").toLowerCase() === username.toLowerCase() ||
        (p.founders || []).some((f) => (f.twitter || "").toLowerCase() === username.toLowerCase())
    );
    if (f) {
      out.push({
        username,
        name: f.name || username,
        city: f.city ?? null,
        short_bio: f.short_bio ?? null,
        profile_image: f.profile_image ?? null,
        project: (proj as { name?: string } | undefined)?.name ?? f.name ?? username,
        tags: f.tags ?? [],
      });
    } else if (proj) {
      out.push({
        username,
        name: (proj as { founder?: string }).founder ?? username,
        city: null,
        short_bio: null,
        profile_image: null,
        project: (proj as { name?: string }).name ?? username,
        tags: (proj.tags as string[]) ?? [],
      });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
