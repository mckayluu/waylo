import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip, WorkflowStrip } from "@/components/marketing/Visuals";
import { PEOPLE, type HeroArt } from "@/components/marketing/PageArt";
const ART: Record<string, HeroArt> = { marketing: { photo: "twoWomen", overlay: "session" }, sales: { photo: "salesTeam", overlay: "slack" }, saas: { photo: "cafe", overlay: "chat" }, agencies: { photo: "pair", overlay: "chat" } };
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import { SOLUTIONS, getSolution } from "@/lib/solutions";
export const dynamicParams = false;
export function generateStaticParams() { return SOLUTIONS.map(s => ({ slug: s.id })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getSolution(params.slug); if (!s) return {};
  return pageMeta(`/solutions/${s.id}`, `Waylo for ${s.who.toLowerCase()}`, s.answer);
}
const tones = ["teal", "indigo", "amber"] as const;
export default function SolutionPage({ params }: { params: { slug: string } }) {
  const s = getSolution(params.slug); if (!s) notFound();
  const others = SOLUTIONS.filter(o => o.id !== s.id);
  const art = ART[s.id] || ART.marketing;
  return <MarketingPage eyebrow={`Solutions · ${s.who}`} crumb={s.who} title={s.headline} sub={s.sub} answer={s.answer} art={art}>
    <JsonLd data={[crumbsLd([["Solutions", "/use-cases"], [s.who, `/solutions/${s.id}`]]), faqLd(s.faqs)]} />
    <Section className="w-band-paper py-16 sm:py-20" eyebrow="Why it matters" title={`What changes for ${s.who.toLowerCase()}`}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="w-tile w-tile-mist p-7"><p className="font-display text-xl font-semibold text-warm-900">Today</p><ul className="mt-4 space-y-2.5 leading-7 text-warm-700">{s.pains.map(p => <li key={p} className="flex gap-2.5"><span aria-hidden className="text-warm-400">–</span>{p}</li>)}</ul></div>
        <div className="w-tile w-tile-blush p-7"><p className="font-display text-xl font-semibold text-warm-900">With Waylo</p><ul className="mt-4 space-y-2.5 leading-7 text-warm-700">{s.wins.map(p => <li key={p} className="flex gap-2.5"><span aria-hidden className="text-rasp-700">✓</span>{p}</li>)}</ul></div>
      </div>
    </Section>
    <Section className="w-band-mist py-16 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div><p className="w-pill">A sample conversation</p><h2 className="w-h-lg mt-5 font-semibold text-warm-900">One visit, start to finish</h2><p className="mt-4 max-w-md text-lg leading-8 text-warm-600">A made-up visit to show the flow. The signals and the Slack post are real Waylo features.</p>
          <div className="mt-6 flex flex-wrap gap-2">{s.signals.map((x, i) => <Chip key={x} t={tones[i % 3]}>{x}</Chip>)}</div></div>
        <ol className="w-tile w-tile-card space-y-1 p-6 shadow-xl shadow-navy-950/10">{s.scenario.map(([who, what], j) => <li key={who} className="flex gap-4 py-2"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 font-display text-white">{j + 1}</span><div><p className="font-semibold text-warm-900">{who}</p><p className="mt-0.5 leading-7 text-warm-700">{what}</p></div></li>)}</ol>
      </div>
    </Section>
    <Section className="bg-card py-16 sm:py-20" eyebrow="Rollout" title="Live in an afternoon" sub="Setup is the same for every team. You can do it yourself, with no call.">
      <ol className="grid gap-4 md:grid-cols-4">{s.setup.map(([h, d], i) => <li key={h} className={`w-tile ${["w-tile-mist", "w-tile-blush", "w-tile-cream", "w-tile-mist"][i % 4]} p-6`}><span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 font-display text-lg font-semibold text-white">{i + 1}</span><p className="mt-4 font-display text-lg font-semibold text-warm-900">{h}</p><p className="mt-1.5 leading-7 text-warm-700">{d}</p></li>)}</ol>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-warm-600">Features used: {s.features.map((f, j) => <Chip key={f} t={tones[j % 3]}>{f}</Chip>)} <Link href="/features" className="ml-2 font-medium text-navy-700 underline">See all features →</Link></div>
    </Section>
    <Section className="w-band-paper py-16 sm:py-20" eyebrow="How Waylo works" title="Crawl, answer, flag, and hand off"><WorkflowStrip /></Section>
    <section className="w-band-mist px-5 py-16 sm:py-20"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]"><div><h2 className="w-h-lg font-semibold text-warm-900">Questions</h2><Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-navy-700 hover:underline">All questions →</Link></div>
      <div className="divide-y divide-warm-200 border-y border-warm-200">{s.faqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-warm-900"><h3>{q}</h3><span className="text-lg leading-none text-rasp-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl leading-7 text-warm-600">{a}</p></details>)}</div></div></section>
    <Section className="w-band-paper py-16 sm:py-20" title="Waylo for other teams">
      <ul className="grid gap-5 md:grid-cols-3">{others.map(o => { const a = ART[o.id] || ART.marketing; const ph = PEOPLE[a.photo]; return <li key={o.id}><Link href={`/solutions/${o.id}`} className="w-tile w-tile-card group flex h-full flex-col overflow-hidden ring-1 ring-warm-200 transition hover:-translate-y-0.5 hover:ring-rasp-600"><Image src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} sizes="(min-width:768px) 360px, 100vw" className="h-40 w-full object-cover" /><span className="flex flex-1 flex-col p-6"><span className="font-display text-xl font-semibold text-warm-900">{o.who}</span><span className="mt-2 flex-1 leading-7 text-warm-600">{o.short}</span><span className="mt-4 text-sm font-semibold text-rasp-700 group-hover:underline">Learn more →</span></span></Link></li>; })}</ul>
    </Section>
    <section className="w-band-paper px-5 pb-16"><CTA /></section>
  </MarketingPage>;
}
