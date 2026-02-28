/**
 * Generate content/projects/*.mdx and content/founders/*.mdx from lib/projects-from-devfolio.json.
 * - Creates project MDX only if file does not exist (slug from JSON).
 * - Creates founder MDX only if file does not exist; founders deduplicated by twitter username (collision-safe).
 * Run after transform_to_data.py so projects-from-devfolio.json is up to date.
 */
const fs = require("fs");
const path = require("path");

const PROJECTS_JSON = path.join(__dirname, "..", "lib", "projects-from-devfolio.json");
const PROJECTS_DIR = path.join(__dirname, "..", "content", "projects");
const FOUNDERS_DIR = path.join(__dirname, "..", "content", "founders");

const DEFAULT_PROJECT_BODY = `## About this project
Add a longer description, milestones, or team story here. This content is merged with the project data from Devfolio.
## Links
- [Devfolio]({url})
`;

const DEFAULT_FOUNDER_BODY = `## About
Builder from India.

## What I'm Building
*Add your focus areas and current projects here.*

## Interests
- Web3
- Base
- India ecosystem
`;

function slugToFilename(slug) {
  return `${slug}.mdx`;
}

function safeFilename(u) {
  return (u || "").replace(/[\\/:*?"<>|]/g, "_").trim() || "unknown";
}

if (!fs.existsSync(PROJECTS_JSON)) {
  console.error("Missing", PROJECTS_JSON, "- run transform_to_data.py first.");
  process.exit(1);
}

const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, "utf8"));
if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR, { recursive: true });
if (!fs.existsSync(FOUNDERS_DIR)) fs.mkdirSync(FOUNDERS_DIR, { recursive: true });

let projectsCreated = 0;
let foundersCreated = 0;

// Unique founders by twitter username (lowercase); value = { name, username }
const founderByUsername = new Map();

for (const p of projects) {
  const slug = p.slug || p.id;
  if (!slug) continue;

  // Project MDX: create only if missing
  const projectPath = path.join(PROJECTS_DIR, slugToFilename(slug));
  if (!fs.existsSync(projectPath)) {
    const editId = "proj-" + (p.id || slug).slice(0, 8);
    const body = DEFAULT_PROJECT_BODY.replace("{url}", p.url || "");
    const frontmatter = {
      edit_id: editId,
      slug,
      project_id: p.id,
      name: p.name,
      description: p.description || "",
    };
    const content =
      "---\n" +
      Object.entries(frontmatter)
        .map(([k, v]) => `${k}: ${typeof v === "string" && (v.includes("\n") || v.includes(":")) ? JSON.stringify(v) : v}`)
        .join("\n") +
      "\n---\n\n" +
      body;
    fs.writeFileSync(projectPath, content, "utf8");
    projectsCreated++;
  }

  // Collect founders (primary + co-founders); dedupe by username
  const primary = p.founderTwitter || p.founder;
  if (primary) {
    const username = String(primary).trim();
    const key = username.toLowerCase();
    if (!founderByUsername.has(key)) {
      founderByUsername.set(key, {
        name: p.founder || p.name,
        username: username,
      });
    }
  }
  for (const f of p.founders || []) {
    const username = (f.twitter || "").trim();
    if (!username) continue;
    const key = username.toLowerCase();
    if (!founderByUsername.has(key)) {
      founderByUsername.set(key, { name: f.name || "", username });
    }
  }
}

for (const [, { name, username }] of founderByUsername) {
  const filename = safeFilename(username) + ".mdx";
  const founderPath = path.join(FOUNDERS_DIR, filename);
  if (!fs.existsSync(founderPath)) {
    const frontmatter = {
      username: username,
      name: name || username,
      hackathons_attended: 0,
      projects_built: 0,
      prizes_won: 0,
      prize_winnings_amount: 0,
      onchain_creds_claimed: 0,
      tags: [],
    };
    const content =
      "---\n" +
      Object.entries(frontmatter)
        .map(([k, v]) => {
          if (k === "tags") return "tags: []";
          return `${k}: ${Array.isArray(v) ? JSON.stringify(v) : (typeof v === "string" && (v.includes("\n") || v.includes(":")) ? JSON.stringify(v) : v)}`;
        })
        .join("\n") +
      "\n---\n\n" +
      DEFAULT_FOUNDER_BODY;
    fs.writeFileSync(founderPath, content, "utf8");
    foundersCreated++;
  }
}

console.log("Projects MDX created:", projectsCreated);
console.log("Founders MDX created:", foundersCreated);
