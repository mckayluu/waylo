import "./globals.css";
import type { Metadata } from "next";
import WayloEmbed from "@/components/WayloEmbed";
import { SITE_URL, TAGLINE } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Waylo — AI website chat that shows its sources", template: "%s | Waylo" },
  description: TAGLINE, applicationName: "Waylo",
  openGraph: { siteName: "Waylo", type: "website", title: "Waylo — AI website chat that shows its sources", description: TAGLINE, images: ["/brand/lockup.svg"] },
  twitter: { card: "summary", title: "Waylo", description: TAGLINE },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<WayloEmbed /></body></html>;
}
