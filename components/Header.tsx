import ThemeToggle from "./ThemeToggle";
import NavigationEffects from "./NavigationEffects";

// The floating Dynamic Island header — markup ported verbatim from the
// static index.html; behaviour lives in NavigationEffects / ThemeToggle.
export default function Header() {
  return (
    <header className="dynamic-island-wrapper">
      <span className="scroll-progress" aria-hidden="true"></span>
      <nav className="dynamic-island" aria-label="Primary Navigation">
        <a href="#home" className="island-brand" aria-label="Wahyu Diva home">
          <span className="brand-avatar-bubble">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="WD" />
          </span>
          <span className="brand-name">WAHYU DIVA</span>
        </a>

        <div className="island-links">
          <span className="island-lens" aria-hidden="true"></span>
          <a href="#home" className="island-link active">
            HOME
          </a>
          <a href="#about" className="island-link">
            ABOUT
          </a>
          <a href="#experience" className="island-link">
            EXPERIENCE
          </a>
          <a href="#education" className="island-link">
            EDUCATION
          </a>
          <a href="#skills" className="island-link">
            SKILLS
          </a>
          <a href="#projects" className="island-link">
            PROJECTS
          </a>
        </div>

        <div className="island-actions">
          <ThemeToggle />

          <button
            className="island-btn chat-trigger-btn"
            type="button"
            aria-label="Open AI Assistant"
            title="Chat with AI Assistant"
          >
            <i className="fas fa-robot" aria-hidden="true"></i>
            <span className="chat-btn-label">AI Assistant</span>
          </button>

          <button
            id="mobileMenuToggle"
            className="island-btn mobile-menu-btn"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded="false"
          >
            <i className="fas fa-bars icon-open" aria-hidden="true"></i>
            <i className="fas fa-xmark icon-close" aria-hidden="true"></i>
          </button>
        </div>
      </nav>

      <div id="mobileMenuSheet" className="mobile-bubble-sheet" aria-hidden="true">
        <div className="sheet-links">
          <a href="#home" className="sheet-link active">
            <i className="fas fa-house" aria-hidden="true"></i>
            <span>HOME</span>
          </a>
          <a href="#about" className="sheet-link">
            <i className="fas fa-user" aria-hidden="true"></i>
            <span>ABOUT</span>
          </a>
          <a href="#experience" className="sheet-link">
            <i className="fas fa-briefcase" aria-hidden="true"></i>
            <span>EXPERIENCE</span>
          </a>
          <a href="#education" className="sheet-link">
            <i className="fas fa-graduation-cap" aria-hidden="true"></i>
            <span>EDUCATION</span>
          </a>
          <a href="#skills" className="sheet-link">
            <i className="fas fa-layer-group" aria-hidden="true"></i>
            <span>SKILLS</span>
          </a>
          <a href="#projects" className="sheet-link">
            <i className="fas fa-box-archive" aria-hidden="true"></i>
            <span>PROJECTS</span>
          </a>
        </div>
      </div>

      <NavigationEffects />
    </header>
  );
}
