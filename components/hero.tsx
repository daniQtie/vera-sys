"use client";

import { motion, useReducedMotion } from "motion/react";
import type { GalleryItem } from "@/lib/types";
import { ProofGallery } from "./proof-gallery";
import { PROFILE } from "@/lib/seed-data";

export function Hero({ gallery }: { gallery: GalleryItem[] }) {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col justify-between overflow-hidden px-5 pb-7 pt-28 sm:px-8 lg:px-12">
      <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="relative z-10">
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="field-label">Full-stack developer · Pangasinan, Philippines</motion.p>
          <motion.h1 className="mt-6 max-w-[11ch] text-[clamp(3.25rem,5.7vw,6.8rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-balance">
            I build software for <span className="text-vermillion">real work.</span>
          </motion.h1>
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} className="mt-8">
            <p className="max-w-[43ch] text-base leading-relaxed text-ink/65 sm:text-lg">Booking platforms, management systems, and focused business websites—from database to interface.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={PROFILE.cvPath} download className="hero-action"><span>Download CV</span></a>
              <a href="https://github.com/daniQtie" target="_blank" rel="noopener noreferrer" className="hero-action hero-action-filled"><span>GitHub</span></a>
            </div>
          </motion.div>
        </div>
        <motion.div initial={reduce ? false : { opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}>
          <ProofGallery items={gallery} />
        </motion.div>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-ink/20 pt-4">
        <span className="field-label">Build · solve · improve</span><span className="field-label">Scroll / 01</span>
      </div>
    </section>
  );
}
