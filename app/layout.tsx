import type { Metadata, Viewport } from "next";
import { Gabarito, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/app/lib/content";
import Chrome from "@/app/components/chrome/Chrome";

/* The display voice: a chunky rounded geometric, variable to 900. Rounded
   terminals and generous counters are what make big type read as friendly
   rather than corporate — the whole point of the shape language. */
const display = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Trebuchet MS", "system-ui", "sans-serif"],
});

/* Variable — omitting `weight` ships the whole 400–900 axis in one file. */
const grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

/* Metadata labels, keycaps, and numerals. Not worth a third preload slot. */
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const description = `${site.name} is a software engineer in ${site.location} building web and mobile products for ${site.industries.join(", ").toLowerCase()} teams. ${site.yearsExperience} years shipping systems that hold up under real traffic.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    "software engineer",
    "product engineer",
    ...site.specialties,
    ...site.industries,
    site.location,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

/* Both entries are required for the browser chrome to follow the theme.
   Next emits one <meta name="theme-color"> per entry with its media query. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
  colorScheme: "light dark",
};

/**
 * Runs before first paint, so the correct theme is on <html> before the
 * browser has anything to repaint. Without this, a dark-mode visitor sees a
 * white flash on every navigation — the single most common tell of a
 * bolted-on theme switcher.
 *
 * Light is the default: an unset preference resolves to light, and only an
 * explicit stored choice or an explicit `prefers-color-scheme: dark` moves it
 * off that. Honouring an OS dark preference is deliberate — someone who has
 * told their machine they want dark everywhere should not be handed a
 * full-bleed white page, and they can still toggle either way.
 */
const themeScript = `(function(){try{
var d=document.documentElement,s=localStorage.getItem('theme');
var dark=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);
d.setAttribute('data-theme',dark?'dark':'light');
if(localStorage.getItem('motion')==='reduced')d.setAttribute('data-motion','reduced');
if(localStorage.getItem('reading')==='on')d.setAttribute('data-reading','on');
}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

/* Person schema. This is what search engines and AI crawlers read to
   understand who the site is about — worth more than any meta keyword. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  description,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.split(",")[0].trim(),
    addressCountry: "NG",
  },
  knowsAbout: [...site.specialties, ...site.industries],
  seeks: site.available
    ? { "@type": "Demand", name: "Remote software engineering work" }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* Font variables belong on <html> so they reach :root. On <body> they are
       invisible to any rule outside the body subtree — including @theme. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <Chrome />
        {children}
      </body>
    </html>
  );
}
