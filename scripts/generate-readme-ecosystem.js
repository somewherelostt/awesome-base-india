const fs = require("fs");
const path = require("path");
const data = require("../lib/projects-from-devfolio.json");

const categoryToSection = {
  DAO: "DAOs",
  DeFi: "DeFi",
  Gaming: "Gaming",
  Infra: "Infrastructure",
  AI: "Infrastructure",
  Consumer: "Social",
  "Mini-apps": "Social",
  NFT: "NFTs",
  Payments: "Onramps",
  Social: "Social",
  Identity: "Wallets",
};

const bySection = {
  Bridges: [],
  DAOs: [],
  DeFi: [],
  Gaming: [],
  Infrastructure: [],
  NFTs: [],
  Onramps: [],
  Social: [],
  Wallets: [],
};

for (const p of data) {
  const section = categoryToSection[p.category] || "Infrastructure";
  const link = p.farcaster || (p.links && p.links[0]) || p.github || p.url;
  bySection[section].push({ name: p.name, description: p.description || "", link });
}

const order = ["Bridges", "DAOs", "DeFi", "Gaming", "Infrastructure", "NFTs", "Onramps", "Social", "Wallets"];
const subtitles = {
  Bridges: "Indian projects building cross-chain bridge solutions on Base",
  DAOs: "Indian DAOs and decentralized governance projects on Base",
  DeFi: "Indian DeFi protocols, DEXs, and financial applications on Base",
  Gaming: "Indian gaming projects and blockchain games on Base",
  Infrastructure: "Indian infrastructure providers, developer tools, and platforms on Base",
  NFTs: "Indian NFT marketplaces, creators, and platforms on Base",
  Onramps: "Indian fiat-to-crypto onramps and payment solutions for Base",
  Social: "Indian social platforms and community projects on Base",
  Wallets: "Indian wallet providers supporting Base",
};

let out = "";
for (const section of order) {
  const list = bySection[section].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );
  out += `### ${section}\n\n`;
  out += `*${subtitles[section]}*\n\n`;
  if (list.length === 0) {
    out += "<!-- Add Indian projects here -->\n\n";
  } else {
    for (const p of list) {
      const desc = (p.description || "").replace(/\[/g, "\\[").trim();
      out += `- [${p.name}](${p.link}) — ${desc}\n\n`;
    }
  }
}

const header = `# Awesome Base India [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

**Awesome Base India** is a curated list of Indian projects, dApps, and initiatives building on Base — an Ethereum L2 incubated by Coinbase.

## Base Official Links

+ [Base.org](https://base.org/)
+ [Base Blog](https://base.mirror.xyz/)
+ [Base Bridge](https://bridge.base.org/)
+ [Base Discord](https://base.org/discord)
+ [Base Farcaster](https://warpcast.com/base)
+ [Base GitHub](https://github.com/base-org)
+ [Base Guild](https://guild.xyz/buildonbase)
+ [Base Quests](https://quests.base.org/)
+ [Base Status](https://status.base.org/)
+ [Base X](https://x.com/buildonbase)

## Base India Community

+ [Inner Circle X](https://x.com/innercircle_so)
+ [Community Link](https://t.co/BC2WASe4OD)

## Indian Base Ecosystem

`;

const footer = `
## Contributions

If you have something you'd like to add, please open a pull request and ensure it matches the format + ordering (alphanumerical) of the existing entries. Links that are inactive, outdated, or no longer relevant may be removed at any time.

## License

[MIT License](LICENSE)
`;

fs.writeFileSync(path.join(__dirname, "readme_ecosystem_section.md"), out, "utf8");
fs.writeFileSync(path.join(__dirname, "..", "README.md"), header + out + footer, "utf8");
console.log("Wrote readme_ecosystem_section.md and README.md (all projects listed under 9 sections)");
