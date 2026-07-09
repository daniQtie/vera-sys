"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  createSkillAction,
  deleteSkillAction,
  type ActionState,
} from "@/app/admin/actions";
import { SKILL_CATEGORIES, type Skill } from "@/lib/types";

export function SkillManager({ skills }: { skills: Skill[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSkillAction,
    {},
  );
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.ok, router]);

  const grouped = SKILL_CATEGORIES.map((c) => ({
    ...c,
    items: skills.filter((s) => s.category === c.key),
  }));

  return (
    <section>
      <h2 className="font-display text-2xl font-medium text-fg">
        Skills <span className="text-base text-faint">({skills.length})</span>
      </h2>

      <form
        ref={formRef}
        action={formAction}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-bg2/40 p-4"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            Name
          </span>
          <input name="name" required placeholder="TypeScript" className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            Category
          </span>
          <select name="category" className="input" defaultValue="languages">
            {SKILL_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-24 flex-col gap-1.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            Order
          </span>
          <input name="sort_order" type="number" min={0} defaultValue={0} className="input" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
        {state.error && (
          <span className="w-full text-sm text-accent">{state.error}</span>
        )}
      </form>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {grouped.map((g) => (
          <div key={g.key} className="rounded-xl border border-line bg-surface/40 p-4">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-secondary">
              {g.label}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s.id}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 text-sm text-fg"
                >
                  {s.name}
                  <form action={deleteSkillAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      aria-label={`Delete ${s.name}`}
                      className="text-faint transition-colors hover:text-accent"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </li>
              ))}
              {g.items.length === 0 && (
                <li className="text-sm text-faint">None yet.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
