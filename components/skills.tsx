"use client";

import { useState } from "react";
import Image from "next/image";
import { SKILL_CATEGORIES, type Skill } from "@/lib/types";
import { Braces, MonitorSmartphone, PanelsTopLeft, Sparkles, Workflow } from "lucide-react";

const capabilityCopy = [
  ["Product interfaces", "Responsive websites, dashboards, design systems, and clear interaction flows."],
  ["Booking systems", "Availability, reservations, appointments, confirmations, and admin operations."],
  ["Backend & databases", "APIs, authentication, role-based tools, structured data, and reliable business logic."],
  ["Deployment & support", "Production releases, domain setup, maintenance, monitoring, and ongoing improvement."],
] as const;

const BRAND_ICONS: Record<string, string> = {
  JavaScript: "javascript",
  PHP: "php",
  Python: "python",
  SQL: "postgresql",
  HTML5: "html5",
  CSS3: "css",
  "React.js": "react",
  "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss",
  "Node.js": "nodedotjs",
  Laravel: "laravel",
  MySQL: "mysql",
  "Git & GitHub": "github",
  "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  XAMPP: "xampp",
  Figma: "figma",
  Vercel: "vercel",
  Codex: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/openai.svg",
  "Make.com": "make",
};

function SkillMark({ name }: { name: string }) {
  const slug = BRAND_ICONS[name];
  if (slug) return <Image unoptimized src={slug.startsWith("https://") ? slug : `https://cdn.simpleicons.org/${slug}/20231F`} alt="" width={30} height={30} />;
  const ConceptIcon = name === "Responsive Design" ? MonitorSmartphone : name === "CSS Animations" ? Sparkles : name === "UI/UX Design" ? PanelsTopLeft : name === "REST APIs" ? Braces : name === "PHP MVC" ? Workflow : null;
  return ConceptIcon ? <ConceptIcon aria-hidden className="h-8 w-8" strokeWidth={1.5} /> : <span className="font-mono text-sm">{name.slice(0, 2).toUpperCase()}</span>;
}

export function Skills({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState<"frontend" | "backend" | "tools" | "automations">("frontend");
  const filters = [
    { key: "frontend", label: "Front end" },
    { key: "backend", label: "Back end" },
    { key: "tools", label: "Tools" },
    { key: "automations", label: "Automations" },
  ] as const;
  const visibleSkills = skills.filter((skill) => {
    if (activeCategory === "automations") return skill.name === "Make.com";
    if (activeCategory === "tools") return skill.category === "tools" && skill.name !== "Make.com";
    if (activeCategory === "frontend") return skill.category === "frontend" || (skill.category === "languages" && ["JavaScript", "HTML5", "CSS3"].includes(skill.name));
    return skill.category === "backend" || (skill.category === "languages" && ["PHP", "Python", "SQL"].includes(skill.name));
  });
  return (
    <section id="skills" className="border-t border-ink/15 bg-paper">
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="field-label">Capabilities / 04</p>
            <h2 className="mt-3 max-w-[10ch] text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">What I can take from idea to release.</h2>
          </div>
          <ol className="border-t border-ink/25">
            {capabilityCopy.map(([title, copy], index) => (
              <li key={title} className="grid grid-cols-[45px_1fr] gap-4 border-b border-ink/15 py-6 sm:grid-cols-[70px_220px_1fr]">
                <span className="font-mono text-xs text-ink/40">0{index + 1}</span>
                <h3 className="text-lg font-semibold tracking-[-0.025em]">{title}</h3>
                <p className="col-start-2 max-w-[48ch] text-sm leading-relaxed text-ink/58 sm:col-start-3">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-20 border-t border-ink/25">
          <div className="grid border-b border-ink/15 py-5 lg:grid-cols-[0.34fr_0.66fr]">
            <p className="field-label">Working stack</p>
            <p className="mt-2 max-w-[46ch] text-sm text-ink/55 lg:mt-0">Tools I use in production, grouped by where they do the work.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter skills by discipline">
            {filters.map((filter) => (
              <button key={filter.key} type="button" onClick={() => setActiveCategory(filter.key)} aria-pressed={activeCategory === filter.key} className={"skill-filter " + (activeCategory === filter.key ? "skill-filter-active" : "")}>{filter.label}</button>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-live="polite">
            {visibleSkills.map((skill, index) => (
              <article key={skill.id} className="skill-tile">
                <span className="font-mono text-[9px] text-ink/28">{String(index + 1).padStart(2, "0")}</span>
                <div className="skill-mark"><SkillMark name={skill.name} /></div>
                <h3 className="text-center text-sm font-medium leading-tight">{skill.name}</h3>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/32">{SKILL_CATEGORIES.find((category) => category.key === skill.category)?.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
