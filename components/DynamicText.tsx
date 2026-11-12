"use client";

import { useEffect, useRef, useState } from "react";

// Small date-driven text islands. Each mirrors the old main.js behaviour:
// the server renders exactly what the static HTML had (empty span / the
// literal "2+" placeholder), and the value is filled in after mount — so
// there is no hydration mismatch and no stale prerendered number.

export function AgeText() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const birthDate = new Date("2004-06-15");
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    el.textContent = `${age} years old`;
  }, []);
  return <span id="age" ref={ref}></span>;
}

export function ExperienceYears() {
  // Static HTML shipped "2+"; main.js calculateExperience() replaces it.
  // Now counts up to the computed value when the stat scrolls into view.
  const ref = useRef<HTMLSpanElement>(null);
  const [years, setYears] = useState(2);
  useEffect(() => {
    const startDate = new Date("2022-06-01");
    const currentDate = new Date();
    let y = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    if (months < 0) y -= 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-mount fill-in over the static placeholder, mirroring main.js
    setYears(y);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${years}+`;
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / 1400, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = `${Math.round(years * eased)}+`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [years]);
  return (
    <span className="stat-number" ref={ref}>
      {years}+
    </span>
  );
}

export function FooterYear() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(new Date().getFullYear());
    }
  }, []);
  return <span id="currentYear" ref={ref}></span>;
}
