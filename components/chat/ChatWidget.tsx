"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

// Port of the v16 chatbot.js class. Same behaviour: user messages are plain
// text; bot replies go marked -> DOMPurify -> enhance (external-link
// hardening, table scroll wrappers, code bars with copy buttons, KaTeX
// auto-render); conversation is POSTed to /api/chat capped at the last 8
// messages; history is capped at 12 entries.

type ChatMessage = { role: "user" | "assistant"; content: string };
type UiMessage = ChatMessage & { id: number };

const GREETING =
  "Halo! Saya AI Assistant untuk portfolio Wahyu Diva. Saya siap membantu menjawab seputar profil, keahlian, dan proyek Wahyu, maupun topik teknologi umum. Silakan tanyakan apa saja!";

const ERROR_MESSAGE =
  "Maaf, koneksi ke AI sedang bermasalah. Silakan coba lagi sebentar lagi.";

function escapeHtml(src: string): string {
  return src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string): string {
  const src = String(text || "");
  try {
    const rawHtml = marked.parse(src, { gfm: true, breaks: true }) as string;
    return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ["target", "rel"] });
  } catch (e) {
    console.error("Markdown render failed, falling back:", e);
  }
  // Fallback if the render pipeline fails: escaped plain text.
  return escapeHtml(src).replace(/\n/g, "<br>");
}

function enhanceRenderedContent(root: HTMLElement) {
  // External links open safely in a new tab.
  root.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  // Tables get a horizontal-scroll wrapper (chat panel is narrow).
  root.querySelectorAll("table").forEach((table) => {
    const wrap = document.createElement("div");
    wrap.className = "md-table-wrap";
    table.parentNode?.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  // Code blocks get a header with the language + a copy button.
  root.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    let lang = "";
    if (code && code.className) {
      const m = code.className.match(/language-([\w-]+)/);
      if (m) lang = m[1];
    }
    const bar = document.createElement("div");
    bar.className = "code-bar";
    const label = document.createElement("span");
    label.className = "code-lang";
    label.textContent = lang || "code";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      const text = code ? code.innerText : pre.innerText;
      const done = () => {
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
    bar.appendChild(label);
    bar.appendChild(btn);
    pre.parentNode?.insertBefore(bar, pre);
    pre.classList.add("has-code-bar");
  });

  // LaTeX math via KaTeX auto-render.
  try {
    renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  } catch {
    /* math stays as-is */
  }
}

function BotMessage({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = renderMarkdown(text);
    enhanceRenderedContent(el);
  }, [text]);
  return <div className="message bot-message" ref={ref} />;
}

let nextId = 1;

export default function ChatWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: 0, role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const historyRef = useRef<ChatMessage[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to the latest message, like the class implementation did.
  useEffect(() => {
    const c = messagesRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [messages, typing]);

  // Focus the input shortly after opening, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Abort any in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = async (raw?: string) => {
    const message = (raw ?? input).trim();
    if (!message) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId++, role: "user", content: message },
    ]);
    setInput("");
    setTyping(true);
    historyRef.current.push({ role: "user", content: message });

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current.slice(-8) }),
        signal: ctrl.signal,
      });
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };
      if (!response.ok || !data.reply) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", content: data.reply as string },
      ]);
      historyRef.current.push({ role: "assistant", content: data.reply });
      if (historyRef.current.length > 12) {
        historyRef.current = historyRef.current.slice(-12);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      console.error("Chat error:", error);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", content: ERROR_MESSAGE },
      ]);
    }
  };

  return (
    <div
      className={`chatbot-container${open ? " active" : ""}`}
      role="dialog"
      aria-label="AI Assistant"
      aria-hidden={!open}
    >
      <div className="chatbot-header">
        <div className="bot-profile">
          <div className="bot-avatar">
            <i className="fas fa-robot" aria-hidden="true"></i>
          </div>
          <div className="bot-details">
            <span className="bot-name">AI Assistant</span>
          </div>
        </div>
        <button
          className="close-chat"
          type="button"
          aria-label="Close chat window"
          onClick={onClose}
        >
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      <div className="chat-quick-suggestions">
        {["Tentang Wahyu", "Keahlian Utama", "Proyek FlashPlay"].map(
          (chip) => (
            <button
              key={chip}
              className="suggestion-chip"
              type="button"
              onClick={() => sendMessage(chip)}
            >
              {chip}
            </button>
          )
        )}
      </div>

      <div className="chatbot-messages" aria-live="polite" ref={messagesRef}>
        {messages.map((m) =>
          m.role === "assistant" ? (
            <BotMessage key={m.id} text={m.content} />
          ) : (
            <div key={m.id} className="message user-message">
              {m.content}
            </div>
          )
        )}
        {typing && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          id="chatInput"
          placeholder="Ask me anything..."
          aria-label="Type your message"
          autoComplete="off"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="send-message"
          type="button"
          aria-label="Send message"
          onClick={() => sendMessage()}
        >
          <i className="fas fa-arrow-up" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
