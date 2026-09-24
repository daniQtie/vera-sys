import Image from "next/image";
import { PROFILE } from "@/lib/seed-data";
import { Reveal } from "./reveal";

export function About() {
  return (
    <section id="about" className="border-t border-ink/15">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-12 lg:py-36">
        <div>
          <p className="field-label">About / 02</p>
          <Reveal className="mt-8">
            <div className="relative aspect-[4/5] max-w-[360px] overflow-hidden bg-ink/5">
              <Image src="/daniel-about.png" alt={PROFILE.name + " in formal attire"} fill sizes="(max-width: 1024px) 80vw, 28vw" className="object-cover object-center" />
            </div>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <h2 className="max-w-[15ch] text-[clamp(2.8rem,6vw,7rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-balance">
              I care about the work behind the <span className="text-vermillion">interface.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 border-t border-ink/20 pt-7 md:grid-cols-2">
            <Reveal>
              <p className="text-lg leading-relaxed">
                I’m Daniel, a full-stack developer from Pangasinan. I turn manual workflows into focused software—especially booking, operations, and business-management tools.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-5 text-base leading-relaxed text-ink/62">
                {PROFILE.aboutParagraphs.slice(0, 2).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                <a href={PROFILE.cvPath} download className="editorial-link text-ink">Download résumé</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
