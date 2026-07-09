# VeraSys — Daniel De Vera Portfolio

A full-stack developer portfolio built with **Next.js 15 (App Router)**, **Supabase**,
**Tailwind v4**, and **Motion**. Editorial "boutique hospitality" design with two
named themes, live project previews, an admin panel, and SEO baked in.

> The original single-file `index.html` is preserved untouched in [`/legacy`](./legacy).

---

## ✨ Features

- **Two named themes** — _Midnight Concierge_ (default) and _Atlas Linen_ — with a
  toggle, persisted in `localStorage`, independent of OS preference.
- **Live project previews** — each project embeds the real site in an `<iframe>`;
  sites that block framing (X-Frame-Options / CSP) are detected server-side and fall
  back to a screenshot/cover automatically. Skeleton loading state included.
- **Motion** — scroll-reveal animations + hover micro-interactions, all
  `prefers-reduced-motion` aware.
- **Loading states** — animated monogram page-loader + skeletons.
- **SEO** — Metadata API, Open Graph + Twitter cards, JSON-LD (`Person` +
  `CreativeWork`), dynamic `sitemap.xml` / `robots.txt`, per-project pages with
  descriptive slugs, `next/image` optimization.
- **Admin panel** — protected `/admin` with Supabase Auth; add/edit/delete projects
  and skills; image uploads to Supabase Storage. Server Actions + Zod validation + RLS.

The site renders fully from bundled seed data **even before Supabase is configured**,
so you can preview immediately.

---

## 🚀 Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values (see below)
npm run dev                         # http://localhost:3000
```

---

## 🔑 Environment variables (`.env.local`)

| Variable | Where to find it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase ▸ Project Settings ▸ API | ✅ yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page, "anon public" key | ✅ yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | same page, "service_role" key | ❌ **server only — never commit** |
| `NEXT_PUBLIC_SITE_URL` | your deployed URL (e.g. `https://yourdomain.com`) | ✅ yes |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS dashboard | ✅ yes (public) |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS dashboard | ✅ yes |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS dashboard | ✅ yes |

---

## 🗄️ Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - [`supabase/schema.sql`](./supabase/schema.sql) — tables, RLS policies, storage bucket.
   - [`supabase/seed.sql`](./supabase/seed.sql) — your real projects + skills.
3. **Storage** ▸ confirm a public bucket named `project-images` exists (the schema
   creates it).
4. **Authentication ▸ Users ▸ Add user** — create your admin email + password.
5. Paste your keys into `.env.local` and restart `npm run dev`.
6. Sign in at [`/admin/login`](http://localhost:3000/admin/login).

### Security model (RLS)

- **Public:** `SELECT` only on `projects` and `skills`.
- **Authenticated (you):** full `INSERT / UPDATE / DELETE`.
- All queries go through the Supabase client (parameterized — no SQL string
  concatenation). Inputs are validated with **Zod**. Login is rate-limited
  (5 attempts / 15 min per IP). Uploads are restricted to images ≤ 5 MB. The
  service-role key is only ever used in server code (`import "server-only"`).

---

## 📁 Structure

```
app/                 App Router pages, layout, SEO routes, admin
  admin/             Protected dashboard, login, server actions
  projects/[slug]/   Per-project pages (dynamic metadata + JSON-LD)
components/          UI + section components (+ admin/ managers)
lib/                 Supabase clients, data layer, validations, rate-limit, seed
supabase/            schema.sql + seed.sql
legacy/              Original static site (kept for reference)
```

## 🛠️ Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the build
```

## ☁️ Deploy

Deploy on **Vercel**. Add all env vars in the project settings (mark
`SUPABASE_SERVICE_ROLE_KEY` as a server-side secret) and set
`NEXT_PUBLIC_SITE_URL` to the production domain.

© Daniel De Vera. Built with care.
