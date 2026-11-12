"use client";

import { useEffect } from "react";

// Imperative port of main.js initRealGlass(): true backdrop-filter
// refraction via per-element SVG displacement maps. Chromium + fine pointer
// + >=769px + no reduced-transparency only; every other browser keeps the
// frost fallback from the CSS. All DOM it creates is removed on cleanup.
export default function RealGlass() {
  useEffect(() => {
    const ua = (
      navigator as Navigator & {
        userAgentData?: { brands: Array<{ brand: string; version: string }> };
      }
    ).userAgentData;
    const isChromium = !!(
      ua &&
      ua.brands &&
      ua.brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
    );
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const desktop = window.matchMedia("(min-width: 769px)").matches;
    const reducedTransparency = window.matchMedia(
      "(prefers-reduced-transparency: reduce)"
    ).matches;
    if (!isChromium || !finePointer || !desktop || reducedTransparency) return;

    const island = document.querySelector<HTMLElement>(".dynamic-island");
    const lens = document.querySelector<HTMLElement>(".island-lens");
    if (!island || !lens) return;

    const cleanups: Array<() => void> = [];
    document.documentElement.classList.add("has-refract");
    cleanups.push(() =>
      document.documentElement.classList.remove("has-refract")
    );

    // Frost becomes a sibling layer so the lens backdrop is not trapped
    const frost = document.createElement("div");
    frost.className = "island-frost";
    frost.setAttribute("aria-hidden", "true");
    island.prepend(frost);
    cleanups.push(() => frost.remove());

    // Clear-lens window: a lens-shaped hole is cut out of the frost so the
    // lens refracts the RAW page backdrop, while the rest stays frosted.
    const svgNS0 = "http://www.w3.org/2000/svg";
    const clipSvg = document.createElementNS(svgNS0, "svg");
    clipSvg.setAttribute("width", "0");
    clipSvg.setAttribute("height", "0");
    clipSvg.setAttribute("aria-hidden", "true");
    clipSvg.style.position = "absolute";
    const clipPath = document.createElementNS(svgNS0, "clipPath");
    clipPath.setAttribute("id", "frost-clip");
    const clipPathPath = document.createElementNS(svgNS0, "path");
    clipPathPath.setAttribute("clip-rule", "evenodd");
    clipPath.appendChild(clipPathPath);
    clipSvg.appendChild(clipPath);
    document.body.appendChild(clipSvg);
    frost.style.clipPath = "url(#frost-clip)";
    cleanups.push(() => clipSvg.remove());

    const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) =>
      `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} ` +
      `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} ` +
      `V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;

    const updateHole = () => {
      const ir = island.getBoundingClientRect();
      const lr = lens.getBoundingClientRect();
      const x = lr.left - ir.left;
      const y = lr.top - ir.top;
      const outer = `M -2 -2 H ${ir.width + 2} V ${ir.height + 2} H -2 Z`;
      clipPathPath.setAttribute(
        "d",
        `${outer} ${roundedRectPath(x, y, lr.width, lr.height, lr.height / 2)}`
      );
    };
    updateHole();

    // Track the hole per-frame while the lens slides (called from moveLens)
    let holeRaf: number | null = null;
    let holeUntil = 0;
    window.__glassTrackHole = () => {
      holeUntil = performance.now() + 700;
      if (holeRaf) return;
      const step = () => {
        updateHole();
        if (performance.now() < holeUntil) {
          holeRaf = requestAnimationFrame(step);
        } else {
          holeRaf = null;
          updateHole();
        }
      };
      holeRaf = requestAnimationFrame(step);
    };
    const islandObserver = new ResizeObserver(() => updateHole());
    islandObserver.observe(island);
    cleanups.push(() => {
      islandObserver.disconnect();
      if (holeRaf) cancelAnimationFrame(holeRaf);
      delete window.__glassTrackHole;
    });

    // SVG filter defs (one filter per refractive element)
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);
    document.body.appendChild(svg);
    cleanups.push(() => svg.remove());

    type FilterRefs = {
      id: string;
      img: SVGElement;
      dm: SVGElement;
    };
    const makeFilter = (id: string): FilterRefs => {
      const f = document.createElementNS(svgNS, "filter");
      f.setAttribute("id", id);
      f.setAttribute("color-interpolation-filters", "sRGB");
      f.setAttribute("x", "-8%");
      f.setAttribute("y", "-8%");
      f.setAttribute("width", "116%");
      f.setAttribute("height", "116%");
      const img = document.createElementNS(svgNS, "feImage");
      img.setAttribute("preserveAspectRatio", "none");
      img.setAttribute("result", "map");
      const dm = document.createElementNS(svgNS, "feDisplacementMap");
      dm.setAttribute("in", "SourceGraphic");
      dm.setAttribute("in2", "map");
      dm.setAttribute("xChannelSelector", "R");
      dm.setAttribute("yChannelSelector", "G");
      f.appendChild(img);
      f.appendChild(dm);
      defs.appendChild(f);
      return { id, img, dm };
    };

    // Displacement map: R/G encode the sampling offset along the edge
    // normal. Centre stays neutral (128,128) = zero displacement.
    const buildMap = (W: number, H: number, radius: number, bezel: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
      const imgData = ctx.createImageData(W, H);
      const d = imgData.data;
      const cx = W / 2;
      const cy = H / 2;
      const hx = W / 2;
      const hy = H / 2;
      const r = Math.min(radius, hx, hy);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const px = x + 0.5 - cx;
          const py = y + 0.5 - cy;
          const qx = Math.abs(px) - (hx - r);
          const qy = Math.abs(py) - (hy - r);
          const ax = Math.max(qx, 0);
          const ay = Math.max(qy, 0);
          const distIn = -(Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r);
          let R = 128;
          let G = 128;
          if (distIn < bezel) {
            let nx: number;
            let ny: number;
            if (qx > 0 && qy > 0) {
              const l = Math.hypot(ax, ay) || 1;
              nx = (Math.sign(px) * ax) / l;
              ny = (Math.sign(py) * ay) / l;
            } else if (qx > qy) {
              nx = Math.sign(px);
              ny = 0;
            } else {
              nx = 0;
              ny = Math.sign(py);
            }
            const t = 1 - distIn / bezel;
            const m = 1 - Math.pow(1 - t, 3);
            R = 128 + nx * m * 127;
            G = 128 + ny * m * 127;
          }
          const i = (y * W + x) * 4;
          d[i] = R;
          d[i + 1] = G;
          d[i + 2] = 128;
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL();
    };

    const attach = (
      el: HTMLElement,
      filter: FilterRefs,
      scale: number,
      bezelRatio: number
    ) => {
      let lastKey = "";
      let timer: ReturnType<typeof setTimeout> | null = null;
      const apply = () => {
        const rect = el.getBoundingClientRect();
        const W = Math.max(2, Math.round(rect.width));
        const H = Math.max(2, Math.round(rect.height));
        const key = `${W}x${H}`;
        if (key === lastKey) return;
        lastKey = key;
        const bezel = Math.max(6, Math.min(18, H * bezelRatio));
        filter.img.setAttribute("href", buildMap(W, H, H / 2, bezel));
        filter.img.setAttribute("x", "0");
        filter.img.setAttribute("y", "0");
        filter.img.setAttribute("width", String(W));
        filter.img.setAttribute("height", String(H));
        filter.dm.setAttribute("scale", String(scale));
        el.style.backdropFilter = `url("#${filter.id}") saturate(1.6)`;
      };
      const schedule = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(apply, 80);
      };
      apply();
      const ro = new ResizeObserver(schedule);
      ro.observe(el);
      cleanups.push(() => {
        ro.disconnect();
        if (timer) clearTimeout(timer);
        el.style.backdropFilter = "";
      });
    };

    attach(lens, makeFilter("glass-lens"), 26, 0.42);
    const themeBtn = document.querySelector<HTMLElement>("#themeToggle");
    if (themeBtn) attach(themeBtn, makeFilter("glass-btn-theme"), 12, 0.45);
    const chatBtn = document.querySelector<HTMLElement>(".chat-trigger-btn");
    if (chatBtn) attach(chatBtn, makeFilter("glass-btn-chat"), 14, 0.4);
    const fab = document.querySelector<HTMLElement>(".chatbot-toggle");
    if (fab) attach(fab, makeFilter("glass-fab"), 16, 0.45);

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
