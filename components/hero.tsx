"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { PROFILE } from "@/lib/seed-data";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  const reduce = useReducedMotion();
  const photo = imageUrl || PROFILE.photo;
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      className="relative mx-auto grid min-h-[100dvh] max-w-[1240px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-24"
    >
      {/* soft ambient glow for depth (theme-aware, very subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-[560px] w-[560px] rounded-full opacity-[0.14] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent), transparent 68%)",
        }}
      />
      {/* Left — copy */}
      <div className="order-2 lg:order-1">
        <motion.span
          {...rise(0.1)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
          </span>
          {PROFILE.availability}
        </motion.span>

        <motion.h1
          {...rise(0.2)}
          className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.04] tracking-tight text-fg xs:text-5xl sm:text-6xl lg:text-[4.4rem]"
        >
          If it lives in a browser,{" "}
          <span className="italic text-accent">I can build it.</span>
        </motion.h1>

        <motion.p
          {...rise(0.32)}
          className="mt-6 max-w-[30rem] text-base leading-relaxed text-muted sm:text-lg"
        >
          {PROFILE.heroSub}
        </motion.p>

        <motion.div
          {...rise(0.44)}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            View selected work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={PROFILE.cvPath}
            download
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>
        </motion.div>
      </div>

      {/* Right — portrait */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
        className="order-1 lg:order-2"
      >
        <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
          <div className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-line" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-line-strong bg-surface">
            <Image
              src={photo}
              alt={`${PROFILE.name}, ${PROFILE.role} based in ${PROFILE.location}`}
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 40vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-4">
              <span className="font-display text-lg text-white">
                {PROFILE.name}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/80">
                {PROFILE.location}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
