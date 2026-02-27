/**
 * Generate content/projects/*.mdx for every project in lib/projects-from-devfolio.json.
 * - If an MDX file already exists, only add edit_id to frontmatter when missing.
 * - If it doesn't exist, create one with slug, project_id, name, description and edit_id.
 * Run after transform_to_data.py. Then run npm run sync-edit-ids to sync edit_id to Supabase.
 *
 * Usage: npx tsx scripts/generate-project-mdx.ts
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const PROJECTS_JSON = path.join(process.cwd(), "lib", "projects-from-devfolio.json");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function randomEditId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let id = "";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function escapeYaml(s: string): string {
  if (!s) return "";
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function buildNewMdx(project: { id?: string; slug: string; name: string; description?: string; url?: string; github?: string; farcaster?: string; logo?: string }): string {
  const editId = randomEditId();
  const slug = (project.slug || "").trim();
  const name = (project.name || slug).trim();
  const description = (project.description || "").trim();
  const logo = (project.logo || "").trim();
  const lines = [
    "---",
    `edit_id: "${editId}"`,
    `slug: "${escapeYaml(slug)}"`,
    `project_id: "${(project.id || "").trim()}"`,
    `name: "${escapeYaml(name)}"`,
    description ? `description: "${escapeYaml(description)}"` : null,
    logo && logo.startsWith("http") ? `logo: "${escapeYaml(logo)}"` : null,
    "---",
    "",
    "## About this project",
    "",
    "Add a longer description, milestones, or team story here. This content is merged with the project data from Devfolio.",
    "",
    "## Links",
    "",
  ];
  const linkLines: string[] = [];
  if (project.url) linkLines.push(`- [Devfolio](${project.url})`);
  if (project.github) linkLines.push(`- [GitHub](${project.github})`);
  if (project.farcaster) linkLines.push(`- [Farcaster miniapp](${project.farcaster})`);
  if (linkLines.length === 0) linkLines.push("- [Devfolio](https://base-batch-india.devfolio.co)");
  return lines.filter(Boolean).join("\n") + linkLines.join("\n") + "\n";
}

function main() {
  if (!fs.existsSync(PROJECTS_JSON)) {
    console.error("Run scripts/devfolio-scraper/transform_to_data.py first to create lib/projects-from-devfolio.json");
    process.exit(1);
  }
  const projects: Array<{ id?: string; slug?: string; name?: string; description?: string; url?: string; github?: string; farcaster?: string }> = JSON.parse(
    fs.readFileSync(PROJECTS_JSON, "utf-8")
  );
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
  let created = 0;
  let updated = 0;
  for (const p of projects) {
    const slug = (p.slug || "").trim();
    if (!slug) continue;
    const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const dataObj = data as Record<string, unknown>;
      if (dataObj.edit_id) continue;
      dataObj.edit_id = randomEditId();
      fs.writeFileSync(filePath, matter.stringify(content, dataObj), "utf-8");
      console.log(slug + ".mdx -> added edit_id:", dataObj.edit_id);
      updated++;
    } else {
      const mdx = buildNewMdx({
        id: p.id,
        slug,
        name: p.name || slug,
        description: p.description,
        url: p.url || (p as { source?: string }).source,
        github: p.github,
        farcaster: p.farcaster,
        logo: (p as { logo?: string }).logo,
      });
      fs.writeFileSync(filePath, mdx, "utf-8");
      console.log("Created", slug + ".mdx");
      created++;
    }
  }
  console.log("Done. Created", created, "new project MDX, added edit_id to", updated, "existing. Run npm run sync-edit-ids to sync to Supabase.");
}

main();
