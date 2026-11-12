"use client";

import { useState } from "react";

// Infinite tech marquee directly under the hero: logo-less stack names
// with brand icons, separated by accent dots, with edge fade masks and
// a pause/play toggle. The track is duplicated 4x and translated -50%
// for a seamless loop; reduced motion turns it into a static row.
const ITEMS: Array<{ name: string; icon?: string; img?: string }> = [
  { name: "PHP", icon: "fab fa-php" },
  { name: "JavaScript", icon: "fab fa-js" },
  { name: "TypeScript", icon: "fas fa-code" },
  { name: "React", icon: "fab fa-react" },
  { name: "Next.js", icon: "fas fa-n" },
  { name: "Vue.js", icon: "fab fa-vuejs" },
  { name: "Node.js", icon: "fab fa-node-js" },
  { name: "Go", icon: "fab fa-golang" },
  { name: "Bun", icon: "fas fa-bolt" },
  { name: "MySQL", img: "/images/mysql.svg" },
  { name: "SQL Server", img: "/images/sql-server.svg" },
  { name: "SQLite", icon: "fas fa-database" },
  { name: "HTML5", icon: "fab fa-html5" },
  { name: "CSS3", icon: "fab fa-css3-alt" },
  { name: "Git & GitHub", icon: "fab fa-git-alt" },
];

export default function TechMarquee() {
  const [paused, setPaused] = useState(false);
  const row = [...ITEMS, ...ITEMS];
  return (
    <section
      className={`tech-marquee${paused ? " is-paused" : ""}`}
      aria-label="Technology stack"
    >
      <div className="tech-marquee__viewport">
        <ul className="tech-marquee__track">
          {[0, 1].map((half) => (
            <li key={half} className="tech-marquee__half" aria-hidden={half === 1}>
              {row.map((item, i) => (
                <span key={`${item.name}-${i}`} className="tech-marquee__item">
                  {item.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.img} alt="" className="tech-marquee__img" />
                  ) : (
                    <i className={item.icon} aria-hidden="true"></i>
                  )}
                  {item.name}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="tech-marquee__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play tech stack animation" : "Pause tech stack animation"}
      >
        <i className={paused ? "fas fa-play" : "fas fa-pause"} aria-hidden="true"></i>
      </button>
    </section>
  );
}
