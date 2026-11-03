import Link from "next/link";
import { MarketingPage, FactsBlock, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, faqLd, pageMeta, FAQS, DEFINITION } from "@/lib/seo";
export const metadata = pageMeta("/faq", "FAQ: how Waylo AI website chat works", "Answers to common questions about Waylo: what it is, where answers come from, install, performance, CRM integrations, AI model, and pricing.");
export default function Faq() {
  return <MarketingPage eyebrow="FAQ" crumb="FAQ" title="Waylo frequently asked questions" answer={DEFINITION}>
    <JsonLd data={[faqLd(FAQS), crumbsLd([["FAQ", "/faq"]])]} />
    <Section className="pt-6"><div className="mx-auto max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{FAQS.map(([q, a]) => <div key={q} className="py-6"><h2 className="text-lg font-semibold">{q}</h2><p className="mt-2 leading-7 text-stone-600">{a}</p></div>)}</div>
      <p className="mx-auto mt-6 max-w-3xl text-sm text-stone-600">More detail: <Link href="/features" className="text-teal-700 underline">features</Link> · <Link href="/pricing" className="text-teal-700 underline">pricing</Link> · <Link href="/docs/install" className="text-teal-700 underline">install guide</Link>.</p></Section>
    <Section className="bg-white"><FactsBlock /></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
