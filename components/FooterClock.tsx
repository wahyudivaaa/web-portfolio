"use client";

import { useEffect, useRef } from "react";

// Port of the v15 footer clock IIFE in main.js: live Asia/Makassar (WITA)
// time, ticking every second. Server renders the same "--:--:--"
// placeholder the static HTML had; the effect fills it on mount.
export default function FooterClock() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Makassar",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      el.textContent = fmt.format(new Date());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span id="footerClock" ref={ref}>
      --:--:--
    </span>
  );
}
