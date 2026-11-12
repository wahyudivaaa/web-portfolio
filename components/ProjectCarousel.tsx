"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type Slide = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Port of one .project-carousel instance from main.js
// initProjectCarousels(): active-class slide switching, 4s auto-advance,
// arrows + dots (which reset the timer), touch swipe (>40px), pause on
// hover/touch. The effect depends on `index` so every slide change —
// manual or automatic — restarts the 4s timer, like startTimer() did.
export default function ProjectCarousel({
  name,
  slides,
}: {
  name: string;
  slides: Slide[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const count = slides.length;

  useEffect(() => {
    if (paused || lightbox !== null || count <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % count),
      4000
    );
    return () => clearInterval(id);
  }, [paused, index, count, lightbox]);

  // Lightbox: keyboard navigation (Esc / arrows) + page scroll lock.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((v) => (v === null ? v : (v + 1) % count));
      if (e.key === "ArrowLeft")
        setLightbox((v) => (v === null ? v : (v - 1 + count) % count));
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [lightbox, count]);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const openLightbox = (i: number) => {
    setLightbox(i);
    setPaused(true);
  };

  return (
    <>
    <div className="project-carousel-container">
      <div
        className="project-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0].screenX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const diff = e.changedTouches[0].screenX - touchStartX.current;
          if (Math.abs(diff) > 40) {
            if (diff > 0) prev();
            else next();
          }
          setPaused(false);
        }}
      >
        <button
          className="carousel-nav prev"
          type="button"
          aria-label={`Previous ${name} image`}
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div
              key={s.src}
              className={`carousel-item${i === index ? " active" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                loading="lazy"
                onClick={() => openLightbox(i)}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-nav next"
          type="button"
          aria-label={`Next ${name} image`}
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
        <button
          className="carousel-expand"
          type="button"
          aria-label={`Enlarge ${name} image`}
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(index);
          }}
        >
          <i className="fas fa-expand" aria-hidden="true"></i>
        </button>
        <div
          className="carousel-dots"
          role="tablist"
          aria-label={`${name} slides`}
        >
          {slides.map((s, i) => (
            <button
              key={s.src}
              className={`carousel-dot${i === index ? " active" : ""}`}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
            ></button>
          ))}
        </div>
      </div>
    </div>
    {lightbox !== null &&
      createPortal(
        <div
          className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`${name} screenshot preview`}
        onClick={() => setLightbox(null)}
      >
        <button
          className="lightbox-close"
          type="button"
          aria-label="Close preview"
          autoFocus
          onClick={() => setLightbox(null)}
        >
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
        <button
          className="lightbox-nav prev"
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox((lightbox - 1 + count) % count);
          }}
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <figure
          className="lightbox-stage"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slides[lightbox].src} alt={slides[lightbox].alt} />
          <figcaption>
            {slides[lightbox].alt} · {lightbox + 1} / {count}
          </figcaption>
        </figure>
        <button
          className="lightbox-nav next"
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox((lightbox + 1) % count);
          }}
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
        </div>,
        document.body
      )}
    </>
  );
}
