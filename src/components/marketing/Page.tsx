import Link from "next/link";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
import { FACTS } from "@/lib/seo";
import { HeroCollage, type HeroArt } from "./PageArt";
// Inner marketing page shell. Same rhythm as the homepage: navy hero (photo + code-drawn card when `art` is set),
// a short-answer tile, then tinted bands from the page body, and the navy CTA tile.
export function MarketingPage({ eyebrow, title, answer, crumb, sub, art, ctas = true, children }: { eyebrow: string; sub?: string; title: string; answer: string; crumb: string; art?: HeroArt; ctas?: boolean; children: React.ReactNode }) {
  return <Shell><Header /><main>
    <section className="w-band-navy relative overflow-hidden px-5 pb-24 pt-10 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute -left-16 bottom-10 hidden h-32 w-32 -rotate-6 rounded-[26px] bg-navy-700 lg:block" />
      {!art && <><div aria-hidden className="pointer-events-none absolute -right-10 top-10 hidden h-40 w-40 rotate-6 rounded-[28px] bg-rasp-600/90 lg:block" /><div aria-hidden className="pointer-events-none absolute right-32 top-40 hidden h-20 w-20 -rotate-3 rounded-[18px] bg-blush/80 lg:block" /></>}
      <div className={`relative mx-auto grid max-w-6xl items-center gap-12 ${art ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>{crumb}</span></nav>
          <p className="w-pill w-pill-dark mt-6"><span className="w-pill-dot" />{eyebrow}</p>
          <h1 className={`${art ? "w-h-lg" : "w-h-lg max-w-3xl"} mt-5 font-semibold text-white`}>{title}</h1>
          {sub && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{sub}</p>}
          {ctas && <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/try" className="w-btn-glass w-btn-lg">Try it on your site</Link></div>}
        </div>
        {art && <div className="relative"><HeroCollage art={art} /></div>}
      </div>
    </section>
    <div className="relative z-10 -mt-12 px-5"><div className="w-tile w-tile-card mx-auto max-w-6xl p-7 shadow-xl shadow-navy-950/10 sm:p-8"><p className="w-pill">Short answer</p><p className="mt-3 max-w-4xl text-lg leading-8 text-warm-700">{answer}</p></div></div>
    {children}
  </main><Footer /></Shell>;
}
export function FactsBlock() {
  return <div className="mx-auto max-w-4xl"><h2 className="w-h-lg font-semibold text-warm-900">Waylo at a glance</h2>
    <dl className="mt-8 grid gap-3 sm:grid-cols-2">{FACTS.map(([k, v]) => <div key={k} className="w-tile w-tile-card p-5"><dt className="font-plex text-[11px] font-medium uppercase tracking-[0.09em] text-rasp-700">{k}</dt><dd className="mt-1.5 leading-7 text-warm-700">{v}</dd></div>)}</dl></div>;
}
export function CTA() {
  return <div className="w-tile w-band-navy relative mx-auto max-w-6xl overflow-hidden px-8 py-14 text-center sm:px-12">
    <div aria-hidden className="absolute -right-6 -top-6 h-32 w-32 rotate-6 rounded-[28px] bg-rasp-600" /><div aria-hidden className="absolute bottom-8 left-10 h-14 w-14 -rotate-6 rounded-[14px] bg-blush" />
    <div className="relative"><h2 className="w-h-lg font-semibold text-white">See it on your own site.</h2><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/80">Start the 14-day Trial with no card, or enter your website and ask it a few questions first.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/try" className="w-btn-glass w-btn-lg">Try it on your site</Link></div></div>
  </div>;
}
