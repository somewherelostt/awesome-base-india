/** One founder in a project's team (project id is separate from user/founder id). */
export interface ProjectFounder {
  name: string;
  twitter: string;
  github?: string;
}

export interface Project {
  /** Project ID (e.g. Devfolio UUID) – distinct from founder/user id (username). */
  id: string;
  name: string;
  description: string;
  /** Full markdown description from Devfolio (problem, how it works, challenges, etc.). */
  descriptionFull?: string;
  category: string;
  /** Primary founder name (first in list); kept for backward compat. */
  founder: string;
  /** Primary founder Twitter username (first in list). */
  founderTwitter: string;
  founderGithub?: string;
  /** All founders for this project (when multiple). Primary = first entry. */
  founders?: ProjectFounder[];
  /** URL slug for routing (e.g. not-your-type-80a6). */
  slug?: string;
  url: string;
  batch: string;
  tags: string[];
  logo: string;
  source?: string;
  /** Project GitHub repo or link */
  github?: string;
  /** Project Farcaster / miniapp link */
  farcaster?: string;
  /** YouTube video URL (demo, pitch, etc.) */
  youtube?: string;
  /** Other important links (app, demo, website) from Devfolio */
  links?: string[];
  /** Prize names won (e.g. ["First Place"]). Used to surface winners when filtering by batch. */
  prizes?: string[];
}

export interface Founder {
  id: string;
  name: string;
  twitter: string;
  github?: string;
  avatar: string;
  role: string;
  project: string;
}

export const DEVFOLIO_LINKS = {
  baseBatchIndia: "https://base-batch-india.devfolio.co/projects",
  builderTrack002: "https://base-batches-builder-track.devfolio.co/projects",
  basedIndia: "https://based-india.devfolio.co/projects",
  buildOnchainFBI: "https://build-onchain-fbi.devfolio.co/projects",
} as const;

export const TG_BOT_LINK = "https://t.me/awesome_base_India_bot";

export const categories = [
  "All",
  "AI",
  "Consumer",
  "DeFi",
  "Gaming",
  "Infra",
  "Mini-apps",
  "NFT",
  "DAO",
  "Identity",
  "Social",
  "Payments",
] as const;

export const batches = [
  "All Batches",
  "Base Batch India",
  "Based India",
  "Builder Track 002",
  "Build Onchain FBI",
  "Onchain AI BLR",
  "ClawdKitchen",
  "Independent",
] as const;

/** Sub-filters per category (dropdown checkboxes). Matched against project tags (case-insensitive). */
export const categorySubFilters: Record<string, string[]> = {
  AI: ["chatbot", "agents", "discovery", "personalization", "automation", "compute", "support", "multi-agent"],
  Consumer: ["creator", "payments", "video", "content", "rewards", "marketplace", "music", "gaming", "messaging", "social"],
  DeFi: ["DEX", "AMM", "yield", "staking", "savings", "portfolio", "treasury", "multisig", "lending", "insurance", "onramp", "trading", "farming", "dashboard", "automation"],
  Gaming: ["play-to-earn", "NFT", "lottery", "raffle", "casual", "betting", "quests", "gamification", "dungeon-crawler"],
  Infra: ["oracle", "bridge", "L2", "analytics", "gas", "relay", "dev-tools", "security", "audit"],
  "Mini-apps": ["marketplace", "payments", "social", "gaming"],
  NFT: ["art", "gallery", "no-code", "deployer", "collab", "3D"],
  DAO: ["governance", "voting", "treasury", "multisig", "sybil"],
  Identity: ["credentials", "KYC", "soulbound", "attestations", "naming", "ZK"],
  Social: ["creator", "tipping", "messaging", "token-gated", "community", "social-tokens"],
  Payments: ["stablecoin", "onramp", "merchant", "micropayments", "payroll", "streaming", "freelance", "USDC"],
};

