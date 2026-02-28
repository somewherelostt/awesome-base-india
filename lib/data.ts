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

export const projects: Project[] = projectsFromDevfolio as Project[];

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