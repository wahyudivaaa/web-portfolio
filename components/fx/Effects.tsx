"use client";

import { useEffect, useRef } from "react";

// Page-level scroll & pointer effects, all driven from one rAF-throttled
// scroll listener plus pointer handlers:
//  - .scroll-progress bar scaleX (reading progress)
//  - .timeline-fill scaleY (rail fill per Experience/Education timeline)
//  - skill meters: bar fill + percentage count-up when a skill row
//    scrolls into view (values from data-width / data-target)
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

    // Skill meters: fill the bar and count the percentage up once the
    // row scrolls into view.
    const skillItems = [...document.querySelectorAll<HTMLElement>(".skill-item")];
    if (skillItems.length) {
      const animateSkill = (item: HTMLElement) => {
        const bar = item.querySelector<HTMLElement>(".skill-progress");
        const label = item.querySelector<HTMLElement>(".skill-percentage");
        const target = Number(bar?.dataset.width || label?.dataset.target || 0);
        if (!target) return;
        if (bar) bar.style.width = `${target}%`;
        if (!label) return;
        if (reduced) {
          label.textContent = `${target}%`;
          return;
        }
        const t0 = performance.now();
        const dur = 1200;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          label.textContent = `${Math.round(target * eased)}%`;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              animateSkill(en.target as HTMLElement);
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      skillItems.forEach((item) => io.observe(item));
      cleanups.push(() => io.disconnect());
    }

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
