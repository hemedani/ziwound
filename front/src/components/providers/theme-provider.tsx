"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

type ThemeProviderContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | null>(null);

const STORAGE_KEY = "theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDocument(attribute: "class" | "data-theme", theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } else {
    root.setAttribute(attribute, theme);
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");
  const [mounted, setMounted] = React.useState(false);

  // Ensure server output sets a stable baseline without rendering <script> in React tree.
  useServerInsertedHTML(() => {
    return null;
  });

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? defaultTheme;
    const nextTheme: Theme =
      saved === "light" || saved === "dark" || saved === "system" ? saved : defaultTheme;

    setThemeState(nextTheme);
    setMounted(true);
  }, [defaultTheme]);

  React.useEffect(() => {
    if (!mounted) return;

    const computeResolved = () => {
      if (theme === "system") {
        return enableSystem ? getSystemTheme() : "light";
      }
      return theme;
    };

    const nextResolved = computeResolved();
    setResolvedTheme(nextResolved);
    applyThemeToDocument(attribute, nextResolved);

    if (theme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, attribute, enableSystem, mounted]);

  React.useEffect(() => {
    if (!enableSystem || theme !== "system" || typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const nextResolved = getSystemTheme();
      setResolvedTheme(nextResolved);
      applyThemeToDocument(attribute, nextResolved);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, attribute, enableSystem]);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = React.useMemo<ThemeProviderContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeProviderContext);

  if (!ctx) {
    return {
      theme: "system" as Theme,
      setTheme: () => {},
      resolvedTheme: "light" as const,
    };
  }

  return ctx;
}
