// Single source of truth for Wahyu Diva's CV.
// Rendered by the web CV page (app/cv/page.tsx) and by the ATS-safe PDF
// document (components/pdf/CvDocument.tsx). Content mirrors
// ~/workspace/portfolio-redesign/cv-data.md — do not add metrics that are
// not supported there.

export interface CvSkillGroup {
  label: string;
  skills: string[];
}

export interface CvExperience {
  role: string;
  company: string;
  location: string;
  employmentType: string;
  period: string;
  bullets: string[];
}

export interface CvProject {
  name: string;
  tagline: string;
  stack: string;
  bullets: string[];
  /** Human-readable link label, e.g. "flash-play.vercel.app". */
  linkLabel?: string;
  /** Full URL for the link label. Omit for private projects. */
  linkUrl?: string;
}

export interface CvEducation {
  institution: string;
  qualification: string;
  period: string;
  detail: string;
}

export interface CvLanguage {
  language: string;
  level: string;
}

export interface CvData {
  name: string;
  headline: string;
  location: string;
  email: string;
  links: { label: string; url: string; display: string }[];
  summary: string;
  skills: CvSkillGroup[];
  experience: CvExperience[];
  projects: CvProject[];
  education: CvEducation[];
  languages: CvLanguage[];
  pdfPath: string;
}

export const cvData: CvData = {
  name: "Wahyu Diva",
  headline: "Full Stack Developer",
  location: "Bali, Indonesia",
  email: "wahyudiva2004@gmail.com",
  links: [
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/wahyudiva",
      display: "linkedin.com/in/wahyudiva",
    },
    {
      label: "GitHub",
      url: "https://github.com/wahyudivaaa",
      display: "github.com/wahyudivaaa",
    },
    {
      label: "Portfolio",
      url: "https://wahyu-diva.vercel.app",
      display: "wahyu-diva.vercel.app",
    },
  ],
  summary:
    "Full Stack Developer with 4+ years of full-time experience at Sanata System in Bali, building production web applications end to end — database design (Microsoft SQL Server, MySQL), PHP backends, and responsive JavaScript frontends. Shipped 50+ projects for 30+ clients, and builds independent AI tooling in TypeScript and Go, including a multi-provider AI gateway running 24/7 in production. Final-year B.Sc. Informatics Engineering student at Primakara University.",
  skills: [
    {
      label: "Languages",
      skills: ["PHP", "JavaScript", "TypeScript", "Go", "Python", "SQL", "HTML", "CSS"],
    },
    {
      label: "Frontend",
      skills: ["React", "Next.js", "Vue.js", "Responsive Design"],
    },
    {
      label: "Backend",
      skills: ["Node.js", "Bun", "Elysia", "REST APIs", "SSE Streaming"],
    },
    {
      label: "Databases",
      skills: ["Microsoft SQL Server", "MySQL", "SQLite"],
    },
    {
      label: "Tools & Platforms",
      skills: ["Git", "GitHub", "Vercel", "Linux Server Administration"],
    },
  ],
  experience: [
    {
      role: "Full Stack Developer",
      company: "Sanata System",
      location: "Bali, Indonesia",
      employmentType: "Full-time, Hybrid",
      period: "May 2022 – Present",
      bullets: [
        "Build and maintain production web applications end to end — schema design in Microsoft SQL Server and MySQL, PHP backends, and responsive JavaScript frontends — across 50+ projects shipped over 4+ years.",
        "Delivered client-facing systems for 30+ clients, owning each project from database design and backend development through frontend delivery and deployment.",
        "Develop internal tooling and integrations that support the company's client delivery work, alongside ongoing maintenance of live production systems.",
      ],
    },
  ],
  projects: [
    {
      name: "FlashRouter",
      tagline: "Self-hosted multi-provider AI gateway",
      stack: "TypeScript, Bun, Elysia, React, SQLite",
      bullets: [
        "Built a self-hosted gateway that routes OpenAI-, Anthropic-, and Gemini-compatible traffic across 70+ provider backends, with bidirectional protocol translation and SSE streaming.",
        "Implemented fallback, load balancing, and circuit breaking, plus quota and cost accounting with latency observability; runs 24/7 in production.",
      ],
    },
    {
      name: "Flash Agent",
      tagline: "Autonomous penetration-testing agent",
      stack: "Go, React",
      bullets: [
        "Built an autonomous penetration-testing agent in Go as a single binary with an HTTP API, React dashboard, and terminal UI.",
        "Shipped 100+ tools with hybrid memory and RAG, plus cron and autopilot scheduling for unattended test runs.",
      ],
    },
    {
      name: "FlashPlay",
      tagline: "Movie trailer streaming platform",
      stack: "HTML, CSS, JavaScript, Node.js",
      bullets: [
        "Built a movie trailer streaming platform integrating the TMDB API with YouTube embeds for browsing and playback.",
      ],
      linkLabel: "flash-play.vercel.app",
      linkUrl: "https://flash-play.vercel.app",
    },
    {
      name: "FlashBot",
      tagline: "AI chatbot with live weather",
      stack: "Vue.js, Cohere AI, OpenWeatherMap API",
      bullets: [
        "Built an Indonesian-language AI chatbot using Cohere AI, with weather lookups via the OpenWeatherMap API, syntax highlighting, and switchable themes.",
      ],
      linkLabel: "flash-bot-chat.vercel.app",
      linkUrl: "https://flash-bot-chat.vercel.app",
    },
  ],
  education: [
    {
      institution: "Primakara University",
      qualification: "B.Sc. Informatics Engineering",
      period: "September 2022 – July 2026 (expected)",
      detail:
        "Focus on web technologies, software engineering, and database systems. Pursued alongside full-time work.",
    },
    {
      institution: "SMK Negeri 1 Denpasar",
      qualification: "Vocational Diploma, Software Engineering",
      period: "July 2019 – June 2022",
      detail: "Software Engineering (Rekayasa Perangkat Lunak) programme.",
    },
  ],
  languages: [
    { language: "Indonesian", level: "Native" },
    { language: "English", level: "Professional" },
  ],
  pdfPath: "/cv/Wahyu-Diva-Resume.pdf",
};
