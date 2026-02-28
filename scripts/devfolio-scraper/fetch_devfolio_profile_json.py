"""
Fetch full Devfolio profile JSON from profile page (__NEXT_DATA__) and generate founder MDX.

Reads: lib/projects-from-devfolio.json (for list of founder usernames)
Fetches: https://devfolio.co/@{username} and parses script#__NEXT_DATA__
Writes: content/founders/[username].mdx (frontmatter + editable body)

Usage:
  pip install requests
  python fetch_devfolio_profile_json.py                    # fetch all founders
  python fetch_devfolio_profile_json.py user1 user2 user3  # retry only these usernames
"""
import json
import re
import sys
import time
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent.parent
PROJECTS_JSON = ROOT / "lib" / "projects-from-devfolio.json"
PROFILE_LINKS = SCRIPT_DIR / "profile_links.json"
CONTENT_FOUNDERS = ROOT / "content" / "founders"
BASE_URL = "https://devfolio.co"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0"


def find_in_obj(obj, path: list):
    """Recursively find first object that has all keys in path (depth-first)."""
    if not path:
        return obj
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == path[0]:
                found = find_in_obj(v, path[1:])
                if found is not None:
                    return found
            found = find_in_obj(v, path)
            if found is not None:
                return found
    elif isinstance(obj, list):
        for item in obj:
            found = find_in_obj(item, path)
            if found is not None:
                return found
    return None


def extract_users_and_stats(next_data: dict):
    """Extract users[0], profiles (social), address, userDevfolioStats from Next.js payload.
    Devfolio structure: queries[].state.data with users, profiles, userDevfolioStats."""
    user = None
    profiles_list = []
    address_data = None
    stats_data = None

    def walk(o, depth=0):
        nonlocal user, profiles_list, address_data, stats_data
        if depth > 30:
            return
        if isinstance(o, dict):
            if "users" in o and isinstance(o["users"], list) and o["users"] and user is None:
                user = o["users"][0]
            if "userDevfolioStats" in o and stats_data is None:
                stats_data = o["userDevfolioStats"]
            if "profiles" in o and isinstance(o["profiles"], list) and o["profiles"]:
                profiles_list = o["profiles"]
            if "address" in o and isinstance(o["address"], dict) and address_data is None:
                address_data = o["address"]
            for v in o.values():
                walk(v, depth + 1)
        elif isinstance(o, list):
            for i in o:
                walk(i, depth + 1)

    # Prefer dehydratedState.queries[].state.data (Next.js React Query)
    props = next_data.get("props", {}) or {}
    page_props = props.get("pageProps", {}) or {}
    dehydrated = page_props.get("dehydratedState") or page_props.get("dehydratedState") or {}
    queries = (dehydrated.get("queries") or []) if isinstance(dehydrated, dict) else []
    for q in queries:
        if not isinstance(q, dict):
            continue
        state = q.get("state") or {}
        data = state.get("data") if isinstance(state, dict) else None
        if data and isinstance(data, dict):
            if "users" in data and isinstance(data["users"], list) and data["users"] and user is None:
                user = data["users"][0]
            if "profiles" in data and isinstance(data["profiles"], list):
                profiles_list = data["profiles"]
            if "address" in data and isinstance(data["address"], dict):
                address_data = data["address"]
            if "userDevfolioStats" in data and stats_data is None:
                stats_data = data["userDevfolioStats"]

    walk(next_data)
    return user, profiles_list, address_data, stats_data


def social_from_profiles(profiles: list) -> dict:
    out = {}
    for p in profiles or []:
        if not isinstance(p, dict):
            continue
        # Support both url/link and value/name (readme-md.json API shape)
        url = (p.get("url") or p.get("link") or p.get("value") or "").strip()
        kind = (p.get("type") or p.get("platform") or p.get("name") or "").lower()
        if "github" in kind or "github.com" in url:
            out["github"] = url or None
        if "twitter" in kind or "x.com" in url or "twitter.com" in url:
            out["twitter"] = url or None
        if "linkedin" in kind:
            out["linkedin"] = url or None
    return out


