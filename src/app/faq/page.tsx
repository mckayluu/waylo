import Link from "next/link";
import { MarketingPage, FactsBlock, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip } from "@/components/marketing/Visuals";
import { JsonLd, crumbsLd, faqLd, pageMeta, FAQ_GROUPS, DEFINITION } from "@/lib/seo";
export const metadata = pageMeta("/faq", "FAQ: how Waylo AI website chat works", "Answers about Waylo: what it is, where answers come from, cited sources, buying-intent signals, Slack and CRM handoff, install and performance, data and AI model, and pricing.");
const all = FAQ_GROUPS.flatMap(g => g.items);
const tones = ["teal", "amber", "indigo"] as const;
export default function Faq() {
  return <MarketingPage eyebrow="FAQ" crumb="FAQ" title="Waylo frequently asked questions" sub={`${all.length} straight answers about how Waylo works, what it costs, and how to install it.`} answer={DEFINITION}>
    <JsonLd data={[faqLd(all), crumbsLd([["FAQ", "/faq"]])]} />
    <Section className="pt-10"><div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block"><div className="w-card-lg sticky top-24 p-5"><p className="w-eyebrow-amber">Topics</p><ul className="mt-3 space-y-2 text-sm">{FAQ_GROUPS.map(g => <li key={g.id}><a href={`#${g.id}`} className="text-stone-600 hover:text-teal-700">{g.title}</a></li>)}</ul><a href="mailto:hello@waylo.ai" className="w-btn mt-5 w-full">Ask us directly</a></div></aside>
      <div className="space-y-12">{FAQ_GROUPS.map((g, i) => <section key={g.id} id={g.id} className="scroll-mt-24"><div className="flex items-center gap-3"><Chip t={tones[i % 3]}>{g.items.length} questions</Chip><h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{g.items.map(([q, a]) => <details key={q} open={i === 0} className="w-card-lg group p-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-stone-900"><h3>{q}</h3><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-stone-600">{a}</p></details>)}</div></section>)}</div>
    </div>
      <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-stone-600">More detail: <Link href="/features" className="text-teal-700 underline">features</Link> · <Link href="/pricing" className="text-teal-700 underline">pricing</Link> · <Link href="/docs/install" className="text-teal-700 underline">install guide</Link>.</p></Section>
    <Section className="bg-white"><FactsBlock /></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
