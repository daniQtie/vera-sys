import { PROFILE } from "@/lib/seed-data";
import { SITE_URL } from "@/lib/env";
import type { Project } from "@/lib/types";

/**
 * Structured data (JSON-LD). Rebuilt from the same data source the page
 * renders, so editing projects/skills in the admin keeps rich results in sync.
 */
export function JsonLd({ projects }: { projects: Project[] }) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.role,
    url: SITE_URL,
    image: `${SITE_URL}${PROFILE.photo}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pangasinan",
      addressCountry: "PH",
    },
    sameAs: [
      PROFILE.socials.facebook.href,
      PROFILE.socials.instagram.href,
    ],
    knowsAbout: [
      "Full Stack Web Development",
      "E-commerce",
      "Booking Systems",
      "PHP",
      "Laravel",
      "React",
      "Next.js",
      "MySQL",
    ],
  };

  const portfolio = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${PROFILE.name} — Selected Work`,
    url: `${SITE_URL}/#work`,
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      abstract: p.description,
      url: p.live_url ?? `${SITE_URL}/projects/${p.slug}`,
      keywords: p.tech_stack.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolio) }}
      />
    </>
  );
}
