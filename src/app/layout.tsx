import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import WayloEmbed from "@/components/WayloEmbed";
import { SITE_URL, TAGLINE } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Waylo – Your website’s own AI chat", template: "%s | Waylo" },
  description: TAGLINE, applicationName: "Waylo",
  openGraph: { siteName: "Waylo", type: "website", title: "Waylo – Your website’s own AI chat", description: TAGLINE, images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo – Your website’s own AI chat" }] },
  twitter: { card: "summary_large_image", images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo – Your website’s own AI chat" }], title: "Waylo – Your website’s own AI chat", description: TAGLINE },
  // Mast icons (public/). favicon.ico is 16/32/48; the SVG is the Mast favicon; the touch icon is 180.
  icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }] },
};
// Raspberry Navy brand fonts, self-hosted (no Google Fonts requests). These only
// define CSS variables; the marketing `.mk` and admin `.ad` scopes apply them.
const display = localFont({ src: "./fonts/Fraunces-Variable.woff2", variable: "--font-display", weight: "400 700", display: "swap", fallback: ["Georgia", "serif"] });
const ui = localFont({ src: [{ path: "./fonts/SourceSans3-Variable.woff2", weight: "200 900", style: "normal" }, { path: "./fonts/SourceSans3-Italic-Variable.woff2", weight: "200 900", style: "italic" }], variable: "--font-ui", display: "swap", fallback: ["system-ui", "sans-serif"] });
const mono = localFont({ src: [{ path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400" }, { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500" }], variable: "--font-mono", display: "swap", preload: false, fallback: ["ui-monospace", "monospace"] });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}><body>{children}<WayloEmbed /></body></html>;
}
