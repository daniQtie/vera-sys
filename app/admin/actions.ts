"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  projectSchema,
  skillSchema,
  loginSchema,
  experienceSchema,
  normalizeProject,
  normalizeExperience,
  validateImageFile,
  gallerySchema,
} from "@/lib/validations";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/rate-limit";
import { isPortfolioAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isPortfolioAdmin(user)) throw new Error("Unauthorized");
  return { supabase, user };
}

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// ── AUTH ─────────────────────────────────────────────────
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await clientIp();
  const rl = checkLoginRateLimit(ip);
  if (!rl.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(
        rl.retryAfterSec / 60,
      )} min.`,
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Invalid email or password." };
  }

  if (!isPortfolioAdmin(data.user)) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for the admin dashboard." };
  }

  resetLoginRateLimit(ip);
  const next = (formData.get("next") as string) || "/admin";
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── IMAGE UPLOAD ─────────────────────────────────────────
async function maybeUploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const err = validateImageFile(file);
  if (err) throw new Error(err);

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `projects/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed.");

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

// ── PROJECTS ─────────────────────────────────────────────
function readProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    label: formData.get("label"),
    description: formData.get("description"),
    tech_stack: formData.get("tech_stack"),
    image_url: formData.get("image_url"),
    live_url: formData.get("live_url"),
    admin_url: formData.get("admin_url"),
    preview_url: formData.get("preview_url"),
    sort_order: formData.get("sort_order"),
  });
}

export async function createProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const parsed = readProjectForm(formData);
    if (!parsed.success)
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const data = normalizeProject(parsed.data);
    const uploaded = await maybeUploadImage(
      supabase,
      formData.get("image") as File | null,
    );
    if (uploaded) data.image_url = uploaded;

    const { error } = await supabase.from("projects").insert(data);
    if (error)
      return {
        error: error.message.includes("duplicate")
          ? "A project with that slug already exists."
          : "Could not save project.",
      };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Project added." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const id = formData.get("id") as string;
    if (!id) return { error: "Missing project id." };

    const parsed = readProjectForm(formData);
    if (!parsed.success)
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const data = normalizeProject(parsed.data);
    const uploaded = await maybeUploadImage(
      supabase,
      formData.get("image") as File | null,
    );
    if (uploaded) data.image_url = uploaded;

    const { error } = await supabase
      .from("projects")
      .update(data)
      .eq("id", id);
    if (error) return { error: "Could not update project." };

    revalidatePath("/");
    revalidatePath(`/projects/${data.slug}`);
    revalidatePath("/admin");
    return { ok: true, message: "Project updated." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase } = await requireUser();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

const featuredPlacementSchema = z.object({
  id: z.string().uuid(),
  operation: z.enum(["add", "remove", "up", "down"]),
});

export async function changeFeaturedPlacementAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = featuredPlacementSchema.safeParse({
      id: formData.get("id"),
      operation: formData.get("operation"),
    });
    if (!parsed.success) return { error: "Invalid project action." };
    const { supabase } = await requireUser();
    const { id, operation } = parsed.data;
    const { data, error } = await supabase
      .from("projects")
      .select("id,is_featured,featured_order")
      .eq("is_featured", true);
    if (error) return { error: "Run the featured-projects migration in Supabase first." };

    const featured = (data ?? []).sort((a, b) =>
      (a.featured_order ?? Number.MAX_SAFE_INTEGER) - (b.featured_order ?? Number.MAX_SAFE_INTEGER),
    );
    const currentIndex = featured.findIndex((item) => item.id === id);

    if (operation === "add" || operation === "remove") {
      const nextOrder = operation === "add"
        ? Math.max(0, ...featured.map((item) => item.featured_order ?? 0)) + 1
        : null;
      const { data: updated, error: updateError } = await supabase
        .from("projects")
        .update({ is_featured: operation === "add", featured_order: nextOrder })
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (updateError || !updated) return { error: "Could not update selected work." };
    } else {
      if (currentIndex < 0) return { error: "This project is not featured." };
      const neighbor = featured[currentIndex + (operation === "up" ? -1 : 1)];
      if (!neighbor) return { ok: true, message: "Already at the end." };
      const current = featured[currentIndex];
      const currentOrder = current.featured_order ?? currentIndex + 1;
      const neighborOrder = neighbor.featured_order ?? currentIndex + (operation === "up" ? 0 : 2);
      const { data: firstUpdated, error: firstError } = await supabase.from("projects")
        .update({ featured_order: neighborOrder }).eq("id", id).select("id").maybeSingle();
      if (firstError || !firstUpdated) return { error: "Could not reorder selected work." };
      const { data: secondUpdated, error: secondError } = await supabase.from("projects")
        .update({ featured_order: currentOrder }).eq("id", neighbor.id).select("id").maybeSingle();
      if (secondError || !secondUpdated) {
        await supabase.from("projects").update({ featured_order: currentOrder }).eq("id", id);
        return { error: "Could not reorder selected work." };
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Selected work updated." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not update selected work." };
  }
}

