-- Run this in Supabase Dashboard → SQL Editor → New query, then Run.

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

alter table project_submissions enable row level security;

drop policy if exists "Service role can do anything" on project_submissions;
create policy "Service role can do anything"
  on project_submissions for all
  using (true)
  with check (true);
