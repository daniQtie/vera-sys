import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LivePreview } from "@/components/live-preview";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { canEmbed } from "@/lib/embeddable";
import { SITE_URL } from "@/lib/env";
import { PROFILE } from "@/lib/seed-data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const title = project.title;
  const description = project.description.slice(0, 160);

  return {
    title,
    description,
    keywords: project.tech_stack,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${title} · ${PROFILE.name}`,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const embeddable = await canEmbed(project.preview_url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.description,
    url: project.live_url ?? `${SITE_URL}/projects/${project.slug}`,
    keywords: project.tech_stack.join(", "),
    author: { "@type": "Person", name: PROFILE.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="mx-auto max-w-[1000px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All work
        </Link>

        {project.label && (
          <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-secondary">
            {project.label}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-fg sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech_stack.map((t) => (
            <li
              key={t}
              className="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
            >
              Open live site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
          {project.admin_url && (
            <a
              href={project.admin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition-colors hover:border-secondary hover:text-secondary"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin panel
            </a>
          )}
        </div>

        <div className="mt-12">
          <LivePreview
            previewUrl={project.preview_url}
            embeddable={embeddable}
            imageUrl={project.image_url}
            title={project.title}
            slug={project.slug}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
