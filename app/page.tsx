import { Suspense } from "react";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { ProjectsSkeleton } from "@/components/projects-skeleton";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getProjects, getSkills, getExperience, getGallery } from "@/lib/data";
import { FEATURED_PROJECTS, hasFeaturedProjectFields, projectUrlKey } from "@/lib/featured-projects";

export default async function HomePage() {
  const [projects, skills, experience, gallery] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getGallery(),
  ]);

  return (
    <>
      <JsonLd projects={[...projects, ...(hasFeaturedProjectFields(projects) ? [] : FEATURED_PROJECTS.filter((featured) => !projects.some((project) => projectUrlKey(project.live_url) === projectUrlKey(featured.live_url))))]} />
      <Nav />
      <main>
        <Hero gallery={gallery} />
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects projects={projects} />
        </Suspense>
        <About />
        <Experience items={experience} />
        <Skills skills={skills} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
