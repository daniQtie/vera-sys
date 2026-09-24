import type { Project } from "./types";

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "featured-velara", slug: "velara-hotel", title: "Velara",
    label: "Frontend · Hospitality concept",
    description: "A luxury hotel experience built around quiet visual storytelling, considered typography, room discovery, and a focused reservation journey.",
    tech_stack: ["Frontend", "Responsive UI", "EmailJS", "Vercel"], image_url: null,
    live_url: "https://web-velara.vercel.app/", admin_url: null,
    preview_url: "https://web-velara.vercel.app/", sort_order: 1,
  },
  {
    id: "featured-foodfinder", slug: "foodfinder", title: "Foodfinder",
    label: "Full Stack · Product discovery",
    description: "A food discovery interface that turns open product data into a clear, friendly search experience for everyday packaged goods.",
    tech_stack: ["Next.js", "Product UI", "Open Food Facts", "Vercel"], image_url: null,
    live_url: "https://web-pearl-six-79.vercel.app/", admin_url: null,
    preview_url: "https://web-pearl-six-79.vercel.app/", sort_order: 2,
  },
  {
    id: "featured-monsterchef", slug: "monster-chef", title: "Monster Chef",
    label: "Full Stack · VR education",
    description: "A cookery learning platform where students enter a guided VR kitchen while teachers manage access, review progress, and monitor sessions.",
    tech_stack: ["Web application", "Authentication", "VR workflow", "Vercel"], image_url: null,
    live_url: "https://monsterchef-admin.vercel.app/login", admin_url: null,
    preview_url: "https://monsterchef-admin.vercel.app/login", sort_order: 3,
  },
  {
    id: "featured-splitlab", slug: "splitlab", title: "SplitLab",
    label: "Full Stack · Experimentation platform",
    description: "An A/B testing and conversion platform for running experiments, tracking real outcomes, and identifying the version that performs best.",
    tech_stack: ["Next.js", "Experimentation", "Analytics", "AI assistant"], image_url: null,
    live_url: "https://splitlab-nu.vercel.app/", admin_url: null,
    preview_url: "https://splitlab-nu.vercel.app/", sort_order: 4,
  },
  {
    id: "featured-luxury-heaven", slug: "luxury-heaven-booking-system", title: "Luxury Heaven",
    label: "Full Stack · Hotel booking",
    description: "A hotel booking platform with room discovery, availability, reservations, and an admin workspace for day-to-day operations.",
    tech_stack: ["PHP", "MySQL", "JavaScript", "Booking system"], image_url: null,
    live_url: "https://daniluxuryheaven.kesug.com/", admin_url: "https://daniluxuryheaven.kesug.com/admin",
    preview_url: "https://daniluxuryheaven.kesug.com/", sort_order: 5,
  },
  {
    id: "featured-shwxn-bookstore", slug: "shwxn-bookstore", title: "SHWXN Bookstore",
    label: "Frontend · Online bookstore",
    description: "An online bookstore built around a curated catalog, book discovery, reader reviews, and a clear path to pre-order.",
    tech_stack: ["Web design", "Responsive UI", "E-commerce", "Vercel"], image_url: null,
    live_url: "https://shwxnbookstore.vercel.app/", admin_url: null,
    preview_url: "https://shwxnbookstore.vercel.app/", sort_order: 6,
  },
];

export function projectUrlKey(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname.replace(/\/(login|admin)\/?$/, "").replace(/\/$/, "")}`;
  } catch {
    return url.replace(/\/$/, "");
  }
}

/** Static slides are only a fallback until the featured migration is installed. */
export function hasFeaturedProjectFields(projects: Project[]): boolean {
  return projects.every((project) => typeof project.is_featured === "boolean");
}

export function selectFeaturedProjects(projects: Project[]): Project[] {
  if (!hasFeaturedProjectFields(projects)) return FEATURED_PROJECTS;
  return projects
    .filter((project) => project.is_featured)
    .sort((a, b) =>
      (a.featured_order ?? Number.MAX_SAFE_INTEGER) - (b.featured_order ?? Number.MAX_SAFE_INTEGER) ||
      a.sort_order - b.sort_order || a.title.localeCompare(b.title),
    );
}

export function selectArchiveProjects(projects: Project[]): Project[] {
  if (hasFeaturedProjectFields(projects)) return projects.filter((project) => !project.is_featured);
  const featuredUrls = new Set(FEATURED_PROJECTS.map((project) => projectUrlKey(project.live_url)));
  return projects.filter((project) => !featuredUrls.has(projectUrlKey(project.live_url)));
}
