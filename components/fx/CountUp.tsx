"use client";

import { useEffect, useRef } from "react";

// Count-up number that starts when it scrolls into view: easeOutQuart
// over ~1.4s after an optional delay. The server-rendered text is the
// final value, so no-JS and reduced-motion still show the real number;
// the animation only rewrites the text node while running.
export default function CountUp({
  to,
  suffix = "",
  delay = 0,
  duration = 1400,
  className = "",
}: {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = `${Math.round(to * eased)}${suffix}`;
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = `${to}${suffix}`;
    };
  }, [to, suffix, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
