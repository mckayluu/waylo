import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import { snippet } from "@/lib/embed";

export const metadata = pageMeta("/use-cases/saas-presales-slack", "SaaS pre-sales chat that hands off to Slack", "Answer SaaS evaluators' pricing, integration, and security questions with cited links to your own pages, then post the conversation to a Slack channel when they're ready to talk.");

const questions: [string, string, string][] = [
  ["“Do you have SSO?”", "Answers from /docs/sso or /security with the link. If neither page mentions it, says it doesn’t know.", "security"],
  ["“Does it integrate with HubSpot?”", "Cites the integrations page and tags integration interest.", "integration"],
  ["“What’s the difference between plans?”", "Quotes the pricing page, links it, flags pricing intent.", "pricing"],
  ["“Can I talk to someone?”", "Asks for name and email, then posts to Slack.", "handoff"],
];
const timeline: [string, string][] = [
  ["0:00", "Visitor lands on /pricing from a comparison article."],
  ["0:40", "Asks about SSO. Waylo answers from /security and shows the source chip."],
  ["1:15", "Asks whether Growth covers 3 sites. Pricing signal recorded."],
  ["2:05", "Asks to talk to someone. Leaves a work email."],
  ["2:06", "#sales-leads gets the post: email, pages viewed, signals, full transcript."],
  ["2:20", "A rep replies by email with the answer to the one question Waylo couldn’t cover."],
];
const faq: [string, string][] = [
  ["What happens when Waylo doesn't know the answer?", "It says so instead of guessing, and the question shows up in your dashboard so you can add the fact or fix the page."],
  ["Which Slack setup do I need?", "An incoming webhook URL for the channel you want. Paste it in Admin → Integrations. Slack and CRM handoff are on Starter ($79/mo) and up."],
  ["Will it answer from pages I don't want it to use?", "It only crawls public HTML on your domain. You can exclude pages and add rules for topics it should route to a person."],
];

export default function SaasPresalesSlack() {
  return <MarketingPage eyebrow="Use case" crumb="SaaS pre-sales → Slack" title="Pre-sales chat for SaaS that hands off to Slack" sub="Evaluators ask the same five questions before they book a call. Waylo answers them from your docs and pricing with links, and posts the serious ones to Slack." answer="Waylo answers SaaS pre-sales questions — pricing, integrations, security — with citations to your own pages, says when it doesn't know, and posts the conversation to a Slack channel when a visitor asks for a person or shows buying intent.">
    <JsonLd data={[crumbsLd([["Use cases", "/use-cases"], ["SaaS pre-sales → Slack", "/use-cases/saas-presales-slack"]]), faqLd(faq)]} />
    <Section eyebrow="What it answers" title="The questions that come before a demo" sub="Each answer links the page it came from, so the evaluator can check it and so can you.">
      <div className="divide-y divide-stone-200 border-y border-stone-200">{questions.map(([q, a, sig]) => <div key={q} className="grid gap-2 py-4 sm:grid-cols-[260px_1fr_auto] sm:items-baseline"><p className="font-semibold text-stone-900">{q}</p><p className="text-sm text-stone-600">{a}</p><span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">{sig}</span></div>)}</div>
    </Section>
    <Section eyebrow="One visit" title="Two minutes from first question to a Slack post" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ol className="border-l-2 border-indigo-600 pl-5">{timeline.map(([t, d]) => <li key={t + d} className="pb-4 last:pb-0"><p className="font-mono text-xs text-indigo-700">{t}</p><p className="text-sm text-stone-700">{d}</p></li>)}</ol>
        <div className="rounded-xl border border-stone-200 bg-stone-950 p-5 text-sm text-stone-200">
          <p className="text-xs text-stone-400">#sales-leads</p>
          <p className="mt-2"><span className="font-semibold text-amber-300">New handoff</span> · jordan@company.com</p>
          <p className="mt-1 text-stone-400">Signals: security, pricing · Pages: /pricing → /security → /pricing</p>
          <p className="mt-3 border-l-2 border-teal-500 pl-3">“Does Growth cover 3 sites? We need SSO before we can buy.”</p>
          <p className="mt-3 text-xs text-stone-400">Full transcript attached</p>
        </div>
      </div>
    </Section>
    <Section eyebrow="Setup" title="What you need" sub="Most SaaS sites are set up in an afternoon. During early access we do the first one with you.">
      <ol className="grid gap-x-10 gap-y-3 text-sm text-stone-700 sm:grid-cols-[auto_1fr]">
        {([["1", "Paste the script tag, launcher on marketing pages, sidebar on docs."], ["2", "Let Waylo crawl your pricing, docs, security, and integrations pages."], ["3", "Add rules: what you don't support, when to hand off, which questions always go to a person."], ["4", "Paste a Slack incoming webhook in Admin → Integrations."], ["5", "Ask it your five hardest pre-sales questions before going live."]] as const).map(([n, d]) => <li key={n} className="contents"><span className="font-mono text-teal-700">{n}</span><span>{d}</span></li>)}
      </ol>
      <div className="mt-6 max-w-3xl"><Code>{snippet()}</Code></div>
      <p className="mt-4 text-sm"><Link href="/docs/install#checklist" className="font-semibold text-teal-700 hover:underline">Full install checklist →</Link> · <Link href="/pricing" className="font-semibold text-teal-700 hover:underline">Pricing</Link> (handoff starts on Starter, $79/mo)</p>
    </Section>
    <Section eyebrow="Questions" title="Before you set it up" className="bg-white">
      <div className="max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{faq.map(([q, a]) => <div key={q} className="py-4"><p className="font-medium">{q}</p><p className="mt-1 text-sm text-stone-600">{a}</p></div>)}</div>
      <p className="mt-6 text-sm text-stone-500">Customer stories will be added after the first installs.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/demo" className="w-btn-accent px-4 py-2">Try the live demo</Link><a href="mailto:hello@waylo.ai?subject=Waylo%20SaaS%20setup" className="w-btn px-4 py-2">Book a setup call</a></div>
    </Section>
  </MarketingPage>;
}
