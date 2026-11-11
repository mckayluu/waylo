import Link from "next/link";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
import { COMPARE } from "@/lib/pages/compare";
export const metadata = pageMeta("/compare", "Compare Waylo with other website chat", "How Waylo compares with generic AI chatbots and staffed live chat, what each does better, and when to use which.");
export default function CompareIndex() {
  return <MarketingPage eyebrow="Compare" crumb="Compare" title="How Waylo compares" sub="These pages compare kinds of tools. They also say when Waylo is the wrong pick." answer="Waylo is narrower than most website chat. It answers only from your pages with links, flags buying intent, and can alert Slack. Generic AI chatbots offer more channels and integrations. Live chat gives you a person in real time.">
    <JsonLd data={[crumbsLd([["Compare", "/compare"]])]} />
    <Section className="pt-10"><div className="grid gap-5 md:grid-cols-2">{COMPARE.map(c => <Link key={c.path} href={c.path} className="w-card-lg group block p-6 transition hover:border-rasp-300"><p className="w-eyebrow-alt">Comparison</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-warm-900 group-hover:text-navy-800">{c.crumb}</h2><p className="mt-2 text-sm leading-6 text-warm-600">{c.answer}</p><span className="mt-4 inline-block text-sm font-semibold text-navy-700">Read the comparison →</span></Link>)}</div>
      <p className="mt-6 text-sm text-warm-500">We don’t compare against named competitors. Features change, so check each vendor’s current docs.</p></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
