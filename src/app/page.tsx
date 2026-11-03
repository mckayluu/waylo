import { snippet } from "@/lib/embed";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { FactsBlock } from "@/components/marketing/Page";
import { JsonLd, orgLd, appLd, faqLd, FAQS, DEFINITION } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Waylo — AI website chat that shows its sources" }, description: "Waylo is AI website chat that answers visitors with cited sources from your pages, flags buying intent, and hands warm leads to Slack or your CRM. One-line install.", alternates: { canonical: "/" } };

const ACCESS = "mailto:hello@waylo.ai?subject=Waylo%20early%20access";
const features = [
  ["Answers with sources", "Every reply cites the pages it came from, so visitors can check it and your team can trust it."],
  ["Learns from your site", "Waylo crawls your pages and stays grounded in what you’ve actually published."],
  ["Buying-intent signals", "See which questions and page journeys point to real interest — pricing, integrations, demos."],
  ["Contact & demo handoff", "When someone’s ready, Waylo collects their details and passes them on with the full conversation attached."],
  ["Slack & CRM webhooks", "Send leads and alerts where your team already works — HubSpot, Salesforce, Zapier, Make, or any endpoint."],
  ["Guidance you control", "Add facts, rules, and skills so Waylo says things the way you would — and doesn’t say what you wouldn’t."],
  ["Audiences", "Group visitors by behavior, like anyone who viewed /pricing, to focus follow-up. (Growth)"],
  ["Team members & roles", "Invite teammates as admins, editors, or viewers and decide who can change what."],
];
const steps = [["Add your site", "Enter your domain and Waylo crawls your public pages."], ["Paste one line", "Drop the snippet into your site, CMS, or tag manager."], ["Answer visitors", "A chat launcher answers questions with cited sources, 24/7."], ["Act on signals", "Hot leads and handoffs land in Slack or your CRM."]];
const outcomes = [["Visitors stop hunting through pages.", "They get a straight answer with a link."], ["You stop guessing who’s serious.", "Waylo flags buying signals as they happen."], ["Good leads stop slipping away.", "Handoff goes straight to Slack or your CRM."]];
const faqs = FAQS;
function ProductMock() {
  return (
    <div className="w-card overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">yoursite.com/pricing</span></div>
      <div className="grid sm:grid-cols-[1fr_300px]">
        <div className="hidden space-y-3 p-8 sm:block"><div className="h-6 w-2/3 rounded bg-stone-200" /><div className="h-3 w-full rounded bg-stone-100" /><div className="h-3 w-5/6 rounded bg-stone-100" /><div className="mt-6 grid grid-cols-3 gap-3">{[0,1,2].map(i => <div key={i} className="h-24 rounded-lg border border-stone-200" />)}</div></div>
        <div className="border-l border-stone-200 bg-white p-4 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-700">Waylo assistant</p>
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-teal-700 px-3 py-2 text-white">Do you integrate with HubSpot?</div>
          <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-sm bg-stone-100 px-3 py-2 text-stone-800">Yes — Waylo sends leads and signals to HubSpot via webhook, with the full conversation attached.<sup className="ml-0.5 text-teal-700">1</sup></div>
          <div className="mt-2 flex gap-1.5"><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">1 · Integrations</span><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">2 · Pricing</span></div>
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900">Signal: <b>integration interest</b> → sent to Slack</div>
          <div className="mt-3 w-fit rounded-lg border border-teal-700 px-3 py-1.5 text-xs font-medium text-teal-800">Talk to sales</div>
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
        <JsonLd data={[orgLd, appLd, faqLd(FAQS)]} />
        <section className="px-5 pb-16 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"><span className="h-1.5 w-1.5 rounded-full bg-teal-600" />Early access · AI chat for your website</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">Answer every visitor. <span className="text-teal-700">Show your sources.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">Waylo learns your site and answers questions with links to the pages behind each answer. It spots buying intent and hands warm leads to your team in Slack or your CRM.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/demo" className="w-btn px-5 py-3 text-base">Try the live demo</Link><a href={ACCESS} className="w-btn-ghost px-5 py-3 text-base">Request access</a></div>
            <p className="mt-4 text-sm text-stone-500">One line of code. Works with Webflow, WordPress, Shopify, and more.</p>
          </div>
          <div id="product" className="mx-auto mt-16 max-w-5xl scroll-mt-20"><ProductMock /></div>
        </section>
        <div className="border-y border-stone-200 bg-white px-5 py-6"><ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-stone-500">{["Early access", "Built for marketing & sales", "Works on any website", "Answers grounded in your content"].map(t => <li key={t} className="flex items-center gap-2"><span className="text-teal-700">✓</span>{t}</li>)}</ul></div>
        <Section className="pb-0">
          <div className="grid gap-6 md:grid-cols-3">{outcomes.map(([a, b]) => <div key={a} className="border-l-2 border-teal-700 pl-5"><p className="text-stone-600">{a}</p><p className="mt-1 text-lg font-semibold">{b}</p></div>)}</div>
        </Section>
        <Section id="features" eyebrow="Features" title="Everything between “just browsing” and “booked a call”" sub="One chat for visitors. One dashboard for your team.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(([t, d], i) => <div key={t} className="w-card p-6"><div className="mb-4 grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-xs font-semibold text-teal-800 ring-1 ring-teal-100">{String(i + 1).padStart(2, "0")}</div><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{d}</p></div>)}</div>
        </Section>
        <Section id="how" eyebrow="How it works" title="Live in an afternoon" className="bg-white">
          <ol className="grid gap-8 md:grid-cols-4">{steps.map(([t, d], i) => <li key={t}><span className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">{i + 1}</span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-stone-600">{d}</p></li>)}</ol>
          <div className="mx-auto mt-12 max-w-2xl"><Code label="Paste before </body>">{snippet()}</Code><p className="mt-3 text-center text-sm"><Link href="/docs/install" className="font-medium text-teal-700 hover:underline">Read the install guide →</Link></p></div>
          <p className="mt-10 text-center text-sm text-stone-500">Works with Webflow · WordPress · Squarespace · Wix · Shopify · Google Tag Manager · Slack · CRM webhooks</p>
        </Section>
        <Section id="what" eyebrow="In short" title="What is Waylo?"><p className="mx-auto max-w-3xl text-center text-lg leading-8 text-stone-700">{DEFINITION}</p><div className="mt-10"><FactsBlock /></div><p className="mt-6 text-center text-sm"><Link href="/features" className="font-medium text-teal-700 hover:underline">All features →</Link> · <Link href="/use-cases" className="font-medium text-teal-700 hover:underline">Use cases →</Link></p></Section>
        <Section id="pricing" eyebrow="Pricing" title="Simple plans while we’re in early access">
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">{[["Trial", "$0", "1 site · 500 AI messages"], ["Starter", "$79/mo", "3,000 messages · webhooks · handoff"], ["Growth", "$249/mo", "3 sites · 15,000 messages · Audiences"]].map(([n, p, d]) => <div key={n} className="w-card p-6 text-center"><p className="font-semibold">{n}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{p}</p><p className="mt-2 text-sm text-stone-600">{d}</p></div>)}</div>
          <p className="mt-8 text-center"><Link href="/pricing" className="w-btn-ghost">Compare plans →</Link></p>
        </Section>
        <Section id="faq" eyebrow="FAQ" title="Questions, answered" className="bg-white">
          <div className="mx-auto max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{faqs.map(([q, a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between font-medium"><h3>{q}</h3><span className="text-teal-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-stone-600">{a}</p></details>)}</div>
        </Section>
        <section className="px-5 py-20"><div className="mx-auto max-w-4xl rounded-2xl bg-teal-700 px-8 py-14 text-center text-white"><h2 className="text-3xl font-semibold tracking-tight">Give every visitor a straight answer</h2><p className="mt-3 text-teal-100">Ask the demo a question and watch the signal land in the dashboard. We’re onboarding our first teams now.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href={ACCESS} className="rounded-lg bg-white px-5 py-3 font-medium text-teal-800 hover:bg-teal-50">Request access</a><Link href="/demo" className="rounded-lg border border-teal-400 px-5 py-3 font-medium hover:bg-teal-800">Try the live demo</Link></div></div></section>
      </main>
      <Footer />
    </Shell>
  );
}
