/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { DEFAULT_THEME_PRESET_ID, HERO_UI_THEME_PRESETS } from "../data/heroutheampresets.js";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  themePreset: DEFAULT_THEME_PRESET_ID,
  setThemePreset: () => {},
});

export function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme() {
  if (typeof window === "undefined") return null;
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;
  return null;
}

export function applyDomTheme(theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

export function isValidThemePreset(presetId) {
  return HERO_UI_THEME_PRESETS.some((p) => p.id === presetId);
}

export function applyThemePresetToDocument(presetId) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (presetId && presetId !== "default") {
    root.setAttribute("data-theme-preset", presetId);
  } else {
    root.removeAttribute("data-theme-preset");
  }
}

export function readStoredThemePreset() {
  if (typeof window === "undefined") return DEFAULT_THEME_PRESET_ID;
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;
  return DEFAULT_THEME_PRESET_ID;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme() ?? getSystemTheme());
  const [themePreset, setThemePresetState] = useState(readStoredThemePreset);

  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  const setTheme = (next) => setThemeState(next);

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  const setThemePreset = (next) => {
    setThemePresetState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value = { theme, setTheme, toggleTheme, themePreset, setThemePreset };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}