"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

export function PageLoader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem("ddv-loader-v2-seen")) {
      setDone(true);
      return;
    }
    if (reduce) {
      const short = window.setTimeout(() => setDone(true), 180);
      return () => window.clearTimeout(short);
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const value = Math.min(100, Math.round((elapsed / 1250) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const finish = window.setTimeout(() => {
      sessionStorage.setItem("ddv-loader-v2-seen", "1");
      setDone(true);
    }, 1450);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finish);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader-failsafe fixed inset-0 z-[200] flex items-center justify-center bg-paper px-5 text-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.72, ease: EASE }}
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="w-full max-w-[680px]">
            <div className="mb-4 flex items-end justify-between border-b border-ink/15 pb-4 font-mono uppercase">
              <span className="text-[10px] tracking-[0.16em] text-ink/50">Daniel De Vera / Portfolio</span>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[clamp(3.5rem,12vw,8rem)] leading-[0.75] tracking-[-0.08em] tabular-nums"
              >
                {String(progress).padStart(3, "0")}
              </motion.span>
            </div>
            <div className="h-[3px] overflow-hidden bg-ink/12">
              <motion.div className="h-full bg-vermillion" animate={{ width: progress + "%" }} transition={{ duration: 0.08, ease: "linear" }} />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">
              <span>Loading selected work</span><span>{String(progress).padStart(3, "0")}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
