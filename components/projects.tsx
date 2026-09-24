"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { FEATURED_PROJECTS, projectUrlKey, selectArchiveProjects, selectFeaturedProjects } from "@/lib/featured-projects";

type CaptureAsset = { src: string; deviceExport?: boolean };
type CaptureSet = {
  desktop: CaptureAsset | CaptureAsset[];
  mobile: CaptureAsset;
  secondary?: CaptureAsset;
};

const raw = (src: string): CaptureAsset => ({ src });
const device = (src: string): CaptureAsset => ({ src, deviceExport: true });

const CAPTURES: Record<string, CaptureSet> = {
  "velara-hotel": {
    desktop: device("/project-shots/velara-device-desktop.webp"),
    secondary: device("/project-shots/velara-device-tablet.webp"),
    mobile: device("/project-shots/velara-device-mobile.webp"),
  },
  // Only a new mobile capture was supplied, so the original desktop remains.
  "foodfinder": {
    desktop: raw("/project-shots/pearl-desktop.png"),
    mobile: device("/project-shots/pearl-device-mobile.webp"),
  },
  // Only a new desktop capture was supplied, so the original mobile remains.
  "monster-chef": {
    desktop: device("/project-shots/monsterchef-device-desktop.webp"),
    secondary: raw("/project-shots/monsterchef-desktop.png"),
    mobile: raw("/project-shots/monsterchef-mobile.png"),
  },
  "splitlab": {
    desktop: device("/project-shots/splitlab-device-desktop.webp"),
    secondary: raw("/project-shots/splitlab-desktop.png"),
    mobile: device("/project-shots/splitlab-device-mobile.webp"),
  },
  "luxury-heaven-booking-system": {
    desktop: [
      device("/project-shots/luxury-device-calendar.webp"),
      device("/project-shots/luxury-device-about.webp"),
      device("/project-shots/luxury-device-admin.webp"),
    ],
    secondary: device("/project-shots/luxury-device-fold.webp"),
    mobile: device("/project-shots/luxury-device-mobile.webp"),
  },
  "shwxn-bookstore": {
    desktop: device("/project-shots/shwxn-device-desktop.webp"),
    secondary: device("/project-shots/shwxn-device-fold.webp"),
    mobile: device("/project-shots/shwxn-device-mobile.webp"),
  },
};

const EASE = [0.76, 0, 0.24, 1] as const;
const SLIDE_BACKGROUNDS = ["#f4f1e8", "#eef0e8", "#f1eee6", "#e9edeb", "#f2ede5", "#eeeae4"];
export function Projects({ projects }: { projects: Project[] }) {
  return <HorizontalWorks projects={projects} />;
}

