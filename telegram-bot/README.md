# Base India Circle – Telegram submission bot

Bot that collects project submissions via Telegram and saves them to Supabase. You verify in Supabase and then use the data on the frontend.

## Setup

1. **Create a Telegram bot**  
   Message [@BotFather](https://t.me/BotFather), create a bot, copy the token.

2. **Supabase**  
   Run in the SQL editor, in order:
   - **`supabase-setup.sql`** – project submissions table.
   - **`supabase-edit-id-and-mdx.sql`** – edit_id registry and mdx_edits for /edit flow.
   - **`supabase-directory-and-edits.sql`** – directory_projects, directory_founders, founder_submissions (for “Existing project/founder” list and field-level edits).
   From repo root run **`npm run sync-edit-ids`** to sync edit_id from MDX into the registry. Run **`npm run seed-directory`** to seed **directory_projects** and **directory_founders** from `lib/projects-from-devfolio.json` and `content/founders/*.mdx` so the bot can list “Existing project” / “Existing founder” by exact name.

3. **Env**  
   Copy `.env.example` to `.env` and set:

   - `TELEGRAM_BOT_TOKEN` – from BotFather  
   - `SUPABASE_URL` – Supabase project URL  
   - `SUPABASE_SERVICE_KEY` – Supabase service role key (Settings → API)

4. **Install and run**

```bash
cd telegram-bot
npm install
npm run build
npm start
```

For development:

```bash
npm run dev
```

## Flow

1. User sends **/start** or **/submit**. The bot shows a menu:
   - **Existing project** – list of projects (from `directory_projects` or `edit_id_registry`). User picks by name/number, then can edit fields one by one. Changes are saved to `directory_projects`; you copy from Supabase into the project MDX.
   - **Existing founder** – same for founders (`directory_founders`). Edits go to Supabase; you update the founder MDX manually.
   - **New project** – same as before: product name, URL, description, logo, category, tags, GitHub, Twitter, founder name, founder Twitter, teammates. Saved to `project_submissions` (simple columns for easy copy to MDX).
   - **New founder** – asks: username, name, city, country, short_bio, profile_image, github, twitter, hackathons_attended, projects_built, prizes_won, tags, etc. Saved to `founder_submissions`.
2. All data is stored in **simple flat fields** in Supabase so you can copy-paste when updating or creating MDX files.
3. **/edit &lt;edit_id&gt;** – unchanged: user sends full MDX in the next message; stored in `mdx_edits` for manual replace.

## Field mapping to frontend

| Bot / Supabase field   | Frontend (`lib/data.ts`) |
|------------------------|---------------------------|
| `product_name`         | `Project.name`            |
| `project_url`          | `Project.url`             |
| `description`          | `Project.description`    |
| `logo_url`             | `Project.logo` (image URL) |
| `category`             | `Project.category` (AI, Wallet, Defi, Consumer, Onramp, Infra) |
| `tags`                 | `Project.tags` (array)    |
| `founder_name`         | `Project.founder`, `Founder.name` |
| `founder_twitter`      | `Project.founderTwitter`, `Founder.twitter` |
| `teammates` (array)    | Extra `Founder` entries (name, twitter) |
| `github_url`           | Use for links / proof     |
| `twitter_profile`      | Project’s Twitter         |
| `batch`                | `Project.batch` (optional) |

## Deploy on Render (Web Service, free tier)

The bot runs an HTTP server on `PORT` (for Render health checks) and the Telegram bot in the same process.

1. **Push the repo**  
   Ensure the repo is pushed to GitHub.

2. **Create a Render account**  
   Go to [render.com](https://render.com) and sign in (e.g. with GitHub).

3. **New Web Service**  
   - Dashboard → **New +** → **Web Service**.  
   - Connect GitHub and select the **awesome-base-india** repo.  
   - Set **Root Directory** to: `telegram-bot`  
   - **Name**: e.g. `awesome-base-india-bot`.

4. **Build & start**  
   - **Build Command:** `npm install && npm run build`  
   - **Start Command:** `npm start`

5. **Environment variables**  
   In the service **Environment** tab, add:
   - `TELEGRAM_BOT_TOKEN` – from BotFather  
   - `SUPABASE_URL` – e.g. `https://xxxxx.supabase.co`  
   - `SUPABASE_SERVICE_KEY` – your Supabase secret key  

6. **Create Web Service**  
   Click **Create Web Service**. After deploy, check **Logs** for “Health server on :XXXX” and “Bot running (webhook): …”.

7. **Webhook vs polling**  
   On Render the bot uses *webhook* mode (Telegram sends updates to `https://your-service.onrender.com/webhook`). Render sets `RENDER_EXTERNAL_URL` automatically, so no extra env is needed. This avoids the “409 Conflict: only one bot instance” error. For local dev, don’t set `RENDER_EXTERNAL_URL` or `WEBHOOK_BASE_URL` so the bot uses polling — and stop the local bot when the same token is used on Render.

8. **Free tier note**  
   On the free tier, the service may spin down after ~15 minutes with no traffic. When someone messages the bot, the first request can be slow (cold start). To keep it awake, you can use a free cron (e.g. [cron-job.org](https://cron-job.org)) to hit `https://your-service.onrender.com/` every 10 minutes.

## Commands

- `/start` – Start or restart the flow  
- `/submit` – Start a new submission  
- `/cancel` – Cancel current submission or edit flow  
- `/skip` – Skip optional steps (GitHub, Twitter, teammates)  
- `/edit <edit_id>` – Update your founder profile or project MDX. Use the `edit_id` from your MDX frontmatter (e.g. `/edit dv8x2k9m`). The bot will ask for the full updated MDX content; it’s stored in Supabase for manual review, then you replace the file in the repo.

### Edit flow (profile / project MDX)

1. Founder and project pages are stored as MDX with an **edit_id** in frontmatter.  
2. User sends `/edit <edit_id>` in the bot.  
3. Bot looks up `edit_id_registry` (synced from MDX via `npm run sync-edit-ids` in the repo root).  
4. User sends the full new MDX (frontmatter + body) in the next message.  
5. Bot saves it to `mdx_edits` with status `pending`.  
6. You review in Supabase, then copy `mdx_content` into the right file (e.g. `content/founders/<username>.mdx`) and deploy.
