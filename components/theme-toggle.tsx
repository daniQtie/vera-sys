"use client";

import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme, THEME_META } from "./theme-provider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const next = theme === "concierge" ? "linen" : "concierge";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${THEME_META[next].label} theme`}
      title={`Switch to ${THEME_META[next].label}`}
      className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-2.5 py-2 text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
          >
            {theme === "concierge" ? (
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      {!compact && (
        <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.12em] sm:inline">
          {THEME_META[theme].label.split(" ")[1]}
        </span>
      )}
    </button>
  );
}
