"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectForm } from "./project-form";
import { deleteProjectAction } from "@/app/admin/actions";
import type { Project } from "@/lib/types";

export function ProjectManager({ projects }: { projects: Project[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {adding && (
        <div className="mt-4">
          <ProjectForm onDone={() => setAdding(false)} />
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-line bg-surface/40 p-4"
          >
            <div className="flex items-start justify-between gap-4">
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
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() =>
                    setEditingId((id) => (id === p.id ? null : p.id))
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                    aria-label="Delete"
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
        ))}
      </ul>
    </section>
  );
}
