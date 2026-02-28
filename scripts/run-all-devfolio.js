/**
 * Run full Devfolio pipeline in order:
 * 1. scrape.py          -> all_projects.json
 * 2. transform_to_data  -> lib/projects-from-devfolio.json
 * 3. fetch_devfolio_profiles -> profile_links.json
 * 4. merge_profile_links     -> canonical founder id + founderTwitterHandle in JSON
 * 5. fetch_devfolio_profile_json -> content/founders/*.mdx (one per person, no duplicates)
 * 6. generate-mdx-from-json -> missing project/founder MDX
 * 7. generate-readme-ecosystem -> README
 *
 * Usage: node scripts/run-all-devfolio.js
 * Requires: Python with requests.
 */
const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SCRAPER_DIR = path.join(__dirname, "devfolio-scraper");

const steps = [
  [SCRAPER_DIR, "python scrape.py", "Scrape (fetch all hackathons)"],
  [SCRAPER_DIR, "python transform_to_data.py", "Transform to projects-from-devfolio.json"],
  [SCRAPER_DIR, "python fetch_devfolio_profiles.py", "Fetch Devfolio profile links (Twitter/GitHub)"],
  [SCRAPER_DIR, "python merge_profile_links.py", "Merge profile links (canonical founder id)"],
  [SCRAPER_DIR, "python fetch_devfolio_profile_json.py", "Fetch founder MDX (one profile per person)"],
  [ROOT, "node scripts/generate-mdx-from-json.js", "Generate missing project/founder MDX"],
  [ROOT, "node scripts/generate-readme-ecosystem.js", "Update README ecosystem sections"],
];

for (let i = 0; i < steps.length; i++) {
  const [cwd, cmd, label] = steps[i];
  console.log(`Step ${i + 1}/${steps.length}: ${label}...`);
  try {
    execSync(cmd, { cwd, stdio: "inherit" });
  } catch (e) {
    console.error(`Step ${i + 1} failed. Stopping.`);
    process.exit(e.status ?? 1);
  }
}

console.log("Done.");
