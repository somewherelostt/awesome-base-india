export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  founder: string;
  founderTwitter: string;
  url: string;
  batch: string;
  tags: string[];
  logo: string;
  source?: string;
}

export interface Founder {
  id: string;
  name: string;
  twitter: string;
  avatar: string;
  role: string;
  project: string;
}

export const DEVFOLIO_LINKS = {
  baseBatchIndia: "https://base-batch-india.devfolio.co/projects",
  builderTrack002: "https://base-batches-builder-track.devfolio.co/projects",
  basedIndia: "https://based-india.devfolio.co/projects",
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
  "Social",
  "Payments",
] as const;

export const batches = [
  "All Batches",
  "Base Batch India",
  "Based India",
  "Builder Track 002",
  "Independent",
] as const;

export const projects: Project[] = [
  {
    id: "1",
    name: "NOICE",
    description:
      "Turns every social interaction into income. Set-and-forget micropayment tipping on Farcaster and Coinbase Wallet. 5,000 users have tipped 1.4 million times in 30 days.",
    category: "Consumer",
    founder: "Srijan A",
    founderTwitter: "srijancse",
    url: "https://devfolio.co/projects/noice-fd34",
    batch: "Base Batch India",
    tags: ["micropayments", "farcaster", "tipping", "social"],
    logo: "N",
    source: "https://devfolio.co/projects/noice-fd34",
  },
  {
    id: "2",
    name: "JesseGPT",
    description:
      "AI chatbot fine-tuned on Jesse Pollak. Pitch your project idea, get a rating or a roast, and mint your pitch as an ideacoin on Zora. Used as an official judge during Base Batches.",
    category: "AI",
    founder: "Devfolio Team",
    founderTwitter: "devaborin",
    url: "https://jessegpt.xyz",
    batch: "Base Batch India",
    tags: ["AI", "chatbot", "jesse-pollak", "zora"],
    logo: "J",
    source: "https://devfolio.co/projects/jessegpt-2acd",
  },
  {
    id: "3",
    name: "Creatorbase",
    description:
      "Connects brands with creators on the blockchain. Revolutionizes UGC campaigns across TikTok, X, and Facebook with AI automation, onchain verification, and instant payments.",
    category: "Consumer",
    founder: "Creatorbase Team",
    founderTwitter: "creatorbasepro",
    url: "https://creatorbase.pro",
    batch: "Base Batch India",
    tags: ["creator-economy", "UGC", "brands", "payments"],
    logo: "C",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "4",
    name: "Hook-Tuah",
    description:
      "DeFi tooling built around Uniswap v4 hooks on Base. Simplifies custom hook deployment and testing for developers building advanced AMM strategies onchain.",
    category: "DeFi",
    founder: "Hook-Tuah Team",
    founderTwitter: "hooktuah_base",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["uniswap-v4", "hooks", "DeFi", "dev-tools"],
    logo: "H",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "5",
    name: "Clip",
    description:
      "Short-form video platform with onchain engagement rewards. Creators earn directly from views and interactions, with transparent revenue sharing settled on Base.",
    category: "Consumer",
    founder: "Clip Team",
    founderTwitter: "cliponbase",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["video", "content", "creator", "rewards"],
    logo: "Cl",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "6",
    name: "Not Your Type",
    description:
      "AI-powered consumer app that reimagines how users interact with onchain content. Personalized discovery and recommendation engine built natively on Base.",
    category: "AI",
    founder: "NYT Team",
    founderTwitter: "notyourtype_",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["AI", "discovery", "consumer", "personalization"],
    logo: "NY",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "7",
    name: "replyguy",
    description:
      "AI agent that monitors social media conversations and generates context-aware replies to promote onchain projects. Automates community engagement across X and Farcaster.",
    category: "AI",
    founder: "replyguy Team",
    founderTwitter: "replyguyai",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["AI-agent", "social-media", "marketing", "automation"],
    logo: "R",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "8",
    name: "AuditHook",
    description:
      "AI agent that audits Base smart contracts with deep expertise in Uniswap v4 hooks. Provides security analysis, gas optimization, and educational resources for developers.",
    category: "DeFi",
    founder: "AuditHook Team",
    founderTwitter: "audithook_",
    url: "https://devfolio.co/projects/audithook-4602",
    batch: "Base Batch India",
    tags: ["security", "audit", "AI", "uniswap-v4"],
    logo: "A",
    source: "https://devfolio.co/projects/audithook-4602",
  },
  {
    id: "9",
    name: "Kuri",
    description:
      "Onchain savings and chit-fund protocol inspired by traditional Indian community savings circles. Trustless group savings with automated payouts on Base.",
    category: "DeFi",
    founder: "Kuri Team",
    founderTwitter: "kuri_onchain",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["savings", "chit-fund", "community", "DeFi"],
    logo: "K",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "10",
    name: "BitMore",
    description:
      "DeFi investment platform that helps users earn more from their crypto holdings on Base through automated yield strategies and smart portfolio management.",
    category: "DeFi",
    founder: "BitMore Team",
    founderTwitter: "bitmore_fi",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["yield", "investment", "portfolio", "DeFi"],
    logo: "B",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "11",
    name: "A$CE",
    description:
      "Crypto payments and trading tool with a focus on stablecoin transfers. Fast onramp/offramp solution for Indian users on Base with low fees.",
    category: "Payments",
    founder: "A$CE Team",
    founderTwitter: "ace_onbase",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["payments", "stablecoin", "onramp", "trading"],
    logo: "A$",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "12",
    name: "Lotry",
    description:
      "Provably fair onchain lottery and raffle system on Base. Transparent draws with verifiable randomness and instant prize distribution via smart contracts.",
    category: "Gaming",
    founder: "Lotry Team",
    founderTwitter: "lotry_xyz",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["lottery", "raffle", "randomness", "gaming"],
    logo: "L",
    source: "https://base-batch-india.devfolio.co/projects",
  },
  {
    id: "13",
    name: "Darkest Dungeon",
    description:
      "Onchain dungeon crawler game built on Base. Explore procedurally generated dungeons, collect NFT loot, and compete in leaderboard challenges with real stakes.",
    category: "Gaming",
    founder: "Darkest Dungeon Team",
    founderTwitter: "darkestdungeon_",
    url: "https://base-batch-india.devfolio.co/projects",
    batch: "Base Batch India",
    tags: ["gaming", "dungeon-crawler", "NFT", "play-to-earn"],
    logo: "DD",
    source: "https://base-batch-india.devfolio.co/projects",
  },
];

export const founders: Founder[] = projects.map((p) => ({
  id: p.id,
  name: p.founder,
  twitter: p.founderTwitter,
  avatar: p.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  role: "Builder",
  project: p.name,
}));
