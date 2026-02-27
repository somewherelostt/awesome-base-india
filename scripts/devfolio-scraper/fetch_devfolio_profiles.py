"""
Fetch Twitter/X and GitHub links from Devfolio profile pages.

Reads: lib/projects-from-devfolio.json (to get founderTwitter = Devfolio usernames)
Writes: profile_links.json in this folder { "devfolio_username": { "twitter": "handle", "github": "url" } }
        Then run merge_profile_links.py to update projects-from-devfolio.json with founderTwitter + founderGithub.

Usage:
  pip install requests beautifulsoup4
  python fetch_devfolio_profiles.py
  python merge_profile_links.py
"""
import json
import re
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECTS_JSON = SCRIPT_DIR.parent.parent / "lib" / "projects-from-devfolio.json"
OUTPUT_FILE = SCRIPT_DIR / "profile_links.json"
BASE_URL = "https://devfolio.co"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0"


def extract_handle_from_twitter_url(url: str) -> str | None:
    if not url:
        return None
    url = url.rstrip("/")
    # x.com/handle or twitter.com/handle
    for prefix in ("https://x.com/", "https://twitter.com/", "http://x.com/", "http://twitter.com/"):
        if url.lower().startswith(prefix):
            handle = url[len(prefix) :].split("/")[0].split("?")[0].strip()
            if handle:
                return handle
    return None


def extract_github_url(html: str, base: str) -> str | None:
    # Prefer direct links to github.com (user or repo)
    soup = BeautifulSoup(html, "html.parser")
    seen = set()
    for a in soup.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        if not href or href in seen:
            continue
        seen.add(href)
        if href.startswith("//"):
            href = "https:" + href
        if not href.startswith("http"):
            if href.startswith("/"):
                href = base + href
            else:
                continue
        lower = href.lower()
        if "github.com" in lower and "gist." not in lower:
            return href
    # Fallback: regex in raw HTML (for client-rendered links in script/data)
    for match in re.finditer(r'["\'](https?://(?:www\.)?github\.com/[^"\'\\s]+)["\']', html, re.I):
        return match.group(1)
    return None


def extract_twitter_handle(html: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        h = extract_handle_from_twitter_url(href)
        if h:
            return h
    for match in re.finditer(
        r'["\'](https?://(?:www\.)?(?:x\.com|twitter\.com)/(?:#!/)?([a-zA-Z0-9_]+))["\']',
        html,
        re.I,
    ):
        return match.group(2)
    return None


def fetch_profile(username: str) -> dict:
    url = f"{BASE_URL}/@{username}"
    out = {}
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=15)
        r.raise_for_status()
        html = r.text
        twitter = extract_twitter_handle(html)
        if twitter:
            out["twitter"] = twitter
        github = extract_github_url(html, BASE_URL)
        if github:
            out["github"] = github
    except Exception as e:
        out["_error"] = str(e)
    return out


def main():
    if not PROJECTS_JSON.exists():
        print("Run transform_to_data.py first so that", PROJECTS_JSON, "exists.")
        return

    with open(PROJECTS_JSON, encoding="utf-8") as f:
        projects = json.load(f)

    usernames = set()
    for p in projects:
        tw = (p.get("founderTwitter") or "").strip()
        if tw and tw != "devfolio":
            usernames.add(tw)

    print("Found", len(usernames), "unique Devfolio usernames to fetch.")
    results = {}
    for i, username in enumerate(sorted(usernames)):
        print(i + 1, "/", len(usernames), username, end=" ... ")
        data = fetch_profile(username)
        if data.get("_error"):
            print("error:", data["_error"])
        else:
            print("twitter=", data.get("twitter") or "-", "github=", "yes" if data.get("github") else "-")
        results[username] = {k: v for k, v in data.items() if k != "_error"}
        time.sleep(0.8)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("Wrote", OUTPUT_FILE)


if __name__ == "__main__":
    main()
