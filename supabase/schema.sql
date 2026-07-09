-- ══════════════════════════════════════════════════════════════
--  VeraSys Portfolio — Database schema + Row Level Security
--  Run this in the Supabase SQL Editor (once).
-- ══════════════════════════════════════════════════════════════

-- ── PROJECTS ──────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  label       text,
  description text not null,
  tech_stack  text[] not null default '{}',
  image_url   text,
  live_url    text,
  admin_url   text,
  preview_url text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── SKILLS ────────────────────────────────────────────────────
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null check (category in ('languages','frontend','backend','tools')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- keep updated_at fresh on projects
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  Public: SELECT only.  Authenticated: full write.
-- ══════════════════════════════════════════════════════════════
alter table public.projects enable row level security;
alter table public.skills   enable row level security;

-- Public read
drop policy if exists "public read projects" on public.projects;
create policy "public read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "public read skills" on public.skills;
create policy "public read skills"
  on public.skills for select
  to anon, authenticated
  using (true);

-- Authenticated write (insert / update / delete)
drop policy if exists "auth write projects" on public.projects;
create policy "auth write projects"
  on public.projects for all
  to authenticated
  using (true) with check (true);

drop policy if exists "auth write skills" on public.skills;
create policy "auth write skills"
  on public.skills for all
  to authenticated
  using (true) with check (true);

-- ══════════════════════════════════════════════════════════════
--  STORAGE — bucket for project images
--  (create the bucket in Dashboard ▸ Storage named `project-images`,
--   marked PUBLIC, or run the insert below)
-- ══════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read of images
drop policy if exists "public read project images" on storage.objects;
create policy "public read project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

-- Authenticated upload / update / delete of images
drop policy if exists "auth manage project images" on storage.objects;
create policy "auth manage project images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

-- ══════════════════════════════════════════════════════════════
--  SITE SETTINGS (editable hero image, etc.) + EXPERIENCE
--  Also available standalone in migration-02-hero-experience.sql
-- ══════════════════════════════════════════════════════════════
create table if not exists public.site_settings (
  id             int primary key default 1,
  hero_image_url text,
  updated_at     timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select
  to anon, authenticated using (true);
drop policy if exists "auth write settings" on public.site_settings;
create policy "auth write settings" on public.site_settings for all
  to authenticated using (true) with check (true);

create table if not exists public.experience (
  id         uuid primary key default gen_random_uuid(),
  date       text not null,
  role       text not null,
  company    text,
  points     text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_experience_updated on public.experience;
create trigger trg_experience_updated
  before update on public.experience
  for each row execute function public.set_updated_at();

alter table public.experience enable row level security;
drop policy if exists "public read experience" on public.experience;
create policy "public read experience" on public.experience for select
  to anon, authenticated using (true);
drop policy if exists "auth write experience" on public.experience;
create policy "auth write experience" on public.experience for all
  to authenticated using (true) with check (true);
