import type { CSSProperties } from "react";
import Header from "@/components/Header";
import RevealAnimations from "@/components/RevealAnimations";
import RealGlass from "@/components/RealGlass";
import ProjectCarousel, { type Slide } from "@/components/ProjectCarousel";
import { AgeText, ExperienceYears, FooterYear } from "@/components/DynamicText";
import FooterClock from "@/components/FooterClock";
import ChatWidgetLoader from "@/components/chat/ChatWidgetLoader";
import SplitText from "@/components/fx/SplitText";
import Magnetic from "@/components/fx/Magnetic";
import CountUp from "@/components/fx/CountUp";
import ScrubText from "@/components/fx/ScrubText";
import Effects from "@/components/fx/Effects";
import TechMarquee from "@/components/TechMarquee";
import ContactSection from "@/components/ContactSection";

// All markup, class names and copy ported verbatim from the pre-migration
// static index.html (v17 state). Behaviour islands: RevealAnimations (GSAP),
// ProjectCarousel, DynamicText, FooterClock, ChatWidgetLoader, RealGlass.

const flashPlaySlides: Slide[] = [1, 2, 3, 4].map((n) => ({
  src: `/images/flashplay${n}.svg`,
  alt: `FlashPlay ${n}`,
  width: n === 1 ? 1897 : n === 2 ? 1901 : n === 3 ? 1898 : 1890,
  height: n === 1 ? 912 : n === 2 ? 903 : 906,
}));

const flashBotSlides: Slide[] = [1, 2, 3, 4].map((n) => ({
  src: `/images/flashbot${n}.svg`,
  alt: `Flash Bot ${n}`,
  width: n === 4 ? 1917 : 1919,
  height: n === 1 ? 907 : n === 2 ? 904 : n === 3 ? 909 : 906,
}));

const flashRouterSlides: Slide[] = [
  {
    src: "/images/flashrouter1.svg",
    alt: "FlashRouter console overview — traffic, endpoints, and system telemetry",
    width: 1600,
    height: 1000,
  },
  {
    src: "/images/flashrouter2.svg",
    alt: "FlashRouter Model Lab — interactive model playground",
    width: 1600,
    height: 1000,
  },
  {
    src: "/images/flashrouter3.svg",
    alt: "FlashRouter usage analytics and latency metrics",
    width: 1600,
    height: 1000,
  },
  {
    src: "/images/flashrouter4.svg",
    alt: "FlashRouter combos and fallback routing configuration",
    width: 1600,
    height: 1000,
  },
];

const flashAgentSlides: Slide[] = [
  {
    src: "/images/flashagent1.svg",
    alt: "Flash Agent dashboard — chat workspace with tool results",
    width: 1600,
    height: 1000,
  },
  {
    src: "/images/flashagent2.svg",
    alt: "Flash Agent specialist roles catalog",
    width: 1600,
    height: 1000,
  },
  {
    src: "/images/flashagent4.svg",
    alt: "Flash Agent VPS management view",
    width: 1600,
    height: 1000,
  },
];

