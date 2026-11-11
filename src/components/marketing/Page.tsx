import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
import { FACTS } from "@/lib/seo";
import { ProofBar } from "./Visuals";
export function MarketingPage({ eyebrow, title, answer, crumb, sub, children }: { eyebrow: string; sub?: string; title: string; answer: string; crumb: string; children: React.ReactNode }) {
  return <Shell><Header /><main>
    <section className="w-gradient relative overflow-hidden px-5 pb-16 pt-10 text-white sm:pt-12"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>{crumb}</span></nav>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">{eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>{sub && <p className="mt-4 max-w-2xl text-lg text-white/85">{sub}</p>}
    </div></section>
    <div className="relative z-10 -mt-12 px-5"><p className="w-card-lg mx-auto max-w-5xl border-l-4 border-l-amber-500 p-6 text-lg leading-8 text-stone-700"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-amber-700">Short answer</span>{answer}</p></div>
    <div className="mx-auto mt-6 max-w-5xl px-5"><ProofBar /></div>
    {children}
  </main><Footer /></Shell>;
}
export function FactsBlock() {
  return <div className="mx-auto max-w-3xl"><h2 className="text-2xl font-semibold tracking-tight">Waylo at a glance</h2>
    <dl className="mt-5 w-card-lg divide-y divide-stone-200 overflow-hidden">{FACTS.map(([k, v]) => <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[160px_1fr]"><dt className="text-sm font-semibold text-stone-900">{k}</dt><dd className="text-sm text-stone-600">{v}</dd></div>)}</dl></div>;
}
export function CTA() {
  return <div className="mx-auto grid max-w-6xl gap-6 overflow-hidden rounded-2xl bg-stone-950 p-8 text-white sm:p-10 md:grid-cols-[1.4fr_auto] md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">Self-serve</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">Try it on your own site</h2><p className="mt-2 max-w-xl text-stone-300">The Trial gives you 500 AI messages on your own pages. Most of the setup takes an afternoon. You can also look through every screen first.</p></div><div className="flex flex-wrap gap-3 md:justify-end"><Link href="/signup" className="w-btn-accent px-4 py-2">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass">See how it works</Link></div></div>;
}
