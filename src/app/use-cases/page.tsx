import Link from "next/link";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/use-cases", "Use cases for marketing, sales, and SaaS websites", "How marketing teams, sales teams, and SaaS companies use Waylo to answer website visitors with cited sources, capture intent, and route warm leads.");
const cases: [string, string, string, string[]][] = [
  ["marketing", "Marketing teams", "Waylo turns website traffic into qualified conversations by answering questions instantly and showing which pages and topics drive buying intent.", ["Answer product questions 24/7 without a live-chat rota", "See the real questions visitors ask, in their words", "Find content gaps when Waylo says it doesn’t know"]],
  ["sales", "Sales teams", "Waylo alerts sales when a visitor shows buying intent and hands over the full conversation, so reps start with context instead of a cold form fill.", ["Slack alerts for pricing, demo, and integration interest", "Lead handoff with transcript and page journey", "Webhook into HubSpot, Salesforce, or any CRM"]],
  ["saas", "SaaS websites", "Waylo answers technical and pricing questions from your docs and pricing pages with links, which shortens evaluation and reduces support tickets.", ["Cite docs pages in answers", "Sidebar mode for docs and help centers", "Tracking-only mode to measure intent before enabling chat"]],
  ["agencies", "Agencies and multi-site teams", "Waylo runs on several sites from one dashboard, each with its own crawl, guidance, and handoff routing.", ["Up to 3 sites on Growth", "Per-site guidance and brand color", "Roles for clients and teammates"]],
];
const qa: [string, string][] = cases.map(([, t, a]) => [`How do ${t.toLowerCase()} use Waylo?`, a]);
export default function UseCases() {
  return <MarketingPage eyebrow="Use cases" crumb="Use cases" title="Who uses Waylo, and for what" answer="Waylo is used by marketing and sales teams at B2B and SaaS companies to answer website visitors with cited answers from their own pages, detect buying intent, and route warm leads to sales in Slack or the CRM.">
    <JsonLd data={[crumbsLd([["Use cases", "/use-cases"]]), faqLd(qa)]} />
    {cases.map(([id, t, a, pts], i) => <Section key={id} id={id} className={i % 2 ? "bg-white" : ""}><div className="mx-auto max-w-3xl"><h2 className="text-3xl font-semibold tracking-tight">Waylo for {t.toLowerCase()}</h2><p className="mt-4 text-lg text-stone-700">{a}</p><ul className="mt-5 space-y-2">{pts.map(p => <li key={p} className="flex gap-2 text-stone-600"><span className="text-teal-700">✓</span>{p}</li>)}</ul></div></Section>)}
    <Section><p className="mx-auto max-w-3xl text-sm text-stone-600">Explore <Link href="/features" className="text-teal-700 underline">all features</Link>, <Link href="/pricing" className="text-teal-700 underline">pricing</Link>, or the <Link href="/faq" className="text-teal-700 underline">FAQ</Link>.</p><div className="mt-10"><CTA /></div></Section>
  </MarketingPage>;
}
