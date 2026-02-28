"""
Transform Devfolio all_projects.json into the app's Project[] format.
Reads: all_projects.json (in this folder)
Writes: ../../lib/projects-from-devfolio.json
"""
import json
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
INPUT_FILE = SCRIPT_DIR / "all_projects.json"
OUTPUT_FILE = SCRIPT_DIR.parent.parent / "lib" / "projects-from-devfolio.json"

# Devfolio hackathon subdomain -> our batch display name (for filter + README)
HACKATHON_BATCH_MAP = {
    "base-batch-india": "Base Batch India",
    "build-onchain-fbi": "Build Onchain FBI",
    "onchain-ai-blr": "Onchain AI BLR",
    "based-india": "Based India",
}

# Map hashtags/tags to our app categories (case-insensitive match)
CATEGORY_KEYWORDS = {
    "AI": ["ai", "chatbot", "agents", "discovery", "personalization", "automation", "compute", "support", "multi-agent", "llm", "ml"],
    "Consumer": ["creator", "payments", "video", "content", "rewards", "marketplace", "music", "gaming", "messaging", "social", "consumer"],
    "DeFi": ["defi", "dex", "amm", "yield", "staking", "savings", "portfolio", "treasury", "multisig", "lending", "insurance", "onramp", "trading", "farming", "uniswap", "hooks"],
    "Gaming": ["gaming", "play-to-earn", "nft", "lottery", "raffle", "casual", "betting", "quests", "gamification", "dungeon"],
    "Infra": ["infra", "oracle", "bridge", "l2", "analytics", "gas", "relay", "dev-tools", "security", "audit", "solidity", "smart contract"],
    "Mini-apps": ["mini-app", "marketplace", "miniapp", "farcaster"],
    "NFT": ["nft", "art", "gallery", "no-code", "deployer", "collab", "3d"],
    "DAO": ["dao", "governance", "voting", "treasury", "multisig", "sybil"],
    "Identity": ["identity", "credentials", "kyc", "soulbound", "attestations", "naming", "zk"],
    "Social": ["social", "creator", "tipping", "messaging", "token-gated", "community", "social-tokens"],
    "Payments": ["payments", "stablecoin", "onramp", "merchant", "micropayments", "payroll", "streaming", "freelance", "usdc"],
}


def infer_category(hashtags: list) -> str:
    """Infer app category from Devfolio hashtags."""
    if not hashtags:
        return "Consumer"
    tag_names = []
    for h in hashtags:
        if isinstance(h, dict) and "name" in h:
            tag_names.append(h["name"].lower())
        elif isinstance(h, str):
            tag_names.append(h.lower())
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if any(kw in t or t in kw for t in tag_names):
                return category
    return "Consumer"


def description_text(desc_field) -> str:
    """Get a short description from Devfolio description (tagline or first section)."""
    if not desc_field:
        return ""
    if isinstance(desc_field, str):
        return desc_field.strip()[:400]
    if isinstance(desc_field, list) and desc_field:
        first = desc_field[0]
        if isinstance(first, dict):
            content = first.get("content") or first.get("title") or ""
            # Strip markdown headers for display
            text = re.sub(r"^#+\s*", "", content)
            text = re.sub(r"\n+", " ", text).strip()
            return text[:400]
    return ""


def full_description_markdown(desc_field) -> str:
    """Build full markdown from Devfolio description[] (title + content per section)."""
    if not desc_field or not isinstance(desc_field, list):
        return ""
    boilerplate_phrases = (
        "First Place Winners will receive",
        "Incubator Placement",
        "Demo Day Invitation",
        "Second Place Winners",
        "prizes to teams placed",
    )
    parts = []
    for item in desc_field:
        if not isinstance(item, dict):
            continue
        title = (item.get("title") or "").strip()
        content = (item.get("content") or "").strip()
        if not content:
            continue
        if any(phrase in content for phrase in boilerplate_phrases):
            continue
        if title:
            parts.append(f"## {title}\n\n{content}")
        else:
            parts.append(content)
    return "\n\n".join(parts).strip() if parts else ""


