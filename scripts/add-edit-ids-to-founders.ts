/**
 * Add edit_id to content/founders/*.mdx that don’t have one (8-char alphanumeric).
 * Run once, then run npm run sync-edit-ids to push to Supabase.
 *
 * Usage: npx tsx scripts/add-edit-ids-to-founders.ts
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const FOUNDERS_DIR = path.join(process.cwd(), "content", "founders");

function randomEditId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let id = "";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function main() {
  if (!fs.existsSync(FOUNDERS_DIR)) {
    console.log("No content/founders dir.");
    return;
  }
  const files = fs.readdirSync(FOUNDERS_DIR).filter((f) => f.endsWith(".mdx"));
  let added = 0;
  for (const file of files) {
    const filePath = path.join(FOUNDERS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if ((data as { edit_id?: string }).edit_id) continue;
    (data as Record<string, string>).edit_id = randomEditId();
    const newRaw = matter.stringify(content, data);
    fs.writeFileSync(filePath, newRaw, "utf-8");
    console.log(file, "-> edit_id:", (data as { edit_id: string }).edit_id);
    added++;
  }
  console.log("Added edit_id to", added, "file(s). Run npm run sync-edit-ids to sync to Supabase.");
}

main();
