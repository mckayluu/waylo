import Script from "next/script";
import { notFound } from "next/navigation";
const PAGES: Record<string, { title: string; body: string }> = {
  "": { title: "Acme Co — Home", body: "A fake customer website with the Waylo sidebar docked on the right. Browse a few pages (they're tracked as a journey), ask Waylo a question, then check Admin → Tracking." },
  features: { title: "Acme Co — Features", body: "Acme Widgets ship with realtime sync, offline mode, and a 99.9% uptime SLA. Try asking the sidebar how installation works." },
  pricing: { title: "Acme Co — Pricing", body: "Starter is free, Pro is $29/user/month, Enterprise is custom. Visiting this page is a buying signal in your visitor's journey." },
  "case-studies": { title: "Acme Co — Case studies", body: "Northwind cut onboarding time by 40% with Acme. Globex rolled out to 3,000 seats in two weeks." },
  contact: { title: "Acme Co — Contact", body: "Use the Contact tab in the sidebar to leave a message or book a demo." },
};
export function generateStaticParams() { return Object.keys(PAGES).map((k) => ({ slug: k ? [k] : [] })); }
export function generateMetadata({ params }: { params: { slug?: string[] } }) { return { title: PAGES[params.slug?.[0] || ""]?.title || "Acme Co" }; }
export default function Demo({ params }: { params: { slug?: string[] } }) {
  const key = params.slug?.[0] || ""; const p = PAGES[key]; if (!p || (params.slug?.length || 0) > 1) notFound();
  return (
    <main className="min-h-screen bg-white">
      <div className="mr-[400px]">
        <nav className="flex items-center gap-6 border-b border-stone-200 px-10 py-4 text-sm">
          <a href="/demo" className="font-bold">Acme Co</a>
          {/* Plain <a> = full page loads, like a typical marketing site */}
          {Object.keys(PAGES).filter(Boolean).map((k) => <a key={k} href={`/demo/${k}`} className={k === key ? "font-medium text-teal-700" : "text-stone-600 hover:text-stone-900"}>{k.replace("-", " ").replace(/^./, (c) => c.toUpperCase())}</a>)}
        </nav>
        <div className="px-10 py-16">
          <h1 className="text-3xl font-bold">{p.title.replace("Acme Co — ", "")}</h1>
          <p className="mt-3 max-w-xl text-stone-600">{p.body}</p>
          <p className="mt-8 text-xs text-stone-400">Embedded with <code>&lt;script src=&quot;/waylo.js&quot; data-mode=&quot;launcher&quot;&gt;</code> · <a href="/admin/tracking" className="underline">Admin → Tracking</a></p>
        </div>
      </div>
      <Script src="/waylo.js" data-mode="launcher" strategy="afterInteractive" />
    </main>
  );
}
