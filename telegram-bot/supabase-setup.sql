  -- Run this in Supabase Dashboard → SQL Editor → New query, then Run.
  -- (If you already have the table, run only the ALTER block at the bottom to add new columns.)

  create table if not exists project_submissions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

    product_name text not null,
    project_url text not null,
    description text not null,
    logo_url text,
    category text,
    tags jsonb not null default '[]',

    github_url text,
    twitter_profile text,

    founder_name text not null,
    founder_twitter text not null,
    teammates jsonb not null default '[]',

    batch text,

    telegram_user_id bigint not null,
    telegram_username text
  );

  -- If table already exists, add new columns (run this once):
  -- alter table project_submissions add column if not exists logo_url text;
  -- alter table project_submissions add column if not exists tags jsonb not null default '[]';

  alter table project_submissions enable row level security;

  drop policy if exists "Service role can do anything" on project_submissions;
  create policy "Service role can do anything"
    on project_submissions for all
    using (true)
    with check (true);
