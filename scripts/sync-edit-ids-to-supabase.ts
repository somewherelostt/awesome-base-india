/**
 * Sync edit_id from content/founders/*.mdx (and optionally content/projects/*.mdx) to Supabase edit_id_registry.
 * Run after adding or changing edit_id in MDX so the Telegram bot /edit command can resolve them.
 *
 * Usage: npm run sync-edit-ids   (or npx tsx scripts/sync-edit-ids-to-supabase.ts)
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY in env or in .env / telegram-bot/.env
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import * as path from "path";
// Load root .env then telegram-bot/.env so either location works
loadEnv({ path: path.join(process.cwd(), "telegram-bot", ".env") });
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const FOUNDERS_DIR = path.join(CONTENT_ROOT, "founders");
const PROJECTS_DIR = path.join(CONTENT_ROOT, "projects");

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY required");
  return createClient(url, key);
}

function syncFounders(supabase: ReturnType<typeof getSupabase>) {
  if (!fs.existsSync(FOUNDERS_DIR)) return [];
  const files = fs.readdirSync(FOUNDERS_DIR).filter((f) => f.endsWith(".mdx"));
  const rows: { edit_id: string; type: "founder"; identifier: string }[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(FOUNDERS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const editId = (data as { edit_id?: string }).edit_id?.trim();
    const username = (data as { username?: string }).username?.trim() || file.replace(/\.mdx$/, "");
    if (editId) {
      rows.push({ edit_id: editId.toLowerCase(), type: "founder", identifier: username });
    }
  }
  return rows;
}

function syncProjects(supabase: ReturnType<typeof getSupabase>) {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  const rows: { edit_id: string; type: "project"; identifier: string }[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const editId = (data as { edit_id?: string }).edit_id?.trim();
    const slug = (data as { slug?: string }).slug?.trim() || file.replace(/\.mdx$/, "");
    if (editId) {
      rows.push({ edit_id: editId.toLowerCase(), type: "project", identifier: slug });
    }
  }
  return rows;
}

async function main() {
  const supabase = getSupabase();
  const founderRows = syncFounders(supabase);
  const projectRows = syncProjects(supabase);
  const all = [...founderRows, ...projectRows];
  if (all.length === 0) {
    console.log("No edit_id found in any MDX. Add edit_id to frontmatter and re-run.");
    return;
  }
  const { error } = await supabase.from("edit_id_registry").upsert(all, {
    onConflict: "edit_id",
    ignoreDuplicates: false,
  });
  if (error) {
    console.error("Supabase upsert error:", error);
    process.exit(1);
  }
  console.log("Synced", founderRows.length, "founder(s) and", projectRows.length, "project(s) to edit_id_registry.");
}

main();
