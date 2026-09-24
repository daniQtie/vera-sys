"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { GalleryItem } from "@/lib/types";

export function ProofGallery({ items }: { items: GalleryItem[] }) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const velocity = useRef(-0.42);
  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    let frame = 0;
    let previous = performance.now();

    const animate = (now: number) => {
      const delta = Math.min(32, now - previous) / 16.67;
      previous = now;
      if (!dragging.current && !reduceMotion) {
        velocity.current += (-0.42 - velocity.current) * 0.025;
        offset.current += velocity.current * delta;
      }
      const half = track.scrollHeight / 2;
      if (half > 0) {
        while (offset.current <= -half) offset.current += half;
        while (offset.current > 0) offset.current -= half;
      }
      track.style.transform = `translate3d(0, ${offset.current}px, 0)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [items.length, reduceMotion]);

  const repeated = [...items, ...items];
  return (
    <div
      ref={viewportRef}
      className="proof-gallery"
      aria-label="Draggable gallery of selected work"
      onPointerDown={(event) => {
        dragging.current = true;
        moved.current = false;
        lastPoint.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const dx = event.clientX - lastPoint.current.x;
        const dy = event.clientY - lastPoint.current.y;
        const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        if (Math.abs(delta) > 1) moved.current = true;
        offset.current += delta;
        velocity.current = delta * 0.34;
        lastPoint.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        dragging.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      <div ref={trackRef} className="proof-track">
        {repeated.map((item, index) => (
          <figure
            key={`${item.id}-${index}`}
            className={`proof-card proof-card-${index % 5}`}
            aria-hidden={index >= items.length}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <Image src={item.image_url} alt={index < items.length ? item.alt_text : ""} fill sizes="(max-width: 768px) 64vw, 25vw" className="pointer-events-none select-none object-cover object-top" draggable={false} />
            </div>
            <figcaption><span>{String((index % items.length) + 1).padStart(2, "0")}</span><span>{item.title}</span></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
