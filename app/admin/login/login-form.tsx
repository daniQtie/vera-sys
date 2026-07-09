"use client";

import { useActionState } from "react";
import { Lock, LogIn, AlertCircle } from "lucide-react";
import { loginAction, type ActionState } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
        />
      </div>

      {state.error && (
        <p className="flex items-center gap-2 text-sm text-accent">
          <AlertCircle className="h-4 w-4" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? (
          <>
            <Lock className="h-4 w-4 animate-pulse" /> Signing in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" /> Sign in
          </>
        )}
      </button>
    </form>
  );
}
