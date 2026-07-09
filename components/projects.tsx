import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import { canEmbed } from "@/lib/embeddable";
import type { Project } from "@/lib/types";

export async function Projects({ projects }: { projects: Project[] }) {
  // Decide per-project (server-side) whether the live site allows framing.
  const withEmbed = await Promise.all(
    projects.map(async (p) => ({
      project: p,
      embeddable: await canEmbed(p.preview_url),
    })),
  );

  return (
    <section
      id="work"
      className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal>
        <h2 className="max-w-[18ch] font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl">
          Selected work, shown{" "}
          <span className="italic text-accent">live.</span>
        </h2>
        <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted">
          Real, running projects across hospitality, healthcare, fitness and
          commerce. Each preview loads the actual site; open any of them to
          explore the full build.
        </p>
      </Reveal>

      <div className="mt-16 flex flex-col gap-24 sm:gap-28">
        {withEmbed.map(({ project, embeddable }, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            embeddable={embeddable}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
