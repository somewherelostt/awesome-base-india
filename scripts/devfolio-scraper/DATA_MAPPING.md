# Devfolio data vs directory needs

## 1. What Devfolio API actually gives (raw example)

One project from `all_projects.json` (Not Your Type) looks like this:

```json
{
  "uuid": "dd7a3d4582ad4baf9131926f53fb063e",
  "name": "Not Your Type",
  "tagline": "Bet Against the Crowd, Win with Base.",
  "slug": "not-your-type-80a6",
  "description": [
    {
      "title": "The problem it solves",
      "content": "## The Problem: Groupthink..."
    },
    { "title": "Challenges we ran into", "content": "..." }
  ],
  "favicon": "https://assets.devfolio.co/.../a193380a-472c-40b4-8aea-63effc2239f3.jpeg",
  "cover_img": "https://assets.devfolio.co/.../e8682fab-0094-4002-9cfe-adf691e0d3db.jpeg",
  "hashtags": [
    { "name": "Solidity", "verified": true },
    { "name": "Next.js", "verified": true },
    { "name": "BASE" }
  ],
  "members": [
    {
      "first_name": "Harsh",
      "last_name": "Shukla",
      "username": "Harshshukla",
      "profile_image": "https://assets.devfolio.co/users/.../avatar-....jpeg"
    },
    {
      "first_name": "Yadla",
      "last_name": "Mani",
      "username": "mani_yadla",
      "profile_image": "https://..."
    }
  ],
  "links": "https://github.com/...,https://farcaster.xyz/...",
  "video_url": "https://youtu.be/MiWPD8DCiZE",
  "prize_tracks": [
    { "name": "Consumer" },
    { "name": "Mini-apps" },
    { "name": "Stablecoins" }
  ],
  "hackathon": {
    "name": "Base Batch India",
    "subdomain": "base-batch-india"
  },
  "category": null,
  "desc": null
}
```

So Devfolio **does give**:

| Field | Devfolio source | Used in directory |
|-------|-----------------|--------------------|
| Project name | `name` | ✅ |
| Short blurb | `tagline` | ✅ (as description) |
| Long description | `description[].content` | ✅ (we use tagline or first section) |
| Logo | `favicon` / `cover_img` | ✅ |
| Project URL | built from `slug` | ✅ |
| Tags | `hashtags[].name` | ✅ |
| Founder name | `members[0].first_name` + `last_name` | ✅ |
| Batch | `hackathon.name` | ✅ (always "Base Batch India" for this scrape) |
| Track/category (hackathon) | `prize_tracks[].name` | ⚠️ We infer from hashtags instead |
| Member avatars | `members[].profile_image` | ❌ Not used (we use project logo / initials) |
| Links (GitHub, app, etc.) | `links` (comma-separated string) | ❌ Not in our schema |
| Video | `video_url` | ❌ Not in our schema |

---

## 2. What we produce for the directory (after transform)

Same project in `lib/projects-from-devfolio.json`:

```json
{
  "id": "dd7a3d4582ad4baf9131926f53fb063e",
  "name": "Not Your Type",
  "description": "Bet Against the Crowd, Win with Base.",
  "category": "Infra",
  "founder": "Harsh Shukla",
  "founderTwitter": "Harshshukla",
  "url": "https://base-batch-india.devfolio.co/projects/not-your-type-80a6",
  "batch": "Base Batch India",
  "tags": ["Solidity", "Next.js", "TypeScript", "BASE", "ThridWeb", "Remix (IDE)", "Shadcn", "Smart wallet"],
  "logo": "https://assets.devfolio.co/.../a193380a-472c-40b4-8aea-63effc2239f3.jpeg",
  "source": "https://base-batch-india.devfolio.co/projects/not-your-type-80a6"
}
```

This matches the directory’s `Project` type and is used everywhere (product grid, chroma grid, filters, founders list).

---

## 3. What the directory needs but we don’t get (or don’t use) from Devfolio

| Need | Status | Notes |
|------|--------|--------|
| **Twitter/X handle** | ❌ Not from API | Devfolio has `members[].username` (Devfolio handle, e.g. `Harshshukla`). We put that in `founderTwitter`, so “@founderTwitter” and the link go to **x.com/Harshshukla** — often wrong. Directory expects a real Twitter handle. |
| **Category** | ⚠️ Inferred | Devfolio has `category: null` but has `prize_tracks` (e.g. Consumer, Mini-apps). We infer category from hashtags (e.g. “Solidity” → Infra). So some projects can be in a different category than their hackathon track. |
| **Project / demo URL** | ⚠️ Partial | We only set `url` to the Devfolio project page. Devfolio’s `links` has live app / GitHub; we don’t parse that into a “demo URL” field. |
| **Other batches** | ❌ This scrape only | Scraper is for `base-batch-india` only. “Based India”, “Builder Track 002”, “Build Onchain FBI”, “Independent” have no data from this pipeline. |
| **Founder avatar (per founder)** | ❌ Not used | We derive founders from projects; avatar is project-name initials. Devfolio’s `members[].profile_image` is not mapped into our Founder type. |

---

## 4. Summary

- **We have and use:** name, description (tagline/short), logo URL, project URL (Devfolio), tags, founder name, batch (for this hackathon), and we infer category from hashtags.
- **Main gap for the directory:** real **Twitter/X handle**; currently it’s the Devfolio username, so “@founderTwitter” and the X link are often wrong.
- **Optional improvements:** use `prize_tracks` for category when available; optionally add founder avatars from `members[].profile_image`.

## 5. Implemented extras

- **Project GitHub & Farcaster:** Parsed from `links` (comma-separated); stored as `github` and `farcaster` on each project. Shown on project cards.
- **Prizes:** We do **not** use the API `prizes` array. The search API returns prize *definitions* for tracks the project applied to (e.g. "First Place" for Consumer), not actual awards won, so it would mark non-winners as winners. `prizes` is left empty in the transform. To show real winners, use a manual list of winner slugs or a dedicated winners endpoint and set `prizes` only for those projects.
- **Founder Twitter & GitHub:** Script `fetch_devfolio_profiles.py` fetches each founder’s Devfolio profile (e.g. `https://devfolio.co/@Harshshukla`), parses the page for Twitter/X and GitHub links, and writes `profile_links.json`. Run `merge_profile_links.py` to update `projects-from-devfolio.json` with real `founderTwitter` and `founderGithub`.
