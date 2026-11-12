import { WorkflowStrip, PhotoBand, PHOTOS } from "@/components/marketing/Visuals";
import Link from "next/link";
import { MarketingPage, FactsBlock, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip } from "@/components/marketing/Visuals";
import { JsonLd, crumbsLd, faqLd, pageMeta, FAQ_GROUPS, DEFINITION } from "@/lib/seo";
export const metadata = pageMeta("/faq", "Waylo FAQ", "Answers about Waylo. What it is, where answers come from, sources, buying signals, Slack and CRM handoff, install, data and the AI model, and pricing.");
const all = FAQ_GROUPS.flatMap(g => g.items);
const tones = ["teal", "amber", "indigo"] as const;
export default function Faq() {
  return <MarketingPage eyebrow="FAQ" crumb="FAQ" title="Waylo frequently asked questions" sub={`${all.length} straight answers about how Waylo works, what it costs, and how to install it.`} answer={DEFINITION}>
    <JsonLd data={[faqLd(all), crumbsLd([["FAQ", "/faq"]])]} />
    <Section className="w-band-paper py-16"><div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block"><div className="w-tile w-tile-card ring-1 ring-warm-200 sticky top-24 p-5"><p className="w-pill">Topics</p><ul className="mt-3 space-y-2 text-sm">{FAQ_GROUPS.map(g => <li key={g.id}><a href={`#${g.id}`} className="text-warm-600 hover:text-navy-700">{g.title}</a></li>)}</ul><Link href="/signup" className="w-btn mt-5 w-full">Start free trial</Link><Link href="/how-it-works" className="mt-2 block text-center text-sm font-medium text-navy-700 hover:underline">See how it works</Link></div></aside>
      <div className="space-y-12">{FAQ_GROUPS.map((g, i) => <section key={g.id} id={g.id} className="scroll-mt-24"><div className="flex items-center gap-3"><Chip t={tones[i % 3]}>{g.items.length} questions</Chip><h2 className="font-display text-3xl font-semibold tracking-tight text-warm-900">{g.title}</h2></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{g.items.map(([q, a]) => <details key={q} open={i === 0} className="w-tile w-tile-card ring-1 ring-warm-200 group p-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-warm-900"><h3>{q}</h3><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rasp-50 text-rasp-700 ring-1 ring-rasp-200 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-warm-600">{a}</p></details>)}</div></section>)}</div>
    </div>
      <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-warm-600">More detail: <Link href="/features" className="text-navy-700 underline">features</Link> · <Link href="/pricing" className="text-navy-700 underline">pricing</Link> · <Link href="/docs/install" className="text-navy-700 underline">install guide</Link>.</p></Section>
    <Section className="bg-card py-16 sm:py-20"><FactsBlock /></Section>
    <Section eyebrow="The Waylo loop" title="Crawl, answer, flag, and hand off" className="bg-card py-16 sm:py-20"><WorkflowStrip /><div className="mt-6"><PhotoBand items={[PHOTOS.support, PHOTOS.meeting, PHOTOS.dashboard, PHOTOS.workshop]} /></div></Section>
    <section className="w-band-paper px-5 py-16"><CTA /></section>
  </MarketingPage>;
}
