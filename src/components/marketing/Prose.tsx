import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
// Legal pages: visual template only. The legal text itself lives in each page and is unchanged.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return <Shell><Header /><main>
    <section className="w-band-navy relative overflow-hidden px-5 pb-24 pt-10 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute -right-10 top-10 hidden h-36 w-36 rotate-6 rounded-[28px] bg-rasp-600/90 lg:block" />
      <div className="relative mx-auto max-w-3xl"><nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>{title}</span></nav>
        <p className="w-pill w-pill-dark mt-6"><span className="w-pill-dot" />Legal</p>
        <h1 className="w-h-lg mt-5 font-semibold text-white">{title}</h1><p className="mt-4 text-sm text-white/70">Last updated {updated}</p></div>
    </section>
    <div className="relative z-10 -mt-12 px-5 pb-16"><div className="w-tile w-tile-card mx-auto max-w-3xl p-7 shadow-xl shadow-navy-950/10 sm:p-10">
      <div className="w-tile w-tile-blush p-4 text-sm leading-6 text-rasp-900">This document is a plain-language template. It’s usable as-is, but have a lawyer review it for your jurisdiction before relying on it.</div>
      <div className="mt-8 space-y-4 text-[15px] leading-7 text-warm-700 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-warm-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:text-navy-700 [&_a]:underline">{children}</div>
    </div></div>
  </main><Footer /></Shell>;
}
