-- Directory listing + field-level edits for Telegram bot.
-- Run in Supabase Dashboard → SQL Editor after supabase-setup.sql and supabase-edit-id-and-mdx.sql.
-- Seed directory_projects from projects-from-devfolio (or sync script); seed directory_founders from content/founders/*.mdx.

-- Current directory state: one row per project. Admin copies from here to MDX.
create table if not exists directory_projects (
  slug text primary key,
  name text not null,
  description text,
  description_full text,
  category text,
  founder_name text,
  founder_twitter text,
  founder_twitter_handle text,
  founder_github text,
  url text,
  batch text,
  tags text,
  logo_url text,
  github_url text,
  farcaster_url text,
  youtube_url text,
  other_links text,
  prizes text,
  telegram_user_id_edit bigint,
  updated_at timestamptz not null default now()
);

-- Current directory state: one row per founder. Admin copies from here to MDX.
create table if not exists directory_founders (
  username text primary key,
  name text not null,
  city text,
  country text,
  short_bio text,
  profile_image text,
  github text,
  twitter text,
  hackathons_attended text,
  projects_built text,
  prizes_won text,
  prize_winnings_amount text,
  onchain_creds_claimed text,
  tags text,
  telegram_user_id_edit bigint,
  updated_at timestamptz not null default now()
);

-- New founder submissions (like project_submissions). Simple columns for easy copy to MDX.
create table if not exists founder_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

  username text not null,
  name text not null,
  city text,
  country text,
  short_bio text,
  profile_image text,
  github text,
  twitter text,
  hackathons_attended text,
  projects_built text,
  prizes_won text,
  prize_winnings_amount text,
  onchain_creds_claimed text,
  tags text,

  telegram_user_id bigint not null,
  telegram_username text
);

alter table directory_projects enable row level security;
alter table directory_founders enable row level security;
alter table founder_submissions enable row level security;

create policy "Service role full access directory_projects" on directory_projects for all using (true) with check (true);
create policy "Service role full access directory_founders" on directory_founders for all using (true) with check (true);
create policy "Service role full access founder_submissions" on founder_submissions for all using (true) with check (true);
