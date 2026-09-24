import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { FEATURED_PROJECTS, hasFeaturedProjectFields } from "@/lib/featured-projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const uniqueProjects = [...projects, ...(hasFeaturedProjectFields(projects) ? [] : FEATURED_PROJECTS)].filter(
    (project, index, all) => all.findIndex((item) => item.slug === project.slug) === index,
  );

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...uniqueProjects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
