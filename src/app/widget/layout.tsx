import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Waylo chat" };
export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