def build_founder_schema(user: dict, profiles: list, address: dict, stats: dict, username: str) -> dict:
    """Build clean founder schema for MDX frontmatter."""
    if not user:
        return {"username": username, "name": username }

    first = (user.get("first_name") or "").strip()
    last = (user.get("last_name") or "").strip()
    name = f"{first} {last}".strip() or username
    short_bio = (user.get("short_bio") or "").strip()
    full_bio = (user.get("bio") or user.get("full_bio") or user.get("long_bio") or "").strip()
    # Devfolio uses profileImage (camelCase) in readme-md API; Next.js may use snake_case
    profile_image = (
        (user.get("profile_image") or user.get("avatar_url") or user.get("profileImage") or "").strip()
    )

    social = social_from_profiles(profiles)
    city = ""
    country = "India"
    if address:
        city = (address.get("city") or address.get("locality") or "").strip()
        country = (address.get("country") or "India").strip() or "India"

    hackathons_attended = 0
    projects_built = 0
    prizes_won = 0
    prize_winnings_amount = 0
    onchain_creds_claimed = 0
    if stats and isinstance(stats, dict):
        hackathons_attended = int(stats.get("hackathons_attended") or stats.get("hackathon_count") or 0)
        projects_built = int(stats.get("projects_built") or stats.get("project_count") or 0)
        prizes_won = int(stats.get("prizes_won") or stats.get("prize_count") or 0)
        prize_winnings_amount = float(stats.get("prize_winnings_amount") or stats.get("prize_amount") or 0)
        onchain_creds_claimed = int(stats.get("onchain_credentials_claimed") or stats.get("onchain_creds") or 0)

    # Tags from short_bio / full_bio keywords (simplified)
    tags = []
    for word in (short_bio + " " + full_bio).replace(",", " ").split():
        w = word.strip().strip(".#")
        if len(w) > 2 and w.isalnum() and w not in ("the", "and", "from", "for", "with", "building", "builder"):
            tags.append(w)
    tags = list(dict.fromkeys(tags))[:12]

    return {
        "username": username,
        "name": name,
        "city": city or None,
        "country": country,
        "short_bio": short_bio or None,
        "profile_image": profile_image or None,
        "github": social.get("github"),
        "twitter": social.get("twitter"),
        "linkedin": social.get("linkedin"),
        "hackathons_attended": hackathons_attended,
        "projects_built": projects_built,
        "prizes_won": prizes_won,
        "prize_winnings_amount": prize_winnings_amount,
        "onchain_creds_claimed": onchain_creds_claimed,
        "tags": tags,
    }


def mdx_escape(s: str) -> str:
    if not s:
        return ""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def generate_mdx(schema: dict, full_bio: str) -> str:
    """Generate MDX content with frontmatter and editable body."""
    lines = ["---"]
    for k, v in schema.items():
        if v is None:
            continue
        if k == "tags" and v:
            lines.append("tags:")
            for t in v:
                lines.append(f'  - "{mdx_escape(str(t))}"')
        elif isinstance(v, str):
            lines.append(f'{k}: "{mdx_escape(v)}"')
        elif isinstance(v, (int, float)):
            lines.append(f"{k}: {v}")
    lines.append("---")
    lines.append("")
    lines.append("## About")
    lines.append("")
    lines.append(full_bio[:2000] if full_bio else "*Edit this section in the MDX file.*")
    lines.append("")
    lines.append("## What I'm Building")
    lines.append("")
    lines.append("*Add your focus areas and current projects here.*")
    lines.append("")
    lines.append("## Interests")
    lines.append("")
    lines.append("- Web3")
    lines.append("- Base")
    lines.append("- India ecosystem")
    return "\n".join(lines)


