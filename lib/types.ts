export type SkillCategory = "languages" | "frontend" | "backend" | "tools";

export interface Project {
  id: string;
  slug: string;
  title: string;
  label: string | null;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  admin_url: string | null;
  preview_url: string | null;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  sort_order: number;
}

export interface Experience {
  id: string;
  date: string;
  role: string;
  company: string | null;
  points: string[];
  sort_order: number;
}

export interface SiteSettings {
  hero_image_url: string | null;
}

export const SKILL_CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools" },
];
