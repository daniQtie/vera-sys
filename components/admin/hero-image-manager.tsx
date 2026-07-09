"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import {
  updateHeroImageAction,
  resetHeroImageAction,
  type ActionState,
} from "@/app/admin/actions";
import { PROFILE } from "@/lib/seed-data";

export function HeroImageManager({
  currentUrl,
}: {
  currentUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateHeroImageAction,
    {},
  );
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const shown = preview || currentUrl || PROFILE.photo;

  return (
    <section className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-7">
      <h2 className="font-display text-2xl font-medium text-fg">
        Hero image
      </h2>
      <p className="mt-1 text-sm text-muted">
        This shows as the main portrait at the top of your site. Upload a new
        one to replace it instantly.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-xl border border-line-strong bg-bg">
          <Image
            src={shown}
            alt="Current hero image preview"
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
              Choose image (JPEG/PNG/WebP, ≤ 5 MB)
            </span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
              className="input file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1 file:text-accent-fg"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {pending ? "Uploading..." : "Upload & set"}
            </button>

            {currentUrl && (
              <button
                type="submit"
                formAction={resetHeroImageAction}
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to default
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
      </div>
    </section>
  );
}