function HorizontalWorks({ projects }: { projects: Project[] }) {
  const featured = selectFeaturedProjects(projects);
  const archive = selectArchiveProjects(projects);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [locked, setLocked] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);
  const reduce = useReducedMotion();

  const move = useCallback((next: number) => {
    if (next < 0 || next >= featured.length || next === active) return false;
    setDirection(next > active ? 1 : -1);
    setActive(next);
    setLocked(true);
    window.setTimeout(() => setLocked(false), reduce ? 120 : 760);
    return true;
  }, [active, featured.length, reduce]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    let accumulated = 0;
    let resetTimer: number | undefined;
    const onWheel = (event: WheelEvent) => {
      const rect = node.getBoundingClientRect();
      const centered = rect.top <= 72 && rect.bottom >= window.innerHeight - 72;
      if (!centered) return;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const goingForward = delta > 0;
      const canMove = goingForward ? active < featured.length - 1 : active > 0;
      if (!canMove) return;
      event.preventDefault();
      if (locked) return;
      accumulated += delta;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => (accumulated = 0), 160);
      if (Math.abs(accumulated) < 34) return;
      move(active + (goingForward ? 1 : -1));
      accumulated = 0;
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      window.clearTimeout(resetTimer);
    };
  }, [active, featured.length, locked, move, reduce]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      touchDelta.current = 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const start = touchStart.current;
      const touch = event.touches[0];
      if (!start || !touch) return;
      const vertical = start.y - touch.clientY;
      const horizontal = start.x - touch.clientX;
      const delta = Math.abs(vertical) >= Math.abs(horizontal) ? vertical : horizontal;
      const goingForward = delta > 0;
      const canMove = goingForward ? active < featured.length - 1 : active > 0;
      if (!canMove) return;
      event.preventDefault();
      touchDelta.current = delta;
    };
    const onTouchEnd = () => {
      const delta = touchDelta.current;
      touchStart.current = null;
      touchDelta.current = 0;
      if (locked || Math.abs(delta) < 42) return;
      move(active + (delta > 0 ? 1 : -1));
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, featured.length, locked, move, reduce]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!stageRef.current?.matches(":focus-within")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        move(active + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        move(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, move]);

  const current = featured[active];
  if (!current) return (
    <section id="work" className="border-t border-ink/15">
      {archive.length ? <ProjectArchive projects={archive} startIndex={1} allProjects /> : (
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12">
          <p className="field-label">Selected work</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">New work is on its way.</h2>
        </div>
      )}
    </section>
  );

  return (
    <section id="work" className="border-t border-ink/15">
      <motion.div
        ref={stageRef}
        tabIndex={0}
        aria-label="Featured projects. Scroll or swipe to browse one project at a time."
        animate={{ backgroundColor: SLIDE_BACKGROUNDS[active % SLIDE_BACKGROUNDS.length] }}
        transition={{ duration: 0.65, ease: EASE }}
        className="relative min-h-[100dvh] touch-pan-y overflow-hidden outline-none"
      >
        <div className="mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col px-5 pb-7 pt-24 sm:px-8 lg:px-12 lg:pt-28">
          <header className="flex items-end justify-between border-b border-ink/20 pb-4">
            <div>
              <p className="field-label">Selected work</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Systems built for real work.</h2>
            </div>
          </header>

          <div className="relative flex flex-1 items-center py-6 lg:py-8">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.article
                key={current.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 110, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -110, opacity: 0 }),
                }}
                initial={reduce ? false : "enter"}
                animate="center"
                exit={reduce ? undefined : "exit"}
                transition={{ duration: reduce ? 0 : 0.72, ease: EASE }}
                className="grid w-full grid-cols-1 items-center gap-7 lg:grid-cols-[0.34fr_0.66fr] lg:gap-10"
              >
                <ProjectCopy project={current} index={active} total={featured.length} />
                <DeviceStage project={current} direction={direction} />
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center gap-5 border-t border-ink/20 pt-4">
            <div className="flex gap-1" aria-hidden>
              {featured.map((project, index) => (
                <span key={project.id} className={"h-[3px] flex-1 transition-colors duration-500 " + (index <= active ? "bg-vermillion" : "bg-ink/15")} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(active - 1)} disabled={active === 0 || locked} className="project-control" aria-label="Previous project">←</button>
              <button type="button" onClick={() => move(active + 1)} disabled={active === featured.length - 1 || locked} className="project-control" aria-label="Next project">→</button>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45 sm:hidden">Swipe up or down to move sideways</p>
        </div>
      </motion.div>
      <ProjectArchive projects={archive} startIndex={featured.length + 1} />
    </section>
  );
}

function ProjectCopy({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <div className="relative z-10 max-w-xl">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-ink/55">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span aria-hidden>—</span>
        <span>{project.label?.split("·")[1]?.trim() || "Digital product"}</span>
      </div>
      <h3 className="mt-5 text-[clamp(2.8rem,5vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-balance">{project.title}</h3>
      <p className="mt-6 max-w-[39ch] text-base leading-relaxed text-ink/66">{project.description}</p>
      <div className="mt-6 grid max-w-md grid-cols-[90px_1fr] gap-y-2 border-y border-ink/15 py-4 text-sm">
        <span className="field-label">Role</span><span>Design & full-stack development</span>
        <span className="field-label">Stack</span><span>{project.tech_stack.slice(0, 4).join(", ")}</span>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
        {project.live_url ? (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="editorial-link">Open project</a>
        ) : (
          <Link href={`/projects/${project.slug}`} className="editorial-link">View project</Link>
        )}
      </div>
    </div>
  );
}

