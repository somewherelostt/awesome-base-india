-- Edit ID registry + MDX edit requests for Telegram bot.
-- Run in Supabase Dashboard → SQL Editor.
-- Users send /edit <edit_id> in the bot; we lookup here. Pending MDX content is stored in mdx_edits.

-- Registry: which edit_id maps to which founder/profile or project (for MDX replace).
create table if not exists edit_id_registry (
  edit_id text primary key,
  type text not null check (type in ('founder', 'project')),
  identifier text not null,
  created_at timestamptz not null default now()
);

comment on table edit_id_registry is 'Maps edit_id (from MDX frontmatter) to founder username or project slug for /edit flow';

-- Pending MDX edits: user submits full MDX body; after manual verify, admin pastes into repo.
create table if not exists mdx_edits (
  id uuid primary key default gen_random_uuid(),
  edit_id text not null references edit_id_registry(edit_id) on delete cascade,
  mdx_content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  telegram_user_id bigint not null,
  telegram_username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mdx_edits_edit_id on mdx_edits(edit_id);
create index if not exists mdx_edits_status on mdx_edits(status);

alter table edit_id_registry enable row level security;
alter table mdx_edits enable row level security;

drop policy if exists "Service role full access edit_id_registry" on edit_id_registry;
create policy "Service role full access edit_id_registry"
  on edit_id_registry for all using (true) with check (true);

drop policy if exists "Service role full access mdx_edits" on mdx_edits;
create policy "Service role full access mdx_edits"
  on mdx_edits for all using (true) with check (true);
