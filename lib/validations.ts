import { z } from "zod";

/** Server-side input validation + sanitization for all admin mutations. */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Accept a comma/newline separated string OR an array for tech stack.
const techStack = z
  .union([z.string(), z.array(z.string())])
  .transform((val) =>
    (Array.isArray(val) ? val : val.split(","))
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20),
  );

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .url({ message: "Must be a valid URL" })
  .optional()
  .or(z.literal("").transform(() => undefined));

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .max(140)
    .optional()
    .or(z.literal("")),
  label: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Description is too short").max(2000),
  tech_stack: techStack,
  image_url: z.string().trim().max(700).optional().or(z.literal("")),
  live_url: optionalUrl,
  admin_url: optionalUrl,
  preview_url: optionalUrl,
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export function normalizeProject(input: ProjectInput) {
  return {
    ...input,
    slug: input.slug && input.slug.length > 0 ? slugify(input.slug) : slugify(input.title),
    label: input.label || null,
    image_url: input.image_url || null,
    live_url: input.live_url || null,
    admin_url: input.admin_url || null,
    preview_url: input.preview_url || input.live_url || null,
  };
}

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(["languages", "frontend", "backend", "tools"]),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;

// ── File upload validation ──────────────────────────────
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function validateImageFile(file: File): string | null {
  if (!file || file.size === 0) return "No file selected.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return "Only JPEG, PNG, WebP or AVIF images are allowed.";
  if (file.size > MAX_UPLOAD_BYTES) return "Image must be 5 MB or smaller.";
  return null;
}

// ── Experience ("The road") ─────────────────────────────
const points = z
  .union([z.string(), z.array(z.string())])
  .transform((val) =>
    (Array.isArray(val) ? val : val.split("\n"))
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 12),
  );

export const experienceSchema = z.object({
  date: z.string().trim().min(1, "Date is required").max(60),
  role: z.string().trim().min(2, "Role is required").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  points,
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export function normalizeExperience(input: ExperienceInput) {
  return { ...input, company: input.company || null };
}

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z.string().min(6, "Password is too short").max(200),
});
