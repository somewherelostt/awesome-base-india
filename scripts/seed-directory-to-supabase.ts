/**
 * Seed directory_projects and directory_founders in Supabase from repo data.
 * Run once (or after adding projects/founders) so the Telegram bot can list "Existing project" / "Existing founder" by name.
 *
 * Usage: npm run seed-directory   (or npx tsx scripts/seed-directory-to-supabase.ts)
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY (e.g. in telegram-bot/.env)
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";

loadEnv({ path: path.join(process.cwd(), "telegram-bot", ".env") });
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const LIB = path.join(ROOT, "lib");
const FOUNDERS_DIR = path.join(ROOT, "content", "founders");

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY required");
  return createClient(url, key);
}

type ProjectRow = {
  slug: string;
  name: string;
  description: string | null;
  description_full: string | null;
  category: string | null;
  founder_name: string | null;
  founder_twitter: string | null;
  founder_twitter_handle: string | null;
  founder_github: string | null;
  url: string | null;
  batch: string | null;
  tags: string | null;
  logo_url: string | null;
  github_url: string | null;
  farcaster_url: string | null;
  youtube_url: string | null;
  other_links: string | null;
  prizes: string | null;
};

function loadProjects(): ProjectRow[] {
  const p = path.join(LIB, "projects-from-devfolio.json");
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf-8");
  const arr = JSON.parse(raw) as Record<string, unknown>[];
  return arr.map((proj) => {
    const slug = (proj.slug as string) ?? (proj.id as string) ?? "";
    const founders = (proj.founders as { name?: string; twitter?: string }[]) ?? [];
    const primary = founders[0];
    const tags = Array.isArray(proj.tags) ? (proj.tags as string[]).join(", ") : null;
    const links = (proj.links as string[]) ?? [];
    const otherLinks = Array.isArray(links) ? links.join(", ") : null;
    const prizes = Array.isArray(proj.prizes) ? (proj.prizes as string[]).join(", ") : null;
    return {
      slug,
      name: (proj.name as string) ?? "",
      description: (proj.description as string) ?? null,
      description_full: (proj.descriptionFull as string) ?? null,
      category: (proj.category as string) ?? null,
      founder_name: (proj.founder as string) ?? primary?.name ?? null,
      founder_twitter: (proj.founderTwitter as string) ?? primary?.twitter ?? null,
      founder_twitter_handle: (proj.founderTwitterHandle as string) ?? null,
      founder_github: (proj.founderGithub as string) ?? null,
      url: (proj.url as string) ?? null,
      batch: (proj.batch as string) ?? null,
      tags,
      logo_url: (proj.logo as string)?.startsWith("http") ? (proj.logo as string) : null,
      github_url: (proj.github as string) ?? null,
      farcaster_url: (proj.farcaster as string) ?? null,
      youtube_url: (proj.youtube as string) ?? null,
      other_links: otherLinks,
      prizes,
    };
  }).filter((r) => r.slug && r.name);
}

type FounderRow = {
  username: string;
  name: string;
  city: string | null;
  country: string | null;
  short_bio: string | null;
  profile_image: string | null;
  github: string | null;
  twitter: string | null;
  hackathons_attended: string | null;
  projects_built: string | null;
  prizes_won: string | null;
  prize_winnings_amount: string | null;
  onchain_creds_claimed: string | null;
  tags: string | null;
};

function loadFounders(): FounderRow[] {
  if (!fs.existsSync(FOUNDERS_DIR)) return [];
  const files = fs.readdirSync(FOUNDERS_DIR).filter((f) => f.endsWith(".mdx"));
  const rows: FounderRow[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(FOUNDERS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const d = data as Record<string, unknown>;
    const username = (d.username as string) ?? file.replace(/\.mdx$/, "");
    const tagsArr = d.tags as string[] | undefined;
    const tags = Array.isArray(tagsArr) ? tagsArr.join(", ") : null;
    rows.push({
      username,
      name: (d.name as string) ?? username,
      city: (d.city as string) ?? null,
      country: (d.country as string) ?? null,
      short_bio: (d.short_bio as string) ?? null,
      profile_image: (d.profile_image as string) ?? null,
      github: (d.github as string) ?? null,
      twitter: (d.twitter as string) ?? null,
      hackathons_attended: d.hackathons_attended != null ? String(d.hackathons_attended) : null,
      projects_built: d.projects_built != null ? String(d.projects_built) : null,
      prizes_won: d.prizes_won != null ? String(d.prizes_won) : null,
      prize_winnings_amount: d.prize_winnings_amount != null ? String(d.prize_winnings_amount) : null,
      onchain_creds_claimed: d.onchain_creds_claimed != null ? String(d.onchain_creds_claimed) : null,
      tags,
    });
  }
  return rows;
}

async function main() {
  const supabase = getSupabase();

  const projects = loadProjects();
  if (projects.length > 0) {
    const { error } = await supabase.from("directory_projects").upsert(projects, {
      onConflict: "slug",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("directory_projects upsert error:", error);
      process.exit(1);
    }
    console.log("Seeded", projects.length, "projects to directory_projects.");
  } else {
    console.log("No projects in lib/projects-from-devfolio.json.");
  }

  const founders = loadFounders();
  if (founders.length > 0) {
    const { error } = await supabase.from("directory_founders").upsert(founders, {
      onConflict: "username",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("directory_founders upsert error:", error);
      process.exit(1);
    }
    console.log("Seeded", founders.length, "founders to directory_founders.");
  } else {
    console.log("No founders in content/founders/*.mdx.");
  }
}

main();
