-- Migration 03 — proof-of-work gallery used by the draggable homepage reel.
-- Safe to run more than once in the Supabase SQL editor.

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_gallery_items_updated on public.gallery_items;
create trigger trg_gallery_items_updated
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

drop policy if exists "public read gallery" on public.gallery_items;
create policy "public read gallery" on public.gallery_items for select
  to anon, authenticated using (true);

drop policy if exists "auth write gallery" on public.gallery_items;
create policy "auth write gallery" on public.gallery_items for all
  to authenticated using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

grant select on table public.gallery_items to anon, authenticated;
grant insert, update, delete on table public.gallery_items to authenticated;

insert into public.gallery_items (title, alt_text, image_url, sort_order)
select * from (values
  ('Velara', 'Velara hotel website homepage', '/project-shots/velara-desktop.png', 1),
  ('Foodfinder', 'Foodfinder product website homepage', '/project-shots/pearl-desktop.png', 2),
  ('Monster Chef', 'Monster Chef admin website', '/project-shots/monsterchef-desktop.png', 3),
  ('SplitLab', 'SplitLab experimentation website', '/project-shots/splitlab-desktop.png', 4)
) as seed(title, alt_text, image_url, sort_order)
where not exists (select 1 from public.gallery_items);
