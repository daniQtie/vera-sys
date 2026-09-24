"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PROFILE } from "@/lib/seed-data";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const anchor = (href: string) => pathname === "/" ? href : `/${href}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={"fixed inset-x-0 top-0 z-[120] transition-colors duration-300 " + (scrolled ? "border-b border-ink/15 bg-paper/92 backdrop-blur-md" : "")}>
      <nav className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href={anchor("#top")} className="text-sm font-semibold tracking-[-0.025em]">
          DDV <span className="ml-2 font-mono text-[10px] font-normal tracking-[0.12em] text-ink/45">DANIEL DE VERA</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => <a key={link.href} href={anchor(link.href)} className="nav-link">{link.label}</a>)}
        </div>
        <div className="flex items-center gap-4">
          <a href={"mailto:" + PROFILE.email} className="available-link hidden items-center gap-2 text-xs font-medium sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#268455]" />Available for work
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} className="menu-toggle md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-x-0 top-[68px] min-h-[calc(100dvh-68px)] border-t border-ink/15 bg-paper px-5 py-10 md:hidden">
            <div className="flex flex-col">
              {links.map((link, index) => (
                <a key={link.href} href={anchor(link.href)} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-ink/15 py-5 text-4xl font-semibold tracking-[-0.05em]">
                  <span className="font-mono text-xs font-normal text-ink/40">0{index + 1}</span>{link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
