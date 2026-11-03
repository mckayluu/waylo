import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
const nav: [string, string][] = [["Overview", "/docs"], ["Install guide", "/docs/install"], ["Embed options", "/docs/install#options"], ["JavaScript API", "/docs/install#api"], ["Allow your domain", "/docs/install#allowlist"], ["CMS notes", "/docs/install#cms"], ["Troubleshooting", "/docs/install#troubleshooting"]];
export function DocsLayout({ children }: { children: React.ReactNode }) {
  return <Shell><Header /><div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[200px_1fr]">
    <aside className="hidden md:block"><p className="w-eyebrow">Docs</p><ul className="sticky top-24 mt-3 space-y-2 text-sm">{nav.map(([l, h]) => <li key={h}><Link href={h} className="text-stone-600 hover:text-teal-700">{l}</Link></li>)}</ul></aside>
    <main className="min-w-0 max-w-3xl text-[15px] leading-7 text-stone-700 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-stone-900 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-stone-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:text-teal-700 [&_code]:rounded [&_code]:bg-stone-100 [&_code]:px-1 [&_code]:text-[13px] [&_pre_code]:bg-transparent [&_pre_code]:p-0">{children}</main>
  </div><Footer /></Shell>;
}
