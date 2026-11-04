import { snippet } from "@/lib/embed";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { FactsBlock } from "@/components/marketing/Page";
import { ProofBar, WorkflowStrip, PhotoBand, PHOTOS, CrawlVisual, SignalsVisual, HandoffVisual, GuidanceVisual, Chip } from "@/components/marketing/Visuals";
import { JsonLd, orgLd, appLd, faqLd, FAQS, DEFINITION } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Waylo — AI website chat that shows its sources" }, description: "Waylo is AI website chat that crawls your site, answers visitors with cited source links, flags buying intent, and hands warm leads to Slack or your CRM with the full conversation. One-line install.", alternates: { canonical: "/" } };

const ACCESS = "mailto:hello@waylo.ai?subject=Waylo%20early%20access";
const features = [
  ["Cited source chips", "Every reply links the exact pages it used, so buyers can verify it and your team can audit it."],
  ["Background site crawl", "Enter your domain; Waylo indexes your public pages and re-crawls on demand."],
  ["Buying-intent signals", "See which questions and page journeys point to real interest — pricing, integrations, demos."],
  ["Contact & demo handoff", "When someone’s ready, Waylo collects their details and passes them on with the full conversation attached."],
  ["Slack & CRM webhooks", "Send leads and alerts where your team already works — HubSpot, Salesforce, Zapier, Make, or any endpoint."],
  ["Guidance you control", "Add facts, rules, and skills so Waylo says things the way you would — and doesn’t say what you wouldn’t."],
  ["Audiences", "Group visitors by behavior, like anyone who viewed /pricing, to focus follow-up. (Growth)"],
  ["Team members & roles", "Invite teammates as admins, editors, or viewers and decide who can change what."],
];
const steps = [["Add your site", "Enter your domain and Waylo crawls your public pages."], ["Paste one line", "Drop the snippet into your site, CMS, or tag manager."], ["Answer visitors", "Launcher or sidebar chat answers with cited sources, 24/7."], ["Act on signals", "Hot leads and handoffs land in Slack or your CRM."]];
const outcomes = [["Fewer “where’s the pricing?” emails.", "Visitors get the answer and the page it came from."], ["Pricing and demo questions get flagged.", "You see them in the dashboard while the visitor is still browsing."], ["Demo requests don’t sit in a form inbox.", "They post to Slack or your CRM with the transcript."]];
const faqs = FAQS;
function ProductMock() {
  return (
    <div className="w-glow overflow-hidden rounded-2xl border border-white/20 bg-white">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">yoursite.com/pricing</span></div>
      <div className="grid sm:grid-cols-[1fr_300px]">
        <div className="hidden space-y-3 p-8 sm:block"><div className="h-6 w-2/3 rounded bg-stone-200" /><div className="h-3 w-full rounded bg-stone-100" /><div className="h-3 w-5/6 rounded bg-stone-100" /><div className="mt-6 grid grid-cols-3 gap-3">{[0,1,2].map(i => <div key={i} className="h-24 rounded-lg border border-stone-200" />)}</div></div>
        <div className="border-l border-stone-200 bg-white p-4 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-700">Waylo assistant</p>
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-white" style={{ background: "var(--w-grad-cta)" }}>Do you integrate with HubSpot?</div>
          <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-sm bg-stone-100 px-3 py-2 text-stone-800">Yes — Waylo sends leads and signals to HubSpot via webhook, with the full conversation attached.<sup className="ml-0.5 font-semibold text-indigo-700">1</sup></div>
          <div className="mt-2 flex gap-1.5"><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">1 · Integrations</span><span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-600">2 · Pricing</span></div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">Signal: <b>integration interest</b> → sent to Slack</div>
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
        <section className="w-gradient relative overflow-hidden px-5 pb-20 pt-10 text-white sm:pt-14">
          <div className="w-grid-bg absolute inset-0 opacity-70" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />Early access · AI website chat with cited answers</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Answer every visitor. <span className="w-text-grad-light">Catch every buyer.</span></h1>
              <p className="mt-5 max-w-xl text-lg text-white/90">Waylo is AI chat for your website. It learns your public pages, answers visitors with links to the exact source, spots pricing, integration, and demo intent, and posts warm leads to Slack or your CRM with the transcript attached.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/demo" className="w-btn-accent px-5 py-3 text-base">Try the live demo</Link><a href={ACCESS} className="w-btn-glass px-5 py-3 text-base">Request access</a></div>
              <dl className="mt-8 grid max-w-lg grid-cols-4 gap-3 border-t border-white/15 pt-6">{stats.map(([v, l]) => <div key={l}><dt className="text-xl font-semibold">{v}</dt><dd className="text-xs text-white/70">{l}</dd></div>)}</dl>
            </div>
            <div id="product" className="relative scroll-mt-20">
              <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,.35),rgba(99,102,241,.25)_50%,transparent_75%)] blur-3xl" aria-hidden />
              <div className="relative"><ProductMock /></div>
              <div className="w-glow absolute -bottom-6 -left-4 hidden rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-700 sm:block"><p className="font-semibold text-indigo-700">#sales-leads · Slack</p><p className="mt-1"><span className="font-semibold text-amber-700">Hot lead</span> · integration interest on /pricing</p></div>
            </div>
          </div>
        </section>
        <div className="relative z-10 -mt-10 px-5"><div className="mx-auto max-w-6xl shadow-xl shadow-indigo-950/10"><ProofBar /></div></div>
        <div className="px-5 pt-6"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-2"><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Built for marketing &amp; sales teams in</p>{proof.map(t => <span key={t} className="text-sm font-semibold tracking-tight text-stone-500">{t}</span>)}</div></div>
        <Section id="early-access" eyebrow="Early access" title="Waylo is new. The first installs are done with you." sub="Right now it runs on a small free-tier stack and billing is in test mode until the first paying sites go live. In exchange, McKay sets up your first site with you." className="bg-white">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <ol className="border-l-2 border-teal-600 pl-5">{([["30-minute call", "We look at your site together and pick which pages Waylo should answer from."], ["Crawl + guidance", "Waylo crawls your public pages. We add the facts it shouldn’t guess at — pricing rules, what you don’t support, who to hand off to."], ["Install", "One script tag before </body>, or a GTM tag. Launcher, sidebar, or track-only."], ["Slack handoff", "Pricing, demo, and security questions post to the channel you pick, with the transcript."], ["First week review", "We read the real conversations, fix the answers it got wrong, and fill gaps where it said “I don’t know.”"]] as const).map(([h, d], i) => <li key={h} className="relative pb-5 last:pb-0"><span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-[10px] font-semibold text-white">{i + 1}</span><p className="font-semibold text-stone-900">{h}</p><p className="mt-0.5 text-sm text-stone-600">{d}</p></li>)}</ol>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">What to expect</p>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2"><span className="text-teal-700">✓</span>Free Trial: 500 AI messages, no card.</li>
                <li className="flex gap-2"><span className="text-teal-700">✓</span>Starter $79/mo and Growth $249/mo when you’re ready.</li>
                <li className="flex gap-2"><span className="text-teal-700">✓</span>Direct line to the person building it.</li>
                <li className="flex gap-2"><span className="text-amber-600">–</span>No custom domain or status page yet. Some rough edges.</li>
                <li className="flex gap-2"><span className="text-amber-600">–</span>No customer logos yet. Customer stories will come after the first installs.</li>
              </ul>
              <a href={ACCESS} className="w-btn-accent mt-5 inline-block px-4 py-2">Book a setup slot</a>
            </div>
          </div>
        </Section>
        <Section className="w-mesh">
          <div className="grid gap-y-5 border-y border-stone-200 py-6 md:grid-cols-[1.3fr_1fr_1fr] md:divide-x md:divide-stone-200">{outcomes.map(([a, b], i) => <div key={a} className={i ? "md:pl-6" : "md:pr-6"}><p className={i ? "font-semibold text-stone-900" : "text-xl font-semibold tracking-tight text-stone-900"}>{a}</p><p className="mt-1 text-sm leading-6 text-stone-600">{b}</p></div>)}</div>
          <div className="mt-8"><WorkflowStrip /></div>
        </Section>
        <Section id="tour" eyebrow="Product tour" title="The chat your visitors use, and the dashboard your team reads" sub="Four views in the admin: Knowledge (what was crawled), Signals (who asked about what), Guidance (facts and rules), and Handoff (where leads go)." className="bg-white">
          <div className="grid gap-5 lg:grid-cols-2">{([["teal", "Knowledge", "Your site, indexed automatically", "Paste a domain and Waylo crawls your public pages. Re-crawl after any launch.", <CrawlVisual key="c" />], ["amber", "Signals", "Who asked about pricing, and from which page", "Pricing, security, integration, and demo interest are scored and tied to the visitor’s page journey.", <SignalsVisual key="s" />], ["indigo", "Handoff", "Leads arrive with context", "Contact and demo requests post to Slack and your CRM webhook with the full transcript.", <HandoffVisual key="h" />], ["teal", "Guidance", "Answers stay inside what you’ve published", "Facts, rules, and skills keep answers accurate and on brand. Waylo says “I don’t know” rather than guess.", <GuidanceVisual key="g" />]] as const).map(([t, k, h, d, v], i) => <div key={k} className={`rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200 ${i === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-8" : ""}`}><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold tracking-tight">{h}</h3><p className="mt-1 text-sm text-stone-600">{d}</p></div><Chip t={t}>{k}</Chip></div>{v}</div>)}</div>
        </Section>
        <Section id="features" eyebrow="Features" title="What’s included" sub="Every plan gets the chat, the crawl, and signals. Handoff, guidance, and audiences depend on the plan." className="w-mesh">
          <div className="space-y-8">{rows.map(([tag, t, d, img, bullets], i) => <div key={t} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative overflow-hidden rounded-2xl w-glow"><Image src={img} alt="" width={1400} height={934} sizes="(min-width:1024px) 560px, 100vw" className={`${i === 1 ? "h-52" : "h-72"} w-full object-cover`} /><div className="absolute inset-0 bg-gradient-to-tr from-stone-950/70 via-indigo-950/20 to-amber-500/10" /><span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur">{tag}</span></div>
            <div><p className="w-eyebrow">{tag}</p><h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t}</h3><p className="mt-3 text-stone-600">{d}</p><ul className="mt-5 grid gap-2 sm:grid-cols-2">{bullets.map(b => <li key={b} className="flex items-start gap-2 text-sm text-stone-700"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">✓</span>{b}</li>)}</ul></div>
          </div>)}</div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]"><div><h3 className="text-lg font-semibold tracking-tight">Full feature list</h3><p className="mt-1 text-sm text-stone-600">Everything in the admin today.</p><Link href="/features" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">Feature details →</Link></div><dl className="grid border-t border-stone-200 sm:grid-cols-2 sm:gap-x-10">{features.map(([t, d]) => <div key={t} className="border-b border-stone-200 py-4"><dt className="font-semibold text-stone-900">{t}</dt><dd className="mt-1 text-sm leading-6 text-stone-600">{d}</dd></div>)}</dl></div>
        </Section>
        <section id="how" className="scroll-mt-20 bg-stone-950 px-5 py-14 text-white sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">How it works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Live in about ten minutes</h2><p className="mt-3 text-stone-300">No SDK, no build step. One async tag that never blocks your page — pick <code className="text-amber-200">launcher</code>, <code className="text-amber-200">sidebar</code>, or <code className="text-amber-200">track</code> with <code className="text-amber-200">data-mode</code>.</p>
            <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">{steps.map(([t, d], i) => <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 py-3.5"><span className="font-mono text-sm text-amber-300">0{i + 1}</span><p className="text-sm text-stone-300"><b className="font-semibold text-white">{t}.</b> {d}</p></li>)}</ol></div>
          <div><Code label="Paste before </body>">{snippet()}</Code><div className="mt-4"><Code label="Open chat from your own button">{`<button onclick="Waylo.open()">Talk to us</button>`}</Code></div><p className="mt-4 text-sm"><Link href="/docs/embed-modes" className="mr-4 font-medium text-amber-300 hover:underline">Compare embed modes →</Link><Link href="/docs/install" className="font-medium text-amber-300 hover:underline">Read the install guide →</Link></p><p className="mt-6 text-sm text-stone-400">Works with Webflow · WordPress · Squarespace · Wix · Shopify · Google Tag Manager · Slack · CRM webhooks</p></div>
        </div></section>
        <Section eyebrow="Who it helps" title="How marketing, sales, SaaS, and agency teams use it" className="bg-white"><PhotoBand items={[PHOTOS.support, PHOTOS.meeting, PHOTOS.dashboard, PHOTOS.workshop]} /></Section>
        <Section id="what" eyebrow="In short" title="What is Waylo?" className="w-mesh"><div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]"><div><p className="text-lg leading-8 text-stone-700">{DEFINITION}</p><div className="relative mt-6 overflow-hidden rounded-2xl w-glow"><Image src="/marketing/collab.webp" alt="A marketing and sales team reviewing website conversations together" width={1400} height={934} sizes="(min-width:1024px) 480px, 100vw" className="h-56 w-full object-cover" /></div><p className="mt-5 text-sm"><Link href="/features" className="font-medium text-teal-700 hover:underline">All features →</Link> · <Link href="/use-cases" className="font-medium text-teal-700 hover:underline">Use cases →</Link></p></div><FactsBlock /></div></Section>
        <Section id="pricing" eyebrow="Pricing" title="Simple plans while we’re in early access" className="bg-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end"><div className="overflow-hidden rounded-xl ring-1 ring-stone-200">{[["Trial", "$0", "1 site · 500 AI messages"], ["Starter", "$79/mo", "3,000 messages · webhooks · handoff"], ["Growth", "$249/mo", "3 sites · 15,000 messages · Audiences"]].map(([n, p, d], i) => <div key={n} className={`grid grid-cols-[6rem_6.5rem_1fr] items-baseline gap-3 px-5 py-4 text-sm ${i ? "border-t border-stone-200" : ""} ${i === 1 ? "bg-teal-50/60" : "bg-white"}`}><p className="font-semibold text-stone-900">{n}{i === 1 && <span className="ml-1.5 text-[11px] font-medium text-teal-700">most picked</span>}</p><p className="text-xl font-semibold tracking-tight">{p}</p><p className="text-stone-600">{d}</p></div>)}</div>
          <div><Link href="/pricing" className="w-btn-grad px-5 py-2.5">Compare plans &amp; start checkout →</Link><p className="mt-3 text-xs text-stone-500">Secure checkout by Stripe · manage or cancel anytime from Billing in your admin</p></div></div>
        </Section>
        <Section id="faq" className="w-mesh">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]"><div className="lg:sticky lg:top-24 lg:self-start"><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">FAQ</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[2rem]">Questions, answered</h2><Link href="/faq" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">All questions →</Link></div><div className="divide-y divide-stone-200 border-y border-stone-200">{faqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"><h3>{q}</h3><span className="text-lg leading-none text-amber-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{a}</p></details>)}</div></div>
        </Section>
        <section className="px-5 pb-14 pt-4"><div className="w-gradient w-glow relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-3xl px-8 py-12 text-white md:grid-cols-[1.3fr_1fr]"><div className="w-grid-bg absolute inset-0 opacity-50" aria-hidden /><div className="relative"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Try it on the demo site</h2><p className="mt-3 text-white/85">Ask the demo a question and watch the signal land in the dashboard. We’re onboarding our first teams now.</p><div className="mt-7 flex flex-wrap gap-3"><a href={ACCESS} className="w-btn-accent px-5 py-3 text-base">Request access</a><Link href="/demo" className="w-btn-glass px-5 py-3 text-base">Try the live demo</Link></div></div><div className="relative hidden overflow-hidden rounded-2xl ring-1 ring-white/20 md:block"><Image src="/marketing/office.webp" alt="" width={1400} height={935} sizes="400px" className="h-56 w-full object-cover opacity-90" /></div></div></section>
      </main>
      <Footer />
    </Shell>
  );
}
