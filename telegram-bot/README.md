# Base India Circle – Telegram submission bot

Bot that collects project submissions via Telegram and saves them to Supabase. You verify in Supabase and then use the data on the frontend.

## Setup

1. **Create a Telegram bot**  
   Message [@BotFather](https://t.me/BotFather), create a bot, copy the token.

2. **Supabase**  
   Create a project and run this SQL in the SQL editor to create the table:

```sql
create table if not exists project_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

  product_name text not null,
  project_url text not null,
  description text not null,
  github_url text,
  twitter_profile text,

  founder_name text not null,
  founder_twitter text not null,
  teammates jsonb not null default '[]',

  category text,
  batch text,

  telegram_user_id bigint not null,
  telegram_username text
);

-- Optional: RLS so only service role can write; you can read from dashboard or a small admin
alter table project_submissions enable row level security;

create policy "Service role can do anything"
  on project_submissions for all
  using (true)
  with check (true);
```

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
2. Bot asks in order:  
   - Product name  
   - Project URL  
   - Description  
   - GitHub link (optional, `/skip`)  
   - Project Twitter (optional, `/skip`)  
   - Founder name  
   - Founder Twitter  
   - Teammates: one per line as `Name @handle`, or `/skip` for solo
3. Bot inserts one row into `project_submissions` with `status = 'pending'`.
4. You review in Supabase, set `status = 'approved'` (or reject), then use the row to add the project to the frontend (e.g. copy into `lib/data.ts` or feed an API that serves the directory).

## Field mapping to frontend

| Bot / Supabase field   | Frontend (`lib/data.ts`) |
|------------------------|---------------------------|
| `product_name`         | `Project.name`            |
| `project_url`          | `Project.url`             |
| `description`          | `Project.description`    |
| `founder_name`         | `Project.founder`, `Founder.name` |
| `founder_twitter`      | `Project.founderTwitter`, `Founder.twitter` |
| `teammates` (array)    | Extra `Founder` entries (name, twitter)     |
| `github_url`           | Use for links / proof     |
| `twitter_profile`      | Project’s Twitter         |
| `category` / `batch`   | `Project.category`, `Project.batch` (optional; bot can be extended to ask these) |

## Commands

- `/start` – Start or restart the flow  
- `/submit` – Start a new submission  
- `/cancel` – Cancel current submission  
- `/skip` – Skip optional steps (GitHub, Twitter, teammates)
