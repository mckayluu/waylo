import Link from "next/link";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Shot } from "@/components/marketing/Shots";
import { JsonLd, crumbsLd, pageMeta, orgLd } from "@/lib/seo";
export const metadata = pageMeta("/about", "About Waylo", "Waylo is an early-access product built by McKay Luu: AI website chat that answers from your own pages with sources and tells your team who is ready to buy.");
const beliefs: [string, string][] = [
  ["Show the source or don’t say it", "A website bot that can’t point to where an answer came from shouldn’t be talking to buyers. Every Waylo answer links its pages."],
  ["“I don’t know” is a feature", "When your site doesn’t cover a question, the right answer is to say so and get a person. Those gaps are also your content to-do list."],
  ["Alerts go where people already are", "Sales teams live in Slack. A hot visitor should show up there, not in another inbox nobody opens."],
  ["Say what isn’t built", "Every product page has an “honest limits” box. If it isn’t in the product, it isn’t on the site."],
];
const stack: [string, string][] = [["App", "Next.js, one Node server"], ["Data", "Postgres on Supabase, isolated per workspace"], ["Answers", "OpenAI API (gpt-4o-mini by default)"], ["Billing", "Stripe Checkout and Customer Portal (test mode in early access)"], ["Email", "Resend, for invites and password resets"], ["Hosting", "Render, free tier during early access (a keep-alive ping limits cold starts, but expect the odd slow first load)"]];
export default function About() {
  return <MarketingPage eyebrow="About" crumb="About" title="A small product with a narrow promise" sub="Waylo answers website visitors from your own pages, shows its sources, and tells your team who’s ready to buy. That’s the whole job." answer="Waylo is an early-access product built by McKay Luu. It’s AI chat for B2B and SaaS websites that answers only from your published pages and guidance, links its sources, flags buying intent, and alerts your team in Slack.">
    <JsonLd data={[orgLd, crumbsLd([["About", "/about"]])]} />
    <Section className="pt-10"><div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="max-w-2xl space-y-4 leading-7 text-stone-700"><p className="w-eyebrow">Why it exists</p>
        <p>Most website chat falls into two camps. Staffed live chat is great when someone is online and expensive when they aren’t. AI chatbots are always on, and will cheerfully tell a buyer you support something you don’t.</p>
        <p>Waylo sits in between on purpose: always on, but held to what your site actually says, with the link to prove it. And because the questions buyers ask are the best sales data most sites never collect, it records them, flags the serious ones, and sends those to a person.</p>
        <p>It’s early. There are no customer logos on this site because there aren’t customers to show yet, and we won’t invent them. The first teams get a done-with-you setup and a direct line to the person building it.</p>
        <p className="pt-2">The <Link href="/contact" className="font-semibold text-teal-700 hover:underline">contact form</Link> reaches McKay directly.</p></div>
      <Shot k="answer" />
    </div></Section>
    <Section eyebrow="How we build it" title="Four rules" className="bg-white"><dl className="grid gap-px overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200 md:grid-cols-2">{beliefs.map(([h, d]) => <div key={h} className="bg-white p-6"><dt className="font-semibold text-stone-900">{h}</dt><dd className="mt-2 text-sm leading-6 text-stone-600">{d}</dd></div>)}</dl></Section>
    <Section eyebrow="What it runs on" title="The stack, plainly" sub="Useful if you’re doing a vendor review. Details on the Security page.">
      <dl className="grid border-t border-stone-200 sm:grid-cols-2 sm:gap-x-10">{stack.map(([k, v]) => <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone-200 py-3"><dt className="text-sm font-semibold text-stone-900">{k}</dt><dd className="text-sm text-stone-600">{v}</dd></div>)}</dl>
      <p className="mt-5 text-sm"><Link href="/security" className="font-semibold text-teal-700 hover:underline">Security & data →</Link> · <Link href="/changelog" className="font-semibold text-teal-700 hover:underline">Changelog →</Link></p></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
