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
  const [text, setText] = useState("2+");
  useEffect(() => {
    const startDate = new Date("2022-06-01");
    const currentDate = new Date();
    let years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    if (months < 0) years -= 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-mount fill-in over the static placeholder, mirroring main.js
    setText(`${years}+`);
  }, []);
  return <span className="stat-number">{text}</span>;
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
