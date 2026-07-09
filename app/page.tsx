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
import { getProjects, getSkills, getExperience, getSettings } from "@/lib/data";

export default async function HomePage() {
  const [projects, skills, experience, settings] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd projects={projects} />
      <Nav />
      <main>
        <Hero imageUrl={settings.hero_image_url} />
        <About />
        <Skills skills={skills} />
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects projects={projects} />
        </Suspense>
        <Experience items={experience} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
