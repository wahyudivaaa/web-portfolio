import type { CSSProperties } from "react";

// Split-text entrance: words (or chars) rise from below an overflow mask
// with a staggered ease-out, driven purely by CSS animation + the --d
// custom property. Server-rendered spans — no JS, no hydration cost.
// Screen readers get the plain text via the sr-only copy.
export default function SplitText({
  text,
  by = "words",
  delay = 0,
  spread,
  className = "",
}: {
  text: string;
  by?: "words" | "chars";
  delay?: number;
  spread?: number;
  className?: string;
}) {
  const words = text.split(" ").filter(Boolean);

  if (by === "chars") {
    const total = words.reduce((n, w) => n + [...w].length, 0);
    const span = spread ?? Math.min(total * 40, 380);
    let seen = 0;
    return (
      <span className={`split ${className}`.trim()}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, wi) => {
            const start = seen;
            seen += [...word].length;
            return (
              <span key={wi}>
                <span className="split__word">
                  {[...word].map((ch, ci) => {
                    const idx = total <= 1 ? 0 : (start + ci) / (total - 1);
                    const d = Math.round(delay + idx * span * (1 - idx * 0.25));
                    return (
                      <span key={ci} className="split__w">
                        <span
                          className="split__i"
                          style={{ "--d": `${d}ms` } as CSSProperties}
                        >
                          {ch}
                        </span>
                      </span>
                    );
                  })}
                </span>
                {wi < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      </span>
    );
  }

  const span = spread ?? Math.min(words.length * 60, 420);
  return (
    <span className={`split ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const idx = words.length <= 1 ? 0 : i / (words.length - 1);
          const d = Math.round(delay + idx * span * (1 - idx * 0.25));
          return (
            <span key={i}>
              <span className="split__w">
                <span
                  className="split__i"
                  style={{ "--d": `${d}ms` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </span>
  );
}
