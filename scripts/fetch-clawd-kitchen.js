/**
 * Fetches ClawdKitchen hackathon submissions from https://clawd.kitchen/api/submit
 * and writes lib/clawd-kitchen-projects.json for merge in lib/data.ts
 */
const fs = require("fs");
const path = require("path");

const API_URL = "https://clawd.kitchen/api/submit";
const OUT_PATH = path.join(__dirname, "..", "lib", "clawd-kitchen-projects.json");

function slugify(name, id) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const shortId = (id || "").replace(/-/g, "").slice(0, 6);
  return shortId ? `${base}-${shortId}` : base || "clawd-project";
}

async function main() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const data = await res.json();
  const submissions = data.submissions || [];

  const entries = submissions.map((s) => {
    const links = [s.github_url, s.vercel_url].filter(Boolean);
    if (s.token_url) links.push(s.token_url);
    if (s.contract_address)
      links.push(`https://basescan.org/address/${s.contract_address}`);
    const slug = slugify(s.project_name, s.id);
    return {
      name: s.project_name,
      description: s.description || "",
      url: s.vercel_url || s.github_url || "https://clawd.kitchen/submissions",
      github: s.github_url || undefined,
      slug,
      links: links.length ? links : undefined,
    };
  });

  fs.writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2), "utf8");
  console.log(`Wrote ${entries.length} ClawdKitchen projects to ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
