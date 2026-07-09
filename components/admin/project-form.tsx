"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  createProjectAction,
  updateProjectAction,
  type ActionState,
} from "@/app/admin/actions";
import type { Project } from "@/lib/types";

export function ProjectForm({
  project,
  onDone,
}: {
  project?: Project;
  onDone?: () => void;
}) {
  const editing = Boolean(project);
  const action = editing ? updateProjectAction : createProjectAction;
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
      {editing && <input type="hidden" name="id" value={project!.id} />}

      <L label="Title *" className="sm:col-span-2">
        <input name="title" required defaultValue={project?.title} className="input" />
      </L>
      <L label="Slug (auto if blank)">
        <input name="slug" defaultValue={project?.slug} className="input" />
      </L>
      <L label="Label (e.g. Full Stack · Booking)">
        <input name="label" defaultValue={project?.label ?? ""} className="input" />
      </L>
      <L label="Description *" className="sm:col-span-2">
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={project?.description}
          className="input resize-y"
        />
      </L>
      <L label="Tech stack (comma separated)" className="sm:col-span-2">
        <input
          name="tech_stack"
          defaultValue={project?.tech_stack.join(", ")}
          placeholder="PHP, MySQL, JavaScript"
          className="input"
        />
      </L>
      <L label="Live URL">
        <input name="live_url" type="url" defaultValue={project?.live_url ?? ""} className="input" />
      </L>
      <L label="Admin URL">
        <input name="admin_url" type="url" defaultValue={project?.admin_url ?? ""} className="input" />
      </L>
      <L label="Live preview URL (iframe target)">
        <input name="preview_url" type="url" defaultValue={project?.preview_url ?? ""} className="input" />
      </L>
      <L label="Sort order">
        <input
          name="sort_order"
          type="number"
          min={0}
          defaultValue={project?.sort_order ?? 0}
          className="input"
        />
      </L>
      <L label="Image URL (or upload below)" className="sm:col-span-2">
        <input name="image_url" defaultValue={project?.image_url ?? ""} className="input" />
      </L>
      <L label="Upload screenshot (JPEG/PNG/WebP, ≤5MB)" className="sm:col-span-2">
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="input file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1 file:text-accent-fg"
        />
      </L>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Saving..." : editing ? "Update project" : "Add project"}
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
