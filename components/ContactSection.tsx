"use client";

import { useEffect, useState } from "react";
import SplitText from "./fx/SplitText";
import Magnetic from "./fx/Magnetic";

const EMAIL = "wahyudiva2004@gmail.com";

// Full-viewport contact finale: numbered section header, a giant split
// title with a serif-italic accent line, the email as the primary
// magnetic CTA, and a copy-email button with "Copied" feedback.
export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="section-wrapper contact-section">
      <div className="app-container">
        <div className="glass-panel contact-panel">
          <div className="section-header">
            <span className="section-eyebrow">
              <span className="section-index">06</span>
              Get in Touch
            </span>
            <h2 className="contact-title">
              <SplitText text="Let's build" />{" "}
              <span className="serif-accent">
                <SplitText text="something great" delay={140} />
              </span>
            </h2>
          </div>

          <p className="contact-desc">
            Open to collaborations, new projects, and full-time
            opportunities — if you have something in mind, my inbox is
            always open.
          </p>

          <div className="contact-actions">
            <Magnetic>
              <a href={`mailto:${EMAIL}`} className="btn-apple-primary contact-email-btn">
                <span>{EMAIL}</span>
                <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </Magnetic>
            <button
              type="button"
              className="btn-apple-secondary contact-copy-btn"
              onClick={copy}
            >
              <i className={copied ? "fas fa-check" : "far fa-copy"} aria-hidden="true"></i>
              <span>{copied ? "Copied to clipboard" : "Copy email"}</span>
            </button>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {copied ? "Copied to clipboard" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
