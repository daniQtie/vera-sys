import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>

        <div className="mt-6 rounded-2xl border border-line bg-surface/40 p-7 sm:p-8">
          <h1 className="font-display text-3xl font-medium text-fg">
            Admin<span className="italic text-accent"> access</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage projects and skills.
          </p>

          <div className="mt-7">
            {isSupabaseConfigured ? (
              <LoginForm next={next ?? "/admin"} />
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-line bg-bg2/50 p-4 text-sm text-muted">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  Supabase isn't configured yet. Add your keys to{" "}
                  <code className="font-mono text-fg">.env.local</code> and
                  create an admin user to enable sign in.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
