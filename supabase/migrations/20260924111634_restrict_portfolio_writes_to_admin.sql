-- Only the Auth user with admin-controlled app_metadata.portfolio_role can
-- write portfolio content. user_metadata is intentionally not trusted.
-- Run after setting portfolio_role=admin on the owner's Auth user.

drop policy if exists "auth write projects" on public.projects;
drop policy if exists "auth write skills" on public.skills;
drop policy if exists "auth write settings" on public.site_settings;
drop policy if exists "auth write experience" on public.experience;
drop policy if exists "auth write gallery" on public.gallery_items;
drop policy if exists "auth manage project images" on storage.objects;
drop policy if exists "admin write projects" on public.projects;
drop policy if exists "admin write skills" on public.skills;
drop policy if exists "admin write settings" on public.site_settings;
drop policy if exists "admin write experience" on public.experience;
drop policy if exists "admin write gallery" on public.gallery_items;
drop policy if exists "admin manage project images" on storage.objects;

create policy "admin write projects" on public.projects
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

create policy "admin write skills" on public.skills
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

create policy "admin write settings" on public.site_settings
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

create policy "admin write experience" on public.experience
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

create policy "admin write gallery" on public.gallery_items
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

create policy "admin manage project images" on storage.objects
  for all to authenticated
  using (bucket_id = 'project-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin')
  with check (bucket_id = 'project-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'portfolio_role') = 'admin');

grant select on public.projects, public.skills, public.site_settings,
  public.experience, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.projects, public.skills,
  public.site_settings, public.experience, public.gallery_items to authenticated;
