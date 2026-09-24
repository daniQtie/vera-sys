"use client";

import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { PROFILE } from "@/lib/seed-data";

const PK = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const SID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
type FormState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FormState>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!PK || !SID || !TID) return setState("error");
    const fromName = (form.elements.namedItem("from_name") as HTMLInputElement).value.trim();
    const senderEmail = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    setState("sending");
    try {
      await emailjs.send(SID, TID, {
        from_name: fromName,
        email: senderEmail,
        from_email: senderEmail,
        reply_to: senderEmail,
        message,
      }, { publicKey: PK });
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="border-t border-ink/15 bg-[#e5e7df]">
      <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-14">
          <div>
            <p className="field-label">Contact / 05</p>
            <p className="mt-5 max-w-[28ch] text-sm leading-relaxed text-ink/58">If you need someone who can move between interface and backend, tell me what you’re building.</p>
          </div>
          <div>
            <h2 className="max-w-[17ch] text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-balance">Let’s build something people can use.</h2>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="mt-9 flex w-full items-center justify-between gap-6 border border-ink/30 px-5 py-4 text-left text-base font-medium tracking-[-0.025em] transition-colors hover:bg-white/30">
              <span>{open ? "Close message form" : "Start a conversation"}</span><span className="text-xl font-light">{open ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.form onSubmit={submit} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-0 border-b border-ink/25 pt-7 sm:grid-cols-2">
                    <label className="contact-field sm:border-r sm:border-ink/15"><span>Name</span><input name="from_name" required maxLength={120} autoComplete="name" placeholder="Your name" /></label>
                    <label className="contact-field"><span>Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" /></label>
                    <label className="contact-field border-t border-ink/15 sm:col-span-2"><span>Project</span><textarea name="message" required rows={4} maxLength={2000} placeholder="What are you trying to build or improve?" /></label>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-5">
                    <p className="text-sm text-ink/55">
                      {state === "sent" && "Message sent. I’ll get back to you soon."}
                      {state === "error" && "The message could not be sent. Please use email instead."}
                    </p>
                    <button type="submit" disabled={state === "sending"} className="editorial-link disabled:opacity-40">{state === "sending" ? "Sending…" : "Send message"}</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
            <div className="mt-10 border-t border-ink/20 pt-6 text-sm">
              <p className="field-label mb-3">Or reach me directly</p>
              <div className="flex flex-wrap gap-2">
                <a href={"mailto:" + PROFILE.email} className="editorial-link">{PROFILE.email}</a>
                <a href={PROFILE.socials.facebook.href} target="_blank" rel="noopener noreferrer" className="editorial-link">Facebook</a>
                <a href={PROFILE.socials.instagram.href} target="_blank" rel="noopener noreferrer" className="editorial-link">Instagram</a>
                <a href={PROFILE.socials.whatsapp.href} target="_blank" rel="noopener noreferrer" className="editorial-link">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
