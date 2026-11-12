import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import { snippet } from "@/lib/embed";
import { SlackFormats } from "@/components/marketing/Blocks";
import { Shot } from "@/components/marketing/Shots";

export const metadata = pageMeta("/use-cases/saas-presales-slack", "SaaS pre-sales chat that hands off to Slack", "Answer SaaS evaluators’ pricing, integration, and security questions with links to your own pages. Post the conversation to Slack when they’re ready to talk.");

const questions: [string, string, string][] = [
  ["“Do you have SSO?”", "Answers from your security or docs page with the link. If no page mentions it, says it doesn’t know.", "enterprise"],
  ["“Does it integrate with HubSpot?”", "Cites your integrations page and tags integration interest.", "integration"],
  ["“What’s the difference between plans?”", "Quotes the pricing page, links it, and flags pricing intent.", "pricing"],
  ["“Can I talk to someone?”", "Asks for name and email, then posts to Slack.", "handoff"],
];
const timeline: [string, string][] = [
  ["0:00", "Visitor lands on /pricing from a comparison article."],
  ["0:40", "Asks about SSO. Waylo answers from /security and shows the source chip."],
  ["1:15", "Asks whether Growth covers 3 sites. Pricing signal recorded."],
  ["2:05", "Asks to talk to someone. Leaves a work email."],
  ["2:06", "#sales-leads gets a post with who it was, what they asked last, and an Open in Waylo link to the conversation and pages viewed."],
  ["2:20", "A rep replies by email with the answer to the one question Waylo couldn’t cover."],
];
const faq: [string, string][] = [
  ["What happens when Waylo doesn’t know the answer?", "It says it doesn’t know. The question shows up in your admin so you can add a fact or fix the page."],
  ["Which Slack setup do I need?", "An incoming webhook URL for the channel you want. Paste it in Admin → Integrations. Slack and CRM handoff work on every plan, the Trial included."],
  ["Will it answer from pages I don’t want it to use?", "It crawls only public pages and linked documents on your domain, and it honors robots.txt. You can remove pages from the index in Admin → Content and add rules for topics that should go to a person. A new crawl picks removed pages up again unless robots.txt blocks them."],
];

export default function SaasPresalesSlack() {
  return <MarketingPage eyebrow="Use case" crumb="SaaS pre-sales → Slack" title="Pre-sales chat for SaaS that hands off to Slack" sub="Evaluators ask the same five questions before they talk to sales. Waylo answers them from your docs and pricing with links and posts the serious ones to Slack." answer="Waylo answers SaaS pre-sales questions about pricing, integrations, and security with links to your own pages. It says when it doesn’t know. It posts the conversation to Slack when a visitor asks for a person or shows buying intent.">
    <JsonLd data={[crumbsLd([["Use cases", "/use-cases"], ["SaaS pre-sales → Slack", "/use-cases/saas-presales-slack"]]), faqLd(faq)]} />
    <Section eyebrow="What it answers" title="The questions that come before a demo" sub="Each answer links the page it came from, so the evaluator can check it and so can you.">
      <div className="divide-y divide-warm-200 border-y border-warm-200">{questions.map(([q, a, sig]) => <div key={q} className="grid gap-2 py-4 sm:grid-cols-[260px_1fr_auto] sm:items-baseline"><p className="font-semibold text-warm-900">{q}</p><p className="text-sm text-warm-600">{a}</p><span className="w-fit rounded-full border border-rasp-300 bg-rasp-50 px-2 py-0.5 text-xs font-medium text-rasp-800">{sig}</span></div>)}</div>
    </Section>
    <Section eyebrow="One visit" title="From first question to a Slack post" className="bg-card py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ol className="border-l-2 border-navy-600 pl-5">{timeline.map(([t, d]) => <li key={t + d} className="pb-4 last:pb-0"><p className="font-mono text-xs text-navy-700">{t}</p><p className="text-sm text-warm-700">{d}</p></li>)}</ol>
        <SlackFormats />
      </div>
    </Section>
    <Section eyebrow="Setup" title="What you need" sub="You can set up most SaaS sites yourself in an afternoon.">
      <ol className="grid gap-x-10 gap-y-3 text-sm text-warm-700 sm:grid-cols-[auto_1fr]">
        {([["1", "Paste the script tag. Use the launcher on marketing pages and the sidebar on docs."], ["2", "Let Waylo crawl your pricing, docs, security, and integrations pages."], ["3", "Add rules for what you don’t support, when to hand off, and which questions always go to a person."], ["4", "Paste a Slack incoming webhook in Admin → Integrations."], ["5", "Ask it your five hardest pre-sales questions before going live."]] as const).map(([n, d]) => <li key={n} className="contents"><span className="font-mono text-navy-700">{n}</span><span>{d}</span></li>)}
      </ol>
      <div className="mt-6 max-w-3xl"><Code>{snippet()}</Code></div>
      <p className="mt-4 text-sm"><Link href="/docs/install#checklist" className="font-semibold text-navy-700 hover:underline">Full install checklist →</Link> · <Link href="/pricing" className="font-semibold text-navy-700 hover:underline">Pricing</Link> (handoff is on every plan, the Trial included)</p>
    </Section>
    <Section eyebrow="Questions" title="Before you set it up" className="bg-card py-16 sm:py-20">
      <div className="max-w-3xl divide-y divide-warm-200 border-y border-warm-200">{faq.map(([q, a]) => <div key={q} className="py-4"><p className="font-medium">{q}</p><p className="mt-1 text-sm text-warm-600">{a}</p></div>)}</div>
      <p className="mt-6 text-sm text-warm-500">We’ll add customer stories once there are customers to write about.</p><div className="mt-6 grid max-w-4xl gap-5 md:grid-cols-2"><Shot k="tracking" crop="h-52" /><Shot k="integrations" crop="h-52" /></div>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent px-4 py-2">Start free trial</Link><Link href="/how-it-works" className="w-btn-ghost px-4 py-2">See how it works</Link></div>
    </Section>
  </MarketingPage>;
}
