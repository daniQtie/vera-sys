"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SKILL_CATEGORIES, type Skill, type SkillCategory } from "@/lib/types";

type Filter = "all" | SkillCategory;

export function Skills({ skills }: { skills: Skill[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    ...SKILL_CATEGORIES,
  ];

  const shown =
    filter === "all" ? skills : skills.filter((s) => s.category === filter);

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-y border-line bg-bg2/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl">
            The tools I{" "}
            <span className="italic text-accent">build with.</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] transition-colors ${
                  filter === f.key
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line text-muted hover:border-accent hover:text-fg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-10 flex flex-wrap gap-2.5">
          <AnimatePresence mode="popLayout">
            {shown.map((s) => (
              <motion.li
                key={s.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-fg"
              >
                {s.name}
                <span className="ml-2 font-mono text-[0.6rem] uppercase tracking-wide text-faint">
                  {s.category.slice(0, 2)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
