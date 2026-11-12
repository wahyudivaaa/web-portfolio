"use client";

import { useEffect, useRef } from "react";

// Scroll-scrub statement: each word starts dimmed and lights up as the
// paragraph travels through the viewport, tied directly to scroll
// progress (not a one-shot reveal). Reduced motion renders it fully lit.
export default function ScrubText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const litRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll(".scrub__w").forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const words = el.querySelectorAll(".scrub__w");
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(
        1,
        Math.max(0, (vh * 0.86 - r.top) / (r.height + vh * 0.28))
      );
      const lit = Math.round(p * words.length);
      if (lit === litRef.current) return;
      const from = Math.min(lit, litRef.current);
      const to = Math.max(lit, litRef.current);
      for (let i = from; i < to; i++) {
        words[i]?.classList.toggle("is-lit", i < lit);
      }
      litRef.current = lit;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const words = text.split(" ").filter(Boolean);
  return (
    <p ref={ref} className={`scrub ${className}`.trim()}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="scrub__w">{w}</span>{" "}
        </span>
      ))}
    </p>
  );
}
