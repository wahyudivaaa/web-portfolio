"use client";

import { useEffect } from "react";

// Imperative port of main.js initNavigation() + initPointerSpecular():
// scrollspy, island scrolled/compact states, the sliding glass lens,
// the mobile menu sheet, the header chat trigger, and the pointer-reactive
// specular on the island. Runs once after mount; full cleanup on unmount.
export default function NavigationEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = (
      target: Window | Document | HTMLElement,
      type: string,
      handler: EventListener,
      opts?: AddEventListenerOptions
    ) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    const mobileToggle = document.getElementById("mobileMenuToggle");
    const mobileSheet = document.getElementById("mobileMenuSheet");
    const island = document.querySelector<HTMLElement>(".dynamic-island");
    const navLinks = document.querySelectorAll(".island-link, .sheet-link");
    const sections = document.querySelectorAll("section[id]");
    const chatTrigger = document.querySelector(".chat-trigger-btn");

    // ---- Scrollspy, island elevation & compact-on-scroll -----------------
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const scrollPos = window.scrollY + 200;
      const y = window.scrollY;

      if (island) {
        if (y > 30) {
          island.classList.add("island-scrolled");
        } else {
          island.classList.remove("island-scrolled");
        }
        if (y > 160 && y > lastScrollY + 4) {
          island.classList.add("island-compact");
        } else if (y < lastScrollY - 4 || y <= 160) {
          island.classList.remove("island-compact");
        }
      }
      lastScrollY = y;

      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const id = section.getAttribute("id");
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    };
    on(window, "scroll", onScroll, { passive: true });
    onScroll();

    // ---- Liquid Glass tab lens -------------------------------------------
    const linksTrack = document.querySelector<HTMLElement>(".island-links");
    const lens = document.querySelector<HTMLElement>(".island-lens");
    const islandLinks = document.querySelectorAll(".island-link");

    if (linksTrack && lens && islandLinks.length) {
      const trackHole = () => {
        if (window.__glassTrackHole) window.__glassTrackHole();
      };
      const moveLens = (target: HTMLElement | null, animate = true) => {
        if (!target || linksTrack.offsetParent === null) {
          lens.style.opacity = "0";
          return;
        }
        if (!animate) lens.style.transition = "none";
        lens.style.width = `${target.offsetWidth}px`;
        lens.style.transform = `translateX(${target.offsetLeft}px)`;
        lens.style.opacity = "1";
        trackHole();
        if (!animate) {
          void lens.offsetWidth;
          lens.style.transition = "";
        }
      };
      const lensToActive = (animate = true) =>
        moveLens(
          linksTrack.querySelector<HTMLElement>(".island-link.active"),
          animate
        );

      const lensObserver = new MutationObserver(() => lensToActive());
      islandLinks.forEach((link) => {
        lensObserver.observe(link, {
          attributes: true,
          attributeFilter: ["class"],
        });
        const el = link as HTMLElement;
        const enter = () => moveLens(el);
        const click = () => moveLens(el);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("click", click);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("click", click);
        });
      });
      cleanups.push(() => lensObserver.disconnect());

      const leave = () => lensToActive();
      linksTrack.addEventListener("mouseleave", leave);
      cleanups.push(() => linksTrack.removeEventListener("mouseleave", leave));

      const onResize = () => lensToActive(false);
      const onLoad = () => lensToActive(false);
      on(window, "resize", onResize);
      on(window, "load", onLoad);
      const raf = requestAnimationFrame(() => lensToActive(false));
      const t = setTimeout(() => lensToActive(false), 350);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      });
    }

    // ---- Mobile menu sheet -------------------------------------------------
    if (mobileToggle && mobileSheet) {
      const closeMenu = () => {
        mobileSheet.classList.remove("open");
        mobileSheet.setAttribute("aria-hidden", "true");
        mobileToggle.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
      };
      const toggleMenu = () => {
        const isOpen = mobileSheet.classList.contains("open");
        if (isOpen) {
          closeMenu();
        } else {
          mobileSheet.classList.add("open");
          mobileSheet.setAttribute("aria-hidden", "false");
          mobileToggle.classList.add("active");
          mobileToggle.setAttribute("aria-expanded", "true");
        }
      };
      const onToggleClick = (e: Event) => {
        e.stopPropagation();
        toggleMenu();
      };
      mobileToggle.addEventListener("click", onToggleClick);
      cleanups.push(() =>
        mobileToggle.removeEventListener("click", onToggleClick)
      );

      mobileSheet.querySelectorAll(".sheet-link").forEach((link) => {
        link.addEventListener("click", closeMenu);
        cleanups.push(() => link.removeEventListener("click", closeMenu));
      });

      const onDocClick = (e: Event) => {
        const target = e.target as Node;
        if (!mobileSheet.contains(target) && !mobileToggle.contains(target)) {
          if (mobileSheet.classList.contains("open")) closeMenu();
        }
      };
      const onDocKey = (e: Event) => {
        if (
          (e as KeyboardEvent).key === "Escape" &&
          mobileSheet.classList.contains("open")
        ) {
          closeMenu();
        }
      };
      on(document, "click", onDocClick);
      on(document, "keydown", onDocKey);
    }

    // ---- Header chat trigger ------------------------------------------------
    if (chatTrigger) {
      const onChatTrigger = () => {
        const chatbotToggle = document.querySelector(".chatbot-toggle");
        if (chatbotToggle) {
          (chatbotToggle as HTMLElement).click();
        }
      };
      chatTrigger.addEventListener("click", onChatTrigger);
      cleanups.push(() =>
        chatTrigger.removeEventListener("click", onChatTrigger)
      );
    }

    // ---- Pointer-reactive specular (fine pointers only) ---------------------
    if (
      island &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      let current = 50;
      let target = 50;
      let rafId: number | null = null;
      const tick = () => {
        current += (target - current) * 0.12;
        island.style.setProperty("--light-x", `${current.toFixed(2)}%`);
        if (Math.abs(target - current) > 0.05) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      };
      const onPointerMove = (e: PointerEvent) => {
        const r = island.getBoundingClientRect();
        target = Math.min(
          100,
          Math.max(0, ((e.clientX - r.left) / r.width) * 100)
        );
        if (!rafId) rafId = requestAnimationFrame(tick);
      };
      island.addEventListener("pointermove", onPointerMove);
      cleanups.push(() => {
        island.removeEventListener("pointermove", onPointerMove);
        if (rafId) cancelAnimationFrame(rafId);
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
