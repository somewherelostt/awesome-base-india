"""
Merge profile_links.json into lib/projects-from-devfolio.json.

Updates each project:
  - founderTwitter -> real Twitter handle from Devfolio profile (if found)
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

    updated = 0
    for p in projects:
        username = (p.get("founderTwitter") or "").strip()
        if not username or username == "devfolio":
            continue
        data = links.get(username) or {}
        if data.get("twitter"):
            p["founderTwitter"] = data["twitter"]
            updated += 1
        if data.get("github"):
            p["founderGithub"] = data["github"]

    with open(PROJECTS_JSON, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

    print("Updated", updated, "projects with Twitter; added founderGithub where available.")
    print("Wrote", PROJECTS_JSON)


if __name__ == "__main__":
    main()
