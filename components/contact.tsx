"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "motion/react";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Reveal } from "./reveal";
import { PROFILE } from "@/lib/seed-data";

const PK = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const SID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

type State = "idle" | "sending" | "sent" | "error";

const SOCIALS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: PROFILE.socials.whatsapp.label,
    href: PROFILE.socials.whatsapp.href,
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: PROFILE.socials.facebook.label,
    href: PROFILE.socials.facebook.href,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: PROFILE.socials.instagram.label,
    href: PROFILE.socials.instagram.href,
  },
];

export function Contact() {
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!PK || !SID || !TID) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      await emailjs.send(
        SID,
        TID,
        {
          from_name: (form.elements.namedItem("from_name") as HTMLInputElement)
            .value,
          reply_to: (form.elements.namedItem("reply_to") as HTMLInputElement)
            .value,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement)
            .value,
        },
        { publicKey: PK },
      );
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-fg sm:text-5xl">
              Let's build{" "}
              <span className="italic text-accent">something.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted">
              Have a store, a booking platform, or a management system in mind?
              Tell me about it. My inbox is open.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-2">
            {SOCIALS.map((s) => (
              <Reveal key={s.label} delay={0.05}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-line bg-surface/50 p-4 transition-colors hover:border-accent"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-line text-accent transition-colors group-hover:border-accent">
                    <s.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-fg">
                      {s.label}
                    </span>
                    <span className="block text-xs text-faint">{s.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-5">
              <Field label="Your name" htmlFor="from_name">
                <input
                  id="from_name"
                  name="from_name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Juan Dela Cruz"
                  className="input"
                />
              </Field>
              <Field label="Email address" htmlFor="reply_to">
                <input
                  id="reply_to"
                  name="reply_to"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="input"
                />
              </Field>
              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="Tell me about your project..."
                  className="input resize-y"
                />
              </Field>

              {state === "sent" && (
                <p className="flex items-center gap-2 text-sm text-secondary">
                  <CheckCircle2 className="h-4 w-4" /> Message sent. I'll reply
                  soon.
                </p>
              )}
              {state === "error" && (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <AlertCircle className="h-4 w-4" /> Something went wrong. Please
                  try WhatsApp instead.
                </p>
              )}

              <motion.button
                type="submit"
                disabled={state === "sending"}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {state === "sending" ? "Sending..." : "Send message"}
              </motion.button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
