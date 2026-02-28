/**
 * Run full pipeline: scrape (Python) -> transform -> generate MDX -> update README.
 * Usage: node scripts/run-all-devfolio.js
 * Requires: Python with requests, and lib/projects-from-devfolio.json will be created/updated.
 * If all_projects.json is missing, run: cd scripts/devfolio-scraper && python scrape.py
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const SCRAPER_DIR = path.join(__dirname, "devfolio-scraper");

console.log("Step 1: Scrape (fetch all hackathons)...");
execSync("python scrape.py", { cwd: SCRAPER_DIR, stdio: "inherit" });

console.log("Step 2: Transform to projects-from-devfolio.json...");
execSync("python transform_to_data.py", { cwd: SCRAPER_DIR, stdio: "inherit" });

console.log("Step 3: Generate project & founder MDX...");
execSync("node scripts/generate-mdx-from-json.js", { cwd: ROOT, stdio: "inherit" });

console.log("Step 4: Update README ecosystem sections...");
execSync("node scripts/generate-readme-ecosystem.js", { cwd: ROOT, stdio: "inherit" });

console.log("Done.");
