"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CycleRouteAnimation } from "./cycle-route-animation";
import { Reveal } from "./reveal";
import type { Experience as ExperienceType } from "@/lib/types";

export function Experience({ items }: { items: ExperienceType[] }) {
  const introRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: introRef, offset: ["start start", "end end"] });
  const titleScale = useTransform(scrollYProgress, [0, 0.38, 0.55], [2.4, 1.15, 0.85]);
  const titleY = useTransform(scrollYProgress, [0, 0.45], [185, 0]);
  const bicycleScale = useTransform(scrollYProgress, [0.36, 0.54, 0.86], [2.4, 2.1, 1]);
  const bicycleOpacity = useTransform(scrollYProgress, [0.34, 0.48], [0, 1]);

  return (
    <section id="experience" className="border-t border-ink/15 bg-[#f5f3ed]">
      <div ref={introRef} className={reduceMotion ? "relative min-h-[80dvh]" : "relative h-[270dvh]"}>
        <div className={reduceMotion ? "relative flex min-h-[80dvh] flex-col items-center justify-center gap-8 overflow-hidden px-5 py-24" : "sticky top-0 h-[100dvh] overflow-hidden"}>
          {reduceMotion ? (
            <>
              <h2 className="experience-intro-title">The road <span className="italic text-accent">so far.</span></h2>
              <div className="w-full max-w-[340px]"><CycleRouteAnimation /></div>
            </>
          ) : (
            <>
              <motion.h2 style={{ scale: titleScale, y: titleY }} className="experience-intro-title absolute inset-x-5 top-[17%] z-10 text-center">
                The road <span className="italic text-accent">so far.</span>
              </motion.h2>
              <motion.div style={{ scale: bicycleScale, opacity: bicycleOpacity }} className="absolute inset-x-0 top-[44%] mx-auto w-[min(70vw,380px)]">
                <CycleRouteAnimation />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
        <p className="field-label mb-8 text-center">Experience / {String(items.length).padStart(2, "0")}</p>
        <ol className="mx-auto max-w-[780px] border-b border-ink/15">
          {items.map((job, index) => (
            <Reveal as="li" key={job.id} delay={0.04 * index}>
              <div className="grid grid-cols-1 gap-3 border-t border-ink/20 py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 sm:py-10">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink/55">{job.date}</p>
                <div>
                  <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">{job.role}</h3>
                  <p className="mt-1 text-sm text-ink/55">{job.company}</p>
                  <ul className="mt-5 space-y-2">
                    {job.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="relative pl-5 text-[0.92rem] leading-relaxed text-ink/65 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent/60">{point}</li>
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
