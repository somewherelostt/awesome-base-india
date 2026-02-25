-- Run this in Supabase SQL Editor if you already have project_submissions (adds Base ecosystem fields).

alter table project_submissions add column if not exists logo_url text;
alter table project_submissions add column if not exists tags jsonb not null default '[]';
