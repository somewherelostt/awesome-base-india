# Base India Circle – Telegram submission bot

Bot that collects project submissions via Telegram and saves them to Supabase. You verify in Supabase and then use the data on the frontend.

## Setup

1. **Create a Telegram bot**  
   Message [@BotFather](https://t.me/BotFather), create a bot, copy the token.

2. **Supabase**  
   Create a project and run the SQL in **`supabase-setup.sql`** in the SQL editor (creates the table with Base ecosystem–style fields: logo, category, tags).  
   If you already have the table, run **`supabase-migrate-ecosystem-fields.sql`** to add `logo_url` and `tags`.

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

1. User sends `/start` or `/submit`.
2. Bot asks in order (aligned with [Base ecosystem](https://www.base.org/ecosystem)):  
   - Product name  
   - Project URL  
   - Description  
   - Logo URL (optional, `/skip`)  
   - Main category: **AI**, **Wallet**, **Defi**, **Consumer**, **Onramp**, **Infra**  
   - Tags (optional, comma-separated, e.g. Developer Tool, Social, Dex; `/skip`)  
   - GitHub link (optional, `/skip`)  
   - Project Twitter (optional, `/skip`)  
   - Founder name  
   - Founder Twitter  
   - Teammates: one per line as `Name @handle`, or `/skip` for solo
3. Bot inserts one row into `project_submissions` with `status = 'pending'`.
4. You review in Supabase, set `status = 'approved'` (or reject), then use the row on the frontend.

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

## Commands

- `/start` – Start or restart the flow  
- `/submit` – Start a new submission  
- `/cancel` – Cancel current submission  
- `/skip` – Skip optional steps (GitHub, Twitter, teammates)