import projectsFromDevfolio from "./projects-from-devfolio.json";
import clawdKitchenRaw from "./clawd-kitchen-projects.json";

/** Normalize GitHub URL to comparable form for founder matching (e.g. github.com/username or username/repo). */
function normalizeGithubUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const u = url.trim().toLowerCase().replace(/\/$/, "");
  const m = u.match(/github\.com\/([^/]+)(?:\/([^/]+))?/);
  if (m) return m[1] + (m[2] ? `/${m[2]}` : "");
  return u;
}

/** Build map: normalized github -> { name, twitter } from Devfolio projects (for ClawdKitchen founder matching). */
function buildGithubToFounderMap(devfolioProjects: Project[]): Map<string, { name: string; twitter: string }> {
  const map = new Map<string, { name: string; twitter: string }>();
  for (const p of devfolioProjects) {
    if (p.founderGithub) {
      const key = normalizeGithubUrl(p.founderGithub);
      if (key && !map.has(key)) map.set(key, { name: p.founder, twitter: p.founderTwitter });
    }
    if (p.github) {
      const key = normalizeGithubUrl(p.github);
      if (key && !map.has(key)) map.set(key, { name: p.founder, twitter: p.founderTwitter });
    }
    for (const f of p.founders || []) {
      if (f.github) {
        const key = normalizeGithubUrl(f.github);
        if (key && !map.has(key)) map.set(key, { name: f.name, twitter: f.twitter });
      }
    }
  }
  return map;
}

type ClawdKitchenEntry = {
  name: string;
  description: string;
  url: string;
  github?: string;
  slug: string;
  links?: string[];
  descriptionFull?: string;
};

function mergeClawdKitchenProjects(
  devfolio: Project[],
  clawdRaw: ClawdKitchenEntry[],
  githubMap: Map<string, { name: string; twitter: string }>
): Project[] {
  if (!Array.isArray(clawdRaw) || clawdRaw.length === 0) return devfolio;
  const merged = [...devfolio];
  for (const c of clawdRaw) {
    const githubKey = c.github ? normalizeGithubUrl(c.github) : "";
    const firstSegment = githubKey.split("/")[0] ?? "";
    const matched = githubKey
      ? githubMap.get(githubKey) ?? (firstSegment ? githubMap.get(firstSegment) : null)
      : null;
    const project: Project = {
      id: `clawd-${c.slug}`,
      name: c.name,
      description: c.description,
      category: "AI",
      founder: matched?.name ?? c.name,
      founderTwitter: matched?.twitter ?? "",
      url: c.url,
      batch: "ClawdKitchen",
      tags: ["AI", "Agents", "Base"],
      logo: c.name.slice(0, 2).toUpperCase(),
      slug: c.slug,
      ...(c.descriptionFull !== undefined && { descriptionFull: c.descriptionFull }),
      ...(c.links?.length && { links: c.links }),
      ...(c.github && { github: c.github, founderGithub: c.github }),
      ...(matched && {
        founders: [{ name: matched.name, twitter: matched.twitter, ...(c.github && { github: c.github }) }],
      }),
    };
    merged.push(project);
  }
  return merged;
}

const githubToFounder = buildGithubToFounderMap(projectsFromDevfolio as Project[]);
export const projects: Project[] = mergeClawdKitchenProjects(
  projectsFromDevfolio as Project[],
  clawdKitchenRaw as ClawdKitchenEntry[],
  githubToFounder
);

/** Resolve project by slug (e.g. not-your-type-80a6) or by id. */
export function getProjectBySlugOrId(slugOrId: string): Project | undefined {
  return (
    projects.find((p) => p.slug === slugOrId) ??
    projects.find((p) => p.id === slugOrId)
  );
}

export const founders: Founder[] = projects.map((p) => ({
  id: p.id,
  name: p.founder,
  twitter: p.founderTwitter,
  ...(p.founderGithub ? { github: p.founderGithub } : {}),
  avatar: p.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  role: "Builder",
  project: p.name,
}));