"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Port of main.js initAnimations(): the same GSAP from() tweens with
// ScrollTrigger, scoped to <main> via useGSAP so cleanup (ctx.revert)
// kills every tween/trigger on unmount. Renders the <main> element itself
// so no extra wrapper changes the layout.
export default function RevealAnimations({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      // Hero Entrance (copy children stagger, visual as one unit)
      gsap.from(".hero-copy > *, .hero-visual", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      // Hero Parallax Exit: the unified card drifts down and fades as it
      // scrolls out, so the hero feels attached to the scroll itself.
      gsap.to(".hero-unified-card", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
        y: 56,
        opacity: 0.35,
        ease: "none",
      });

      // Section Headers
      gsap.utils.toArray<HTMLElement>(".section-header").forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      });

      // About Cards
      gsap.from(".about-grid > *", {
        scrollTrigger: {
          trigger: ".about-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Skills Group Cards
      gsap.from(".skill-group-card", {
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Projects Cards
      gsap.from(".projects-grid .project-card", {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
      });

      // Experience & Education Timeline Items
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 26,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
        });
      });

      // Layout shifts as screenshots/fonts settle — refresh triggers once
      // everything has loaded, like the research recommends.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    },
    { scope }
  );

  return (
    <main id="main-content" ref={scope}>
      {children}
    </main>
  );
}