// ── SKILLS ───────────────────────────────────────────────
export async function createSkillAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const parsed = skillSchema.safeParse({
      name: formData.get("name"),
      category: formData.get("category"),
      sort_order: formData.get("sort_order"),
    });
    if (!parsed.success)
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const { error } = await supabase.from("skills").insert(parsed.data);
    if (error) return { error: "Could not add skill (maybe a duplicate?)." };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Skill added." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteSkillAction(formData: FormData) {
  const { supabase } = await requireUser();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("skills").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

// ── HERO IMAGE ───────────────────────────────────────────
export async function updateHeroImageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const file = formData.get("image") as File | null;
    const url = await maybeUploadImage(supabase, file);
    if (!url) return { error: "Please choose an image to upload." };

    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, hero_image_url: url, updated_at: new Date().toISOString() });
    if (error) return { error: "Could not save hero image." };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Hero image updated." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function resetHeroImageAction() {
  const { supabase } = await requireUser();
  await supabase.from("site_settings").upsert({ id: 1, hero_image_url: null });
  revalidatePath("/");
  revalidatePath("/admin");
}

// ── PROOF-OF-WORK GALLERY ───────────────────────────────
export async function createGalleryItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const parsed = gallerySchema.safeParse({
      title: formData.get("title"),
      alt_text: formData.get("alt_text"),
      sort_order: formData.get("sort_order"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    const { error: tableError } = await supabase.from("gallery_items").select("id").limit(1);
    if (tableError) return { error: "Run migration-03-gallery.sql in Supabase first." };
    const imageUrl = await maybeUploadImage(supabase, formData.get("image") as File | null);
    if (!imageUrl) return { error: "Please choose an image to upload." };
    const { error } = await supabase.from("gallery_items").insert({ ...parsed.data, image_url: imageUrl });
    if (error) return { error: "Could not add gallery image." };
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Gallery image added." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function deleteGalleryItemAction(formData: FormData) {
  const { supabase } = await requireUser();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("gallery_items").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

// ── EXPERIENCE ("The road") ──────────────────────────────
function readExperienceForm(formData: FormData) {
  return experienceSchema.safeParse({
    date: formData.get("date"),
    role: formData.get("role"),
    company: formData.get("company"),
    points: formData.get("points"),
    sort_order: formData.get("sort_order"),
  });
}

export async function createExperienceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const parsed = readExperienceForm(formData);
    if (!parsed.success)
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const { error } = await supabase
      .from("experience")
      .insert(normalizeExperience(parsed.data));
    if (error) return { error: "Could not add entry." };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Entry added." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateExperienceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireUser();
    const id = formData.get("id") as string;
    if (!id) return { error: "Missing entry id." };

    const parsed = readExperienceForm(formData);
    if (!parsed.success)
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const { error } = await supabase
      .from("experience")
      .update(normalizeExperience(parsed.data))
      .eq("id", id);
    if (error) return { error: "Could not update entry." };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "Entry updated." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteExperienceAction(formData: FormData) {
  const { supabase } = await requireUser();
  const id = formData.get("id") as string;
  if (id) {
    await supabase.from("experience").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
}