function DeviceStage({ project, direction }: { project: Project; direction: number }) {
  const key = projectUrlKey(project.live_url);
  const existing = key ? FEATURED_PROJECTS.find((item) => projectUrlKey(item.live_url) === key) : null;
  const shots = CAPTURES[project.slug] ?? (existing ? CAPTURES[existing.slug] : undefined);
  const reduce = useReducedMotion();
  const desktopShots = shots ? (Array.isArray(shots.desktop) ? shots.desktop : [shots.desktop]) : [];
  const [desktopIndex, setDesktopIndex] = useState(0);

  useEffect(() => {
    setDesktopIndex(0);
    if (reduce || desktopShots.length < 2) return;
    const interval = window.setInterval(() => {
      setDesktopIndex((current) => (current + 1) % desktopShots.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [project.slug, reduce, desktopShots.length]);

  if (!shots) {
    return (
      <div className="device-scene" aria-label={`Preview of ${project.title}`}>
        <div className="desktop-device">
          <div className="device-camera" />
          {project.image_url ? (
            <Image unoptimized src={project.image_url} alt={`${project.title} project screenshot`} fill sizes="(max-width: 1024px) 90vw, 55vw" className="object-cover object-top" />
          ) : (
            <div className="flex h-full items-center justify-center bg-white p-8 text-center text-2xl font-semibold tracking-tight text-ink/65">{project.title}</div>
          )}
        </div>
      </div>
    );
  }
  const currentDesktop = desktopShots[desktopIndex] ?? desktopShots[0];
  if (!currentDesktop) return null;

  return (
    <div className="device-scene" aria-label={"Responsive views of " + project.title}>
      {currentDesktop.deviceExport ? (
        <motion.div
          initial={{ clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 0.86, ease: EASE }}
          className="framed-device framed-desktop"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentDesktop.src}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
              className="absolute inset-0"
            >
              <Image src={currentDesktop.src} alt={project.title + " desktop view"} fill sizes="(max-width: 1024px) 88vw, 54vw" className="object-contain" priority={project.sort_order <= 2} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div initial={{ clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: 0.86, ease: EASE }} className="desktop-device">
          <div className="device-camera" />
          <Image src={currentDesktop.src} alt={project.title + " desktop homepage"} fill sizes="(max-width: 1024px) 90vw, 55vw" className="object-cover object-top" priority={project.sort_order <= 2} />
        </motion.div>
      )}

      {shots.secondary?.deviceExport ? (
        <motion.div initial={{ x: direction * 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.78, delay: 0.12, ease: EASE }} className="framed-device framed-secondary">
          <Image src={shots.secondary.src} alt={project.title + " secondary responsive view"} fill sizes="24vw" className="object-contain" />
        </motion.div>
      ) : shots.secondary || !currentDesktop.deviceExport ? (
        <motion.div initial={{ x: direction * 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.78, delay: 0.12, ease: EASE }} className="laptop-device">
          <Image src={(shots.secondary ?? currentDesktop).src} alt={shots.secondary ? project.title + " secondary desktop view" : ""} fill sizes="32vw" className="object-cover object-top" />
        </motion.div>
      ) : null}

      {shots.mobile.deviceExport ? (
        <motion.div initial={{ x: direction * 100, opacity: 0, rotate: direction * 2 }} animate={{ x: 0, opacity: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="framed-device framed-phone">
          <Image src={shots.mobile.src} alt={project.title + " mobile view"} fill sizes="16vw" className="object-contain" />
        </motion.div>
      ) : (
        <motion.div initial={{ x: direction * 100, opacity: 0, rotate: direction * 2 }} animate={{ x: 0, opacity: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="phone-device">
          <div className="phone-speaker" />
          <Image src={shots.mobile.src} alt={project.title + " mobile homepage"} fill sizes="15vw" className="object-cover object-top" />
        </motion.div>
      )}
    </div>
  );
}

function ProjectArchive({ projects, startIndex, allProjects = false }: { projects: Project[]; startIndex: number; allProjects?: boolean }) {
  if (!projects.length) return null;
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mb-8 flex items-end justify-between">
        <div><p className="field-label">{allProjects ? "Work" : "Archive"}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{allProjects ? "Projects and builds" : "More experiments and builds"}</h2></div>
        <span className="hidden font-mono text-xs text-ink/45 sm:block">{projects.length} entries</span>
      </div>
      <div className="border-t border-ink/25">
        {projects.map((project, index) => (
          <Link key={project.id} href={"/projects/" + project.slug} className="group grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-ink/15 py-5 transition-colors hover:text-vermillion sm:grid-cols-[70px_1fr_220px_auto]">
            <span className="font-mono text-xs text-ink/45">{String(index + startIndex).padStart(2, "0")}</span>
            <span className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">{project.title}</span>
            <span className="hidden text-sm text-ink/50 sm:block">{project.label}</span>
            <span className="text-sm font-medium">View</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