def main():
    # Retry mode: only usernames passed as arguments
    only_usernames = [a.strip() for a in sys.argv[1:] if a.strip()]

    if only_usernames:
        usernames = set(only_usernames)
        print("Retry mode: fetching", len(usernames), "profile(s)...")
    else:
        if not PROJECTS_JSON.exists():
            print("Run transform_to_data.py first.")
            return
        with open(PROJECTS_JSON, encoding="utf-8") as f:
            projects = json.load(f)
        raw = set()
        for p in projects:
            u = (p.get("founderTwitter") or "").strip()
            if u and u != "devfolio":
                raw.add(u)
            for f in p.get("founders") or []:
                t = (f.get("twitter") or "").strip()
                if t and t != "devfolio":
                    raw.add(t)
        # One profile per person: normalize Twitter handles to Devfolio username when we have profile_links
        twitter_to_devfolio = {}
        if PROFILE_LINKS.exists():
            with open(PROFILE_LINKS, encoding="utf-8") as f:
                links = json.load(f)
            for devfolio_user, data in (links or {}).items():
                tw = (data.get("twitter") or "").strip()
                if tw:
                    twitter_to_devfolio[tw.lower()] = devfolio_user
        usernames = set()
        for u in raw:
            canonical = twitter_to_devfolio.get(u.lower(), u)
            usernames.add(canonical)
        print("Fetching", len(usernames), "profiles and writing MDX...")

    CONTENT_FOUNDERS.mkdir(parents=True, exist_ok=True)

    for i, username in enumerate(sorted(usernames)):
        print(i + 1, "/", len(usernames), username, end=" ... ")
        try:
            r = requests.get(f"{BASE_URL}/@{username}", headers={"User-Agent": USER_AGENT}, timeout=15)
            r.raise_for_status()
            html = r.text
        except Exception as e:
            print("fetch error:", e)
            # Write placeholder MDX so page exists
            schema = {"username": username, "name": username.replace("_", " ").title()}
            mdx = generate_mdx(schema, "")
            (CONTENT_FOUNDERS / f"{username}.mdx").write_text(mdx, encoding="utf-8")
            time.sleep(0.8)
            continue

        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
        if not match:
            print("no __NEXT_DATA__")
            schema = {"username": username, "name": username.replace("_", " ").title()}
            mdx = generate_mdx(schema, "")
            (CONTENT_FOUNDERS / f"{username}.mdx").write_text(mdx, encoding="utf-8")
            time.sleep(0.8)
            continue

        try:
            next_data = json.loads(match.group(1))
        except json.JSONDecodeError as e:
            print("json error:", e)
            schema = {"username": username, "name": username.replace("_", " ").title()}
            mdx = generate_mdx(schema, "")
            (CONTENT_FOUNDERS / f"{username}.mdx").write_text(mdx, encoding="utf-8")
            time.sleep(0.8)
            continue

        user, profiles, address, stats = extract_users_and_stats(next_data)
        full_bio = (user.get("bio") or user.get("full_bio") or user.get("long_bio") or "") if user else ""
        schema = build_founder_schema(user or {}, profiles, address or {}, stats or {}, username)
        mdx = generate_mdx(schema, full_bio)
        out_path = CONTENT_FOUNDERS / f"{username}.mdx"
        out_path.write_text(mdx, encoding="utf-8")
        print("ok ->", out_path.name)
        time.sleep(1.0)

    # Remove duplicate founder MDX keyed by Twitter handle (we now use Devfolio username only)
    if not only_usernames and PROFILE_LINKS.exists():
        with open(PROFILE_LINKS, encoding="utf-8") as f:
            links = json.load(f)
        twitter_handles = { (data.get("twitter") or "").strip().lower() for data in (links or {}).values() if (data.get("twitter") or "").strip() }
        removed = 0
        for mdx_file in list(CONTENT_FOUNDERS.glob("*.mdx")):
            stem = mdx_file.stem.lower()
            if stem in twitter_handles:
                mdx_file.unlink()
                removed += 1
                print("Removed duplicate profile (Twitter handle):", mdx_file.name)
        if removed:
            print("Removed", removed, "duplicate founder MDX file(s).")

    print("Done. MDX files in", CONTENT_FOUNDERS)


if __name__ == "__main__":
    main()
