import { snippet } from "@/lib/embed";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { PricingCards } from "@/components/marketing/Pricing";

export const metadata: Metadata = { title: "Waylo — Turn website conversations into sales signals", description: "AI website chat that answers visitors with cited sources, tracks buying intent, and hands hot leads to your team." };

const features = [
  ["AI answers with citations", "Waylo crawls your site and answers visitor questions with numbered source links — no made-up claims."],
  ["Journeys & intent signals", "See pages viewed, questions asked, and auto-tagged signals like pricing interest or demo requests."],
  ["Contact & handoff", "Visitors can leave a message, book a demo, or ask to talk to a person — routed straight to your team."],
  ["Slack & CRM webhooks", "Push leads, handoffs, and signals to Slack or any CRM endpoint the moment they happen."],
  ["Guidance: facts, rules, skills", "Pin authoritative facts, set guardrails, and teach playbooks for specific intents."],
  ["Members & roles", "Invite teammates as admins, editors, or viewers. Keep the dashboard locked down."],
  ["Audiences", "Group visitors by behavior — like anyone who viewed /pricing — to focus follow-up."],
  ["One-line embed", "Paste a single snippet into your site. Works with any CMS or framework."],
];
const steps = [["Paste the snippet", "Add one line of code to your site’s layout."], ["Crawl your site", "Waylo indexes your pages so answers stay grounded in your content."], ["Answer visitors", "The chat sidebar answers questions with citations, 24/7."], ["Act on signals", "Get notified of hot leads and handoffs in Slack or your CRM."]];
const faqs = [
  ["How long does it take to embed?", "Usually a few minutes. Copy the snippet from Settings, paste it into your site template, and the sidebar appears on every page."],
  ["Does Waylo crawl my site?", "Yes. Point it at your domain and it fetches your public HTML pages, then cites them in answers. JavaScript-rendered pages and PDFs aren’t supported yet."],
  ["Which AI model does it use?", "Waylo uses OpenAI models when connected for natural answers. Your content is sent to OpenAI only to generate replies."],
  ["Does it work with my CRM?", "Today Waylo sends leads and signals via webhooks, which work with HubSpot, Salesforce, Zapier, Make, and most CRMs. Native apps are on the roadmap."],
  ["Where is my data stored?", "Conversations, leads, and settings are stored in your Waylo workspace. See our Privacy Policy for details and retention."],
  ["How is this different from a generic chatbot?", "Generic bots answer and forget. Waylo grounds answers in your own pages, shows its sources, and turns each conversation into a sales signal your team can act on."],
];

function ProductMock() {
  return (
    <div className="w-card overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">yoursite.com/pricing</span></div>
      <div className="grid sm:grid-cols-[1fr_300px]">
        <div className="hidden space-y-3 p-8 sm:block"><div className="h-6 w-2/3 rounded bg-stone-200" /><div className="h-3 w-full rounded bg-stone-100" /><div className="h-3 w-5/6 rounded bg-stone-100" /><div className="mt-6 grid grid-cols-3 gap-3">{[0,1,2].map(i => <div key={i} className="h-24 rounded-lg border border-stone-200" />)}</div></div>
        <div className="border-l border-stone-200 bg-white p-4 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-700">Waylo assistant</p>
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-teal-700 px-3 py-2 text-white">Do you offer annual plans?</div>
          <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-sm bg-stone-100 px-3 py-2 text-stone-800">Yes — annual billing saves two months on every plan.<sup className="ml-0.5 text-teal-700">1</sup></div>
          <div className="mt-2 flex gap-1.5"><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">1 · Pricing</span></div>
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900">Signal: <b>pricing interest</b> → sent to Slack</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <section className="px-5 pb-16 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-block rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">Now in early access</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">Turn website conversations into <span className="text-teal-700">sales signals</span>.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">Waylo is an AI chat for your website that answers visitors with cited sources, tracks what they care about, and hands your hottest leads to sales.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/demo" className="w-btn px-5 py-3 text-base">Try the live demo</Link><Link href="/admin" className="w-btn-ghost px-5 py-3 text-base">Open the dashboard</Link></div>
          </div>
          <div id="product" className="mx-auto mt-16 max-w-5xl scroll-mt-20"><ProductMock /></div>
        </section>
        <div className="border-y border-stone-200 bg-white px-5 py-6 text-center text-sm text-stone-500">Built for marketing &amp; sales teams · Works on any website · Answers grounded in your own content</div>
        <Section id="features" eyebrow="Features" title="Everything between “just browsing” and “booked a call”" sub="One sidebar for visitors. One dashboard for your team.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(([t, d]) => <div key={t} className="w-card p-6"><div className="mb-4 h-8 w-8 rounded-lg bg-teal-50 ring-1 ring-teal-100" /><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{d}</p></div>)}</div>
        </Section>
        <Section id="how" eyebrow="How it works" title="Live in an afternoon" className="bg-white">
          <ol className="grid gap-8 md:grid-cols-4">{steps.map(([t, d], i) => <li key={t}><span className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">{i + 1}</span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-stone-600">{d}</p></li>)}</ol>
          <pre className="mx-auto mt-12 max-w-2xl overflow-x-auto rounded-xl bg-stone-900 p-5 text-sm text-teal-200">{snippet()}</pre>
        </Section>
        <Section id="pricing" eyebrow="Pricing" title="Simple plans while we’re in early access"><PricingCards /></Section>
        <Section id="faq" eyebrow="FAQ" title="Questions, answered" className="bg-white">
          <div className="mx-auto max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{faqs.map(([q, a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between font-medium">{q}<span className="text-teal-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-stone-600">{a}</p></details>)}</div>
        </Section>
        <section className="px-5 py-20"><div className="mx-auto max-w-4xl rounded-2xl bg-teal-700 px-8 py-14 text-center text-white"><h2 className="text-3xl font-semibold tracking-tight">See it on a real page</h2><p className="mt-3 text-teal-100">Ask the demo a question and watch the signal land in the dashboard.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/demo" className="rounded-lg bg-white px-5 py-3 font-medium text-teal-800 hover:bg-teal-50">Try the live demo</Link><Link href="/pricing" className="rounded-lg border border-teal-400 px-5 py-3 font-medium hover:bg-teal-800">View pricing</Link></div></div></section>
      </main>
      <Footer />
    </Shell>
  );
}
