import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
const nav: [string, [string, string][]][] = [
  ["Get started", [["Overview", "/docs"], ["Install guide", "/docs/install"], ["Allow your domain", "/docs/install#allowlist"], ["Verify it works", "/docs/install#verify"]]],
  ["Configure", [["Embed modes", "/docs/embed-modes"], ["Mode by page", "/docs/embed-modes#by-page"], ["All attributes", "/docs/install#options"], ["JavaScript API", "/docs/install#api"]]],
  ["Platforms", [["CMS notes", "/docs/install#cms"], ["Troubleshooting", "/docs/install#troubleshooting"]]],
];
export function DocsLayout({ children, title = "Documentation" }: { children: React.ReactNode; title?: string }) {
  return <Shell><Header />
    <div className="w-gradient relative overflow-hidden px-5 pb-20 pt-6 text-white"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3"><p className="text-sm text-white/80"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/docs" className="hover:text-white">Docs</Link> / <span className="text-rasp-200">{title}</span></p><div className="flex gap-2 text-xs"><Link href="/demo" className="w-btn-accent px-3 py-1.5 text-xs">Try the demo</Link><Link href="/contact" className="w-btn-glass px-3 py-1.5 text-xs">Get install help</Link></div></div></div>
    <div className="mx-auto -mt-14 grid max-w-6xl gap-8 px-5 pb-14 md:grid-cols-[230px_1fr]">
    <aside className="hidden self-start md:block"><div className="w-card-lg sticky top-24 p-5">{nav.map(([g, items], i) => <div key={g} className={i ? "mt-5" : ""}><p className={["w-eyebrow", "w-eyebrow-alt", "w-eyebrow-amber"][i]}>{g}</p><ul className="mt-2 space-y-1.5 text-sm">{items.map(([l, h]) => <li key={h}><Link href={h} className="block rounded-md px-2 py-1 text-warm-600 hover:bg-warm-50 hover:text-navy-700">{l}</Link></li>)}</ul></div>)}
      <div className="mt-6 rounded-md bg-rasp-50 p-3 text-xs text-rasp-900 ring-1 ring-rasp-200"><b>Early access.</b> Waylo is self-serve. Walk through the <Link href="/how-it-works" className="underline">product tour</Link> or check <Link href="/docs/install#troubleshooting" className="underline">troubleshooting</Link>.</div></div></aside>
    <main className="w-card-lg min-w-0 p-6 sm:p-9 text-[15px] leading-7 text-warm-700 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-warm-900 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-t [&_h2]:border-warm-100 [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-warm-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-warm-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_.not-prose_ul]:list-none [&_.not-prose_ul]:pl-0 [&_a]:text-navy-700 [&_code]:rounded [&_code]:bg-navy-50 [&_code]:px-1 [&_code]:text-[13px] [&_code]:text-navy-800 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit">{children}</main>
  </div><Footer /></Shell>;
}
