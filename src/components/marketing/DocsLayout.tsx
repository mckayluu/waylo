import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
const nav: [string, [string, string][]][] = [
  ["Get started", [["Overview", "/docs"], ["Install guide", "/docs/install"], ["Allow your domain", "/docs/install#allowlist"], ["Verify it works", "/docs/install#verify"]]],
  ["Configure", [["Embed modes", "/docs/embed-modes"], ["All attributes", "/docs/install#options"], ["JavaScript API", "/docs/install#api"]]],
  ["Platforms", [["CMS notes", "/docs/install#cms"], ["Troubleshooting", "/docs/install#troubleshooting"]]],
];
export function DocsLayout({ children, title = "Documentation" }: { children: React.ReactNode; title?: string }) {
  return <Shell><Header />
    <div className="w-gradient relative overflow-hidden px-5 pb-24 pt-8 text-white"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3"><p className="text-sm text-white/80"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/docs" className="hover:text-white">Docs</Link> / <span className="text-amber-200">{title}</span></p><div className="flex gap-2 text-xs"><Link href="/demo" className="w-btn-accent px-3 py-1.5 text-xs">Try the demo</Link><a href="mailto:hello@waylo.ai" className="w-btn-glass px-3 py-1.5 text-xs">Get install help</a></div></div></div>
    <div className="mx-auto -mt-16 grid max-w-6xl gap-8 px-5 pb-14 md:grid-cols-[230px_1fr]">
    <aside className="hidden self-start md:block"><div className="w-card-lg sticky top-24 p-5">{nav.map(([g, items], i) => <div key={g} className={i ? "mt-5" : ""}><p className={["w-eyebrow", "w-eyebrow-alt", "w-eyebrow-amber"][i]}>{g}</p><ul className="mt-2 space-y-1.5 text-sm">{items.map(([l, h]) => <li key={h}><Link href={h} className="block rounded-md px-2 py-1 text-stone-600 hover:bg-stone-50 hover:text-teal-700">{l}</Link></li>)}</ul></div>)}
      <div className="mt-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200"><b>Early access:</b> we’ll install with you. <a href="mailto:hello@waylo.ai" className="underline">hello@waylo.ai</a></div></div></aside>
    <main className="w-card-lg min-w-0 p-6 sm:p-10 text-[15px] leading-7 text-stone-700 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-stone-900 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:border-t [&_h2]:border-stone-100 [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-stone-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_.not-prose_ul]:list-none [&_.not-prose_ul]:pl-0 [&_a]:text-teal-700 [&_code]:rounded [&_code]:bg-indigo-50 [&_code]:px-1 [&_code]:text-[13px] [&_code]:text-indigo-800 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit">{children}</main>
  </div><Footer /></Shell>;
}
