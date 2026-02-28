"""
Merge profile_links.json into lib/projects-from-devfolio.json.

Keeps one canonical founder id per person (Devfolio username) to avoid duplicate
founder profiles. Updates each project:
  - founderTwitter -> always Devfolio username (canonical id for /founders/[username])
  - founderTwitterHandle -> Twitter handle for display/X links (if found)
  - founderGithub -> founder's GitHub URL from Devfolio profile (if found)

Run after fetch_devfolio_profiles.py.
"""
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECTS_JSON = SCRIPT_DIR.parent.parent / "lib" / "projects-from-devfolio.json"
PROFILE_LINKS = SCRIPT_DIR / "profile_links.json"


def main():
    if not PROFILE_LINKS.exists():
        print("Run fetch_devfolio_profiles.py first to create", PROFILE_LINKS)
        return

    with open(PROJECTS_JSON, encoding="utf-8") as f:
        projects = json.load(f)
    with open(PROFILE_LINKS, encoding="utf-8") as f:
        links = json.load(f)

    # Twitter handle -> Devfolio username (so we normalize Twitter back to canonical id)
    twitter_to_devfolio = {}
    for devfolio_user, data in links.items():
        tw = (data.get("twitter") or "").strip()
        if tw:
            twitter_to_devfolio[tw.lower()] = devfolio_user

    updated = 0
    for p in projects:
        key = (p.get("founderTwitter") or "").strip()
        if not key or key == "devfolio":
            continue
        key_lower = key.lower()
        if key_lower in twitter_to_devfolio:
            # key was a Twitter handle; use Devfolio username as canonical id
            canonical = twitter_to_devfolio[key_lower]
            p["founderTwitter"] = canonical
            p["founderTwitterHandle"] = key
            updated += 1
        elif key in links:
            # key is Devfolio username; keep it, add Twitter handle for display
            data = links[key]
            if data.get("twitter"):
                p["founderTwitterHandle"] = data["twitter"]
                updated += 1
        canonical = p.get("founderTwitter") or key
        if canonical in links and links[canonical].get("github"):
            p["founderGithub"] = links[canonical]["github"]

    with open(PROJECTS_JSON, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

    print("Updated", updated, "projects with canonical founder id + Twitter handle; added founderGithub where available.")
    print("Wrote", PROJECTS_JSON)


if __name__ == "__main__":
    main()
