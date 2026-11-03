"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

// Dogfood: load the Waylo embed on public pages (same-origin), never on admin or the widget itself.
export default function WayloEmbed() {
  const p = usePathname() || "/";
  if (p.startsWith("/admin") || p.startsWith("/widget") || p.startsWith("/api") || p.startsWith("/demo")) return null;
  return <Script src="/waylo.js" data-sidebar="true" strategy="afterInteractive" />;
}
