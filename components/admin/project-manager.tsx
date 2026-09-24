"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectForm } from "./project-form";
import { changeFeaturedPlacementAction, deleteProjectAction, type ActionState } from "@/app/admin/actions";
import type { Project } from "@/lib/types";
import { hasFeaturedProjectFields, selectFeaturedProjects } from "@/lib/featured-projects";

export function ProjectManager({ projects }: { projects: Project[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const featureReady = hasFeaturedProjectFields(projects);
  const featured = featureReady ? selectFeaturedProjects(projects) : [];
  const featuredIds = new Set(featured.map((project) => project.id));
  const orderedProjects = [...featured, ...projects.filter((project) => !featuredIds.has(project.id))];

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium text-fg">
          Projects{" "}
          <span className="text-base text-faint">({projects.length})</span>
        </h2>
        <button
          onClick={() => {
            setAdding((v) => !v);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <p className="mt-2 text-sm text-muted">Featured projects appear one at a time in the sideways scroll. The rest stay in the archive. Upload a screenshot when featuring a new project.</p>
      {adding && (
        <div className="mt-4">
          <ProjectForm onDone={() => setAdding(false)} />
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-3">
        {orderedProjects.map((p) => {
          const featuredIndex = featured.findIndex((item) => item.id === p.id);
          return (
          <li
            key={p.id}
            className="border border-line bg-surface/40 p-4"
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="min-w-0">
                <p className="truncate font-medium text-fg">
                  <span className="mr-2 font-mono text-xs text-faint">
                    {String(p.sort_order).padStart(2, "0")}
                  </span>
                  {p.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {p.label} · {p.tech_stack.join(", ")}
                </p>
                {featuredIndex >= 0 && <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wide text-accent">Featured slide {featuredIndex + 1}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {featureReady && (
                  <>
                    {featuredIndex >= 0 && (
                      <>
                        <PlacementButton id={p.id} operation="up" label="Move featured slide up" disabled={featuredIndex === 0}><ArrowUp className="h-4 w-4" /></PlacementButton>
                        <PlacementButton id={p.id} operation="down" label="Move featured slide down" disabled={featuredIndex === featured.length - 1}><ArrowDown className="h-4 w-4" /></PlacementButton>
                      </>
                    )}
                    <PlacementButton id={p.id} operation={featuredIndex >= 0 ? "remove" : "add"} label={featuredIndex >= 0 ? "Remove from selected work" : "Feature in selected work"}>
                      {featuredIndex >= 0 ? "Unfeature" : "Feature"}
                    </PlacementButton>
                  </>
                )}
                <button
                  onClick={() =>
                    setEditingId((id) => (id === p.id ? null : p.id))
                  }
                  className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="grid h-8 w-8 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                    aria-label={`Delete ${p.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {editingId === p.id && (
              <div className="mt-4">
                <ProjectForm
                  project={p}
                  onDone={() => setEditingId(null)}
                />
              </div>
            )}
          </li>
          );
        })}
      </ul>
    </section>
  );
}

function PlacementButton({ id, operation, label, disabled = false, children }: {
  id: string;
  operation: "add" | "remove" | "up" | "down";
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(changeFeaturedPlacementAction, {});
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);
  return (
    <form action={action} className="relative">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="operation" value={operation} />
      <button type="submit" disabled={disabled || pending} aria-label={label} className="inline-flex h-8 items-center justify-center gap-1 border border-line px-2 text-xs text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35">
        {children}
      </button>
      {state.error && <span role="alert" className="absolute right-0 top-full z-10 mt-1 w-48 border border-accent bg-bg p-2 text-xs text-accent">{state.error}</span>}
    </form>
  );
}
