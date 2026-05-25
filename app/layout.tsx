import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/sections/Navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// TODO: replace pbfmachine.com with the production domain after Vercel setup.
const SITE_URL = "https://pbfmachine.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PBFMACHINE — Precision. Quality. Performance.",
  description:
    "High-tolerance CNC machining for aerospace, defense, automotive, medical, and industrial sectors. Made in New Jersey.",
  keywords: [
    "CNC machining",
    "precision machining",
    "New Jersey",
    "aerospace machining",
    "4-axis machining",
    "live tool turning",
    "CNC milling",
    "CNC turning",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PBFMACHINE",
    title: "PBFMACHINE — Precision. Quality. Performance.",
    description:
      "High-tolerance CNC machining for aerospace, defense, automotive, medical, and industrial sectors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PBFMACHINE — Precision. Quality. Performance.",
    description:
      "High-tolerance CNC machining for aerospace, defense, automotive, medical, and industrial sectors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Manufacturer",
  name: "PBFMACHINE",
  description:
    "Precision CNC machining shop in New Jersey. High-tolerance parts for aerospace, defense, automotive, medical, and industrial sectors.",
  url: SITE_URL,
  telephone: "+1-862-291-9548",
  email: "pbf@pbfmachine.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "615 Pennsylvania Ave",
    addressLocality: "Elizabeth",
    addressRegion: "NJ",
    postalCode: "07201",
    addressCountry: "US",
  },
  areaServed: "US",
  slogan: "Precision. Quality. Performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${roboto.variable}`}>
      <body className="bg-ink text-bone font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-royal focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:uppercase focus:tracking-[0.32em] focus:text-bone focus:outline-none focus:ring-2 focus:ring-bone"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
        <Cursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
      </body>
    </html>
  );
}
