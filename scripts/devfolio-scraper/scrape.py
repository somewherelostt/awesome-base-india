"""
Scrape projects from multiple Devfolio hackathons (Base Batch India, Build Onchain FBI,
Onchain AI BLR, Based India). Output: all_projects.json in this folder.
"""
import requests
import json
from pathlib import Path

URL = "https://api.devfolio.co/api/search/projects"
HEADERS = {
    "Content-Type": "application/json",
    "Origin": "https://base-batch-india.devfolio.co",
    "Referer": "https://base-batch-india.devfolio.co/",
}

# All hackathon slugs to fetch (Devfolio subdomains)
HACKATHON_SLUGS = [
    "base-batch-india",
    "build-onchain-fbi",
    "onchain-ai-blr",
    "based-india",
]

OUTPUT_FILE = Path(__file__).resolve().parent / "all_projects.json"
PAGE_SIZE = 50
MAX_OFFSET = 1000

all_projects = []
seen_ids = set()

for offset in range(0, MAX_OFFSET, PAGE_SIZE):
    payload = {
        "hackathon_slugs": HACKATHON_SLUGS,
        "q": "",
        "filter": "all",
        "prizes": [],
        "prize_tracks": [],
        "tracks": [],
        "category": [],
        "hashtags": [],
        "from": offset,
        "size": PAGE_SIZE,
    }
    res = requests.post(URL, json=payload, headers=HEADERS)
    data = res.json()
    hits = data.get("hits") or {}
    projects = hits.get("hits", []) if isinstance(hits, dict) else []
    if not projects:
        break
    for item in projects:
        src = item.get("_source") or item
        pid = src.get("uuid") or src.get("slug") or ""
        if pid and pid not in seen_ids:
            seen_ids.add(pid)
            all_projects.append(src)
    print("Collected:", len(all_projects))

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_projects, f, indent=2)

print("Final count:", len(all_projects))
print("Saved to:", OUTPUT_FILE)
