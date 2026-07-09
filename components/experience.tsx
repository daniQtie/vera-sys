import { Reveal } from "./reveal";
import type { Experience as ExperienceType } from "@/lib/types";

export function Experience({ items }: { items: ExperienceType[] }) {
  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-line bg-bg2/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl">
            The road{" "}
            <span className="italic text-accent">so far.</span>
          </h2>
        </Reveal>

        <ol className="mt-14 max-w-3xl">
          {items.map((job, i) => (
            <Reveal as="li" key={job.id} delay={0.04 * i}>
              <div className="group relative grid grid-cols-1 gap-3 border-t border-line py-8 sm:grid-cols-[140px_1fr] sm:gap-8">
                <div className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-secondary">
                  {job.date}
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-fg sm:text-2xl">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{job.company}</p>
                  <ul className="mt-4 space-y-2">
                    {job.points.map((pt, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-[0.92rem] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent/60"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
