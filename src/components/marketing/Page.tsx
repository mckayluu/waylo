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
  return <div className="mx-auto max-w-5xl w-gradient w-glow relative overflow-hidden rounded-2xl p-10 text-center text-white"><h2 className="text-2xl font-semibold">See Waylo answer on a real site</h2><p className="mt-2 text-white/85">Ask the demo a real question, watch the cited answer, then see the signal it creates. Early access teams get a done-with-you setup.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/demo" className="w-btn-accent px-4 py-2">Try the live demo</Link><a href="mailto:hello@waylo.ai?subject=Waylo%20early%20access" className="w-btn-glass">Request access</a></div></div>;
}
