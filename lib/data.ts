import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./env";
import { SEED_PROJECTS, SEED_SKILLS, EXPERIENCE } from "./seed-data";
import type { Experience, Project, Skill, SiteSettings } from "./types";

/**
 * Public read layer. When Supabase is configured we read live data (public
 * SELECT is allowed by RLS); otherwise we fall back to the bundled seed so the
 * portfolio always renders. All queries go through the Supabase client, which
 * uses parameterized requests — no string-concatenated SQL.
 */

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return SEED_PROJECTS;
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_PROJECTS;
    return data as Project[];
  } catch {
    return SEED_PROJECTS;
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured) return SEED_SKILLS;
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return SEED_SKILLS;
    return data as Skill[];
  } catch {
    return SEED_SKILLS;
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!isSupabaseConfigured) return EXPERIENCE;
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return EXPERIENCE;
    return data as Experience[];
  } catch {
    return EXPERIENCE;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = { hero_image_url: null };
  if (!isSupabaseConfigured) return fallback;
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_image_url")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return fallback;
    return data as SiteSettings;
  } catch {
    return fallback;
  }
}
