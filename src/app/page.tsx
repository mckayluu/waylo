import { snippet } from "@/lib/embed";
import Link from "next/link";
import Image from "next/image";
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
    <div className="w-glow overflow-hidden rounded-2xl border border-white/20 bg-white">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">yoursite.com/pricing</span></div>
      <div className="grid sm:grid-cols-[1fr_300px]">
        <div className="hidden space-y-3 p-8 sm:block"><div className="h-6 w-2/3 rounded bg-stone-200" /><div className="h-3 w-full rounded bg-stone-100" /><div className="h-3 w-5/6 rounded bg-stone-100" /><div className="mt-6 grid grid-cols-3 gap-3">{[0,1,2].map(i => <div key={i} className="h-24 rounded-lg border border-stone-200" />)}</div></div>
        <div className="border-l border-stone-200 bg-white p-4 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-700">Waylo assistant</p>
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-white" style={{ background: "var(--w-grad-cta)" }}>Do you integrate with HubSpot?</div>
          <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-sm bg-stone-100 px-3 py-2 text-stone-800">Yes — Waylo sends leads and signals to HubSpot via webhook, with the full conversation attached.<sup className="ml-0.5 text-teal-700">1</sup></div>
          <div className="mt-2 flex gap-1.5"><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">1 · Integrations</span><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">2 · Pricing</span></div>
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900">Signal: <b>integration interest</b> → sent to Slack</div>
          <div className="mt-3 w-fit rounded-lg border border-teal-700 px-3 py-1.5 text-xs font-medium text-teal-800">Talk to sales</div>
        </div>
      </div>
    </div>
  );
}

