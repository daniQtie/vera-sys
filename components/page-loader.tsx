"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * First-paint loader: an animated "DV" monogram + progress hairline.
 * Dismisses on window load (or a short fallback), then never shows again
 * for the session so client navigations feel instant.
 */
export function PageLoader() {
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem("verasys-loaded")) {
      setDone(true);
      return;
    }
    const finish = () => {
      sessionStorage.setItem("verasys-loaded", "1");
      setDone(true);
    };
    const t = setTimeout(finish, reduce ? 200 : 1400);
    window.addEventListener("load", finish, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", finish);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader-failsafe fixed inset-0 z-[200] grid place-items-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="font-display text-5xl tracking-tight text-fg">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                D
              </motion.span>
              <motion.span
                className="italic text-accent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                V
              </motion.span>
            </div>
            <div className="h-px w-40 overflow-hidden bg-line">
              <motion.div
                className="h-full bg-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-faint">
              VeraSys
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
