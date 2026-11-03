import Link from "next/link";
import { MarketingPage, FactsBlock, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, appLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/features", "Features: cited AI answers, intent signals, lead handoff", "Waylo features: AI website chat grounded in your pages with cited sources, buying-intent signals, contact handoff, Slack and CRM webhooks, guidance rules, audiences, and team roles.");
const groups: [string, string, [string, string][]][] = [
  ["answers", "Answers visitors can trust", [["Cited sources on every reply", "Each answer links to the pages it came from, so visitors can verify it and your team can audit it."], ["Learns from your site", "Waylo crawls your public HTML pages and re-crawls on demand to stay current."], ["Admits what it doesn’t know", "When your content doesn’t cover a question, Waylo says so and offers a handoff instead of guessing."]]],
  ["signals", "Buying-intent signals", [["Intent detection", "Questions about pricing, integrations, security, and demos are flagged as signals in real time."], ["Page journeys", "See which pages a visitor viewed before and during the chat."], ["Audiences (Growth)", "Group visitors by behavior, like anyone who viewed /pricing, to focus follow-up."]]],
  ["handoff", "Handoff to your team", [["Contact & demo capture", "When a visitor is ready, Waylo collects their details with the full conversation attached."], ["Slack alerts", "Hot leads and signals post to the Slack channel you choose."], ["CRM webhooks", "Send leads to HubSpot, Salesforce, Zapier, Make, or any HTTPS endpoint."]]],
  ["control", "Control and governance", [["Guidance: facts, rules, skills", "Tell Waylo what to say, what never to say, and how to handle specific topics."], ["Team roles", "Invite admins, editors, and viewers."], ["Embed modes", "Launcher, always-open sidebar, or tracking-only. Match your brand color and position."]]],
];
export default function Features() {
  return <MarketingPage eyebrow="Features" crumb="Features" title="Waylo features" answer="Waylo is an AI chat for your website that answers visitor questions using your own pages, cites its sources on every reply, flags buying intent, and hands ready-to-talk leads to your team in Slack or your CRM.">
    <JsonLd data={[appLd, crumbsLd([["Features", "/features"]])]} />
    <nav className="mx-auto max-w-3xl px-5 text-sm"><ul className="flex flex-wrap gap-3">{groups.map(([id, t]) => <li key={id}><a href={`#${id}`} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-700 hover:border-teal-300">{t}</a></li>)}</ul></nav>
    {groups.map(([id, t, items], i) => <Section key={id} id={id} title={t} className={i % 2 ? "bg-white" : ""}><div className="grid gap-5 md:grid-cols-3">{items.map(([h, d]) => <div key={h} className="w-card p-6"><h3 className="font-semibold">{h}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{d}</p></div>)}</div></Section>)}
    <Section><FactsBlock /><p className="mx-auto mt-6 max-w-3xl text-sm text-stone-600">Next: see <Link href="/use-cases" className="text-teal-700 underline">use cases</Link>, compare <Link href="/pricing" className="text-teal-700 underline">pricing</Link>, or read the <Link href="/docs/install" className="text-teal-700 underline">install guide</Link>.</p></Section>
    <Section className="pt-0"><CTA /></Section>
  </MarketingPage>;
}
