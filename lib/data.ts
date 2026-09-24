import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./env";
import { SEED_PROJECTS, SEED_SKILLS, EXPERIENCE } from "./seed-data";
import { FEATURED_PROJECTS, hasFeaturedProjectFields } from "./featured-projects";
import type { Experience, GalleryItem, Project, Skill, SiteSettings } from "./types";

const FALLBACK_GALLERY: GalleryItem[] = [
  { id: "proof-velara", title: "Velara", alt_text: "Velara hotel website", image_url: "/project-shots/velara-desktop.png", sort_order: 1 },
  { id: "proof-foodfinder", title: "Foodfinder", alt_text: "Foodfinder product website", image_url: "/project-shots/pearl-desktop.png", sort_order: 2 },
  { id: "proof-monsterchef", title: "Monster Chef", alt_text: "Monster Chef admin website", image_url: "/project-shots/monsterchef-desktop.png", sort_order: 3 },
  { id: "proof-splitlab", title: "SplitLab", alt_text: "SplitLab experimentation website", image_url: "/project-shots/splitlab-desktop.png", sort_order: 4 },
  { id: "proof-dental", title: "Dental Care", alt_text: "Dental clinic management website", image_url: "/project-shots/dental-desktop.png", sort_order: 5 },
];

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
    if (error || !data) return SEED_PROJECTS;
    return data as Project[];
  } catch {
    return SEED_PROJECTS;
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const all = await getProjects();
  const aliases: Record<string, string> = {
    "velara-hotel": "hotel-website",
    "monster-chef": "monster-chef-vr-cookery-simulator",
  };
  const canonicalSlug = hasFeaturedProjectFields(all) ? aliases[slug] ?? slug : slug;
  const found = all.find((p) => p.slug === canonicalSlug);
  if (found) return found;
  return hasFeaturedProjectFields(all) ? null : FEATURED_PROJECTS.find((p) => p.slug === slug) ?? null;
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

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return FALLBACK_GALLERY;
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id,title,alt_text,image_url,sort_order")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_GALLERY;
    return data as GalleryItem[];
  } catch {
    return FALLBACK_GALLERY;
  }
}
