"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const subscribe = (onChange: () => void): (() => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): boolean =>
  document.documentElement.classList.contains("dark");
const getServerSnapshot = (): boolean => false;

export default function ThemeToggle() {
  const isDark: boolean = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleToggle = (): void => {
    const root: HTMLElement = document.documentElement;
    const next: boolean = !isDark;

    root.classList.add("theme-transition");
    root.classList.toggle("dark", next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);

    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage can be blocked; the theme just will not persist
    }
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleToggle}
      className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
