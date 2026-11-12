"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// The heavy widget (marked + DOMPurify + KaTeX) is code-split and only
// downloaded the first time a visitor opens the chat. Until then this
// loader renders just the floating launcher button — the same
// .chatbot-toggle the header trigger and the glass engine look for.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetLoader() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!loaded) setLoaded(true);
    setOpen((o) => !o);
  };

  return (
    <>
      {loaded && <ChatWidget open={open} onClose={() => setOpen(false)} />}
      <button
        className={`chatbot-toggle${open ? " active" : ""}`}
        type="button"
        aria-label="Toggle AI Assistant"
        title="Chat with AI Assistant"
        onClick={toggle}
      >
        <i className="fas fa-comments launcher-icon" aria-hidden="true"></i>
        <i className="fas fa-xmark launcher-close-icon" aria-hidden="true"></i>
        <span className="notification-dot" aria-hidden="true"></span>
      </button>
    </>
  );
}
