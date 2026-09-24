import { PROFILE } from "@/lib/seed-data";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/15 bg-paper">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:py-16">
        <div className="max-w-[43ch]">
          <Link href="/" className="inline-flex items-baseline gap-3 text-sm font-semibold tracking-[-0.025em] text-ink" aria-label="Daniel De Vera homepage">
            DDV <span className="font-mono text-[10px] font-normal tracking-[0.12em] text-ink/45">DANIEL DE VERA</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Full-stack developer based in {PROFILE.location}. I design and build end-to-end digital products—from SaaS platforms to custom web applications.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap content-start gap-x-7 gap-y-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink/60 md:max-w-[280px]">
          <Link href="/#work" className="transition-colors hover:text-ink">Selected work</Link>
          <Link href="/#about" className="transition-colors hover:text-ink">About</Link>
          <Link href="/#experience" className="transition-colors hover:text-ink">Experience</Link>
          <Link href="/#contact" className="transition-colors hover:text-ink">Contact</Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-ink/15 px-5 py-5 text-xs text-ink/45 sm:flex-row sm:justify-between sm:px-8">
        <p>© {year} {PROFILE.name}. All rights reserved.</p>
        <p>Designed and built in Pangasinan, Philippines.</p>
      </div>
    </footer>
  );
}
