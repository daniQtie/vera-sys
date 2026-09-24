"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Trash2 } from "lucide-react";
import { createGalleryItemAction, deleteGalleryItemAction, type ActionState } from "@/app/admin/actions";
import type { GalleryItem } from "@/lib/types";

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createGalleryItemAction, {});
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      setPreview(null);
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <section>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="field-label">Homepage media</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Gallery</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">Upload proof-of-work screenshots for the draggable hero reel. Wide 16:10 images work best.</p>
        </div>
        <span className="font-mono text-xs text-faint">{items.length} images</span>
      </div>

      <form action={formAction} className="mt-7 grid gap-4 border-y border-line py-6 sm:grid-cols-2">
        <label><span className="field-label">Title</span><input name="title" required maxLength={100} className="input mt-2" placeholder="Velara" /></label>
        <label><span className="field-label">Alt text</span><input name="alt_text" required maxLength={180} className="input mt-2" placeholder="Velara hotel homepage" /></label>
        <label><span className="field-label">Order</span><input name="sort_order" type="number" min={0} max={9999} defaultValue={items.length + 1} className="input mt-2" /></label>
        <label><span className="field-label">Screenshot</span><input name="image" required type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="input mt-2 file:mr-3 file:border-0 file:bg-transparent file:font-semibold" onChange={(event) => { const file = event.target.files?.[0]; setPreview(file ? URL.createObjectURL(file) : null); }} /></label>
        {preview && <div className="relative aspect-[16/10] overflow-hidden bg-bg sm:col-span-2"><Image src={preview} alt="New gallery preview" fill className="object-cover object-top" /></div>}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={pending} className="admin-action"><ImagePlus className="h-4 w-4" />{pending ? "Uploading…" : "Add to gallery"}</button>
          {state.ok && <span className="flex items-center gap-1.5 text-sm text-secondary"><CheckCircle2 className="h-4 w-4" />{state.message}</span>}
          {state.error && <span className="flex items-center gap-1.5 text-sm text-accent"><AlertCircle className="h-4 w-4" />{state.error}</span>}
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="bg-bg p-3">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface"><Image src={item.image_url} alt={item.alt_text} fill sizes="300px" className="object-cover object-top" /></div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div><p className="text-sm font-semibold">{item.title}</p><p className="font-mono text-[10px] text-faint">ORDER {String(item.sort_order).padStart(2, "0")}</p></div>
              {!item.id.startsWith("proof-") && <form action={deleteGalleryItemAction}><input type="hidden" name="id" value={item.id} /><button type="submit" className="icon-action" aria-label={`Delete ${item.title}`}><Trash2 className="h-4 w-4" /></button></form>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
