import { Reveal } from "./reveal";
import { PROFILE } from "@/lib/seed-data";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <h2 className="max-w-[16ch] font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl">
              I treat every build like a{" "}
              <span className="italic text-accent">product</span>, not a page.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5">
            {PROFILE.aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="max-w-[52ch] text-base leading-relaxed text-muted">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Stats — hairline grid, no card boxes */}
        <Reveal delay={0.1} className="self-start">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {PROFILE.stats.map((s) => (
              <div key={s.label} className="bg-bg p-6 sm:p-8">
                <dt className="font-display text-4xl font-semibold text-accent sm:text-5xl">
                  {s.num}
                </dt>
                <dd className="mt-2 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
