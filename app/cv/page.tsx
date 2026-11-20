import type { Metadata } from "next";
import Link from "next/link";
import { cvData as d } from "../../lib/cv-data";
import styles from "./cv.module.css";

export const metadata: Metadata = {
  title: "Wahyu Diva — CV | Full Stack Developer",
  description:
    "Curriculum vitae of Wahyu Diva, Full Stack Developer in Bali, Indonesia. 4+ years of experience, 50+ projects shipped. View online or download the PDF resume.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <div className={styles.actions}>
          <Link href="/" className={styles.backLink}>
            ← Back to Portfolio
          </Link>
          <a href={d.pdfPath} download className={styles.downloadBtn}>
            <i className="fas fa-download" aria-hidden="true"></i>
            Download PDF
          </a>
        </div>

        <article className={styles.doc}>
          <header>
            <h1 className={styles.name}>{d.name}</h1>
            <p className={styles.headline}>{d.headline}</p>
            <p className={styles.contact}>
              {d.location} · <a href={`mailto:${d.email}`}>{d.email}</a>
              <br />
              {d.links.map((l, i) => (
                <span key={l.label}>
                  {i > 0 ? " · " : ""}
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.display}
                  </a>
                </span>
              ))}
            </p>
            <hr className={styles.headerRule} />
          </header>

          <Section title="Professional Summary">
            <p className={styles.summary}>{d.summary}</p>
          </Section>

          <Section title="Technical Skills">
            <div>
              {d.skills.map((group) => (
                <div key={group.label} className={styles.skillRow}>
                  <span className={styles.skillLabel}>{group.label}</span>
                  <span className={styles.skillList}>
                    {group.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Experience">
            {d.experience.map((job) => (
              <div key={job.company} className={styles.entry}>
                <div className={styles.entryHead}>
                  <h3 className={styles.entryTitle}>
                    {job.role} — {job.company}
                  </h3>
                  <span className={styles.entryPeriod}>{job.period}</span>
                </div>
                <p className={styles.entrySub}>
                  {job.location} · {job.employmentType}
                </p>
                <ul className={styles.bullets}>
                  {job.bullets.map((b) => (
                    <li key={b.slice(0, 32)}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Selected Projects">
            {d.projects.map((p) => (
              <div key={p.name} className={styles.entry}>
                <h3 className={styles.entryTitle}>
                  {p.name} — {p.tagline}
                </h3>
                <p className={styles.stack}>
                  {p.stack}
                  {p.linkLabel ? (
                    <>
                      {" · "}
                      <a href={p.linkUrl} target="_blank" rel="noreferrer">
                        {p.linkLabel}
                      </a>
                    </>
                  ) : null}
                </p>
                <ul className={styles.bullets}>
                  {p.bullets.map((b) => (
                    <li key={b.slice(0, 32)}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Education">
            {d.education.map((e) => (
              <div key={e.institution} className={styles.entry}>
                <div className={styles.entryHead}>
                  <h3 className={styles.entryTitle}>
                    {e.qualification} — {e.institution}
                  </h3>
                  <span className={styles.entryPeriod}>{e.period}</span>
                </div>
                <p className={styles.detail}>{e.detail}</p>
              </div>
            ))}
          </Section>

          <Section title="Languages">
            <p className={styles.languages}>
              {d.languages
                .map((l) => `${l.language} — ${l.level}`)
                .join("  ·  ")}
            </p>
          </Section>
        </article>
      </div>
    </main>
  );
}
