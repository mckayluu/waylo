import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip, IconTile, MiniCTA, WorkflowStrip } from "@/components/marketing/Visuals";
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
        <div className="grid gap-4 sm:grid-cols-2"><div className="w-card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Without Waylo</p><ul className="mt-3 space-y-2 text-sm text-stone-700">{s.pains.map(p => <li key={p} className="flex gap-2"><span className="text-stone-400">—</span>{p}</li>)}</ul></div>
          <div className="w-card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">With Waylo</p><ul className="mt-3 space-y-2 text-sm text-stone-700">{s.wins.map(p => <li key={p} className="flex gap-2"><span className="text-teal-700">✓</span>{p}</li>)}</ul></div>
          <div className="w-card-lg p-5 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">A real conversation, start to finish</p><ol className="mt-3 divide-y divide-stone-100">{s.scenario.map(([who, what], j) => <li key={who} className="flex gap-3 py-3"><IconTile t={tones[j]}>{j + 1}</IconTile><div><p className="text-sm font-semibold text-stone-900">{who}</p><p className="text-sm text-stone-600">{what}</p></div></li>)}</ol></div></div>
      </div>
    </Section>
    <Section className="bg-white" eyebrow="Rollout" title="Live in an afternoon" sub="The same four steps every team follows — no engineering sprint required.">
      <ol className="grid gap-4 md:grid-cols-4">{s.setup.map(([h, d], i) => <li key={h} className="w-card p-5"><IconTile t={tones[i % 3]}>{i + 1}</IconTile><p className="mt-3 font-semibold text-stone-900">{h}</p><p className="mt-1 text-sm leading-6 text-stone-600">{d}</p></li>)}</ol>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-stone-600">Features used: {s.features.map((f, j) => <Chip key={f} t={tones[j % 3]}>{f}</Chip>)} <Link href="/features" className="ml-2 font-medium text-teal-700 underline">See all features →</Link></div>
    </Section>
    <Section className="w-mesh" eyebrow="How Waylo works" title="Crawl, answer, signal, hand off"><WorkflowStrip /></Section>
    <Section className="bg-white" eyebrow="FAQ" title={`Questions from ${s.who.toLowerCase()}`}>
      <div className="mx-auto grid max-w-4xl gap-3">{s.faqs.map(([q, a]) => <details key={q} className="w-card group p-5" open><summary className="cursor-pointer font-semibold text-stone-900">{q}</summary><p className="mt-2 text-sm leading-6 text-stone-600">{a}</p></details>)}</div>
      <p className="mt-6 text-center text-sm text-stone-600">More answers in the <Link href="/faq" className="text-teal-700 underline">FAQ</Link> and the <Link href="/docs/install" className="text-teal-700 underline">install guide</Link>.</p>
    </Section>
    <Section eyebrow="Other teams" title="Waylo for every team that owns the site">
      <div className="grid gap-4 md:grid-cols-3">{others.map(o => <Link key={o.id} href={`/solutions/${o.id}`} className="w-card-lg block p-5 transition hover:-translate-y-0.5 hover:border-amber-300"><Chip t={o.t}>{o.who}</Chip><p className="mt-3 font-semibold text-stone-900">{o.short}</p><p className="mt-1 text-sm text-stone-600">{o.wins[0]}</p></Link>)}</div>
      <div className="mt-10"><MiniCTA title={`Set Waylo up for your ${s.id === "agencies" ? "clients" : "team"}`} body="Start on the free trial or see plans for Starter and Growth." /></div>
      <div className="mt-10"><CTA /></div>
    </Section>
  </MarketingPage>;
}
