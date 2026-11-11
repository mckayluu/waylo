import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip, MiniCTA, WorkflowStrip } from "@/components/marketing/Visuals";
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
  return <MarketingPage eyebrow={`Solutions · ${s.who}`} crumb={s.who} title={s.headline} sub={s.sub} answer={s.answer}>
    <JsonLd data={[crumbsLd([["Solutions", "/use-cases"], [s.who, `/solutions/${s.id}`]]), faqLd(s.faqs)]} />
    <Section className="w-mesh" eyebrow="Why it matters" title={`What changes for ${s.who.toLowerCase()}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden rounded-2xl w-glow"><Image src={s.img} alt={`${s.who} using Waylo`} width={1400} height={934} sizes="(min-width:1024px) 520px, 100vw" className="h-full min-h-64 w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-stone-950/60 via-indigo-950/10 to-amber-500/10" /><div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">{s.signals.map((x, i) => <Chip key={x} t={tones[i % 3]}>{x}</Chip>)}</div></div>
        <div className="grid gap-6 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Without Waylo</p><ul className="mt-3 space-y-2 text-sm text-stone-700">{s.pains.map(p => <li key={p} className="flex gap-2"><span className="text-stone-400">—</span>{p}</li>)}</ul></div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">With Waylo</p><ul className="mt-3 space-y-2 text-sm text-stone-700">{s.wins.map(p => <li key={p} className="flex gap-2"><span className="text-teal-700">✓</span>{p}</li>)}</ul></div>
          <div className="w-card-lg p-5 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">A sample conversation</p><ol className="mt-3 border-l-2 border-amber-300 pl-4">{s.scenario.map(([who, what]) => <li key={who} className="py-2"><div><p className="text-sm font-semibold text-stone-900">{who}</p><p className="text-sm text-stone-600">{what}</p></div></li>)}</ol></div></div>
      </div>
    </Section>
    <Section className="bg-white" eyebrow="Rollout" title="Live in an afternoon" sub="Setup is the same for every team. Most sites can go live the same afternoon.">
      <ol className="grid border-t border-stone-200 md:grid-cols-4 md:divide-x md:divide-stone-200">{s.setup.map(([h, d], i) => <li key={h} className="border-b border-stone-200 py-4 md:border-b-0 md:px-5 md:first:pl-0"><span className="font-mono text-xs text-amber-700">Step {i + 1}</span><p className="mt-1 font-semibold text-stone-900">{h}</p><p className="mt-1 text-sm leading-6 text-stone-600">{d}</p></li>)}</ol>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-stone-600">Features used: {s.features.map((f, j) => <Chip key={f} t={tones[j % 3]}>{f}</Chip>)} <Link href="/features" className="ml-2 font-medium text-teal-700 underline">See all features →</Link></div>
    </Section>
    <Section className="w-mesh" eyebrow="How Waylo works" title="Crawl, answer, flag, and hand off"><WorkflowStrip /></Section>
    <Section className="bg-white" eyebrow="FAQ" title={`Questions from ${s.who.toLowerCase()}`}>
      <div className="max-w-4xl divide-y divide-stone-200 border-y border-stone-200">{s.faqs.map(([q, a]) => <details key={q} className="group py-4" open><summary className="cursor-pointer font-semibold text-stone-900">{q}</summary><p className="mt-2 text-sm leading-6 text-stone-600">{a}</p></details>)}</div>
      <p className="mt-6 text-sm text-stone-600">More answers in the <Link href="/faq" className="text-teal-700 underline">FAQ</Link> and the <Link href="/docs/install" className="text-teal-700 underline">install guide</Link>.</p>
    </Section>
    <Section eyebrow="Other teams" title="Other teams using Waylo">
      <ul className="divide-y divide-stone-200 border-y border-stone-200">{others.map(o => <li key={o.id}><Link href={`/solutions/${o.id}`} className="grid gap-1 py-4 hover:text-teal-800 sm:grid-cols-[200px_1fr_auto] sm:items-baseline sm:gap-6"><span className="font-semibold text-stone-900">{o.who}</span><span className="text-sm text-stone-600">{o.short}</span><span className="text-sm font-medium text-teal-700">Read →</span></Link></li>)}</ul>
      <div className="mt-10"><MiniCTA title={`Set Waylo up for your ${s.id === "agencies" ? "clients" : "team"}`} body="Start on the free trial or see plans for Starter and Growth." /></div>
      <div className="mt-10"><CTA /></div>
    </Section>
  </MarketingPage>;
}