function SocialLinks() {
  return (
    <>
      <a
        href="https://github.com/wahyudivaaa"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-social-btn"
        aria-label="GitHub profile"
      >
        <i className="fab fa-github" aria-hidden="true"></i>
      </a>
      <a
        href="https://linkedin.com/in/wahyudiva"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-social-btn"
        aria-label="LinkedIn profile"
      >
        <i className="fab fa-linkedin-in" aria-hidden="true"></i>
      </a>
      <a
        href="mailto:wahyudiva2004@gmail.com"
        className="hero-social-btn"
        aria-label="Send email"
      >
        <i className="fas fa-envelope" aria-hidden="true"></i>
      </a>
    </>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <Header />
      <RealGlass />

      <RevealAnimations>
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="app-container">
            <div className="hero-unified-card glass-panel">
              <div className="hero-copy">
                <div className="availability-badge">
                  <span className="status-dot" aria-hidden="true"></span>
                  <span>Open to collaborations &amp; new projects</span>
                </div>

                <h1 className="hero-headline">
                  <SplitText text="Wahyu Diva" by="chars" delay={80} />
                </h1>

                <p className="hero-role">
                  Full Stack Developer building production web apps with{" "}
                  <span className="highlight">PHP</span>, SQL Server &amp;
                  JavaScript.
                </p>

                <p className="cyber-text">
                  Designing databases, building backends, and shipping
                  responsive interfaces end to end.
                </p>

                <p className="hero-location">
                  <i className="fas fa-location-dot" aria-hidden="true"></i>
                  Bali, Indonesia
                </p>

                <div className="hero-buttons">
                  <Magnetic>
                    <a href="#projects" className="btn-apple-primary">
                      View Work
                    </a>
                  </Magnetic>
                  <a href="#contact" className="btn-apple-secondary">
                    <i className="fas fa-envelope" aria-hidden="true"></i>
                    <span>Contact Me</span>
                  </a>
                </div>

                <div className="hero-socials">
                  <SocialLinks />
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-avatar-bubble">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/profile.svg"
                    alt="Portrait of Wahyu Diva"
                    className="hero-profile-img"
                    width={1080}
                    height={1172}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>

                <div className="hero-bubble bubble-exp">
                  <span className="bubble-icon">
                    <i className="fas fa-briefcase" aria-hidden="true"></i>
                  </span>
                  <span className="bubble-text">
                    <strong>4+ Years</strong>
                    <small>Full-time experience</small>
                  </span>
                </div>

                <div className="hero-bubble bubble-projects">
                  <span className="bubble-icon">
                    <i className="fas fa-rocket" aria-hidden="true"></i>
                  </span>
                  <span className="bubble-text">
                    <strong>50+ Projects</strong>
                    <small>Completed &amp; shipped</small>
                  </span>
                </div>

                <div className="hero-bubble bubble-stack">
                  <span className="bubble-icon">
                    <i className="fas fa-layer-group" aria-hidden="true"></i>
                  </span>
                  <span className="bubble-text">
                    <strong>PHP · JS · SQL</strong>
                    <small>Core stack</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TechMarquee />

        {/* About Section */}
        <section id="about" className="section-wrapper">
          <div className="app-container">
            <div className="section-header">
              <span className="section-eyebrow">
                <span className="section-index">01</span>
                Get to Know
              </span>
              <h2 className="section-title">About Me</h2>
            </div>

            <div className="about-grid">
              <div className="glass-panel about-bio-card">
                <p className="greeting-text">Hello!</p>
                <p>
                  My name is I Putu Wahyu Diva Kumuda, but you can call me
                  Wahyu or Yudip. I was born on 15 June 2004, making me{" "}
                  <AgeText /> today. Currently, I am pursuing a degree in
                  Informatics Engineering while working as a Full Stack
                  Developer.
                </p>
                <ScrubText
                  className="about-scrub"
                  text="My day-to-day work is web development — designing database schemas, building PHP backends, and shipping interfaces that people actually use — and I keep expanding that craft through personal projects."
                />
                <p>
                  My professional and academic journey has shaped me into an
                  honest, collaborative, and respectful individual who thrives
                  in team environments.
                </p>
                <p>
                  Outside of work and studies, I enjoy coding personal projects
                  and gaming, which help me stay creative and sharpen my
                  problem-solving skills.
                </p>

                <div className="stats-row">
                  <div className="stat-bubble-card stat-item">
                    <ExperienceYears />
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat-bubble-card stat-item">
                    <CountUp to={50} suffix="+" delay={120} className="stat-number" />
                    <span className="stat-label">Projects Completed</span>
                  </div>
                  <div className="stat-bubble-card stat-item">
                    <CountUp to={30} suffix="+" delay={240} className="stat-number" />
                    <span className="stat-label">Happy Clients</span>
                  </div>
                </div>
              </div>

              <div className="about-cards-column">
                <div className="glass-panel about-subcard spotlight">
                  <div className="subcard-icon">
                    <i className="fas fa-server" aria-hidden="true"></i>
                  </div>
                  <div className="subcard-content">
                    <h3>Backend Development</h3>
                    <p>Building robust and scalable server-side applications.</p>
                  </div>
                </div>
                <div className="glass-panel about-subcard spotlight">
                  <div className="subcard-icon">
                    <i className="fas fa-desktop" aria-hidden="true"></i>
                  </div>
                  <div className="subcard-content">
                    <h3>Frontend Development</h3>
                    <p>Creating responsive and interactive user interfaces.</p>
                  </div>
                </div>
                <div className="glass-panel about-subcard spotlight">
                  <div className="subcard-icon">
                    <i className="fas fa-database" aria-hidden="true"></i>
                  </div>
                  <div className="subcard-content">
                    <h3>Database Design</h3>
                    <p>Designing efficient and secure database structures.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section-wrapper">
          <div className="app-container">
            <div className="section-header">
              <span className="section-eyebrow">
                <span className="section-index">02</span>
                Career Path
              </span>
              <h2 className="section-title">Experience</h2>
            </div>

            <div className="timeline">
              <span className="timeline-fill" aria-hidden="true"></span>
              <div className="timeline-item">
                <div className="timeline-dot">
                  <i className="fas fa-briefcase" aria-hidden="true"></i>
                </div>
                <article className="glass-panel timeline-card">
                  <div className="timeline-head">
                    <div>
                      <h3 className="timeline-role">Full Stack Developer</h3>
                      <p className="timeline-org">Sanata System · Full-time</p>
                    </div>
                    <span className="timeline-period">May 2022 — Present</span>
                  </div>
                  <p className="timeline-desc">
                    Full Stack Developer at Sanata System in Bali, Indonesia
                    (hybrid), building and maintaining web applications end to
                    end — database design with Microsoft SQL Server and MySQL,
                    PHP backends, and responsive frontends. More than four
                    years in the role, delivering production systems alongside
                    his Informatics Engineering studies.
                  </p>
                  <div className="timeline-tags">
                    <span className="stack-tag">
                      <i className="fab fa-php" aria-hidden="true"></i> PHP
                    </span>
                    <span className="stack-tag">
                      <i className="fas fa-database" aria-hidden="true"></i>{" "}
                      Microsoft SQL Server
                    </span>
                    <span className="stack-tag">
                      <i className="fas fa-database" aria-hidden="true"></i>{" "}
                      MySQL
                    </span>
                    <span className="stack-tag">
                      <i className="fab fa-js" aria-hidden="true"></i> JavaScript
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="section-wrapper">
          <div className="app-container">
            <div className="section-header">
              <span className="section-eyebrow">
                <span className="section-index">03</span>
                Background
              </span>
              <h2 className="section-title">Education</h2>
            </div>

            <div className="timeline">
              <span className="timeline-fill" aria-hidden="true"></span>
              <div className="timeline-item">
                <div className="timeline-dot">
                  <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                </div>
                <article className="glass-panel timeline-card">
                  <div className="timeline-head">
                    <div>
                      <h3 className="timeline-role">Primakara University</h3>
                      <p className="timeline-org">
                        Bachelor of Informatics Engineering
                      </p>
                    </div>
                    <span className="timeline-period">Sep 2022 — Jul 2026</span>
                  </div>
                  <p className="timeline-desc">
                    Bachelor&apos;s degree in Informatics Engineering (Teknik
                    Informatika) at Primakara University, Denpasar — focusing
                    on web technologies, software engineering, and database
                    systems, pursued alongside full-time work as a Full Stack
                    Developer.
                  </p>
                  <div className="timeline-tags">
                    <span className="stack-tag">
                      <i className="fas fa-code" aria-hidden="true"></i> Web
                      Development
                    </span>
                    <span className="stack-tag">
                      <i className="fas fa-diagram-project" aria-hidden="true"></i>{" "}
                      Software Engineering
                    </span>
                    <span className="stack-tag">
                      <i className="fas fa-database" aria-hidden="true"></i>{" "}
                      Databases
                    </span>
                  </div>
                </article>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot">
                  <i className="fas fa-school" aria-hidden="true"></i>
                </div>
                <article className="glass-panel timeline-card">
                  <div className="timeline-head">
                    <div>
                      <h3 className="timeline-role">SMK Negeri 1 Denpasar</h3>
                      <p className="timeline-org">
                        Rekayasa Perangkat Lunak (Software Engineering)
                      </p>
                    </div>
                    <span className="timeline-period">Jul 2019 — Jun 2022</span>
                  </div>
                  <p className="timeline-desc">
                    Vocational high school majoring in Software Engineering
                    (Rekayasa Perangkat Lunak) — where the programming journey
                    began, covering programming fundamentals, web development,
                    and databases.
                  </p>
                  <div className="timeline-tags">
                    <span className="stack-tag">
                      <i className="fas fa-code" aria-hidden="true"></i>{" "}
                      Programming Fundamentals
                    </span>
                    <span className="stack-tag">
                      <i className="fas fa-globe" aria-hidden="true"></i> Web
                      Development
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section-wrapper">
          <div className="app-container">
            <div className="section-header">
              <span className="section-eyebrow">
                <span className="section-index">04</span>
                What I Do
              </span>
              <h2 className="section-title">Skills</h2>
            </div>

            <div className="skills-grid">
              <div className="glass-panel skill-group-card spotlight">
                <h3 className="group-title">Frontend</h3>
                <div className="skill-items-list">
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-html5 skill-brand-icon color-html" aria-hidden="true"></i>
                        <i className="fab fa-css3-alt skill-brand-icon color-css" aria-hidden="true"></i>
                        <span className="skill-name">HTML/CSS</span>
                      </span>
                      <span className="skill-level level-advanced">Advanced</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-js skill-brand-icon color-js" aria-hidden="true"></i>
                        <span className="skill-name">JavaScript</span>
                      </span>
                      <span className="skill-level level-advanced">Advanced</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-react skill-brand-icon color-react" aria-hidden="true"></i>
                        <span className="skill-name">React</span>
                      </span>
                      <span className="skill-level level-basic">Basic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel skill-group-card spotlight">
                <h3 className="group-title">Backend</h3>
                <div className="skill-items-list">
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-node-js skill-brand-icon color-node" aria-hidden="true"></i>
                        <span className="skill-name">Node.js</span>
                      </span>
                      <span className="skill-level level-basic">Basic</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-php skill-brand-icon color-php" aria-hidden="true"></i>
                        <span className="skill-name">PHP</span>
                      </span>
                      <span className="skill-level level-advanced">Advanced</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-python skill-brand-icon color-python" aria-hidden="true"></i>
                        <span className="skill-name">Python</span>
                      </span>
                      <span className="skill-level level-basic">Basic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel skill-group-card spotlight">
                <h3 className="group-title">Database &amp; Tools</h3>
                <div className="skill-items-list">
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/mysql.svg" alt="MySQL" className="skill-img-brand" />
                        <span className="skill-name">MySQL</span>
                      </span>
                      <span className="skill-level level-intermediate">Intermediate</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/sql-server.svg" alt="SQL Server" className="skill-img-brand" />
                        <span className="skill-name">SQL Server</span>
                      </span>
                      <span className="skill-level level-intermediate">Intermediate</span>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-info">
                      <span className="skill-icon-name">
                        <i className="fab fa-git-alt skill-brand-icon color-git" aria-hidden="true"></i>
                        <span className="skill-name">Git &amp; GitHub</span>
                      </span>
                      <span className="skill-level level-advanced">Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section-wrapper">
          <div className="app-container">
            <div className="section-header">
              <span className="section-eyebrow">
                <span className="section-index">05</span>
                Featured Work
              </span>
              <h2 className="section-title">Projects</h2>
            </div>

            <div className="projects-grid">
              {/* Project 1: FlashPlay */}
              <article className="glass-panel project-card" style={{ "--i": 0 } as CSSProperties}>
                <ProjectCarousel name="FlashPlay" slides={flashPlaySlides} />
                <div className="project-body">
                  <h3 className="project-title">FlashPlay</h3>
                  <p className="project-role">
                    Personal project · Designed &amp; built end to end
                  </p>
                  <p className="project-text">
                    FlashPlay is a modern movie trailer streaming platform
                    built using HTML5, CSS3, and Vanilla JavaScript on the
                    frontend and Node.js on the backend. The website utilizes
                    the TMDB API to provide up-to-date movie information and
                    the YouTube Embedded Player for trailer playback.
                  </p>
                  <div className="project-stack-row">
                    <span className="stack-tag"><i className="fab fa-html5" aria-hidden="true"></i> HTML</span>
                    <span className="stack-tag"><i className="fab fa-css3-alt" aria-hidden="true"></i> CSS</span>
                    <span className="stack-tag"><i className="fab fa-js" aria-hidden="true"></i> JavaScript</span>
                    <span className="stack-tag"><i className="fab fa-node-js" aria-hidden="true"></i> Node.js</span>
                  </div>
                  <div className="project-buttons">
                    <a href="https://flash-play.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-apple-primary">
                      <span>View Live</span>
                      <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    </a>
                    <a href="https://github.com/wahyudivaaa/flash-play" target="_blank" rel="noopener noreferrer" className="btn-apple-secondary">
                      <i className="fab fa-github" aria-hidden="true"></i>
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </article>

              {/* Project 2: FlashBot */}
              <article className="glass-panel project-card" style={{ "--i": 1 } as CSSProperties}>
                <ProjectCarousel name="FlashBot" slides={flashBotSlides} />
                <div className="project-body">
                  <h3 className="project-title">FlashBot</h3>
                  <p className="project-role">
                    Personal project · Designed &amp; built end to end
                  </p>
                  <p className="project-text">
                    FlashBot is an interactive AI chatbot built with Vue.js
                    featuring a modern interface. It integrates Cohere AI for
                    intelligent chat in Indonesian language and OpenWeatherMap
                    for real-time weather information. Key features include
                    syntax highlighting using Highlight.js, dark/light theme
                    system, code preview, and dynamic avatars from DiceBear
                    API. Designed with modern HTML5/CSS3 and Material Design
                    Icons to deliver an engaging and responsive user
                    experience.
                  </p>
                  <div className="project-stack-row">
                    <span className="stack-tag"><i className="fab fa-vuejs" aria-hidden="true"></i> Vue.js</span>
                    <span className="stack-tag"><i className="fab fa-html5" aria-hidden="true"></i> HTML</span>
                    <span className="stack-tag"><i className="fab fa-css3-alt" aria-hidden="true"></i> CSS</span>
                    <span className="stack-tag"><i className="fab fa-js" aria-hidden="true"></i> JavaScript</span>
                    <span className="stack-tag"><i className="fas fa-robot" aria-hidden="true"></i> Cohere AI</span>
                    <span className="stack-tag"><i className="fas fa-cloud" aria-hidden="true"></i> OpenWeatherMap</span>
                    <span className="stack-tag"><i className="fas fa-code" aria-hidden="true"></i> Highlight.js</span>
                    <span className="stack-tag"><i className="fas fa-icons" aria-hidden="true"></i> Material Design</span>
                  </div>
                  <div className="project-buttons">
                    <a href="https://flash-bot-chat.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-apple-primary">
                      <span>View Live</span>
                      <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    </a>
                    <a href="https://github.com/wahyudivaaa/flash-bot" target="_blank" rel="noopener noreferrer" className="btn-apple-secondary">
                      <i className="fab fa-github" aria-hidden="true"></i>
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </article>

              {/* Project 3: FlashRouter */}
              <article className="glass-panel project-card" style={{ "--i": 2 } as CSSProperties}>
                <ProjectCarousel name="FlashRouter" slides={flashRouterSlides} />
                <div className="project-body">
                  <div className="project-head">
                    <span className="project-logo-tile">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/logo-flashrouter.svg" alt="Logo FlashRouter" />
                    </span>
                    <h3 className="project-title">FlashRouter</h3>
                  </div>
                  <p className="project-role">Personal project · Private repository</p>
                  <p className="project-text">
                    FlashRouter is a self-hosted, multi-provider AI gateway
                    that routes OpenAI-, Anthropic-, and Gemini-compatible
                    client traffic across 70+ provider backends — including
                    OpenAI, Anthropic, Gemini, DeepSeek, Groq, MiniMax, and
                    Together — behind a single unified API. It performs
                    real-time, bidirectional protocol translation between the
                    OpenAI Chat, Anthropic Messages, and Google Gemini wire
                    formats, so any client such as Claude Code, Cline, or the
                    OpenAI SDK can talk to any backend without adapters, with
                    full streaming (SSE) fidelity throughout.
                  </p>
                  <p className="project-text">
                    Built on Bun and Elysia and shipped as one portable binary
                    with an embedded React operator console and SQLite storage,
                    it adds smart fallback combos, round-robin load balancing,
                    circuit breaking with automatic cooldowns, per-account
                    quota tracking across rolling 5-hour, daily, and weekly
                    windows, dynamic token-cost accounting, and P50/P95/P99
                    latency observability. It also includes token optimization
                    through context pruning, proxy-pool and WireGuard egress
                    control, a Model Lab playground, and one-click
                    configuration injectors for 14+ coding agents — and it
                    runs 24/7 in production as the backbone of my own AI
                    tooling.
                  </p>
                  <div className="project-stack-row">
                    <span className="stack-tag"><i className="fas fa-code" aria-hidden="true"></i> TypeScript</span>
                    <span className="stack-tag"><i className="fas fa-bolt" aria-hidden="true"></i> Bun</span>
                    <span className="stack-tag"><i className="fas fa-route" aria-hidden="true"></i> Elysia</span>
                    <span className="stack-tag"><i className="fab fa-react" aria-hidden="true"></i> React</span>
                    <span className="stack-tag"><i className="fas fa-database" aria-hidden="true"></i> SQLite</span>
                    <span className="stack-tag"><i className="fas fa-plug" aria-hidden="true"></i> OpenAI · Anthropic · Gemini APIs</span>
                  </div>
                  <p className="project-private-note">
                    <i className="fas fa-lock" aria-hidden="true"></i>
                    <span>Private repository — shown as screenshots and description only.</span>
                  </p>
                </div>
              </article>

              {/* Project 4: Flash Agent */}
              <article className="glass-panel project-card" style={{ "--i": 3 } as CSSProperties}>
                <ProjectCarousel name="Flash Agent" slides={flashAgentSlides} />
                <div className="project-body">
                  <div className="project-head">
                    <span className="project-logo-tile">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/logo-flashagent.svg" alt="Logo Flash Agent" />
                    </span>
                    <h3 className="project-title">Flash Agent</h3>
                  </div>
                  <p className="project-role">Personal project · Private repository</p>
                  <p className="project-text">
                    Flash Agent is a self-hosted AI hacking agent — an
                    autonomous penetration-testing and exploitation operator
                    written in Go and shipped as a
                    single binary that serves an HTTP API, a React dashboard,
                    and a terminal UI. It runs authorized engagements end to
                    end: mapping a target's attack surface, hunting and
                    proving vulnerabilities, and turning access into
                    documented impact. A dedicated exploit harness, an
                    engagement tracker that follows the phases of a test,
                    and scope, evidence, and findings stores keep every step
                    inside the authorized boundary — and fully recorded.
                  </p>
                  <p className="project-text">
                    The security work is organized as craft, not prompts.
                    Thirteen of its twenty-five specialist roles are
                    offensive — an exploit operator, OSINT and intercept
                    specialists, a reverse engineer, a threat modeler, and
                    dedicated web-app, API, mobile, cloud, and
                    internal-network testers — backed by a skill library of
                    sixteen per-vulnerability exploitation playbooks (SQL
                    injection, SSRF, SSTI, XXE, command injection,
                    deserialization, JWT attacks, cloud metadata theft, and
                    more) plus recon and reporting playbooks. Underneath sits
                    the general platform: more than 100 tools across 16
                    toolsets, hybrid HNSW + full-text memory with RAG, cron
                    and autopilot, a managed proxy pool, and a ten-vendor
                    challenge classifier.
                  </p>
                  <div className="project-stack-row">
                    <span className="stack-tag"><i className="fab fa-golang" aria-hidden="true"></i> Go</span>
                    <span className="stack-tag"><i className="fab fa-react" aria-hidden="true"></i> React</span>
                    <span className="stack-tag"><i className="fas fa-database" aria-hidden="true"></i> SQLite</span>
                    <span className="stack-tag"><i className="fab fa-chrome" aria-hidden="true"></i> Chromium CDP</span>
                    <span className="stack-tag"><i className="fas fa-terminal" aria-hidden="true"></i> SSH / SFTP</span>
                    <span className="stack-tag"><i className="fas fa-user-secret" aria-hidden="true"></i> Penetration Testing</span>
                  </div>
                  <p className="project-private-note">
                    <i className="fas fa-lock" aria-hidden="true"></i>
                    <span>Private repository — shown as screenshots and description only.</span>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <ContactSection />
      </RevealAnimations>

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="app-container">
          <div className="footer-panel">
            <div className="footer-top">
              <a href="#home" className="footer-brand" aria-label="Wahyu Diva — back to top">
                <span className="brand-avatar-bubble">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.svg" alt="WD" />
                </span>
                <span className="footer-brand-meta">
                  <span className="footer-brand-name">WAHYU DIVA</span>
                  <span className="footer-brand-role">Full Stack Developer</span>
                </span>
              </a>
              <div className="footer-info">
                <div className="footer-info-item">
                  <span className="footer-info-label">Status</span>
                  <span className="footer-info-value">
                    <span className="status-dot" aria-hidden="true"></span>
                    Open to collaborations
                  </span>
                </div>
                <div className="footer-info-item">
                  <span className="footer-info-label">Location</span>
                  <span className="footer-info-value">Bali, Indonesia</span>
                </div>
                <div className="footer-info-item">
                  <span className="footer-info-label">Local time</span>
                  <span className="footer-info-value footer-clock">
                    <FooterClock /> WITA
                  </span>
                </div>
              </div>
            </div>
            <p className="footer-tagline">
              Building web products end to end — from database to interface.
            </p>
            <div className="footer-bottom">
              <p className="footer-copy-text">
                &copy; <FooterYear /> Wahyu Diva. All rights reserved.
              </p>
              <div className="footer-actions">
                <div className="hero-socials footer-socials">
                  <SocialLinks />
                </div>
                <a href="#home" className="to-top-btn" aria-label="Back to top">
                  <i className="fas fa-arrow-up" aria-hidden="true"></i>
                  <span>Top</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Effects />
      <ChatWidgetLoader />
    </>
  );
}
