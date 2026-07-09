-- ══════════════════════════════════════════════════════════════
--  Migration 02 — Editable hero image + Experience ("The road")
--  Run this ONCE in the Supabase SQL Editor (safe to re-run).
-- ══════════════════════════════════════════════════════════════

-- ── SITE SETTINGS (single row: hero image, etc.) ──────────────
create table if not exists public.site_settings (
  id             int primary key default 1,
  hero_image_url text,
  updated_at     timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings"
  on public.site_settings for select
  to anon, authenticated using (true);

drop policy if exists "auth write settings" on public.site_settings;
create policy "auth write settings"
  on public.site_settings for all
  to authenticated using (true) with check (true);

-- ── EXPERIENCE ("The road so far") ────────────────────────────
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
create policy "public read experience"
  on public.experience for select
  to anon, authenticated using (true);

drop policy if exists "auth write experience" on public.experience;
create policy "auth write experience"
  on public.experience for all
  to authenticated using (true) with check (true);

-- Seed the existing timeline, only if the table is empty.
insert into public.experience (date, role, company, points, sort_order)
select * from (values
  ('2026 — Present',
   'Freelance Full Stack Developer',
   'Self-Employed · Remote · Philippines',
   array[
     'Designed and developed 20+ custom websites for hotels, resorts, and hospitality businesses worldwide',
     'Built full booking systems with admin dashboards, room calendar availability, and payment flows using PHP and MySQL',
     'Delivered responsive, SEO-optimized frontends using HTML, CSS, JavaScript, and React',
     'Collaborated directly with clients from requirements gathering through post-launch support'
   ], 1),
  ('2025 (6 months)',
   'Web Development Intern',
   'Local IT Solutions Company · Pangasinan, Philippines',
   array[
     'Assisted senior developers building and maintaining client websites',
     'Contributed to front-end development with HTML, CSS, and JavaScript',
     'Participated in code reviews and learned industry best practices firsthand'
   ], 2),
  ('2024',
   'Freelance Web Developer',
   'Private Client · United States',
   array[
     'Developed a custom website for an adult home care business focused on elderly services',
     'Designed and implemented a clean, user-friendly interface tailored for accessibility and trust',
     'Worked directly with the client to gather requirements and deliver a fully functional web solution'
   ], 3),
  ('2023 — 2026',
   'BSIT Student',
   'University of the Philippines · Pangasinan, Philippines',
   array[
     'Bachelor of Science in Information Technology — specialization in Web Development',
     'Relevant coursework: Web Systems, Database Management, Software Engineering, UI/UX Design'
   ], 4)
) as v(date, role, company, points, sort_order)
where not exists (select 1 from public.experience);
