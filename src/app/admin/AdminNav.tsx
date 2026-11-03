"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const I = (d: string) => <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const ALL = [
  { href: "/admin", label: "Home", icon: I("M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z") },
  { href: "/admin/ai-chat", label: "AI Chat", icon: I("M4 5h16v11H8l-4 4z") },
  { href: "/admin/questions", label: "Questions", icon: I("M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z") },
  { href: "/admin/tracking", label: "Tracking", icon: I("M3 3v18h18M7 15l4-4 3 3 5-6") },
  { href: "/admin/leads", label: "Leads", icon: I("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6") },
  { href: "/admin/handoffs", label: "Handoffs", icon: I("M3 14v-2a9 9 0 0 1 18 0v2M3 14h3v6H3zM18 14h3v6h-3z") },
  { href: "/admin/guidance", label: "Guidance", icon: I("M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z") },
  { href: "/admin/content", label: "Content", icon: I("M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6") },
  { href: "/admin/audiences", label: "Audiences", icon: I("M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z") },
  { href: "/admin/members", label: "Members", icon: I("M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 20v-1a3 3 0 0 0-3-2.9") },
  { href: "/admin/integrations", label: "Integrations", icon: I("M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5") },
  { href: "/admin/install", label: "Install", icon: I("M16 18l6-6-6-6M8 6l-6 6 6 6") },
  { href: "/admin/settings", label: "Settings", icon: I("M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4") },
];
const by = (h: string) => ALL.find((n) => n.href === h)!;
const SECTIONS = [
  { title: "Overview", items: ["/admin"] },
  { title: "Engage", items: ["/admin/ai-chat", "/admin/questions", "/admin/tracking", "/admin/leads", "/admin/handoffs"] },
  { title: "Knowledge", items: ["/admin/guidance", "/admin/content"] },
  { title: "Workspace", items: ["/admin/audiences", "/admin/members", "/admin/integrations", "/admin/install", "/admin/settings"] },
].map((x) => ({ ...x, items: x.items.map(by) }));
export function AdminNav() {
  const p = usePathname();
  const active = (h: string) => h === "/admin" ? p === "/admin" : h === "/admin/tracking" ? p.startsWith(h) || p.startsWith("/admin/c/") : p.startsWith(h);
  return <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:overflow-y-auto md:overflow-x-visible">
    {SECTIONS.map((sec) => <div key={sec.title} className="flex gap-1 md:mb-4 md:flex-col md:gap-0.5">
    <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-stone-500 md:block">{sec.title}</p>
    {sec.items.map((n) => (
      <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active(n.href) ? "bg-white/10 font-medium text-white" : "text-stone-400 hover:bg-white/5 hover:text-stone-200"}`}>
        <span className={active(n.href) ? "text-teal-300" : ""}>{n.icon}</span><span className="hidden md:inline">{n.label}</span></Link>))}
    </div>)}
  </nav>;
}
