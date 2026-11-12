import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
import { FACTS } from "@/lib/seo";
import { ProofBar } from "./Visuals";
export function MarketingPage({ eyebrow, title, answer, crumb, sub, children }: { eyebrow: string; sub?: string; title: string; answer: string; crumb: string; children: React.ReactNode }) {
  return <Shell><Header /><main>
    <section className="w-band-navy relative overflow-hidden px-5 pb-20 pt-10 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute -right-10 top-10 hidden h-40 w-40 rotate-6 rounded-[28px] bg-rasp-600/90 lg:block" />
      <div aria-hidden className="pointer-events-none absolute right-32 top-40 hidden h-20 w-20 -rotate-3 rounded-[18px] bg-blush/80 lg:block" />
      <div className="relative mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>{crumb}</span></nav>
      <p className="w-pill w-pill-dark mt-6"><span className="w-pill-dot" />{eyebrow}</p>
      <h1 className="w-h-lg mt-4 max-w-3xl font-semibold text-white">{title}</h1>{sub && <p className="mt-5 max-w-2xl text-lg text-white/85">{sub}</p>}
    </div></section>
    <div className="relative z-10 -mt-12 px-5"><p className="w-tile w-tile-card mx-auto max-w-5xl p-7 text-lg leading-8 text-warm-700 shadow-xl shadow-navy-950/10"><span className="w-pill mb-3">Short answer</span><br />{answer}</p></div>
    <div className="mx-auto mt-6 max-w-5xl px-5"><ProofBar /></div>
    {children}
  </main><Footer /></Shell>;
}
export function FactsBlock() {
  return <div className="mx-auto max-w-3xl"><h2 className="text-2xl font-semibold tracking-tight">Waylo at a glance</h2>
    <dl className="mt-5 w-card-lg divide-y divide-warm-200 overflow-hidden">{FACTS.map(([k, v]) => <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[160px_1fr]"><dt className="text-sm font-semibold text-warm-900">{k}</dt><dd className="text-sm text-warm-600">{v}</dd></div>)}</dl></div>;
}
export function CTA() {
  return <div className="w-tile w-band-navy relative mx-auto grid max-w-6xl gap-6 p-8 text-white sm:p-10 md:grid-cols-[1.4fr_auto] md:items-center"><div aria-hidden className="absolute -bottom-8 -right-8 h-32 w-32 rotate-6 rounded-[24px] bg-rasp-600" /><div className="relative"><p className="w-pill w-pill-dark">Self-serve</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">Try it on your own site</h2><p className="mt-2 max-w-xl text-warm-300">The Trial gives you 500 AI messages on your own pages. Most of the setup takes an afternoon. You can also look through every screen first.</p></div><div className="relative flex flex-wrap gap-3 md:justify-end"><Link href="/signup" className="w-btn-accent px-4 py-2">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass">See how it works</Link></div></div>;
}
