# Devfolio scraper (Base Batch India)

Fetches official project data from the Devfolio API and turns it into the app’s project list.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

1. **Scrape** – fetch all projects from the API into `all_projects.json`:

   ```bash
   python scrape.py
   ```

2. **Transform** – build `lib/projects-from-devfolio.json` (includes GitHub/Farcaster from links, prizes):

   ```bash
   python transform_to_data.py
   ```

3. **Optional: Twitter & GitHub from profiles** – scrape each founder’s Devfolio profile for real Twitter handle and GitHub URL:

   ```bash
   python fetch_devfolio_profiles.py   # writes profile_links.json
   python merge_profile_links.py       # updates projects-from-devfolio.json
   ```

4. **Optional: Full founder profile MDX** – fetch Devfolio profile JSON (from profile page) and generate one MDX file per founder (primary + co-founders from `founders[]`) under `content/founders/`. This populates Devfolio stats and creates MDX editable via the Telegram bot:

   ```bash
   python fetch_devfolio_profile_json.py   # writes content/founders/*.mdx
   ```

The app’s `lib/data.ts` imports from `projects-from-devfolio.json`. After step 2 the site has official data, logos, prizes, and project GitHub/Farcaster links. After step 3 it also has real founder Twitter and founder GitHub. After step 4, founder pages at `/founders/[username]` use the generated MDX (editable) and show India map + Devfolio stats. Run `npm run add-edit-ids` and `npm run sync-edit-ids` from the repo root so every founder has an edit_id and can edit all data via the Telegram bot. Clicking a project in the directory goes to `/projects/[slug]`, where you can open the founder’s full profile.
