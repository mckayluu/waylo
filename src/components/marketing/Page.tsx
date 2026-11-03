import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
import { FACTS } from "@/lib/seo";
export function MarketingPage({ eyebrow, title, answer, crumb, children }: { eyebrow: string; title: string; answer: string; crumb: string; children: React.ReactNode }) {
  return <Shell><Header /><main>
    <section className="px-5 pb-6 pt-16 sm:pt-20"><div className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-xs text-stone-500"><Link href="/" className="hover:text-teal-700">Home</Link> / <span>{crumb}</span></nav>
      <p className="mt-6 w-eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-6 rounded-xl border-l-4 border-teal-700 bg-white p-5 text-lg leading-8 text-stone-700">{answer}</p>
    </div></section>
    {children}
  </main><Footer /></Shell>;
}
export function FactsBlock() {
  return <div className="mx-auto max-w-3xl"><h2 className="text-2xl font-semibold tracking-tight">Waylo at a glance</h2>
    <dl className="mt-5 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">{FACTS.map(([k, v]) => <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[160px_1fr]"><dt className="text-sm font-semibold text-stone-900">{k}</dt><dd className="text-sm text-stone-600">{v}</dd></div>)}</dl></div>;
}
export function CTA() {
  return <div className="mx-auto max-w-3xl rounded-2xl bg-teal-800 p-8 text-center text-white"><h2 className="text-2xl font-semibold">See Waylo answer on a real site</h2><p className="mt-2 text-teal-100">Try the live demo or request early access.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/demo" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-teal-900">Try the live demo</Link><a href="mailto:hello@waylo.ai?subject=Waylo%20early%20access" className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium">Request access</a></div></div>;
}
