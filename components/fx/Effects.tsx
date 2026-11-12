"use client";

import { useEffect, useRef } from "react";

// Page-level scroll & pointer effects, all driven from one rAF-throttled
// scroll listener plus pointer handlers:
//  - .scroll-progress bar scaleX (reading progress)
//  - .timeline-fill scaleY (rail fill per Experience/Education timeline)
//  - project stack: on wide screens each .project-card scales down
//    slightly and dims as the next card sticks over it
//  - .spotlight cards: --mx/--my for the cursor-tracking glow
//  - cursor label pill for elements carrying [data-cursor]
export default function Effects() {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const timelines = [...document.querySelectorAll<HTMLElement>(".timeline")];
    const fills = timelines.map((t) => t.querySelector<HTMLElement>(".timeline-fill"));
    const stackCards = [...document.querySelectorAll<HTMLElement>(".projects-grid .project-card")];
    const stackMq = window.matchMedia("(min-width: 1024px)");

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const max = doc.scrollHeight - vh;
      if (progress) {
        progress.style.transform = `scaleX(${max > 0 ? (window.scrollY / max).toFixed(4) : 0})`;
      }
      timelines.forEach((t, i) => {
        const fill = fills[i];
        if (!fill) return;
        const r = t.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
        fill.style.transform = `scaleY(${p.toFixed(4)})`;
      });
      if (!reduced && stackMq.matches) {
        stackCards.forEach((card, i) => {
          const next = stackCards[i + 1];
          if (!next) {
            card.style.setProperty("--stack-scale", "1");
            card.style.setProperty("--shade", "0");
            return;
          }
          const base = 96 + i * 16;
          const nextTop = next.getBoundingClientRect().top;
          const p = Math.min(1, Math.max(0, 1 - (nextTop - base) / (vh - base)));
          card.style.setProperty("--stack-scale", (1 - p * 0.05).toFixed(4));
          card.style.setProperty("--shade", (p * 0.55).toFixed(3));
        });
      }
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
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    // Spotlight glow tracking
    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>(".spotlight").forEach((card) => {
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        card.addEventListener("pointermove", onMove);
        cleanups.push(() => card.removeEventListener("pointermove", onMove));
      });
    }

    // Cursor label pill
    const label = labelRef.current;
    if (label && fine && !reduced) {
      const text = label.firstElementChild as HTMLElement;
      let raf = 0;
      let cx = 0;
      let cy = 0;
      let tx = 0;
      let ty = 0;
      let visible = false;
      const tick = () => {
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        label.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
        raf =
          visible || Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1
            ? requestAnimationFrame(tick)
            : 0;
      };
      const hide = () => {
        visible = false;
        label.classList.remove("is-visible");
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const host = (e.target as HTMLElement).closest?.("[data-cursor]");
        if (!host) {
          if (visible) hide();
          return;
        }
        tx = e.clientX;
        ty = e.clientY;
        if (!visible) {
          visible = true;
          cx = tx;
          cy = ty;
          text.textContent = (host as HTMLElement).dataset.cursor || "";
          label.classList.add("is-visible");
        }
        if (!raf) raf = requestAnimationFrame(tick);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("pointerdown", hide);
      document.documentElement.addEventListener("pointerleave", hide);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", hide);
        window.removeEventListener("pointerdown", hide);
        document.documentElement.removeEventListener("pointerleave", hide);
        cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={labelRef} className="cursor-label" aria-hidden="true">
      <span className="cursor-label__text"></span>
    </div>
  );
}
