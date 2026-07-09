"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "concierge" | "linen";

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "verasys-theme";

export const THEME_META: Record<ThemeName, { label: string }> = {
  concierge: { label: "Midnight Concierge" },
  linen: { label: "Atlas Linen" },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("concierge");

  // Sync from the value the pre-paint script already applied.
  useEffect(() => {
    const current = document.documentElement.getAttribute(
      "data-theme",
    ) as ThemeName | null;
    if (current === "concierge" || current === "linen") setThemeState(current);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  };

  const toggle = () => setTheme(theme === "concierge" ? "linen" : "concierge");

  return (
    <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Inline script injected before paint to prevent a theme flash. */
export const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('${STORAGE_KEY}');
    if (t !== 'concierge' && t !== 'linen') t = 'concierge';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'concierge');
  }
})();
`;
