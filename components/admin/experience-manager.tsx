"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ExperienceForm } from "./experience-form";
import { deleteExperienceAction } from "@/app/admin/actions";
import type { Experience } from "@/lib/types";

export function ExperienceManager({ items }: { items: Experience[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium text-fg">
          The road <span className="text-base text-faint">({items.length})</span>
        </h2>
        <button
          onClick={() => {
            setAdding((v) => !v);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" /> New entry
        </button>
      </div>

      {adding && (
        <div className="mt-4">
          <ExperienceForm onDone={() => setAdding(false)} />
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-3">
        {items.map((e) => (
          <li key={e.id} className="rounded-xl border border-line bg-surface/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-fg">
                  <span className="mr-2 font-mono text-xs text-secondary">
                    {e.date}
                  </span>
                  {e.role}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {e.company} · {e.points.length} point
                  {e.points.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() =>
                    setEditingId((id) => (id === e.id ? null : e.id))
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <form action={deleteExperienceAction}>
                  <input type="hidden" name="id" value={e.id} />
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

            {editingId === e.id && (
              <div className="mt-4">
                <ExperienceForm entry={e} onDone={() => setEditingId(null)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
