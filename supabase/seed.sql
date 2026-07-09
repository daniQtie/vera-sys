-- ══════════════════════════════════════════════════════════════
--  VeraSys Portfolio — Seed data (extracted from the original site)
--  Run AFTER schema.sql. Safe to re-run (upserts on slug/name).
-- ══════════════════════════════════════════════════════════════

-- ── PROJECTS ──────────────────────────────────────────────────
insert into public.projects
  (slug, title, label, description, tech_stack, live_url, admin_url, preview_url, sort_order)
values
  ('hotel-website',
   'Hotel Website',
   'Frontend · Hospitality',
   'A modern hotel showcase website with polished UI, room galleries, amenity pages, and an inquiry system integrated with Google Forms and email.',
   array['Vercel','HTML','CSS','JavaScript','EmailJS'],
   'https://web-velara.vercel.app/', null, 'https://web-velara.vercel.app/', 1),

  ('luxury-heaven-booking-system',
   'Luxury Heaven Booking System',
   'Full Stack · Booking System',
   'Full-featured hotel web application with real-time booking flow, admin dashboard, calendar availability, room management, and backend integration.',
   array['PHP','MySQL','JavaScript','Full Stack'],
   'https://daniluxuryheaven.kesug.com/', 'https://daniluxuryheaven.kesug.com/admin', 'https://daniluxuryheaven.kesug.com/', 2),

  ('dental-clinic-management-system',
   'Dental Clinic Management System',
   'Full Stack · Healthcare System',
   'A full-featured dental clinic management system with both client-facing pages and an admin dashboard. It streamlines appointment scheduling, patient record management, and daily clinic operations using a structured MVC architecture for scalability and performance.',
   array['PHP (MVC)','MySQL','JavaScript','HTML','CSS'],
   'https://dentalcareclinic.kesug.com/', 'https://dentalcareclinic.kesug.com/admin', 'https://dentalcareclinic.kesug.com/', 3),

  ('veterinary-clinic-management-system',
   'Veterinary Clinic Management System',
   'Full Stack · Healthcare System',
   'A full-featured veterinary clinic management system designed to streamline operations such as appointment scheduling, patient records, and clinic workflows. Built with a structured MVC architecture, it provides an efficient and scalable solution for modern veterinary practices.',
   array['PHP (MVC)','MySQL','JavaScript','HTML','CSS'],
   'https://vetclinic.kesug.com/', 'https://vetclinic.kesug.com/admin', 'https://vetclinic.kesug.com/', 4),

  ('iron-forge-gym-website',
   'Iron Forge Gym Website',
   'Full Stack · Fitness Platform',
   'A modern gym website designed to showcase services, memberships, and training programs. Includes a structured system for managing user interactions and content, providing a smooth and engaging experience for potential members.',
   array['PHP (MVC)','MySQL','JavaScript','HTML','CSS'],
   'https://ironforgegym.kesug.com/', 'https://ironforgegym.kesug.com/admin', 'https://ironforgegym.kesug.com/', 5),

  ('ui-design-collection',
   'UI Design Collection',
   'UI/UX · Design Systems',
   'A collection of landing pages, dashboards, and custom UI components for hospitality, e-commerce, and SaaS — available upon request or presentation.',
   array['UI/UX','Figma','Frontend','Design'],
   null, null, null, 6)
on conflict (slug) do update set
  title = excluded.title,
  label = excluded.label,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  live_url = excluded.live_url,
  admin_url = excluded.admin_url,
  preview_url = excluded.preview_url,
  sort_order = excluded.sort_order;

-- ── SKILLS ────────────────────────────────────────────────────
-- de-dupe guard so re-running doesn't create duplicates
create unique index if not exists skills_name_unique on public.skills (name);

insert into public.skills (name, category, sort_order) values
  ('JavaScript','languages',1),
  ('PHP','languages',2),
  ('Python','languages',3),
  ('SQL','languages',4),
  ('HTML5','languages',5),
  ('CSS3','languages',6),
  ('React.js','frontend',1),
  ('Next.js','frontend',2),
  ('Tailwind CSS','frontend',3),
  ('Responsive Design','frontend',4),
  ('CSS Animations','frontend',5),
  ('UI/UX Design','frontend',6),
  ('Node.js','backend',1),
  ('Laravel','backend',2),
  ('MySQL','backend',3),
  ('REST APIs','backend',4),
  ('PHP MVC','backend',5),
  ('Git & GitHub','tools',1),
  ('VS Code','tools',2),
  ('XAMPP','tools',3),
  ('Figma','tools',4),
  ('Vercel','tools',5)
on conflict (name) do update set
  category = excluded.category,
  sort_order = excluded.sort_order;