const rows: [string, string, string, string, string[]][] = [
  ["Cited answers", "Answers visitors can check — and your team can trust", "Waylo crawls your public pages and replies with links to the exact pages behind each answer. When it doesn’t know, it says so and offers a handoff.", "/marketing/laptop.webp", ["Grounded in your published content", "Source links on every reply", "Facts and rules you control"]],
  ["Buying signals", "Know who’s serious while they’re still on the page", "Pricing questions, integration checks, and demo requests are flagged as buying intent and routed to the people who should follow up.", "/marketing/analytics.webp", ["Intent signals in real time", "Audiences like “viewed /pricing” (Growth)", "Full conversation attached"]],
  ["Team handoff", "Warm leads land where your team already works", "Send leads and alerts to Slack or any webhook — HubSpot, Salesforce, Zapier, Make — and invite teammates with the right roles.", "/marketing/team.webp", ["Slack alerts", "CRM webhooks", "Admin, editor, and viewer roles"]],
];
const proof = ["B2B SaaS", "Agencies", "Developer tools", "Fintech", "HR tech", "Marketplaces", "Professional services"];
const stats: [string, string][] = [["1 line", "script tag install"], ["async", "never blocks rendering"], ["3", "embed modes"], ["24/7", "cited answers"]];

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <JsonLd data={[orgLd, appLd, faqLd(FAQS)]} />
        <section className="w-gradient relative overflow-hidden px-5 pb-16 pt-14 text-white sm:pt-20">
          <div className="w-grid-bg absolute inset-0 opacity-70" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-teal-50 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_#5EEAD4]" />Early access · AI chat for your website</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Answer every visitor. <span className="w-text-grad-light">Show your sources.</span></h1>
              <p className="mt-5 max-w-xl text-lg text-teal-50/90">Waylo learns your site and answers questions with links to the pages behind each answer. It spots buying intent and hands warm leads to your team in Slack or your CRM.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/demo" className="rounded-lg bg-white px-5 py-3 text-base font-semibold text-teal-900 shadow-lg hover:bg-teal-50">Try the live demo</Link><a href={ACCESS} className="w-btn-glass px-5 py-3 text-base">Request access</a></div>
              <p className="mt-4 text-sm text-teal-100/80">One line of code. Works with Webflow, WordPress, Shopify, and more.</p>
              <dl className="mt-8 grid max-w-lg grid-cols-4 gap-3 border-t border-white/15 pt-6">{stats.map(([v, l]) => <div key={l}><dt className="text-xl font-semibold">{v}</dt><dd className="text-xs text-teal-100/75">{l}</dd></div>)}</dl>
            </div>
            <div id="product" className="relative scroll-mt-20">
              <div className="absolute -inset-6 rounded-[2rem] bg-teal-300/20 blur-3xl" aria-hidden />
              <div className="relative"><ProductMock /></div>
              <div className="w-glow absolute -bottom-6 -left-4 hidden rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-700 sm:block"><p className="font-semibold text-teal-800">#sales-leads · Slack</p><p className="mt-1">🔥 Hot lead: integration interest on /pricing</p></div>
            </div>
          </div>
        </section>
        <div className="border-b border-stone-200 bg-white px-5 py-5"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2"><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Built for marketing &amp; sales teams in</p>{proof.map(t => <span key={t} className="text-sm font-semibold tracking-tight text-stone-500">{t}</span>)}</div></div>
        <ul className="sr-only">{["Early access", "Built for marketing & sales", "Works on any website", "Answers grounded in your content"].map(t => <li key={t}>{t}</li>)}</ul>
        <Section className="w-mesh">
          <div className="grid gap-4 md:grid-cols-3">{outcomes.map(([a, b]) => <div key={a} className="w-card-lg border-l-4 border-l-teal-600 p-6"><p className="text-stone-600">{a}</p><p className="mt-1 text-lg font-semibold">{b}</p></div>)}</div>
        </Section>
        <Section id="features" eyebrow="Features" title="Everything between “just browsing” and “booked a call”" sub="One chat for visitors. One dashboard for your team." className="bg-white">
          <div className="space-y-12">{rows.map(([tag, t, d, img, bullets], i) => <div key={t} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative overflow-hidden rounded-2xl w-glow"><Image src={img} alt="" width={1400} height={934} sizes="(min-width:1024px) 560px, 100vw" className="h-72 w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-teal-950/70 via-teal-900/20 to-transparent" /><span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800 backdrop-blur">{tag}</span></div>
            <div><p className="w-eyebrow">{tag}</p><h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t}</h3><p className="mt-3 text-stone-600">{d}</p><ul className="mt-5 grid gap-2 sm:grid-cols-2">{bullets.map(b => <li key={b} className="flex items-start gap-2 text-sm text-stone-700"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-50 text-[11px] font-bold text-teal-700 ring-1 ring-teal-200">✓</span>{b}</li>)}</ul></div>
          </div>)}</div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([t, d], i) => <div key={t} className="w-card-lg p-5 transition hover:-translate-y-0.5 hover:border-teal-200"><div className="mb-3 grid h-9 w-9 place-items-center rounded-lg text-xs font-semibold text-white" style={{ background: "var(--w-grad)" }}>{String(i + 1).padStart(2, "0")}</div><h3 className="font-semibold">{t}</h3><p className="mt-1.5 text-sm leading-6 text-stone-600">{d}</p></div>)}</div>
        </Section>
        <section id="how" className="scroll-mt-20 bg-stone-950 px-5 py-14 text-white sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-teal-300">How it works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Live in an afternoon</h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2">{steps.map(([t, d], i) => <li key={t} className="rounded-xl border border-white/10 bg-white/[0.04] p-5"><span className="grid h-8 w-8 place-items-center rounded-full text-sm font-semibold" style={{ background: "var(--w-grad-cta)" }}>{i + 1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1 text-sm text-stone-400">{d}</p></li>)}</ol></div>
          <div><Code label="Paste before </body>">{snippet()}</Code><p className="mt-4 text-sm"><Link href="/docs/install" className="font-medium text-teal-300 hover:underline">Read the install guide →</Link></p><p className="mt-6 text-sm text-stone-400">Works with Webflow · WordPress · Squarespace · Wix · Shopify · Google Tag Manager · Slack · CRM webhooks</p></div>
        </div></section>
        <Section id="what" eyebrow="In short" title="What is Waylo?" className="w-mesh"><div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]"><div><p className="text-lg leading-8 text-stone-700">{DEFINITION}</p><div className="relative mt-6 overflow-hidden rounded-2xl w-glow"><Image src="/marketing/collab.webp" alt="A marketing and sales team reviewing website conversations together" width={1400} height={934} sizes="(min-width:1024px) 480px, 100vw" className="h-56 w-full object-cover" /></div><p className="mt-5 text-sm"><Link href="/features" className="font-medium text-teal-700 hover:underline">All features →</Link> · <Link href="/use-cases" className="font-medium text-teal-700 hover:underline">Use cases →</Link></p></div><FactsBlock /></div></Section>
        <Section id="pricing" eyebrow="Pricing" title="Simple plans while we’re in early access" className="bg-white">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">{[["Trial", "$0", "1 site · 500 AI messages"], ["Starter", "$79/mo", "3,000 messages · webhooks · handoff"], ["Growth", "$249/mo", "3 sites · 15,000 messages · Audiences"]].map(([n, p, d], i) => <div key={n} className={i === 1 ? "w-gradient w-glow rounded-2xl p-6 text-center text-white" : "w-card-lg p-6 text-center"}><p className="font-semibold">{n}{i === 1 && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">Popular</span>}</p><p className="mt-2 text-4xl font-semibold tracking-tight">{p}</p><p className={`mt-2 text-sm ${i === 1 ? "text-teal-50" : "text-stone-600"}`}>{d}</p></div>)}</div>
          <p className="mt-8 text-center"><Link href="/pricing" className="w-btn-grad px-5 py-2.5">Compare plans →</Link></p>
        </Section>
        <Section id="faq" eyebrow="FAQ" title="Questions, answered" className="w-mesh">
          <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-2">{faqs.map(([q, a]) => <details key={q} className="w-card-lg group p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"><h3>{q}</h3><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-stone-600">{a}</p></details>)}</div>
        </Section>
        <section className="px-5 pb-16"><div className="w-gradient w-glow relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-3xl px-8 py-12 text-white md:grid-cols-[1.3fr_1fr]"><div className="w-grid-bg absolute inset-0 opacity-50" aria-hidden /><div className="relative"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Give every visitor a straight answer</h2><p className="mt-3 text-teal-50/90">Ask the demo a question and watch the signal land in the dashboard. We’re onboarding our first teams now.</p><div className="mt-7 flex flex-wrap gap-3"><a href={ACCESS} className="rounded-lg bg-white px-5 py-3 font-semibold text-teal-900 shadow-lg hover:bg-teal-50">Request access</a><Link href="/demo" className="w-btn-glass px-5 py-3 text-base">Try the live demo</Link></div></div><div className="relative hidden overflow-hidden rounded-2xl ring-1 ring-white/20 md:block"><Image src="/marketing/office.webp" alt="" width={1400} height={935} sizes="400px" className="h-56 w-full object-cover opacity-90" /></div></div></section>
      </main>
      <Footer />
    </Shell>
  );
}
