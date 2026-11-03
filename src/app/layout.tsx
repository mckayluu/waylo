import "./globals.css";
import type { Metadata } from "next";
import WayloEmbed from "@/components/WayloEmbed";
import { SITE_URL, TAGLINE } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Waylo — AI website chat that shows its sources", template: "%s | Waylo" },
  description: TAGLINE, applicationName: "Waylo",
  openGraph: { siteName: "Waylo", type: "website", title: "Waylo — AI website chat that shows its sources", description: TAGLINE, images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo — AI website chat that shows its sources" }] },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"], title: "Waylo", description: TAGLINE },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<WayloEmbed /></body></html>;
}
