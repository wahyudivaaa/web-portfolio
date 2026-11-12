"use client";

import { useLayoutEffect, useRef } from "react";

// Port of the theme half of main.js initTheme(). The pre-paint resolution
// (saved value -> OS preference) happens in the inline script in the root
// layout; this component owns the toggle, the aria labels, OS-preference
// change tracking, and the StrictMode-dev re-apply (Next flash guide).
export default function ThemeToggle() {
  const btnRef = useRef<HTMLButtonElement>(null);

  const syncAria = (theme: string) => {
    const btn = btnRef.current;
    if (!btn) return;
    const isDark = theme === "dark";
    btn.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    btn.setAttribute(
      "title",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  };

  useLayoutEffect(() => {
    // Re-apply after React clears the attribute on the dev StrictMode
    // remount; in production this only syncs the toggle's aria state.
    let theme = document.documentElement.getAttribute("data-theme") || "dark";
    try {
      const saved = localStorage.getItem("theme");
      if (saved) {
        theme = saved;
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {
      /* localStorage unavailable */
    }
    syncAria(theme);

    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let hasSaved = false;
      try {
        hasSaved = !!localStorage.getItem("theme");
      } catch {
        /* ignore */
      }
      if (!hasSaved) {
        const auto = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", auto);
        syncAria(auto);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onClick = () => {
    const root = document.documentElement;
    const active = root.getAttribute("data-theme") || "dark";
    const next = active === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    syncAria(next);
  };

  return (
    <button
      ref={btnRef}
      id="themeToggle"
      className="island-btn theme-toggle-btn"
      type="button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={onClick}
    >
      <i className="fas fa-sun theme-icon-sun" aria-hidden="true"></i>
      <i className="fas fa-moon theme-icon-moon" aria-hidden="true"></i>
    </button>
  );
}
