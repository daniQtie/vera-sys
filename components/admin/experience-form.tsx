"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  createExperienceAction,
  updateExperienceAction,
  type ActionState,
} from "@/app/admin/actions";
import type { Experience } from "@/lib/types";

export function ExperienceForm({
  entry,
  onDone,
}: {
  entry?: Experience;
  onDone?: () => void;
}) {
  const editing = Boolean(entry);
  const action = editing ? updateExperienceAction : createExperienceAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {},
  );
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      if (onDone) onDone();
    }
  }, [state.ok, router, onDone]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-xl border border-line bg-bg2/40 p-5 sm:grid-cols-2"
    >
      {editing && <input type="hidden" name="id" value={entry!.id} />}

      <L label="Date / period *">
        <input
          name="date"
          required
          defaultValue={entry?.date}
          placeholder="2026 — Present"
          className="input"
        />
      </L>
      <L label="Sort order">
        <input
          name="sort_order"
          type="number"
          min={0}
          defaultValue={entry?.sort_order ?? 0}
          className="input"
        />
      </L>
      <L label="Role / title *" className="sm:col-span-2">
        <input
          name="role"
          required
          defaultValue={entry?.role}
          placeholder="Freelance Full Stack Developer"
          className="input"
        />
      </L>
      <L label="Company / place" className="sm:col-span-2">
        <input
          name="company"
          defaultValue={entry?.company ?? ""}
          placeholder="Self-Employed · Remote · Philippines"
          className="input"
        />
      </L>
      <L label="Bullet points — one per line" className="sm:col-span-2">
        <textarea
          name="points"
          rows={4}
          defaultValue={entry?.points.join("\n")}
          placeholder={"Built booking systems with PHP and MySQL\nDelivered responsive, SEO-optimized frontends"}
          className="input resize-y"
        />
      </L>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Saving..." : editing ? "Update entry" : "Add entry"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-muted hover:text-fg"
          >
            Cancel
          </button>
        )}
        {state.ok && (
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <CheckCircle2 className="h-4 w-4" /> {state.message}
          </span>
        )}
        {state.error && (
          <span className="flex items-center gap-1.5 text-sm text-accent">
            <AlertCircle className="h-4 w-4" /> {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

function L({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}
