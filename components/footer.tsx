import { PROFILE } from "@/lib/seed-data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <a
            href="#top"
            className="font-display text-lg font-semibold text-fg"
          >
            Vera<span className="italic text-accent">Sys</span>
          </a>
          <p className="mt-1 text-xs text-faint">
            © {year} {PROFILE.name}. Designed and built from {PROFILE.location}.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted">
          <a href="#work" className="hover:text-fg">
            Work
          </a>
          <a href="#contact" className="hover:text-fg">
            Contact
          </a>
          <a
            href={PROFILE.socials.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg"
          >
            WhatsApp
          </a>
          <a href="#top" className="hover:text-fg">
            Back to top
          </a>
        </nav>
      </div>
    </footer>
  );
}
