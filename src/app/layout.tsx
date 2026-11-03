import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Waylo", description: "Website chat that turns conversations into sales signals." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
