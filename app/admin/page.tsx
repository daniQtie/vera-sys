import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut, ShieldAlert, LayoutGrid } from "lucide-react";
import { ProjectManager } from "@/components/admin/project-manager";
import { SkillManager } from "@/components/admin/skill-manager";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { HeroImageManager } from "@/components/admin/hero-image-manager";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "./actions";
import { createClient } from "@/lib/supabase/server";
import {
  getProjects,
  getSkills,
  getExperience,
  getSettings,
} from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface/40 p-6">
          <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-accent" />
          <div>
            <h1 className="font-display text-2xl font-medium text-fg">
              Set up Supabase to enable the admin
            </h1>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
              <li>
                Add your keys into{" "}
                <code className="font-mono text-fg">.env.local</code>.
              </li>
              <li>
                Run <code className="font-mono text-fg">supabase/schema.sql</code>{" "}
                then <code className="font-mono text-fg">supabase/seed.sql</code>.
              </li>
              <li>Create an admin user under Authentication ▸ Users.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Defense in depth (middleware also gates this route).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [projects, skills, experience, settings] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getSettings(),
  ]);

  return (
    <div className="min-h-[100dvh]">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-line text-accent">
              <LayoutGrid className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-lg font-medium leading-none text-fg">
                VeraSys <span className="italic text-accent">Studio</span>
              </p>
              <p className="mt-1 text-xs text-faint">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
            Content <span className="italic text-accent">studio.</span>
          </h1>
          <p className="mt-3 max-w-prose text-muted">
            Everything here is live. Changes save straight to your database and
            appear on the site right away.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          <HeroImageManager currentUrl={settings.hero_image_url} />
          <div className="rule" />
          <ProjectManager projects={projects} />
          <div className="rule" />
          <ExperienceManager items={experience} />
          <div className="rule" />
          <SkillManager skills={skills} />
        </div>
      </main>
    </div>
  );
}
