"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { MonitorPlay } from "lucide-react";

type Status = "loading" | "ok" | "fail";

const COVERS = [
  "linear-gradient(135deg,#1a0e3a,#2d1060,#0d0820)",
  "linear-gradient(135deg,#0a1628,#0d2248,#1a0e3a)",
  "linear-gradient(135deg,#0a2540,#1e3a8a,#020617)",
  "linear-gradient(135deg,#0f172a,#1e293b,#020617)",
  "linear-gradient(135deg,#1a1109,#3b2410,#0f0a05)",
  "linear-gradient(135deg,#0e2a1a,#0d3d26,#091a10)",
];

function coverFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return COVERS[h % COVERS.length];
}

export function LivePreview({
  previewUrl,
  embeddable,
  imageUrl,
  title,
  slug,
}: {
  previewUrl: string | null;
  embeddable: boolean;
  imageUrl: string | null;
  title: string;
  slug: string;
}) {
  const canFrame = embeddable && !!previewUrl;
  const [status, setStatus] = useState<Status>(canFrame ? "loading" : "fail");
  const [inView, setInView] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only mount the iframe once the card scrolls near the viewport, so we never
  // load several external sites at once on first paint.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!canFrame || !inView) return;
    // Belt-and-suspenders: if the frame never fires onLoad, fall back.
    timer.current = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "fail" : s));
    }, 6500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [canFrame, inView]);

  const showFallback = status === "fail";
  const mountFrame = canFrame && inView && !showFallback;

  return (
    <div
      ref={boxRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-surface"
    >
      {/* Live iframe (only if headers allow framing + card in view) */}
      {mountFrame && (
        <iframe
          src={previewUrl!}
          title={`Live preview of ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onLoad={() => {
            if (timer.current) clearTimeout(timer.current);
            setStatus("ok");
          }}
          onError={() => setStatus("fail")}
          className="pointer-events-none absolute left-0 top-0 h-[125%] w-[125%] origin-top-left scale-[0.8] border-0 bg-white"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-surface">
          <div className="shimmer absolute inset-0" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
            <MonitorPlay className="h-3.5 w-3.5 animate-pulse" />
            Loading live preview
          </div>
        </div>
      )}

      {/* Fallback: real screenshot, else a branded cover */}
      {showFallback &&
        (imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Screenshot of the ${title} project`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-top"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ background: coverFor(slug) }}
          >
            <span className="font-display text-2xl italic text-white/90">
              {title}
            </span>
          </div>
        ))}

      {/* Subtle top browser-chrome bar for realism */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-6 items-center gap-1.5 border-b border-black/10 bg-black/20 px-3 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-white/40" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
      />
    </div>
  );
}
