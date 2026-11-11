/**
 * Portfolio AI Assistant (Redesign v16)
 * - Talks to the server-side proxy at /api/chat (keys never reach the browser).
 * - Bot replies are rendered as full Markdown (marked + DOMPurify):
 *   headings, bold/italic, lists, tables, code blocks with copy button,
 *   blockquotes, links, images, and LaTeX math via KaTeX auto-render.
 * - User messages stay plain text (textContent) by design.
 */
class Chatbot {
  constructor() {
    this.toggle = document.querySelector(".chatbot-toggle");
    this.container = document.querySelector(".chatbot-container");
    this.closeBtn = document.querySelector(".close-chat");
    this.input = document.querySelector("#chatInput");
    this.sendBtn = document.querySelector(".send-message");
    this.messagesContainer = document.querySelector(".chatbot-messages");

    this.apiEndpoint = "/api/chat";
    this.conversationHistory = [];

    this.initEventListeners();
    this.addMessage(
      "Halo! Saya AI Assistant untuk portfolio Wahyu Diva. Saya siap membantu menjawab seputar profil, keahlian, dan proyek Wahyu, maupun topik teknologi umum. Silakan tanyakan apa saja!",
      "bot"
    );
  }

  initEventListeners() {
    this.toggle.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat());
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.container.classList.contains("active")) {
        this.toggleChat();
      }
    });

    const chips = document.querySelectorAll(".suggestion-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const text = chip.textContent.trim();
        if (text) {
          this.input.value = text;
          this.sendMessage();
        }
      });
    });
  }

  toggleChat() {
    const isActive = this.container.classList.toggle("active");
    if (this.toggle) {
      this.toggle.classList.toggle("active", isActive);
    }
    this.container.setAttribute("aria-hidden", (!isActive).toString());
    if (isActive) {
      setTimeout(() => {
        if (this.input) this.input.focus();
      }, 250);
    }
  }

  addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${type}-message`);
    if (type === "bot") {
      messageDiv.innerHTML = this.renderMarkdown(text);
      this.enhanceRenderedContent(messageDiv);
    } else {
      messageDiv.textContent = text;
    }
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return messageDiv;
  }

  // ---- Markdown rendering -------------------------------------------------
  renderMarkdown(text) {
    const src = String(text || "");
    if (window.marked && window.DOMPurify) {
      try {
        const rawHtml = window.marked.parse(src, {
          gfm: true,
          breaks: true,
          headerIds: false,
          mangle: false,
        });
        return window.DOMPurify.sanitize(rawHtml, {
          ADD_ATTR: ["target", "rel"],
        });
      } catch (e) {
        console.error("Markdown render failed, falling back:", e);
      }
    }
    // Fallback if the CDN libraries failed to load: escaped plain text.
    const div = document.createElement("div");
    div.textContent = src;
    return div.innerHTML.replace(/\n/g, "<br>");
  }

  enhanceRenderedContent(root) {
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
      table.parentNode.insertBefore(wrap, table);
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
      pre.parentNode.insertBefore(bar, pre);
      pre.classList.add("has-code-bar");
    });

    // LaTeX math, when KaTeX auto-render is available.
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(root, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        /* math stays as-is */
      }
    }
  }

  addTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("typing-indicator");
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      indicator.appendChild(dot);
    }
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return indicator;
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    this.addMessage(message, "user");
    this.input.value = "";
    const typingIndicator = this.addTypingIndicator();

    this.conversationHistory.push({ role: "user", content: message });

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: this.conversationHistory.slice(-8),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      this.messagesContainer.removeChild(typingIndicator);
      this.addMessage(data.reply, "bot");
      this.conversationHistory.push({
        role: "assistant",
        content: data.reply,
      });
      if (this.conversationHistory.length > 12) {
        this.conversationHistory = this.conversationHistory.slice(-12);
      }
    } catch (error) {
      console.error("Chat error:", error);
      this.messagesContainer.removeChild(typingIndicator);
      this.addMessage(
        "Maaf, koneksi ke AI sedang bermasalah. Silakan coba lagi sebentar lagi.",
        "bot"
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Chatbot();
});
