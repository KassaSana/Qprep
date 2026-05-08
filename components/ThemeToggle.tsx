"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(saved);
    setMounted(true);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => applyTheme(theme);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const icon =
    (theme === "system" ? getSystemTheme() : theme) === "dark" ? Moon : Sun;
  const label =
    theme === "system"
      ? "Theme: system"
      : theme === "dark"
        ? "Theme: dark"
        : "Theme: light";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={label}
      title={label}
      onClick={() => {
        const next: Theme =
          theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
        setTheme(next);
        localStorage.setItem("theme", next);
        applyTheme(next);
      }}
      className="w-9 px-0"
    >
      {mounted ? (
        <span className="grid place-items-center">
          {icon === Moon ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </span>
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  );
}

