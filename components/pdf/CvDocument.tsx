// ATS-safe PDF rendering of the CV, built with @react-pdf/renderer.
// Single column, standard Helvetica, real selectable text — no tables,
// no columns, no graphics. Rendered from the same lib/cv-data.ts source
// as the web CV page. Used by scripts/generate-cv-pdf.tsx to produce the
// static file at public/cv/Wahyu-Diva-Resume.pdf.
import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { cvData } from "../../lib/cv-data";

const ACCENT = "#0b5394"; // one dark accent (headings + rules only)
const INK = "#1a1a1a";
const MUTED = "#444444";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.2,
    lineHeight: 1.26,
    color: INK,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 42,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 19,
    lineHeight: 1.15,
    color: INK,
    marginBottom: 2,
  },
  headline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    lineHeight: 1.2,
    color: ACCENT,
    marginBottom: 3,
  },
  contact: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 1.5,
  },
  link: {
    color: MUTED,
    textDecoration: "none",
  },
  headerRule: {
    borderBottomWidth: 1.4,
    borderBottomColor: ACCENT,
    marginTop: 5,
    marginBottom: 7,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottomWidth: 0.7,
    borderBottomColor: "#c9c9c9",
    paddingBottom: 2,
    marginTop: 7,
    marginBottom: 4,
  },
  body: {
    fontSize: 9.2,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
    width: 108,
  },
  skillList: {
    flex: 1,
  },
  entryHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.8,
  },
  entryPeriod: {
    fontSize: 9,
    color: MUTED,
  },
  entrySub: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1.2,
    paddingRight: 4,
  },
  bulletMark: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  projectStack: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: MUTED,
  },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function CvDocument() {
  const d = cvData;
  const contactLine = [d.location, d.email].join("  |  ");

  return (
    <Document
      title={`${d.name} — Resume`}
      author={d.name}
      subject={`${d.headline} — ${d.location}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header — in the document body (never a page header/footer) */}
        <Text style={styles.name}>{d.name}</Text>
        <Text style={styles.headline}>{d.headline}</Text>
        <Text style={styles.contact}>{contactLine}</Text>
        <Text style={styles.contact}>
          {d.links.map((l, i) => (
            <Link key={l.label} src={l.url} style={styles.link}>
              {(i > 0 ? "  |  " : "") + l.display}
            </Link>
          ))}
        </Text>
        <View style={styles.headerRule} />

        <SectionTitle>Professional Summary</SectionTitle>
        <Text style={styles.body}>{d.summary}</Text>

        <SectionTitle>Technical Skills</SectionTitle>
        {d.skills.map((group) => (
          <View key={group.label} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{group.label}</Text>
            <Text style={styles.skillList}>{group.skills.join(", ")}</Text>
          </View>
        ))}

        <SectionTitle>Experience</SectionTitle>
        {d.experience.map((job) => (
          <View key={job.company} wrap={false}>
            <View style={styles.entryHead}>
              <Text style={styles.entryTitle}>
                {job.role} — {job.company}
              </Text>
              <Text style={styles.entryPeriod}>{job.period}</Text>
            </View>
            <Text style={styles.entrySub}>
              {job.location} · {job.employmentType}
            </Text>
            {job.bullets.map((b) => (
              <Bullet key={b.slice(0, 24)}>{b}</Bullet>
            ))}
          </View>
        ))}

        <SectionTitle>Selected Projects</SectionTitle>
        {d.projects.map((p) => (
          <View key={p.name} wrap={false} style={{ marginBottom: 3 }}>
            <Text style={styles.entryTitle}>
              {p.name} — {p.tagline}
              {p.linkLabel ? (
                <Text style={{ fontFamily: "Helvetica", fontSize: 9, color: MUTED }}>
                  {"  ·  "}
                  <Link src={p.linkUrl} style={styles.link}>
                    {p.linkLabel}
                  </Link>
                </Text>
              ) : null}
            </Text>
            <Text style={styles.projectStack}>{p.stack}</Text>
            {p.bullets.map((b) => (
              <Bullet key={b.slice(0, 24)}>{b}</Bullet>
            ))}
          </View>
        ))}

        <SectionTitle>Education</SectionTitle>
        {d.education.map((e) => (
          <View key={e.institution} wrap={false} style={{ marginBottom: 2.5 }}>
            <View style={styles.entryHead}>
              <Text style={styles.entryTitle}>
                {e.qualification} — {e.institution}
              </Text>
              <Text style={styles.entryPeriod}>{e.period}</Text>
            </View>
            <Text style={styles.body}>{e.detail}</Text>
          </View>
        ))}

        <SectionTitle>Languages</SectionTitle>
        <Text style={styles.body}>
          {d.languages.map((l) => `${l.language} — ${l.level}`).join("   ·   ")}
        </Text>
      </Page>
    </Document>
  );
}