def main():
    with open(INPUT_FILE, encoding="utf-8") as f:
        raw = json.load(f)

    base_url = "https://base-batch-india.devfolio.co/projects"
    projects = []

    for i, src in enumerate(raw):
        if not isinstance(src, dict):
            continue
        hackathon = src.get("hackathon") or {}
        subdomain = (hackathon.get("subdomain") or "").strip() or "base-batch-india"
        batch_name = HACKATHON_BATCH_MAP.get(subdomain) or hackathon.get("name") or "Base Batch India"
        base_url_hack = f"https://{subdomain}.devfolio.co/projects"

        name = (src.get("name") or "").strip() or f"Project {i+1}"
        slug = (src.get("slug") or "").strip()
        tagline = (src.get("tagline") or "").strip()
        desc = description_text(src.get("description"))
        description = tagline or desc or "Built on Base."
        if len(description) > 380:
            description = description[:377] + "..."
        description_full = full_description_markdown(src.get("description"))

        hashtags = src.get("hashtags") or []
        tag_names = [
            h.get("name") or h if isinstance(h, dict) else str(h)
            for h in hashtags
            if h
        ][:15]

        members = src.get("members") or []
        founders_list = []
        if members:
            for m in members:
                first_name = (m.get("first_name") or "").strip()
                last_name = (m.get("last_name") or "").strip()
                full_name = f"{first_name} {last_name}".strip() or name
                username = (m.get("username") or "").replace(" ", "").strip()
                if not username:
                    continue
                founders_list.append({"name": full_name, "twitter": username})
            founder = founders_list[0]["name"] if founders_list else name
            founder_twitter = founders_list[0]["twitter"] if founders_list else (slug or "devfolio")
        else:
            founder = name
            founder_twitter = slug or "devfolio"

        project_url = f"{base_url_hack}/{slug}" if slug else base_url_hack
        logo = (src.get("favicon") or src.get("cover_img") or "").strip()

        # Parse all project links: GitHub, Farcaster, YouTube, and other (app/demo/website)
        links_str = (src.get("links") or "").strip()
        github_url = ""
        farcaster_url = ""
        youtube_url = ""
        other_links = []
        if links_str:
            for part in links_str.replace("，", ",").split(","):
                part = part.strip()
                if not part or not part.startswith("http"):
                    continue
                lower = part.lower()
                if "github.com" in lower and not github_url:
                    github_url = part
                elif "farcaster.xyz" in lower or "warpcast.com" in lower:
                    if not farcaster_url:
                        farcaster_url = part
                elif "youtu.be" in lower or "youtube.com" in lower:
                    if not youtube_url:
                        youtube_url = part
                else:
                    # App, demo, website, docs, etc. (skip blockscan, drive, canva, etc. for "main" links)
                    skip_domains = ("basescan.org", "blockscout.com", "drive.google.com", "canva.com", "1drv.ms", "linktr.ee", "medium.com", "docs.google.com", "figma.com")
                    if not any(d in lower for d in skip_domains):
                        other_links.append(part)
        other_links = other_links[:5]

        # Do NOT use API "prizes" for "prizes won" — the search API returns prize definitions
        # for tracks the project applied to (e.g. "First Place" for Consumer track), not actual
        # awards. That would mark non-winners as winners. Leave prizes empty until we have a
        # reliable source (e.g. manual winner list or a dedicated winners API).
        prize_names = []

        out = {
            "id": src.get("uuid") or str(i + 1),
            "name": name,
            "description": description,
            "category": infer_category(hashtags),
            "founder": founder,
            "founderTwitter": founder_twitter,
            "url": project_url,
            "batch": batch_name,
            "tags": tag_names,
            "logo": logo or name[:2].upper(),
            "source": project_url,
        }
        if len(founders_list) > 0:
            out["founders"] = founders_list
        if slug:
            out["slug"] = slug
        if github_url:
            out["github"] = github_url
        if farcaster_url:
            out["farcaster"] = farcaster_url
        if youtube_url:
            out["youtube"] = youtube_url
        if other_links:
            out["links"] = other_links
        if prize_names:
            out["prizes"] = prize_names
        if description_full:
            out["descriptionFull"] = description_full
        projects.append(out)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

    print("Wrote", len(projects), "projects to", OUTPUT_FILE)


if __name__ == "__main__":
    main()
