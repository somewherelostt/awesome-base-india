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
}

export interface Founder {
  id: string;
  name: string;
  twitter: string;
  avatar: string;
  role: string;
  project: string;
}

export const categories = [
  "All",
  "DeFi",
  "NFT",
  "Social",
  "Gaming",
  "Infra",
  "DAO",
  "Payments",
] as const;

export const batches = [
  "All Batches",
  "Batch 1",
  "Batch 2",
  "Base Fellowship",
  "Hyperthon",
  "Activation",
] as const;

export const projects: Project[] = [
  {
    id: "1",
    name: "PayBase",
    description:
      "UPI-style payments on Base. Send and receive crypto as easily as scanning a QR code. Built for the next billion users.",
    category: "Payments",
    founder: "Arjun Mehta",
    founderTwitter: "arjunbuilds",
    url: "https://paybase.xyz",
    batch: "Batch 1",
    tags: ["payments", "UPI", "onramp"],
    logo: "P",
  },
  {
    id: "2",
    name: "OnchainBazaar",
    description:
      "Decentralized marketplace for Indian artisans to sell directly to global buyers. Every transaction is settled on Base.",
    category: "Social",
    founder: "Priya Sharma",
    founderTwitter: "priyaonchain",
    url: "https://onchainbazaar.in",
    batch: "Batch 1",
    tags: ["marketplace", "commerce", "artisans"],
    logo: "O",
  },
  {
    id: "3",
    name: "BaseLend",
    description:
      "Micro-lending protocol purpose-built for emerging markets. Undercollateralized loans powered by onchain reputation.",
    category: "DeFi",
    founder: "Rahul Kapoor",
    founderTwitter: "rahuldefi",
    url: "https://baselend.fi",
    batch: "Batch 2",
    tags: ["lending", "DeFi", "micro-loans"],
    logo: "B",
  },
  {
    id: "4",
    name: "MintVerse",
    description:
      "NFT launchpad for Indian digital artists. Curated collections with gasless minting on Base.",
    category: "NFT",
    founder: "Kavya Nair",
    founderTwitter: "kavyanft",
    url: "https://mintverse.art",
    batch: "Batch 2",
    tags: ["NFT", "art", "launchpad"],
    logo: "M",
  },
  {
    id: "5",
    name: "ChainQuest",
    description:
      "Play-to-earn gaming ecosystem with skill-based tournaments. Built on Base for instant settlements.",
    category: "Gaming",
    founder: "Vikram Singh",
    founderTwitter: "vikramplays",
    url: "https://chainquest.gg",
    batch: "Base Fellowship",
    tags: ["gaming", "P2E", "tournaments"],
    logo: "C",
  },
  {
    id: "6",
    name: "BaseNode",
    description:
      "Infrastructure toolkit for deploying and monitoring smart contracts on Base. One-click deploy with analytics dashboard.",
    category: "Infra",
    founder: "Sneha Gupta",
    founderTwitter: "snehacodes",
    url: "https://basenode.dev",
    batch: "Base Fellowship",
    tags: ["infra", "developer-tools", "analytics"],
    logo: "N",
  },
  {
    id: "7",
    name: "DAOBharat",
    description:
      "DAO governance platform tailored for Indian communities. Multi-language support with gasless voting on Base.",
    category: "DAO",
    founder: "Amit Patel",
    founderTwitter: "amitdao",
    url: "https://daobharat.xyz",
    batch: "Hyperthon",
    tags: ["DAO", "governance", "community"],
    logo: "D",
  },
  {
    id: "8",
    name: "SwapDesi",
    description:
      "DEX aggregator optimized for INR on/off ramps. Best rates across Base liquidity pools.",
    category: "DeFi",
    founder: "Neha Joshi",
    founderTwitter: "nehadefi",
    url: "https://swapdesi.fi",
    batch: "Hyperthon",
    tags: ["DEX", "aggregator", "swap"],
    logo: "S",
  },
  {
    id: "9",
    name: "BaseID",
    description:
      "Decentralized identity verification using Aadhaar-linked proofs on Base. Privacy-preserving KYC for Web3.",
    category: "Infra",
    founder: "Rohan Deshmukh",
    founderTwitter: "rohanid",
    url: "https://baseid.in",
    batch: "Activation",
    tags: ["identity", "KYC", "privacy"],
    logo: "I",
  },
  {
    id: "10",
    name: "CrickDAO",
    description:
      "Fantasy cricket powered by onchain mechanics. Predict, stake, and win with transparent settlement on Base.",
    category: "Gaming",
    founder: "Karan Malhotra",
    founderTwitter: "karangaming",
    url: "https://crickdao.xyz",
    batch: "Activation",
    tags: ["gaming", "fantasy", "cricket"],
    logo: "K",
  },
  {
    id: "11",
    name: "FarmChain",
    description:
      "Supply chain transparency for Indian agriculture. Track farm-to-table with immutable records on Base.",
    category: "Social",
    founder: "Divya Reddy",
    founderTwitter: "divyafarmer",
    url: "https://farmchain.in",
    batch: "Batch 1",
    tags: ["supply-chain", "agriculture", "traceability"],
    logo: "F",
  },
  {
    id: "12",
    name: "ZkRupee",
    description:
      "Privacy-focused stablecoin bridge for INR-pegged assets on Base using zero-knowledge proofs.",
    category: "DeFi",
    founder: "Aditya Kumar",
    founderTwitter: "adityazk",
    url: "https://zkrupee.fi",
    batch: "Batch 2",
    tags: ["ZK", "stablecoin", "bridge"],
    logo: "Z",
  },
];

export const founders: Founder[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    twitter: "arjunbuilds",
    avatar: "AM",
    role: "Founder",
    project: "PayBase",
  },
  {
    id: "2",
    name: "Priya Sharma",
    twitter: "priyaonchain",
    avatar: "PS",
    role: "Founder",
    project: "OnchainBazaar",
  },
  {
    id: "3",
    name: "Rahul Kapoor",
    twitter: "rahuldefi",
    avatar: "RK",
    role: "Founder",
    project: "BaseLend",
  },
  {
    id: "4",
    name: "Kavya Nair",
    twitter: "kavyanft",
    avatar: "KN",
    role: "Founder",
    project: "MintVerse",
  },
  {
    id: "5",
    name: "Vikram Singh",
    twitter: "vikramplays",
    avatar: "VS",
    role: "Founder",
    project: "ChainQuest",
  },
  {
    id: "6",
    name: "Sneha Gupta",
    twitter: "snehacodes",
    avatar: "SG",
    role: "Founder",
    project: "BaseNode",
  },
  {
    id: "7",
    name: "Amit Patel",
    twitter: "amitdao",
    avatar: "AP",
    role: "Founder",
    project: "DAOBharat",
  },
  {
    id: "8",
    name: "Neha Joshi",
    twitter: "nehadefi",
    avatar: "NJ",
    role: "Founder",
    project: "SwapDesi",
  },
  {
    id: "9",
    name: "Rohan Deshmukh",
    twitter: "rohanid",
    avatar: "RD",
    role: "Founder",
    project: "BaseID",
  },
  {
    id: "10",
    name: "Karan Malhotra",
    twitter: "karangaming",
    avatar: "KM",
    role: "Founder",
    project: "CrickDAO",
  },
  {
    id: "11",
    name: "Divya Reddy",
    twitter: "divyafarmer",
    avatar: "DR",
    role: "Founder",
    project: "FarmChain",
  },
  {
    id: "12",
    name: "Aditya Kumar",
    twitter: "adityazk",
    avatar: "AK",
    role: "Founder",
    project: "ZkRupee",
  },
];
