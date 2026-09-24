-- Selected work is managed from public.projects rather than a hardcoded list.
-- Bootstrap the six existing slides only the first time the column is added;
-- rerunning this migration never re-features a project the owner removed.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'projects' and column_name = 'is_featured'
  ) then
    alter table public.projects
      add column is_featured boolean not null default false,
      add column featured_order integer;

    insert into public.projects (
      slug, title, label, description, tech_stack, image_url,
      live_url, preview_url, sort_order
    ) values (
      'foodfinder', 'Foodfinder', 'Full Stack · Product discovery',
      'A food discovery interface that turns open product data into a clear, friendly search experience for everyday packaged goods.',
      array['Next.js', 'Product UI', 'Open Food Facts', 'Vercel'],
      '/project-shots/pearl-desktop.png',
      'https://web-pearl-six-79.vercel.app/',
      'https://web-pearl-six-79.vercel.app/', 2
    ) on conflict (slug) do nothing;

    update public.projects
    set is_featured = true,
        featured_order = case slug
          when 'hotel-website' then 1
          when 'foodfinder' then 2
          when 'monster-chef-vr-cookery-simulator' then 3
          when 'splitlab' then 4
          when 'luxury-heaven-booking-system' then 5
          when 'shwxn-bookstore' then 6
        end
    where slug in (
      'hotel-website', 'foodfinder', 'monster-chef-vr-cookery-simulator',
      'splitlab', 'luxury-heaven-booking-system', 'shwxn-bookstore'
    );

    -- Keep the current slide headlines when switching to database content,
    -- but leave any already-customized admin titles untouched.
    update public.projects set title = 'Velara'
      where slug = 'hotel-website' and title = 'Hotel Website';
    update public.projects set title = 'Monster Chef'
      where slug = 'monster-chef-vr-cookery-simulator'
        and title = 'Monster Chef — VR Cookery Simulator';
    update public.projects set title = 'Luxury Heaven'
      where slug = 'luxury-heaven-booking-system'
        and title = 'Luxury Heaven Booking System';
    update public.projects set title = 'SHWXN Bookstore'
      where slug = 'shwxn-bookstore' and title = 'Shwxn Bookstore';
  end if;
end $$;

create index if not exists projects_featured_order_idx
  on public.projects (featured_order) where is_featured;
