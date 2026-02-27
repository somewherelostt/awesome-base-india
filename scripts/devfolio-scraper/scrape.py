"""
Scrape Base Batch India projects from Devfolio API.
Output: all_projects.json in this folder.
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

OUTPUT_FILE = Path(__file__).resolve().parent / "all_projects.json"
PAGE_SIZE = 50
MAX_OFFSET = 500

all_projects = []

for offset in range(0, MAX_OFFSET, PAGE_SIZE):
    payload = {
        "hackathon_slugs": ["base-batch-india"],
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
    # Each item has _source with the actual project data
    for item in projects:
        src = item.get("_source") or item
        all_projects.append(src)
    print("Collected:", len(all_projects))

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_projects, f, indent=2)

print("Final count:", len(all_projects))
print("Saved to:", OUTPUT_FILE)
