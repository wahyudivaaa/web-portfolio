import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
});

// Meta values ported verbatim from the pre-migration static index.html.
export const metadata: Metadata = {
  metadataBase: new URL("https://wahyu-diva.vercel.app"),
  title: "Wahyu Diva - Portfolio | Full Stack Developer",
  description:
    "Portfolio website of I Putu Wahyu Diva Kumuda - Full Stack Developer in Bali, Indonesia. Building production web applications with PHP, Microsoft SQL Server, MySQL, and JavaScript. 4+ years experience, 50+ projects completed.",
  keywords:
    "Wahyu Diva, Fullstack Developer, Web Developer, PHP, JavaScript, React, Portfolio",
  authors: [{ name: "I Putu Wahyu Diva Kumuda" }],
  icons: {
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
    apple: "/images/logo.svg",
  },
  openGraph: {
    type: "website",
    title: "Wahyu Diva - Portfolio | Full Stack Developer",
    description:
      "Full Stack Developer in Bali building production web apps with PHP, SQL Server, MySQL, and JavaScript. 4+ years experience, 50+ projects completed.",
    url: "https://wahyu-diva.vercel.app",
    images: [
      {
        url: "https://wahyu-diva.vercel.app/images/profile.svg",
        alt: "Portrait of Wahyu Diva",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Mirrors the theme resolution of the old main.js initTheme(): the saved
// localStorage value wins, otherwise the OS color-scheme preference.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <style
          dangerouslySetInnerHTML={{
            __html:
              ':root{--font-family:-apple-system,BlinkMacSystemFont,var(--font-jakarta),"SF Pro Display",var(--font-inter),sans-serif !important;}',
          }}
        />
      </head>
      <body>
        {props.children}
        <Analytics />
      </body>
    </html>
  );
}
