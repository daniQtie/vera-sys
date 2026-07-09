import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-secondary">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium text-fg sm:text-6xl">
          This page took a{" "}
          <span className="italic text-accent">wrong turn.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </main>
  );
}
