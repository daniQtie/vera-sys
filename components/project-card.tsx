"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ShieldCheck, ArrowRight } from "lucide-react";
import { LivePreview } from "./live-preview";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  embeddable,
  index,
}: {
  project: Project;
  embeddable: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  const flip = index % 2 === 1;
  const num = String(project.sort_order).padStart(2, "0");

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
    >
      {/* Preview */}
      <div className={flip ? "lg:order-2" : "lg:order-1"}>
        <motion.div
          whileHover={reduce ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="rounded-[1.15rem] border border-line bg-surface2/50 p-1.5 shadow-[0_20px_50px_-24px_var(--shadow)]"
        >
          <LivePreview
            previewUrl={project.preview_url}
            embeddable={embeddable}
            imageUrl={project.image_url}
            title={project.title}
            slug={project.slug}
          />
        </motion.div>
      </div>

      {/* Info */}
      <div className={flip ? "lg:order-1" : "lg:order-2"}>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-2xl text-faint">{num}</span>
          {project.label && (
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-secondary">
              {project.label}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-fg sm:text-[2.1rem]">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tech_stack.map((t) => (
            <li
              key={t}
              className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[0.66rem] text-muted"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Open live site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
            >
              Request samples
              <ArrowRight className="h-4 w-4" />
            </a>
          )}

          {project.admin_url && (
            <a
              href={project.admin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-secondary hover:text-secondary"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin panel
            </a>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm text-muted transition-colors hover:text-fg"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
